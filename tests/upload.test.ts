import { describe, it, expect } from 'vitest'
import { validateMagicBytes } from '@/lib/upload'

function createFile(bytes: number[], type: string): File {
  const uint8 = new Uint8Array(bytes)
  return new File([uint8], 'test-image', { type })
}

describe('validateMagicBytes', () => {
  it('validates standard JPEG magic bytes', async () => {
    const file = createFile([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46], 'image/jpeg')
    const isValid = await validateMagicBytes(file, 'image/jpeg')
    expect(isValid).toBe(true)
  })

  it('validates EXIF JPEG magic bytes', async () => {
    const file = createFile([0xFF, 0xD8, 0xFF, 0xE1, 0x00, 0x10, 0x45, 0x78], 'image/jpeg')
    const isValid = await validateMagicBytes(file, 'image/jpeg')
    expect(isValid).toBe(true)
  })

  it('validates PNG magic bytes', async () => {
    const file = createFile([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], 'image/png')
    const isValid = await validateMagicBytes(file, 'image/png')
    expect(isValid).toBe(true)
  })

  it('validates WebP magic bytes', async () => {
    const file = createFile([
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x00, 0x00, 0x00, 0x00, // size
      0x57, 0x45, 0x42, 0x50  // WEBP
    ], 'image/webp')
    const isValid = await validateMagicBytes(file, 'image/webp')
    expect(isValid).toBe(true)
  })

  it('validates GIF magic bytes', async () => {
    const file = createFile([0x47, 0x49, 0x46, 0x38, 0x39, 0x61], 'image/gif')
    const isValid = await validateMagicBytes(file, 'image/gif')
    expect(isValid).toBe(true)
  })

  it('rejects corrupted/mismatched magic bytes', async () => {
    const file = createFile([0x00, 0x00, 0x00, 0x00], 'image/jpeg')
    const isValid = await validateMagicBytes(file, 'image/jpeg')
    expect(isValid).toBe(false)
  })

  it('rejects file too short', async () => {
    const file = createFile([0xFF, 0xD8], 'image/jpeg')
    const isValid = await validateMagicBytes(file, 'image/jpeg')
    expect(isValid).toBe(false)
  })
})
