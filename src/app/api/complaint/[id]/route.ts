import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { isStaff } from '@/lib/authorization'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'ID laporan tidak valid' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sesi tidak terotentikasi' }, { status: 401 })
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!complaint) {
      return NextResponse.json({ error: 'Laporan tidak ditemukan' }, { status: 404 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, role: true }
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profil pengguna tidak ditemukan' }, { status: 403 })
    }

    const isAuthor = complaint.authorId === profile.id

    if (!isStaff(profile) && !isAuthor) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    return NextResponse.json(complaint)
  } catch (err) {
    console.error('API /api/complaint/[id] Error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal' }, { status: 500 })
  }
}
