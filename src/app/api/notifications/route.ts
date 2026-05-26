import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true } })
  if (!profile) return NextResponse.json({ error: 'Profile required' }, { status: 403 })

  const notifications = await prisma.notification.findMany({
    where: { userId: profile.id },
    orderBy: [
      { isRead: 'asc' },
      { createdAt: 'desc' }
    ],
    take: 10
  })

  return NextResponse.json(notifications)
}
