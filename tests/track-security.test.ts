import { describe, it, expect, vi, beforeEach } from 'vitest'

let mockIp = '10.0.0.1'
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => {
      if (name === 'x-real-ip') return mockIp
      return null
    },
  })),
}))

const mockFindMany = vi.fn()
vi.mock('@/lib/prisma', () => ({
  default: {
    complaint: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}))

import { trackTicketStatus } from '@/app/actions/track'

describe('trackTicketStatus security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIp = '10.0.0.1'
  })

  it('rejects ticket codes shorter than 6 characters without querying DB', async () => {
    const res1 = await trackTicketStatus('cma')
    expect(res1.found).toBe(false)
    expect(mockFindMany).not.toHaveBeenCalled()

    const res2 = await trackTicketStatus('#LP-12345')
    expect(res2.found).toBe(false)
    expect(mockFindMany).not.toHaveBeenCalled()
  })

  it('normalizes #LP- prefix and queries using exact/endsWith only (no startsWith)', async () => {
    mockFindMany.mockResolvedValue([
      {
        id: 'cm12345678abcdef',
        title: 'Jalan Rusak',
        status: 'PROCESSING',
        category: 'fasilitas',
        rt: '001',
        rw: '008',
        createdAt: new Date('2026-10-01T00:00:00Z'),
        updatedAt: new Date('2026-10-02T00:00:00Z'),
        author: { name: 'Budi Santoso' },
        responses: [],
        _count: { responses: 0 },
      },
    ])

    const res = await trackTicketStatus('#LP-ABCDEF')
    expect(res.found).toBe(true)
    expect(mockFindMany).toHaveBeenCalledTimes(1)

    const callArg = mockFindMany.mock.calls[0][0]
    expect(callArg.where.OR).toEqual([
      { id: { equals: 'ABCDEF', mode: 'insensitive' } },
      { id: { endsWith: 'ABCDEF', mode: 'insensitive' } },
    ])
  })

  it('rejects ambiguous suffix matches when multiple complaints match', async () => {
    mockFindMany.mockResolvedValue([
      { id: 'cm111111abcdef' },
      { id: 'cm222222abcdef' },
    ])

    const res = await trackTicketStatus('ABCDEF')
    expect(res.found).toBe(false)
    expect(res.message).toContain('lebih dari satu')
  })

  it('enforces IP rate limiting after 15 requests', async () => {
    mockIp = '10.0.0.99'
    mockFindMany.mockResolvedValue([])

    for (let i = 0; i < 15; i++) {
      await trackTicketStatus('ABCDEF')
    }

    const blocked = await trackTicketStatus('ABCDEF')
    expect(blocked.found).toBe(false)
    expect(blocked.message).toContain('Terlalu banyak permintaan')
    expect(mockFindMany).toHaveBeenCalledTimes(15)
  })
})

