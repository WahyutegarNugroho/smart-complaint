'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Calendar as CalendarIcon, 
  Send, 
  X,
  Info,
  ShieldAlert,
  Trash2,
  Lightbulb,
  AlertTriangle,
  Hammer,
  ChevronLeft,
  ChevronDown
} from 'lucide-react'
import { createComplaint } from '@/app/dashboard/actions'
import Link from 'next/link'
import Image from 'next/image'
import SubmitButton from '@/components/SubmitButton'
import { suggestCategory } from '@/lib/constants'
import { LocationPicker } from '@/components/map'

interface CategoryChild {
  id: string
  name: string
  slug: string
}

interface CategoryParent {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  children: CategoryChild[]
}

interface ProfileData {
  id: string
  rt?: string | null
  rw?: string | null
  nik?: string | null
  phone?: string | null
  address?: string | null
}

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldAlert, Trash2, Hammer, Lightbulb,
}

export default function CreateComplaintForm({ profile }: { profile: ProfileData }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryParent[]>([])
  const [selectedParent, setSelectedParent] = useState('umum')
  const [selectedChildId, setSelectedChildId] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        if (data.length > 0) {
          const umum = data.find((c: CategoryParent) => c.slug === 'umum')
          if (umum?.children?.length === 1) {
            setSelectedChildId(umum.children[0].id)
          }
        }
      })
      .catch(() => {})
  }, [])

  const isProfileIncomplete = !profile.rt || !profile.rw || !profile.nik || !profile.phone || !profile.address

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null)
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('Ukuran gambar melebihi 5MB. Silakan pilih gambar lain yang lebih kecil.')
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
      setPreview(URL.createObjectURL(file))
    }
  }

  const removePreview = () => {
    setFileError(null)
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const suggestedCategory = suggestCategory(title)

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-32">
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
<Link href="/dashboard" aria-label="Kembali ke dashboard" className="h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                   <ChevronLeft aria-hidden="true" size={20} />
                </Link>
               <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-normal">Layanan Warga</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">Buat Laporan Baru</h1>
            <p className="text-brand-ink/70 font-medium text-sm md:text-base">Sampaikan keluhan atau masukan Anda secara rinci dan objektif.</p>
          </div>

          {/* Urgent Toggle */}
<button
             type="button"
             onClick={() => setIsUrgent(!isUrgent)}
             aria-label={isUrgent ? 'Setel sebagai normal' : 'Setel sebagai urgensi'}
             className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${
               isUrgent 
                 ? 'bg-red-500/10 border-red-500/20 shadow-md' 
                 : 'bg-brand-canvas border-brand-hairline shadow-sm'
             }`}
           >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isUrgent ? 'bg-red-500 text-white' : 'bg-brand-canvas-soft text-brand-ink/40'}`}>
              <AlertTriangle aria-hidden="true" size={18} />
            </div>
            <div className="text-left">
              <p className={`text-[9px] font-semibold uppercase tracking-wider ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-brand-ink/50'}`}>Tingkat Urgensi</p>
              <p className="text-xs font-bold">{isUrgent ? 'Darurat / Penting' : 'Normal / Rutin'}</p>
            </div>
          </button>
        </section>

        {/* ⚠️ INCOMPLETE PROFILE BANNER */}
        {isProfileIncomplete && (
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 sm:p-5 flex items-start gap-3">
            <div className="h-9 w-9 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center shrink-0 border border-amber-500/20">
              <ShieldAlert size={18} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Profil Anda Belum Lengkap</h4>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
                Beberapa data penting Anda (NIK, nomor WhatsApp, alamat domisili) belum terisi. Mohon lengkapi di <Link href="/dashboard/settings" className="font-bold underline hover:text-amber-900 dark:hover:text-amber-200">Pengaturan Profil</Link> untuk mempermudah verifikasi petugas.
              </p>
            </div>
          </div>
        )}

        <form 
          action={createComplaint}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
        >
          {/* Hidden inputs */}
          <input type="hidden" name="category" value={selectedParent} />
          <input type="hidden" name="categoryId" value={selectedChildId} />
          <input type="hidden" name="isUrgent" value={isUrgent.toString()} />
          
          {/* LEFT: Main Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline shadow-sm space-y-6">
              
              {/* Category Selector */}
              <div className="space-y-3">
