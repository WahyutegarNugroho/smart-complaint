import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'

function escapeCsvField(value: string): string {
  const dangerous = /^[=+\-@\t]/
  const escaped = value.replace(/"/g, '""')
  return `"${dangerous.test(value) ? '\t' : ''}${escaped}"`
}

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(`api:export:csv:${ip}`, 5, 60_000)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile || profile.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  // Create CSV Content
  const headers = ['ID', 'Tanggal', 'Pelapor', 'Judul', 'Isi', 'Lokasi', 'RT', 'RW', 'Status', 'Prioritas']
  const rows = complaints.map(c => [
    escapeCsvField(c.id),
    escapeCsvField(new Date(c.createdAt).toLocaleDateString('id-ID')),
    escapeCsvField(c.author?.name || 'Anonim'),
    escapeCsvField(c.title),
    escapeCsvField(c.content.replace(/\n/g, ' ')),
    escapeCsvField(c.location),
    escapeCsvField(c.rt || '-'),
    escapeCsvField(c.rw || '-'),
    escapeCsvField(c.status),
    escapeCsvField(c.isUrgent ? 'YA' : 'TIDAK')
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=Laporan_Masyarakat_${Date.now()}.csv`
    }
  })
}
