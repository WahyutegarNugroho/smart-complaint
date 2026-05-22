import { describe, it, expect } from 'vitest'
import {
  validateString,
  validateNIK,
  validatePhone,
  validateRTRW,
  validateEnum,
} from '@/lib/validate'

describe('validateString', () => {
  it('returns error for empty string', () => {
    expect(validateString('', 'Nama')).toBe('Nama tidak valid')
  })

  it('returns error for whitespace-only string', () => {
    expect(validateString('   ', 'Nama')).toBe('Nama tidak boleh kosong')
  })

  it('returns error for string exceeding max length', () => {
    expect(validateString('a'.repeat(101), 'Nama', 100)).toBe('Nama melebihi 100 karakter')
  })

  it('returns null for valid string', () => {
    expect(validateString('Budi', 'Nama', 100)).toBeNull()
  })

  it('trims whitespace before validation', () => {
    expect(validateString('  Budi  ', 'Nama', 100)).toBeNull()
  })

  it('returns error for non-string input', () => {
    expect(validateString(null as unknown as string, 'Nama')).toBe('Nama tidak valid')
    expect(validateString(undefined as unknown as string, 'Nama')).toBe('Nama tidak valid')
  })
})

describe('validateNIK', () => {
  it('returns null for empty value', () => {
    expect(validateNIK('')).toBeNull()
  })

  it('returns error for non-16-digit value', () => {
    expect(validateNIK('12345')).toBe('NIK harus 16 digit angka')
  })

  it('returns error for value with letters', () => {
    expect(validateNIK('123456789012345a')).toBe('NIK harus 16 digit angka')
  })

  it('returns null for valid 16-digit NIK', () => {
    expect(validateNIK('1234567890123456')).toBeNull()
  })
})

describe('validatePhone', () => {
  it('returns null for empty value', () => {
    expect(validatePhone('')).toBeNull()
  })

  it('returns error for value not starting with 08', () => {
    expect(validatePhone('12345678901')).toBe('Nomor telepon harus diawali 08 (10-15 digit)')
  })

  it('returns error for too short phone', () => {
    expect(validatePhone('0812345')).toBe('Nomor telepon harus diawali 08 (10-15 digit)')
  })

  it('returns null for valid phone', () => {
    expect(validatePhone('081234567890')).toBeNull()
    expect(validatePhone('081234567890123')).toBeNull()
  })

  it('returns error for phone with letters', () => {
    expect(validatePhone('08123456789a')).toBe('Nomor telepon harus diawali 08 (10-15 digit)')
  })
})

describe('validateRTRW', () => {
  it('returns null for empty value', () => {
    expect(validateRTRW('', 'RT')).toBeNull()
  })

  it('returns error for value exceeding 3 digits', () => {
    expect(validateRTRW('1234', 'RT')).toBe('RT harus 1-3 digit angka')
  })

  it('returns error for non-numeric value', () => {
    expect(validateRTRW('abc', 'RT')).toBe('RT harus 1-3 digit angka')
  })

  it('returns null for valid RT/RW', () => {
    expect(validateRTRW('1', 'RT')).toBeNull()
    expect(validateRTRW('12', 'RW')).toBeNull()
    expect(validateRTRW('123', 'RT')).toBeNull()
  })
})

describe('validateEnum', () => {
  it('returns the value if it is in allowed list', () => {
    expect(validateEnum('a', ['a', 'b', 'c'])).toBe('a')
  })

  it('returns null if value is not in allowed list', () => {
    expect(validateEnum('d', ['a', 'b', 'c'])).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(validateEnum('', ['a', 'b'])).toBeNull()
  })
})
