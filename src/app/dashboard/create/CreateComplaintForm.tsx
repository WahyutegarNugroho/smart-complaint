'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Calendar as CalendarIcon, 
  Send, 
  X,
  Info,
  ShieldAlert,
  Lightbulb,
  AlertTriangle,
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

export default function CreateComplaintForm({ profile }: { profile: ProfileData }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryParent[]>([])
  const [selectedParent, setSelectedParent] = useState('umum')
  const [selectedChildId, setSelectedChildId] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [dismissedWarning, setDismissedWarning] = useState(false)
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
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-1">
              <Link href="/dashboard" aria-label="Kembali ke dashboard" className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[40px] min-w-[40px]">
                <ChevronLeft aria-hidden="true" size={20} />
              </Link>
              <span className="text-xs font-semibold text-blue-800 dark:text-blue-400 uppercase tracking-wider">Layanan Aspirasi & Pengaduan Warga</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Buat Laporan Baru</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Sampaikan keluhan, kerusakan fasilitas, atau kendala lingkungan secara jelas dan objektif.</p>
          </div>

          {/* Urgent Toggle */}
          <button
            type="button"
            onClick={() => setIsUrgent(!isUrgent)}
            aria-label={isUrgent ? 'Setel sebagai normal' : 'Setel sebagai urgensi'}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px] ${
              isUrgent 
                ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 shadow-sm' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isUrgent ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <AlertTriangle aria-hidden="true" size={18} />
            </div>
            <div className="text-left">
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${isUrgent ? 'text-red-700 dark:text-red-400' : 'text-slate-500'}`}>Tingkat Urgensi</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{isUrgent ? 'Darurat / Kritis' : 'Normal / Rutin'}</p>
            </div>
          </button>
        </section>

        {/* ⚠️ INCOMPLETE PROFILE BANNER */}
        {isProfileIncomplete && !dismissedWarning && (
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 sm:p-5 flex items-start justify-between gap-3 transition-all relative">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center shrink-0 border border-amber-500/20">
                <ShieldAlert size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Profil Anda Belum Lengkap</h4>
                <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium pr-6">
                  Beberapa data penting (NIK, No. HP, Alamat) belum terisi. Anda tetap bisa melapor untuk keadaan darurat, namun mohon lengkapi profil di <Link href="/dashboard/settings" className="font-bold underline hover:text-amber-900 dark:hover:text-amber-200">Pengaturan</Link> nantinya.
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setDismissedWarning(true)}
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 p-1.5 rounded-lg transition-colors absolute right-4 top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Tutup Peringatan"
            >
              <X size={16} />
            </button>
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
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              
              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pilih Kategori Sektor</label>
                <div className="relative">
                  <select
                    value={selectedParent}
                    onChange={(e) => {
                      setSelectedParent(e.target.value)
                      setSelectedChildId('')
                      if (e.target.value === 'umum' && categories.length > 0) {
                        const umum = categories.find((c: CategoryParent) => c.slug === 'umum')
                        if (umum?.children?.length === 1) {
                          setSelectedChildId(umum.children[0].id)
                        }
                      }
                    }}
                    aria-label="Pilih kategori masalah"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">Pilih Kategori...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="title" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Judul Aduan</label>
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
                      className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 min-h-[32px]"
                    >
                      <Lightbulb aria-hidden="true" size={12} /> Saran Sektor: {(suggestedCategory).toUpperCase()} (Terapkan)
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
                  placeholder="Contoh: Saluran Air Got Mampet Tersumbat Sampah Blok B"
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Detail Kronologi & Lokasi Patokan</label>
                <textarea 
                  id="content"
                  name="content"
                  rows={5}
                  required
                  placeholder="Ceritakan detail masalah, waktu kejadian, patokan rumah terdekat, serta dampaknya bagi warga..."
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none leading-relaxed transition-all"
                />
              </div>
              
              {/* Info Box */}
              <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 p-4 rounded-xl flex gap-3.5">
                <div className="h-9 w-9 bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 rounded-lg flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                  <Info aria-hidden="true" size={18} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <p className="text-xs font-bold text-blue-950 dark:text-blue-200">Standar Pelayanan Warga</p>
                  <p className="text-xs text-blue-900/80 dark:text-blue-300/80 leading-relaxed font-medium">
                    Laporan akan diverifikasi maksimal 24 jam kerja. Data yang lengkap dan foto jelas mempercepat petugas dalam melakukan inspeksi lapangan.
                  </p>
                </div>
              </div>
            </div>
          </div>

{/* RIGHT: Visual & Location */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Photo Attachment */}
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Lampiran Foto Bukti
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Foto kondisi terkini sangat dianjurkan untuk validasi lapangan.
                </p>
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Unggah foto bukti laporan"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
                className={`relative group min-h-[220px] cursor-pointer border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  preview 
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm' 
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-600 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-blue-50/30'
                }`}
              >
                {preview ? (
                  <>
                    <Image
                      src={preview}
                      alt="Pratinjau foto bukti"
                      width={800}
                      height={224}
                      unoptimized
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removePreview(); }}
                        className="bg-white text-rose-600 min-h-[44px] px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        <X aria-hidden="true" size={16} /> Ganti Foto
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-blue-700 dark:text-blue-400 mx-auto shadow-sm border border-blue-200/60 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
                      <Camera aria-hidden="true" size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Klik untuk Memilih Foto
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Format JPG, PNG, atau WebP (Maksimal 5MB)
                      </p>
                      {fileError && (
                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-2 max-w-[260px] mx-auto leading-relaxed">
                          {fileError}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} name="image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            {/* Location & Metadata */}
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <LocationPicker initialAddress={profile?.address || 'Perumahan Pesona Serpong'} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-center">
                  <label htmlFor="rt" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    RT
                  </label>
                  <input 
                    id="rt" 
                    name="rt" 
                    type="text" 
                    required 
                    defaultValue={profile?.rt || '001'} 
                    placeholder="001" 
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono tabular-nums font-bold text-center text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors" 
                  />
                </div>
                <div className="space-y-1.5 text-center">
                  <label htmlFor="rw" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    RW
                  </label>
                  <input 
                    id="rw" 
                    name="rw" 
                    type="text" 
                    required 
                    defaultValue={profile?.rw || '001'} 
                    placeholder="001" 
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono tabular-nums font-bold text-center text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="incidentDate" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Waktu Temuan / Kejadian
                </label>
                <div className="relative group">
                  <CalendarIcon aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" size={18} />
                  <input 
                    id="incidentDate"
                    name="incidentDate"
                    type="date" 
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <SubmitButton 
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              loadingText="Menerbitkan Laporan..."
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

