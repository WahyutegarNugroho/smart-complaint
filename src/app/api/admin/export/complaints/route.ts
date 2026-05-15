import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile || profile.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const complaints = await prisma.complaint.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    })

    // 📄 Create CSV Content
    const headers = ['ID', 'Judul', 'Kategori', 'Status', 'Prioritas', 'Tanggal Kejadian', 'Warga', 'RT', 'RW', 'Lokasi', 'Isi Laporan', 'Tanggal Dibuat']
    const rows = complaints.map(c => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.status,
      c.isUrgent ? 'YA' : 'TIDAK',
      c.incidentDate.toLocaleDateString('id-ID'),
      c.author?.name || 'Anonim',
      c.rt || '-',
      c.rw || '-',
      `"${c.location.replace(/"/g, '""')}"`,
      `"${c.content.replace(/"/g, '""')}"`,
      c.createdAt.toLocaleDateString('id-ID')
    ])

    const csvContent = [
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
