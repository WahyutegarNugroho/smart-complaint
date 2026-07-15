import { describe, it, expect } from 'vitest'

function buildPaginationUrl(page: number, params: Record<string, string | undefined>, basePageSize: number): string {
  const p = new URLSearchParams()
  if (page > 1) p.set('page', String(page))
  if (params.currentStatus) p.set('status', params.currentStatus)
  if (params.searchQuery) p.set('q', params.searchQuery)
  if (params.categoryFilter) p.set('category', params.categoryFilter)
  if (params.fromDate) p.set('fromDate', params.fromDate)
  if (params.toDate) p.set('toDate', params.toDate)
  if (params.rt) p.set('rt', params.rt)
  if (params.rw) p.set('rw', params.rw)
  if (params.pageSize && Number(params.pageSize) !== basePageSize) p.set('pageSize', String(params.pageSize))
  const qs = p.toString()
  return `/dashboard${qs ? `?${qs}` : ''}`
}

describe('buildPaginationUrl', () => {
  const baseParams = { currentStatus: 'PENDING', rt: '001' }

  it('returns base path for page 1 with no params', () => {
    expect(buildPaginationUrl(1, {}, 12)).toBe('/dashboard')
  })

  it('includes page param when page > 1', () => {
    const url = buildPaginationUrl(2, baseParams, 12)
    expect(url).toContain('page=2')
    expect(url).toContain('status=PENDING')
    expect(url).toContain('rt=001')
  })

  it('includes pageSize only when not default', () => {
    const urlDefault = buildPaginationUrl(1, { pageSize: '12' }, 12)
    expect(urlDefault).not.toContain('pageSize')
    const urlCustom = buildPaginationUrl(1, { pageSize: '24' }, 12)
    expect(urlCustom).toContain('pageSize=24')
  })
})
