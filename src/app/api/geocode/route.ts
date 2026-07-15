import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

async function proxyRequest(url: string): Promise<NextResponse> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SmartComplaint/1.0 (https://smart-complaint-app.vercel.app)',
        'Accept': 'application/json',
        'Accept-Language': 'id,en;q=0.9',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Geocoding service unavailable' },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Geocoding service unavailable' },
      { status: 502 }
    )
  }
}

export async function GET(request: NextRequest) {
  const rl = await rateLimit(request, { keyPrefix: 'geocode', max: 10 })
  if (rl) return rl

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'reverse') {
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Missing lat or lon parameter' },
        { status: 400 }
      )
    }

    const latNum = parseFloat(lat)
    const lonNum = parseFloat(lon)

    if (isNaN(latNum) || isNaN(lonNum) ||
        latNum < -90 || latNum > 90 ||
        lonNum < -180 || lonNum > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      )
    }

    const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${latNum}&lon=${lonNum}&accept-language=id&addressdetails=1`
    return proxyRequest(url)
  }

  if (action === 'search') {
    const q = searchParams.get('q')

    if (!q || q.trim().length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters' },
        { status: 400 }
      )
    }

    const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(q.trim())}&limit=5&accept-language=id&addressdetails=1`
    return proxyRequest(url)
  }

  return NextResponse.json(
    { error: 'Invalid action. Use action=reverse or action=search' },
    { status: 400 }
  )
}
