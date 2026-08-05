import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function guardAdminExport(request: NextRequest, keyPrefix: string) {
  const rl = await rateLimit(request, { keyPrefix, max: 10 })
  if (rl) return rl

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { role: true, name: true }
  })

  if (!profile || profile.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return { user, profile }
}
