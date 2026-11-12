import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { isRedirectError } from '@/lib/redirect-guard'

export type AppErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'DEPENDENCY_EXISTS'
  | 'RATE_LIMITED'
  | 'STORAGE_ERROR'
  | 'DATABASE_UNAVAILABLE'
  | 'INTERNAL_ERROR'

export interface MappedError {
  code: AppErrorCode
  status: number
  userMessage: string
  prismaCode?: string
}

const SENSITIVE_META_KEYS = new Set([
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'cookies',
  'nik',
  'database_url',
  'direct_url',
])

/**
 * Mengidentifikasi error kontrol alur internal Next.js (`redirect()`, `notFound()`, `forbidden()`, `unauthorized()`)
 * agar tidak tertangkap secara keliru oleh blok `try/catch`.
 */
export function isNextControlFlowError(err: unknown): boolean {
  if (isRedirectError(err)) return true
  if (typeof err === 'object' && err !== null && 'digest' in err) {
    const digest = (err as { digest?: unknown }).digest
    if (typeof digest === 'string' && digest.startsWith('NEXT_HTTP_ERROR_FALLBACK')) {
      return true
    }
  }
  return false
}

/**
 * Menerjemahkan error Prisma menjadi kode aplikasi, status HTTP, dan pesan aman Bahasa Indonesia.
 */
export function mapPrismaError(err: unknown): MappedError {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return {
          code: 'CONFLICT',
          status: 409,
          userMessage: 'Data sudah terdaftar dalam sistem dan tidak boleh duplikat.',
          prismaCode: err.code,
        }
      case 'P2003':
        return {
          code: 'DEPENDENCY_EXISTS',
          status: 409,
          userMessage: 'Data tidak dapat dihapus karena masih terhubung dengan riwayat atau entri aktif lainnya.',
          prismaCode: err.code,
        }
      case 'P2025':
        return {
          code: 'NOT_FOUND',
          status: 404,
          userMessage: 'Data yang dimaksud tidak ditemukan atau telah dihapus.',
          prismaCode: err.code,
        }
      case 'P1001':
      case 'P1008':
      case 'P1017':
      case 'P2024':
        return {
          code: 'DATABASE_UNAVAILABLE',
          status: 503,
          userMessage: 'Koneksi ke basis data sedang terganggu atau sibuk. Silakan coba kembali beberapa saat lagi.',
          prismaCode: err.code,
        }
      default:
        return {
          code: 'INTERNAL_ERROR',
          status: 500,
          userMessage: 'Terjadi kendala saat memproses basis data. Silakan coba kembali sesaat lagi.',
          prismaCode: err.code,
        }
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      code: 'DATABASE_UNAVAILABLE',
      status: 503,
      userMessage: 'Layanan basis data sedang tidak dapat dijangkau. Silakan coba kembali beberapa saat lagi.',
    }
  }

  return {
    code: 'INTERNAL_ERROR',
    status: 500,
    userMessage: 'Terjadi kendala sistem internal. Silakan coba kembali beberapa saat lagi.',
  }
}

/**
 * Menerjemahkan pesan error Supabase Auth ke pesan Bahasa Indonesia yang ramah pengguna.
 */
export function mapAuthError(rawMessage: string | null | undefined): string {
  const msg = (rawMessage || '').toLowerCase()

  if (msg.includes('invalid login credentials')) {
    return 'Email atau kata sandi yang Anda masukkan tidak sesuai.'
  }
  if (msg.includes('email not confirmed')) {
    return 'Email akun Anda belum diverifikasi. Silakan periksa kotak masuk atau folder spam.'
  }
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'Alamat email ini sudah terdaftar. Silakan masuk atau gunakan menu lupa sandi.'
  }
  if (msg.includes('password should be at least') || msg.includes('weak password')) {
    return 'Kata sandi minimal terdiri dari 6 karakter.'
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Terlalu banyak percobaan dalam waktu singkat. Silakan tunggu beberapa menit lalu coba lagi.'
  }
  if (msg.includes('same password') || msg.includes('different from the old password')) {
    return 'Kata sandi baru harus berbeda dari kata sandi sebelumnya.'
  }
  if (msg.includes('session') || msg.includes('expired') || msg.includes('invalid claim')) {
    return 'Sesi pemulihan akun tidak valid atau telah kedaluwarsa. Silakan ulangi permintaan.'
  }

  return 'Proses autentikasi gagal dijalankan. Silakan periksa kembali data Anda dan coba lagi.'
}

function sanitizeMeta(meta?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!meta) return undefined
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(meta)) {
    if (SENSITIVE_META_KEYS.has(key.toLowerCase())) {
      cleaned[key] = '[REDACTED]'
    } else {
      cleaned[key] = value
    }
  }
  return cleaned
}

/**
 * Mencatat error terstruktur ke server log tanpa mengekspos data sensitif.
 */
export function logServerError(
  context: string,
  err: unknown,
  meta?: Record<string, unknown>
): void {
  const mapped = mapPrismaError(err)
  const payload = {
    timestamp: new Date().toISOString(),
    level: 'error',
    context,
    code: mapped.code,
    ...(mapped.prismaCode ? { prismaCode: mapped.prismaCode } : {}),
    message: err instanceof Error ? err.message : String(err),
    ...(meta ? { meta: sanitizeMeta(meta) } : {}),
  }
  console.error(JSON.stringify(payload))
}

/**
 * Membuat respons JSON API terstandar untuk error.
 */
export function apiErrorResponse(
  code: AppErrorCode,
  message: string,
  status: number,
  headers?: HeadersInit
): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status, headers }
  )
}

/**
 * Memastikan parameter limit ekspor berupa bilangan bulat valid dalam rentang aman.
 */
export function parsePositiveLimit(
  rawLimit: string | null,
  fallback: number = 500,
  max: number = 5000
): number {
  if (!rawLimit) return fallback
  const parsed = Number.parseInt(rawLimit, 10)
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return fallback
  return Math.min(Math.max(1, parsed), max)
}