<label className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Pilih Kategori Masalah</label>
                <select
                  value={selectedParent}
                  onChange={(e) => {
                    setSelectedParent(e.target.value)
                    setSelectedChildId('')
                    if (e.target.value === 'umum' && categories.length > 0) {
                      const umum = categories.find((c: any) => c.slug === 'umum')
                      if (umum?.children?.length === 1) {
                        setSelectedChildId(umum.children[0].id)
                      }
                    }
                  }}
                  aria-label="Pilih kategori masalah"
                  className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-3 text-sm font-medium text-brand-ink focus:outline-none focus:ring-2 focus-ring-brand-primary transition-colors cursor-pointer"
                >
                  <option value="">Pilih Kategori...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="title" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Judul / Subjek</label>
                  {suggestedCategory && selectedParent !== suggestedCategory && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setSelectedParent(suggestedCategory)
                        const parent = categories.find((c) => c.slug === suggestedCategory)
                        if (parent?.children?.length === 1) {
                          setSelectedChildId(parent.children[0].id)
                        } else {
                          setSelectedChildId('')
                        }
                      }}
                      className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    >
                      <Lightbulb aria-hidden="true" size={10} /> Saran: {(suggestedCategory).toUpperCase()} (Terapkan)
                    </button>
                  )}
                </div>
                <input 
                  id="title"
                  name="title"
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Perbaikan Lampu Jalan Mati"
                  className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-3 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Detail Kronologi</label>
                <textarea 
                  id="content"
                  name="content"
                  rows={5}
                  required
                  placeholder="Jelaskan detail masalah, perkiraan waktu kejadian, dan dampak yang dirasakan..."
                  className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-3 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:ring-2 focus:ring-brand-primary outline-none resize-none leading-relaxed"
                />
              </div>
              
              {/* Info Box */}
<div className="bg-brand-canvas border border-brand-hairline p-4 rounded-xl flex gap-4">
                 <div className="h-9 w-9 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-primary shrink-0 border border-brand-hairline">
                   <Info aria-hidden="true" size={18} />
                 </div>
                <div className="space-y-1 pt-0.5">
                  <p className="text-xs font-bold text-brand-ink">Standar Pelayanan</p>
                  <p className="text-[11px] font-medium text-brand-ink/80 leading-relaxed">
                    Laporan akan diproses oleh tim operasional dalam waktu maksimal 24 jam kerja. Pastikan data yang Anda lampirkan akurat untuk mempercepat proses investigasi.
                  </p>
                </div>
              </div>
            </div>
          </div>

{/* RIGHT: Visual & Location */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Photo Attachment */}
            <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline shadow-sm space-y-4">
              <label className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Lampiran Foto Bukti</label>
              
<div 
                 onClick={() => fileInputRef.current?.click()}
                 role="button"
                 tabIndex={0}
                 onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
                 className={`relative group h-56 cursor-pointer border-2 border-dashed rounded-xl transition-colors flex flex-col items-center justify-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${
                   preview ? 'border-brand-primary bg-brand-canvas-soft shadow-md' : 'border-brand-hairline hover:border-brand-primary bg-brand-canvas-soft/30'
                 }`}
               >
                {preview ? (
                  <>
                    <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
<button 
                         type="button"
                         onClick={(e) => { e.stopPropagation(); removePreview(); }}
                         className="bg-brand-canvas p-2.5 rounded-lg text-red-500 shadow-lg flex items-center gap-2 text-xs font-semibold hover:bg-brand-canvas-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                       >
                         <X aria-hidden="true" size={16} /> Ganti Gambar
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
<div className="h-12 w-12 bg-brand-canvas rounded-lg flex items-center justify-center text-brand-ink/20 mx-auto shadow-sm border border-brand-hairline">
                       <Camera aria-hidden="true" size={24} />
                     </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-ink/60 uppercase tracking-wider">Klik untuk Mengunggah</p>
                      <p className="text-[10px] font-medium text-brand-ink/40 mt-1 uppercase tracking-wider">Max 5MB (JPG/PNG)</p>
                      {fileError && (
                        <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mt-2 max-w-[250px] mx-auto leading-relaxed">{fileError}</p>
                      )}
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} name="image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            {/* Location & Metadata */}
            <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline shadow-sm space-y-6">
               <LocationPicker />

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2 text-center">
                   <label htmlFor="rt" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider block">RT</label>
                   <input id="rt" name="rt" type="text" required defaultValue={profile?.rt || ''} placeholder="001" className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-mono tabular-nums font-bold text-center text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors" />
                 </div>
                 <div className="space-y-2 text-center">
                   <label htmlFor="rw" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider block">RW</label>
                   <input id="rw" name="rw" type="text" required defaultValue={profile?.rw || ''} placeholder="001" className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-mono tabular-nums font-bold text-center text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors" />
                </div>
             </div>

             <div className="space-y-2">
                <label htmlFor="incidentDate" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Waktu Temuan</label>
                <div className="relative group">
                  <CalendarIcon aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    id="incidentDate"
                    name="incidentDate"
                    type="date" 
                    required
                    className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg pl-12 pr-4 py-2.5 text-sm font-mono tabular-nums text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors appearance-none"
                  />
                </div>
             </div>
           </div>

            {/* Submit Button */}
            <SubmitButton 
              className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-3.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
              loadingText="Mengirim Data..."
              icon={<Send size={16} />}
            >
              Terbitkan Laporan
            </SubmitButton>
          </div>
        </form>
      </main>
    </div>
  )
}

