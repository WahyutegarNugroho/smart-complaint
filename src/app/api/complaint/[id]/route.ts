import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

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

  return NextResponse.json(complaint)
}
