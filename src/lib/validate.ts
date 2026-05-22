export function validateString(value: string, field: string, maxLength: number = 255): string | null {
  if (!value || typeof value !== 'string') return `${field} tidak valid`
  const trimmed = value.trim()
  if (!trimmed) return `${field} tidak boleh kosong`
  if (trimmed.length > maxLength) return `${field} melebihi ${maxLength} karakter`
  return null
}

export function validateNIK(value: string): string | null {
  if (!value) return null
  if (!/^\d{16}$/.test(value)) return 'NIK harus 16 digit angka'
  return null
}

export function validatePhone(value: string): string | null {
  if (!value) return null
  if (!/^08\d{8,13}$/.test(value)) return 'Nomor telepon harus diawali 08 (10-15 digit)'
  return null
}

export function validateRTRW(value: string, label: string): string | null {
  if (!value) return null
  if (!/^\d{1,3}$/.test(value)) return `${label} harus 1-3 digit angka`
  return null
}

export function validateEnum<T extends string>(value: string, allowed: readonly T[]): T | null {
  if (allowed.includes(value as T)) return value as T
  return null
}
