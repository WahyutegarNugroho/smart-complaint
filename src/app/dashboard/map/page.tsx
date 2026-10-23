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

  const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true, role: true } })
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
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    incidentDate: c.incidentDate ? new Date(c.incidentDate).toISOString() : new Date().toISOString(),
    categoryName: c.categoryRel?.name || c.category
  }))

  return (
    <div className="h-[calc(100vh-1px)] flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href={complaintId ? `/dashboard/complaint/${complaintId}` : '/dashboard'}
            className="h-10 w-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label={complaintId ? 'Kembali ke detail pengaduan' : 'Kembali ke beranda pengaduan'}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">Peta Sebaran Laporan Wilayah</h1>
            <p className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {parsed.length} titik koordinat pengaduan terdata
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

