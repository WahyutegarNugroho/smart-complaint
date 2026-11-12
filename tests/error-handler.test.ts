import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Prisma } from '@prisma/client'

class MockControlFlowError extends Error {
  digest: string
  constructor(digest: string, message = 'NEXT_CONTROL_FLOW') {
    super(message)
    this.digest = digest
  }
}

const {
  mockRedirect,
  mockRevalidatePath,
  mockGetAuthOptional,
  mockRequireStaff,
  mockCreateAuditLog,
  mockResetEscalation,
  mockPrisma,
} = vi.hoisted(() => ({
  mockRedirect: vi.fn((url: string) => {
    throw new MockControlFlowError(`NEXT_REDIRECT;replace;${url};303;`, `Redirect: ${url}`)
  }),
  mockRevalidatePath: vi.fn(),
  mockGetAuthOptional: vi.fn(),
  mockRequireStaff: vi.fn(),
  mockCreateAuditLog: vi.fn(),
  mockResetEscalation: vi.fn(),
  mockPrisma: {
    profile: {
      findUnique: vi.fn(),
    },
    complaint: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
  },
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUserOptional: () => mockGetAuthOptional(),
}))

vi.mock('@/lib/role-guard', () => ({
  requireStaff: () => mockRequireStaff(),
}))

vi.mock('@/lib/audit', () => ({
  createAuditLog: (...args: unknown[]) => mockCreateAuditLog(...args),
}))

vi.mock('@/lib/escalation', () => ({
  resetEscalation: (...args: unknown[]) => mockResetEscalation(...args),
}))

vi.mock('@/lib/prisma', () => ({
  default: mockPrisma,
}))

import {
  apiErrorResponse,
  isNextControlFlowError,
  logServerError,
  mapAuthError,
  mapPrismaError,
  parsePositiveLimit,
} from '@/lib/errors'
import { adminDeleteComplaint } from '@/app/dashboard/actions/admin'
import { updateComplaintStatus } from '@/app/dashboard/actions/complaints.status'

describe('Error Utilities (src/lib/errors.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('memetakan PrismaClientKnownRequestError ke kode dan HTTP status yang sesuai', () => {
    const p2002 = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
      clientVersion: '6.19.3',
    })
    const p2003 = new Prisma.PrismaClientKnownRequestError('Foreign key', {
      code: 'P2003',
      clientVersion: '6.19.3',
    })
    const p2025 = new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '6.19.3',
    })
    const p1001 = new Prisma.PrismaClientKnownRequestError('DB unreachable', {
      code: 'P1001',
      clientVersion: '6.19.3',
    })
    const initErr = new Prisma.PrismaClientInitializationError('Cannot connect', '6.19.3')

    expect(mapPrismaError(p2002)).toMatchObject({ code: 'CONFLICT', status: 409, prismaCode: 'P2002' })
    expect(mapPrismaError(p2003)).toMatchObject({ code: 'DEPENDENCY_EXISTS', status: 409, prismaCode: 'P2003' })
    expect(mapPrismaError(p2025)).toMatchObject({ code: 'NOT_FOUND', status: 404, prismaCode: 'P2025' })
    expect(mapPrismaError(p1001)).toMatchObject({ code: 'DATABASE_UNAVAILABLE', status: 503, prismaCode: 'P1001' })
    expect(mapPrismaError(initErr)).toMatchObject({ code: 'DATABASE_UNAVAILABLE', status: 503 })
    expect(mapPrismaError(new Error('unexpected'))).toMatchObject({ code: 'INTERNAL_ERROR', status: 500 })
  })

  it('memetakan pesan error Supabase Auth ke Bahasa Indonesia ramah pengguna', () => {
    expect(mapAuthError('Invalid login credentials')).toContain('tidak sesuai')
    expect(mapAuthError('Email not confirmed')).toContain('belum diverifikasi')
    expect(mapAuthError('User already registered')).toContain('sudah terdaftar')
    expect(mapAuthError('Password should be at least 6 characters')).toContain('minimal')
    expect(mapAuthError('Email rate limit exceeded')).toContain('Terlalu banyak')
    expect(mapAuthError('New password should be different from the old password')).toContain('harus berbeda')
    expect(mapAuthError('Auth session expired')).toContain('kedaluwarsa')
    expect(mapAuthError('Something unexpected')).toContain('autentikasi gagal')
  })

  it('mengenali Next.js redirect & HTTP fallback errors tanpa menangkap error biasa', () => {
    expect(isNextControlFlowError(new MockControlFlowError('NEXT_REDIRECT;replace;/login;303;'))).toBe(true)
    expect(isNextControlFlowError({ digest: 'NEXT_HTTP_ERROR_FALLBACK;403' })).toBe(true)
    expect(isNextControlFlowError({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' })).toBe(true)
    expect(isNextControlFlowError(new Error('Normal failure'))).toBe(false)
    expect(isNextControlFlowError(null)).toBe(false)
  })

  it('membuat apiErrorResponse JSON terstandar dengan status dan header opsional', async () => {
    const res = apiErrorResponse('RATE_LIMITED', 'Terlalu banyak permintaan', 429, {
      'Retry-After': '30',
    })

    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('30')
    await expect(res.json()).resolves.toEqual({
      error: {
        code: 'RATE_LIMITED',
        message: 'Terlalu banyak permintaan',
      },
    })
  })

  it('parsePositiveLimit menolak input tidak valid dan menjepit rentang aman', () => {
    expect(parsePositiveLimit(null)).toBe(500)
    expect(parsePositiveLimit('')).toBe(500)
    expect(parsePositiveLimit('abc')).toBe(500)
    expect(parsePositiveLimit('0')).toBe(1)
    expect(parsePositiveLimit('-50')).toBe(1)
    expect(parsePositiveLimit('99999')).toBe(5000)
    expect(parsePositiveLimit('250')).toBe(250)
  })

  it('logServerError menyensor kunci sensitif di metadata', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    logServerError('test.context', new Error('boom'), {
      complaintId: 'comp-123',
      password: 'secret-password',
      token: 'jwt-secret',
      database_url: 'postgres://secret',
    })

    expect(consoleSpy).toHaveBeenCalledTimes(1)
    const logged = JSON.parse(String(consoleSpy.mock.calls[0][0])) as {
      context: string
      code: string
      meta: Record<string, string>
    }
    expect(logged.context).toBe('test.context')
    expect(logged.code).toBe('INTERNAL_ERROR')
    expect(logged.meta).toEqual({
      complaintId: 'comp-123',
      password: '[REDACTED]',
      token: '[REDACTED]',
      database_url: '[REDACTED]',
    })

    consoleSpy.mockRestore()
  })
})

