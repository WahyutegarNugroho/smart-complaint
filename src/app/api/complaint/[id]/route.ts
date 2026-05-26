import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { isStaff } from '@/lib/authorization'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const complaint = await prisma.complaint.findUnique({
    where: { id: id },
    include: { author: true }
  })

  if (!complaint) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  // 🛡️ SECURITY: Only author or staff can view details
  const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true, role: true } })
  if (!profile) return NextResponse.json({ error: 'Profile required' }, { status: 403 })

  const isAuthor = complaint.authorId === profile.id

  if (!isStaff(profile) && !isAuthor) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(complaint)
}
