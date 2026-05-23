import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MapPageClient } from '@/components/map'

export default async function MapPage({
  searchParams
}: {
  searchParams: Promise<{ complaintId?: string }>
}) {
  const { complaintId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!profile) redirect('/dashboard')

  const complaints = await prisma.complaint.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null }
    },
    select: {
      id: true,
      title: true,
      content: true,
      latitude: true,
      longitude: true,
      status: true,
      rt: true,
      rw: true,
      isUrgent: true,
      createdAt: true,
      category: true,
      categoryId: true,
      imageUrl: true,
      location: true,
      incidentDate: true,
      escalationLevel: true,
      authorId: true,
      author: {
        select: {
          name: true,
          username: true
        }
      },
      categoryRel: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 500
  })

  const categories = await prisma.category.findMany({
    where: { parentId: { not: null } },
    select: { id: true, name: true, parentId: true },
    orderBy: { name: 'asc' }
  })

  const parsed = complaints.map(c => ({
    ...c,
    latitude: c.latitude!,
    longitude: c.longitude!,
    createdAt: c.createdAt.toISOString(),
    incidentDate: c.incidentDate.toISOString(),
    categoryName: c.categoryRel?.name || c.category
  }))

  return (
    <div className="h-[calc(100vh-1px)] flex flex-col bg-brand-canvas-soft">
      <header className="bg-brand-canvas border-b border-brand-hairline px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={complaintId ? `/dashboard/complaint/${complaintId}` : '/dashboard'}
            className="h-9 w-9 bg-brand-canvas-soft border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/50 hover:text-brand-ink transition-all"
            aria-label={complaintId ? 'Kembali ke detail pengaduan' : 'Kembali ke dashboard'}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-brand-ink">Peta Sebaran Laporan</h1>
            <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest">
              {parsed.length} titik lokasi
            </p>
          </div>
        </div>
      </header>
      <div className="flex-1 relative">
        <MapPageClient complaints={parsed} categories={categories} highlightedComplaintId={complaintId} userRole={profile.role} currentUserId={profile.id} />
      </div>
    </div>
  )
}
