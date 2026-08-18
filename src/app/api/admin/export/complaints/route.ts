import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { guardAdminExport } from '@/lib/admin-export'
import { Readable } from 'stream'

function escapeCsvField(value: string): string {
  const dangerous = /^[=+\-@\t]/
  const escaped = value.replace(/"/g, '""')
  return `"${dangerous.test(value) ? '\t' : ''}${escaped}"`
}

function* generateCsvRows(complaints: Array<{ id: string; createdAt: Date; author: { name: string | null } | null; title: string; category: string; content: string | null; location: string; rt: string | null; rw: string | null; status: string; isUrgent: boolean }>) {
  const headers = ['ID', 'Tanggal Dibuat', 'Pelapor', 'Judul', 'Kategori', 'Isi Laporan', 'Lokasi', 'RT', 'RW', 'Status', 'Prioritas']
  yield headers.join(',') + '\n'
  
  for (const c of complaints) {
    const row = [
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
    ]
    yield row.join(',') + '\n'
  }
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
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    })

    const stream = Readable.from(generateCsvRows(complaints))
    
    const encoder = new TextEncoder()
    const utf8Bom = encoder.encode('\ufeff')
    
    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          controller.enqueue(utf8Bom)
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        }
      }),
      {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename=laporan-smart-complaint-${new Date().toISOString().split('T')[0]}.csv`,
          'Transfer-Encoding': 'chunked',
        }
      }
    )
  } catch (err) {
    console.error('Export Error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
