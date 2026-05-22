import { NextResponse } from 'next/server'
import { processEscalations } from '@/lib/escalation'

// Vercel Cron: */30 * * * *
// Bisa juga dipanggil manual oleh admin via tombol di dashboard
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const escalated = await processEscalations()

    return NextResponse.json({
      success: true,
      escalated,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Cron Escalate Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
