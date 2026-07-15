import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limit store. Note: each serverless instance has its own store.
// For truly distributed rate limiting, use Redis/Vercel KV.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

// Per-key mutex to prevent race conditions within the same process
const keyLocks = new Map<string, Promise<void>>()

async function waitForTurn(key: string): Promise<() => void> {
  while (true) {
    const prev = keyLocks.get(key)
    if (!prev) break
    await prev
  }
  let release: () => void
  keyLocks.set(key, new Promise((r) => { release = r }))
  return () => { keyLocks.delete(key); release!() }
}

interface RateLimitConfig {
  windowMs: number
  max: number
  keyPrefix: string
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60_000,
  max: 30,
  keyPrefix: 'api',
}

export async function rateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
): Promise<NextResponse | null> {
  const { windowMs, max, keyPrefix } = { ...DEFAULT_CONFIG, ...config }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const key = `${keyPrefix}:${ip}`

  const done = await waitForTurn(key)
  try {
    const now = Date.now()
    const record = rateLimitStore.get(key)

    if (!record || now > record.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
      return null
    }

    if (record.count >= max) {
      return NextResponse.json(
        { error: 'Too Many Requests', message: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((record.resetAt - now) / 1000)),
            'X-RateLimit-Limit': String(max),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(record.resetAt / 1000)),
          },
        }
      )
    }

    record.count++
    return null
  } finally {
    done()
  }
}
