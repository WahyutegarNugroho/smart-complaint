import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { guardAdminExport } from '@/lib/admin-export'

function escapeCsvField(value: string): string {
  const dangerous = /^[=+\-@\t]/
  const escaped = value.replace(/"/g, '""')
  return `"${dangerous.test(value) ? '\t' : ''}${escaped}"`
}

export async function GET(request: NextRequest) {
  const ctx = await guardAdminExport(request, 'export:csv')
  if (ctx instanceof NextResponse) return ctx

  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = Math.min(Math.max(1, parseInt(limitParam || '500')), 5000)

    const complaints = await prisma.complaint.findMany({
      take: limit,
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    })

    // 📄 Create CSV Content
    const headers = ['ID', 'Tanggal Dibuat', 'Pelapor', 'Judul', 'Kategori', 'Isi Laporan', 'Lokasi', 'RT', 'RW', 'Status', 'Prioritas']
    const rows = complaints.map(c => [
      escapeCsvField(c.id),
      escapeCsvField(new Date(c.createdAt).toLocaleDateString('id-ID')),
      escapeCsvField(c.author?.name || 'Anonim'),
      escapeCsvField(c.title),
      escapeCsvField(c.category),
      escapeCsvField((c.content || '').replace(/\n/g, ' ')),
      escapeCsvField(c.location),
      escapeCsvField(c.rt || '-'),
      escapeCsvField(c.rw || '-'),
      escapeCsvField(c.status),
      escapeCsvField(c.isUrgent ? 'YA' : 'TIDAK')
    ])

    const csvContent = '\ufeff' + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // 🚀 Return as File Download
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=laporan-smart-complaint-${new Date().toISOString().split('T')[0]}.csv`
      }
    })
  } catch (err) {
    console.error('Export Error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
