import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { apiErrorResponse, logServerError } from '@/lib/errors'

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
      logServerError('api.geocode.upstream', new Error(`HTTP ${response.status}`))
      return apiErrorResponse(
        'INTERNAL_ERROR',
        'Layanan pencarian alamat sedang tidak tersedia. Silakan coba lagi.',
        502
      )
    }

    const data = await response.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    logServerError('api.geocode.fetch', err)
    return apiErrorResponse(
      'INTERNAL_ERROR',
      'Layanan pencarian alamat sedang tidak dapat dijangkau.',
      502
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
      return apiErrorResponse('VALIDATION_ERROR', 'Parameter koordinat lat dan lon wajib diisi.', 400)
    }

    const latNum = parseFloat(lat)
    const lonNum = parseFloat(lon)

    if (isNaN(latNum) || isNaN(lonNum) ||
        latNum < -90 || latNum > 90 ||
        lonNum < -180 || lonNum > 180) {
      return apiErrorResponse('VALIDATION_ERROR', 'Koordinat lokasi tidak valid.', 400)
    }

    const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${latNum}&lon=${lonNum}&accept-language=id&addressdetails=1`
    return proxyRequest(url)
  }

  if (action === 'search') {
    const q = searchParams.get('q')

    if (!q || q.trim().length < 3) {
      return apiErrorResponse('VALIDATION_ERROR', 'Kata kunci pencarian minimal 3 karakter.', 400)
    }

    const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(q.trim())}&limit=5&accept-language=id&addressdetails=1`
    return proxyRequest(url)
  }

  return apiErrorResponse(
    'VALIDATION_ERROR',
    'Parameter action tidak valid. Gunakan reverse atau search.',
    400
  )
}
