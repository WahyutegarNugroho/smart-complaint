import { describe, it, expect } from 'vitest'
import { suggestCategory } from '@/lib/constants'

describe('suggestCategory', () => {
  it('returns null for empty title', () => {
    expect(suggestCategory('')).toBeNull()
  })

  it('returns null for blank title', () => {
    expect(suggestCategory('   ')).toBeNull()
  })

  it('returns keamanan for security-related title', () => {
    expect(suggestCategory('Ada maling di RT 03')).toBe('keamanan')
    expect(suggestCategory('Tetangga curiga')).toBe('keamanan')
  })

  it('returns kebersihan for hygiene-related title', () => {
    expect(suggestCategory('Tumpukan sampah')).toBe('kebersihan')
    expect(suggestCategory('Selokan mampet')).toBe('kebersihan')
  })

  it('returns fasilitas for facility-related title', () => {
    expect(suggestCategory('Jalan rusak')).toBe('fasilitas')
    expect(suggestCategory('Lampu mati')).toBe('fasilitas')
  })

  it('returns null for unrelated title', () => {
    expect(suggestCategory('Halo warga')).toBeNull()
  })

  it('is case insensitive', () => {
    expect(suggestCategory('MALING DI RT 03')).toBe('keamanan')
  })
})
