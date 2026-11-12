import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react')
  return {
    ...actual,
    cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  }
})

const { mockGetCachedProfile, mockGetEscalationInfo, mockPrisma } = vi.hoisted(() => ({
  mockGetCachedProfile: vi.fn(),
  mockGetEscalationInfo: vi.fn(),
  mockPrisma: {
    profile: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    complaint: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/profile', () => ({
  getCachedProfile: (...args: unknown[]) => mockGetCachedProfile(...args),
}))

vi.mock('@/lib/escalation', () => ({
  getEscalationInfo: (...args: unknown[]) => mockGetEscalationInfo(...args),
}))

vi.mock('@/lib/prisma', () => ({
  default: mockPrisma,
}))

import {
  sanitizeMappedComplaintsForViewer,
  getComplaintDetail,
  getComplaintList,
  type RawMappedComplaint,
} from '@/lib/dal/complaints'
import { getAdminUsersList, maskSensitiveTail } from '@/lib/dal/admin'

const sampleMappedComplaints: RawMappedComplaint[] = [
  {
    id: 'comp-own',
    title: 'Lampu Jalan Mati Blok A',
    content: 'Lampu jalan mati sejak 3 hari lalu di depan rumah nomor 12.',
    latitude: -6.33,
    longitude: 106.66,
    status: 'PENDING',
    rt: '001',
    rw: '008',
    isUrgent: true,
    createdAt: new Date('2026-10-01T10:00:00Z'),
    category: 'fasilitas',
    categoryId: 'cat-1',
    imageUrl: 'https://example.com/own.jpg',
    location: 'Blok A No. 12',
    incidentDate: new Date('2026-09-30T10:00:00Z'),
    escalationLevel: 'LEVEL_1',
    authorId: 'prof-warga-1',
    author: { name: 'Budi Santoso', username: 'budi' },
    categoryRel: { id: 'cat-1', name: 'PJU' },
  },
  {
    id: 'comp-other',
    title: 'Keributan Tetangga Blok C',
    content: 'Detail kronologi sensitif milik pelapor lain.',
    latitude: -6.331,
    longitude: 106.661,
    status: 'PROCESSING',
    rt: '002',
    rw: '008',
    isUrgent: false,
    createdAt: new Date('2026-10-02T10:00:00Z'),
    category: 'keamanan',
    categoryId: 'cat-2',
    imageUrl: 'https://example.com/other.jpg',
    location: 'Blok C No. 99',
    incidentDate: new Date('2026-10-01T22:00:00Z'),
    escalationLevel: 'LEVEL_2',
    authorId: 'prof-warga-2',
    author: { name: 'Siti Rahayu', username: 'siti' },
    categoryRel: { id: 'cat-2', name: 'Keamanan' },
  },
]

describe('DAL Security & Data Minimization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sanitizeMappedComplaintsForViewer', () => {
    it('sanitizes other citizens complaints for MASYARAKAT while keeping own complaint intact', () => {
      const result = sanitizeMappedComplaintsForViewer(sampleMappedComplaints, {
        profileId: 'prof-warga-1',
        role: 'MASYARAKAT',
      })

      expect(result).toHaveLength(2)

      const own = result[0]
      expect(own.isOwn).toBe(true)
      expect(own.title).toBe('Lampu Jalan Mati Blok A')
      expect(own.content).toBe('Lampu jalan mati sejak 3 hari lalu di depan rumah nomor 12.')
      expect(own.location).toBe('Blok A No. 12')
      expect(own.imageUrl).toBe('https://example.com/own.jpg')
      expect(own.author).toEqual({ name: 'Budi Santoso', username: 'budi' })
      expect('authorId' in own).toBe(false)

      const other = result[1]
      expect(other.isOwn).toBe(false)
      expect(other.title).toBe('Laporan Warga')
      expect(other.content).toBe('')
      expect(other.location).toBe('')
      expect(other.imageUrl).toBeNull()
      expect(other.author).toBeNull()
      expect(other.escalationLevel).toBe('NONE')
      expect(other.rt).toBe('002')
      expect(other.rw).toBe('008')
      expect(other.latitude).toBe(-6.331)
      expect('authorId' in other).toBe(false)
    })

    it('keeps full details for PETUGAS and ADMIN', () => {
      const petugasResult = sanitizeMappedComplaintsForViewer(sampleMappedComplaints, {
        profileId: 'prof-petugas',
        role: 'PETUGAS',
      })
      expect(petugasResult[1].title).toBe('Keributan Tetangga Blok C')
      expect(petugasResult[1].author).toEqual({ name: 'Siti Rahayu', username: 'siti' })
      expect(petugasResult[1].isOwn).toBe(false)

      const adminResult = sanitizeMappedComplaintsForViewer(sampleMappedComplaints, {
        profileId: 'prof-admin',
        role: 'ADMIN',
      })
      expect(adminResult[1].content).toBe('Detail kronologi sensitif milik pelapor lain.')
      expect(adminResult[1].location).toBe('Blok C No. 99')
    })
  })

  describe('getComplaintDetail', () => {
    it('blocks MASYARAKAT from reading another citizen complaint and skips escalation query', async () => {
      mockGetCachedProfile.mockResolvedValue({
        status: 'AUTHENTICATED',
        profile: { id: 'prof-warga-1', role: 'MASYARAKAT' },
      })
      mockPrisma.complaint.findUnique.mockResolvedValue({
        id: 'comp-other',
        authorId: 'prof-warga-2',
        title: 'Rahasia',
      })

      const result = await getComplaintDetail('comp-other')
      expect(result.forbidden).toBe(true)
      expect(result.complaint).toBeNull()
      expect(result.escalationLogs).toEqual([])
      expect(mockGetEscalationInfo).not.toHaveBeenCalled()
    })

    it('allows owner MASYARAKAT and staff to read complaint detail', async () => {
      mockGetCachedProfile.mockResolvedValue({
        status: 'AUTHENTICATED',
        profile: { id: 'prof-warga-1', role: 'MASYARAKAT' },
      })
      mockPrisma.complaint.findUnique.mockResolvedValue({
        id: 'comp-own',
        authorId: 'prof-warga-1',
        title: 'Milik Sendiri',
      })
      mockGetEscalationInfo.mockResolvedValue([])

      const ownRes = await getComplaintDetail('comp-own')
      expect(ownRes.forbidden).toBe(false)
      expect(ownRes.complaint?.id).toBe('comp-own')
      expect(mockGetEscalationInfo).toHaveBeenCalledWith('comp-own')
    })
  })

  describe('getComplaintList', () => {
    it('returns empty list when isWarga is true and profileId mismatches authenticated user', async () => {
      mockGetCachedProfile.mockResolvedValue({
        status: 'AUTHENTICATED',
        profile: { id: 'prof-warga-1', role: 'MASYARAKAT' },
      })

      const res = await getComplaintList({
        profileId: 'prof-warga-2',
        isWarga: true,
        searchParams: {},
      })

      expect(res.complaints).toEqual([])
      expect(res.totalComplaints).toBe(0)
      expect(mockPrisma.complaint.findMany).not.toHaveBeenCalled()
    })
  })

  describe('getAdminUsersList & maskSensitiveTail', () => {
    it('masks NIK and phone properly', () => {
      expect(maskSensitiveTail('3274012345678901')).toBe('****8901')
      expect(maskSensitiveTail('081234567890')).toBe('****7890')
      expect(maskSensitiveTail(null)).toBeNull()
    })

    it('denies non-admin access inside DAL', async () => {
      mockGetCachedProfile.mockResolvedValue({
        status: 'AUTHENTICATED',
        profile: { id: 'prof-warga-1', role: 'MASYARAKAT' },
      })

      const res = await getAdminUsersList()
      expect(res).toEqual({ users: [], totalUsers: 0 })
      expect(mockPrisma.profile.findMany).not.toHaveBeenCalled()
    })

    it('returns masked PII and omits raw nik/phone/userId for ADMIN', async () => {
      mockGetCachedProfile.mockResolvedValue({
        status: 'AUTHENTICATED',
        profile: { id: 'prof-admin', role: 'ADMIN' },
      })
      mockPrisma.profile.findMany.mockResolvedValue([
        {
          id: 'prof-1',
          name: 'Warga Satu',
          username: 'warga1',
          role: 'MASYARAKAT',
          isVerified: true,
          rt: '001',
          rw: '008',
          address: 'Blok B1',
          createdAt: new Date('2026-01-01T00:00:00Z'),
          nik: '3274012345678901',
          phone: '081234567890',
        },
      ])
      mockPrisma.profile.count.mockResolvedValue(1)

      const res = await getAdminUsersList({ page: 1, pageSize: 20 })
      expect(res.totalUsers).toBe(1)
      expect(res.users[0].maskedNik).toBe('****8901')
      expect(res.users[0].maskedPhone).toBe('****7890')
      expect('nik' in res.users[0]).toBe(false)
      expect('phone' in res.users[0]).toBe(false)
      expect('userId' in res.users[0]).toBe(false)
    })
  })
})
