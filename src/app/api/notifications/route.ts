import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sesi tidak terotentikasi' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true }
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profil pengguna tidak ditemukan' }, { status: 403 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: profile.id },
      orderBy: [
        { isRead: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 10
    })

    return NextResponse.json(notifications)
  } catch (err) {
    console.error('API /api/notifications Error:', err)
    return NextResponse.json([], { status: 500 })
  }
}
