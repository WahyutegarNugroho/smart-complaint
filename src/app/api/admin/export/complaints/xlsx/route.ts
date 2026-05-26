import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import * as XLSX from 'xlsx'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { role: true }
  })

  if (!profile || profile.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = Math.min(Math.max(1, parseInt(limitParam || '500')), 5000)

    const complaints = await prisma.complaint.findMany({
      take: limit,
      include: { author: true, categoryRel: true },
      orderBy: { createdAt: 'desc' }
    })

    const rows = complaints.map(c => ({
      ID: c.id,
      'Tanggal Dibuat': new Date(c.createdAt).toLocaleDateString('id-ID'),
      Pelapor: c.author?.name || 'Anonim',
      Judul: c.title,
      Kategori: c.categoryRel?.name || c.category,
      'Isi Laporan': (c.content || '').replace(/\n/g, ' '),
      Lokasi: c.location,
      Lat: c.latitude ?? '',
      Lng: c.longitude ?? '',
      RT: c.rt || '',
      RW: c.rw || '',
      Status: c.status,
      Prioritas: c.isUrgent ? 'YA' : 'TIDAK',
      'Tingkat Eskalasi': c.escalationLevel,
      'Tanggal Kejadian': new Date(c.incidentDate).toLocaleDateString('id-ID'),
      'Terakhir Diupdate': new Date(c.updatedAt).toLocaleDateString('id-ID'),
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows)

    const colWidths = Object.keys(rows[0] || {}).map(key => ({
      wch: Math.max(key.length, 20)
    }))
    ws['!cols'] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, 'Laporan')

    const summaryRows = [
      { Metrik: 'Total Laporan', Nilai: complaints.length },
      { Metrik: 'Menunggu', Nilai: complaints.filter(c => c.status === 'PENDING').length },
      { Metrik: 'Diproses', Nilai: complaints.filter(c => c.status === 'PROCESSING').length },
      { Metrik: 'Selesai', Nilai: complaints.filter(c => c.status === 'COMPLETED').length },
      { Metrik: 'Prioritas', Nilai: complaints.filter(c => c.isUrgent && c.status !== 'COMPLETED').length },
    ]
    const wsSummary = XLSX.utils.json_to_sheet(summaryRows)
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan')

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=laporan-smart-complaint-${new Date().toISOString().split('T')[0]}.xlsx`
      }
    })
  } catch (err) {
    console.error('XLSX Export Error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
