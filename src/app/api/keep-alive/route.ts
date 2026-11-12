import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { apiErrorResponse, logServerError, mapPrismaError } from '@/lib/errors'

// Pastikan route ini selalu dieksekusi secara dinamis dan tidak di-cache
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return apiErrorResponse('INTERNAL_ERROR', 'Konfigurasi keep-alive belum tersedia.', 500)
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return apiErrorResponse('UNAUTHORIZED', 'Akses tidak sah.', 401)
  }

  try {
    // Melakukan query sangat ringan ke database untuk mengirimkan sinyal aktivitas
    // Ini akan mencegah Supabase dari mem-pause project karena inaktif
    await prisma.complaint.count({ take: 1 })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Database connection is alive and active', 
        timestamp: new Date().toISOString() 
      },
      { status: 200 }
    )
  } catch (err) {
    logServerError('api.keep-alive', err)
    const mapped = mapPrismaError(err)
    return apiErrorResponse(mapped.code, mapped.userMessage, mapped.status)
  }
}
