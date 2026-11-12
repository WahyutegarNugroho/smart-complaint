import { NextResponse } from 'next/server'
import { processEscalations } from '@/lib/escalation'
import { apiErrorResponse, logServerError, mapPrismaError } from '@/lib/errors'

// Vercel Cron: */30 * * * *
// Bisa juga dipanggil manual oleh admin via tombol di dashboard
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return apiErrorResponse('INTERNAL_ERROR', 'Konfigurasi cron belum tersedia.', 500)
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return apiErrorResponse('UNAUTHORIZED', 'Akses cron tidak sah.', 401)
  }

  try {
    const escalated = await processEscalations()

    return NextResponse.json({
      success: true,
      escalated,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    logServerError('api.cron.escalate', err)
    const mapped = mapPrismaError(err)
    return apiErrorResponse(mapped.code, mapped.userMessage, mapped.status)
  }
}