describe('Server Action Redirect Preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adminDeleteComplaint meneruskan redirect /login saat sesi kosong', async () => {
    mockGetAuthOptional.mockResolvedValueOnce(null)
    const formData = new FormData()
    formData.append('id', 'comp-1')

    await expect(adminDeleteComplaint(formData)).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT;replace;/login;303;',
    })
    expect(mockRedirect).toHaveBeenCalledTimes(1)
    expect(mockRedirect).toHaveBeenCalledWith('/login')
  })

  it('adminDeleteComplaint meneruskan redirect sukses setelah menghapus tanpa tertangkap catch', async () => {
    mockGetAuthOptional.mockResolvedValueOnce({ user: { id: 'admin-user-1' } })
    mockPrisma.profile.findUnique.mockResolvedValueOnce({ id: 'prof-admin-1', role: 'ADMIN' })
    mockPrisma.complaint.findUnique.mockResolvedValueOnce({
      title: 'Lampu Jalan Mati',
      authorId: 'prof-warga-1',
      author: { name: 'Warga' },
    })
    mockPrisma.notification.create.mockResolvedValueOnce({})
    mockPrisma.complaint.delete.mockResolvedValueOnce({})

    const formData = new FormData()
    formData.append('id', 'comp-1')

    await expect(adminDeleteComplaint(formData)).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT;replace;/dashboard?message=Laporan telah dihapus dan warga diberi tahu;303;',
    })
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard?message=Laporan telah dihapus dan warga diberi tahu')
  })

  it('adminDeleteComplaint memetakan Prisma P2025 ke redirect not_found', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockGetAuthOptional.mockResolvedValueOnce({ user: { id: 'admin-user-1' } })
    mockPrisma.profile.findUnique.mockResolvedValueOnce({ id: 'prof-admin-1', role: 'ADMIN' })
    mockPrisma.complaint.findUnique.mockResolvedValueOnce({
      title: 'Lampu Jalan Mati',
      authorId: 'prof-warga-1',
      author: { name: 'Warga' },
    })
    mockPrisma.notification.create.mockResolvedValueOnce({})
    mockPrisma.complaint.delete.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '6.19.3',
      })
    )

    const formData = new FormData()
    formData.append('id', 'comp-missing')

    await expect(adminDeleteComplaint(formData)).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT;replace;/dashboard?error=not_found;303;',
    })
    consoleSpy.mockRestore()
  })

  it('updateComplaintStatus meneruskan forbidden() dan invalid_input tanpa ditelan catch', async () => {
    mockRequireStaff.mockRejectedValueOnce(new MockControlFlowError('NEXT_HTTP_ERROR_FALLBACK;403'))
    const formData = new FormData()
    formData.append('id', 'comp-1')
    formData.append('status', 'PROCESSING')

    await expect(updateComplaintStatus(formData)).rejects.toMatchObject({
      digest: 'NEXT_HTTP_ERROR_FALLBACK;403',
    })

    mockRequireStaff.mockResolvedValueOnce({ profile: { id: 'prof-petugas-1', role: 'PETUGAS' } })
    const invalidForm = new FormData()
    invalidForm.append('id', 'comp-1')
    invalidForm.append('status', 'UNKNOWN')

    await expect(updateComplaintStatus(invalidForm)).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT;replace;/dashboard/complaint/comp-1?error=invalid_input;303;',
    })
  })
})

