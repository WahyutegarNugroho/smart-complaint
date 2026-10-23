import { NextResponse } from 'next/server'
import { checkLoginAttempt } from '@/lib/login-rate-limit'

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const result = await checkLoginAttempt(ip)
    return NextResponse.json(result)
  } catch (err) {
    console.error('API /api/login-status Error:', err)
    return NextResponse.json(
      { locked: false, remainingAttempts: 5, remainingSeconds: 0 },
      { status: 200 }
    )
  }
}
