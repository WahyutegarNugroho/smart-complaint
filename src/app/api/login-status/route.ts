import { NextResponse } from 'next/server'
import { checkLoginAttempt } from '@/lib/login-rate-limit'

export async function GET(request: Request) {
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const result = await checkLoginAttempt(ip)
  return NextResponse.json(result)
}
