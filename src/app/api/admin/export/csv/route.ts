import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function GET(_req: NextRequest) {
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
  let csv = 'ID,Tanggal,Pelapor,Judul,Isi,Lokasi,RT,RW,Status,Prioritas\n'
  
  complaints.forEach(c => {
    const row = [
      c.id,
      new Date(c.createdAt).toLocaleDateString('id-ID'),
      c.author.name.replace(/,/g, ''),
      c.title.replace(/,/g, ''),
      c.content.replace(/,/g, ' ').replace(/\n/g, ' '),
      c.location.replace(/,/g, ''),
      c.rt || '-',
      c.rw || '-',
      c.status,
      c.isUrgent ? 'YA' : 'TIDAK'
    ].join(',')
    csv += row + '\n'
  })

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=Laporan_Masyarakat_${Date.now()}.csv`
    }
  })
}
