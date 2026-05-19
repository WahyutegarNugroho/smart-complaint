'use client'

import React, { useState, useRef } from 'react'
import { 
  Camera, 
  MapPin, 
  Calendar as CalendarIcon, 
  Send, 
  X,
  Info,
  ShieldAlert,
  Trash2,
  Lightbulb,
  AlertTriangle,
  Hammer,
  ChevronLeft
} from 'lucide-react'
import { createComplaint } from '@/app/dashboard/actions'
import Link from 'next/link'
import Image from 'next/image'
import SubmitButton from '@/components/SubmitButton'

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
  const [category, setCategory] = useState('umum')
  const [isUrgent, setIsUrgent] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Category Auto Suggestion calculated on render
  const titleLower = title.toLowerCase()
  let suggestedCategory: string | null = null
  if (titleLower.trim()) {
    const keamananKeywords = ['maling', 'curiga', 'asing', 'ronda', 'pos', 'pencuri', 'berantem', 'ribut', 'kehilangan', 'copet', 'rampok', 'rusuh', 'hilang', 'aman', 'tetangga']
    const kebersihanKeywords = ['sampah', 'bau', 'kotor', 'daun', 'selokan', 'mampet', 'lumpur', 'banjir', 'genangan', 'limbah', 'bangkai', 'lalat', 'bersih', 'rumput']
    const fasilitasKeywords = ['paving', 'lampu', 'tiang', 'pipa', 'aspal', 'jalan', 'rusak', 'lubang', 'portal', 'pagar', 'taman', 'kabel', 'listrik', 'air']

    const matchesKeamanan = keamananKeywords.some(keyword => titleLower.includes(keyword))
    const matchesKebersihan = kebersihanKeywords.some(keyword => titleLower.includes(keyword))
    const matchesFasilitas = fasilitasKeywords.some(keyword => titleLower.includes(keyword))

    if (matchesKeamanan) {
      suggestedCategory = 'keamanan'
    } else if (matchesKebersihan) {
      suggestedCategory = 'kebersihan'
    } else if (matchesFasilitas) {
      suggestedCategory = 'fasilitas'
    }
  }

  const categories = [
    { id: 'keamanan', label: 'Keamanan', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'kebersihan', label: 'Kebersihan', icon: Trash2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'fasilitas', label: 'Fasilitas', icon: Hammer, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'umum', label: 'Lainnya', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-32">
      
      <main className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Layanan Warga</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">Buat Laporan Baru</h1>
            <p className="text-brand-ink/70 font-medium text-sm md:text-base">Sampaikan keluhan atau masukan Anda secara rinci dan objektif.</p>
          </div>

          {/* Urgent Toggle */}
          <button 
            type="button"
            onClick={() => setIsUrgent(!isUrgent)}
            className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
              isUrgent 
                ? 'bg-red-500/10 border-red-500/20 shadow-xl shadow-red-500/5' 
                : 'bg-brand-canvas border-brand-hairline shadow-sm'
            }`}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isUrgent ? 'bg-red-500 text-white' : 'bg-brand-canvas-soft text-brand-ink/40'}`}>
              <AlertTriangle size={20} />
            </div>
            <div className="text-left">
              <p className={`text-[9px] font-bold uppercase tracking-widest ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-brand-ink/50'}`}>Tingkat Urgensi</p>
              <p className="text-sm font-bold">{isUrgent ? 'Darurat / Penting' : 'Normal / Rutin'}</p>
            </div>
          </button>
        </section>

        {/* ⚠️ INCOMPLETE PROFILE BANNER */}
        {isProfileIncomplete && (
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6 sm:p-8 flex items-start gap-4 transition-all duration-300">
            <div className="h-12 w-12 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20">
              <ShieldAlert size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">Profil Anda Belum Lengkap</h4>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
                Beberapa data penting Anda (seperti NIK, nomor WhatsApp, atau alamat domisili) belum terisi. Mohon lengkapi profil Anda di menu <Link href="/dashboard/settings" className="font-bold underline hover:text-amber-900 dark:hover:text-amber-200">Pengaturan Profil</Link> untuk mempermudah petugas memverifikasi dan merespon laporan Anda.
              </p>
            </div>
          </div>
        )}

        <form 
          action={createComplaint}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
        >
          {/* Hidden inputs */}
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="isUrgent" value={isUrgent.toString()} />
          
          {/* LEFT: Main Information */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-brand-canvas p-6 md:p-8 rounded-[2rem] border border-brand-hairline shadow-sm space-y-10 transition-colors">
              
              {/* Category Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em] ml-1">Pilih Kategori Masalah</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center justify-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                          category === cat.id 
                            ? `bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] border-transparent shadow-xl` 
                            : 'bg-brand-canvas-soft border-brand-hairline text-brand-ink/65 hover:bg-brand-canvas'
                        }`}
                      >
                        <div className={`transition-transform duration-500 ${category === cat.id ? 'scale-110' : ''}`}>
                           <Icon size={24} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em] ml-1">Judul / Subjek</label>
                  {suggestedCategory && category !== suggestedCategory && (
                    <button 
                      type="button" 
                      onClick={() => setCategory(suggestedCategory)}
                      className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lightbulb size={10} /> Saran Kategori: {suggestedCategory.toUpperCase()} (Terapkan)
                    </button>
                  )}
                </div>
                <input 
                  name="title"
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Perbaikan Lampu Jalan Mati"
                  className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl px-6 py-4.5 text-[15px] font-bold text-brand-ink placeholder:text-brand-ink/30 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] outline-none transition-all duration-300"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em] ml-1">Detail Kronologi</label>
                <textarea 
                  name="content"
                  rows={6}
                  required
                  placeholder="Jelaskan detail masalah, perkiraan waktu kejadian, dan dampak yang dirasakan..."
                  className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl px-6 py-4.5 text-[15px] font-medium text-brand-ink placeholder:text-brand-ink/30 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] outline-none transition-all duration-300 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-brand-canvas border border-brand-hairline p-6 md:p-8 rounded-[2rem] flex gap-6 transition-colors group">
              <div className="h-14 w-14 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-primary shadow-sm shrink-0 border border-brand-hairline transition-transform group-hover:rotate-6">
                <Info size={28} />
              </div>
              <div className="space-y-1.5 pt-1">
                <p className="text-sm font-bold text-brand-ink">Standar Pelayanan</p>
                <p className="text-[13px] font-medium text-brand-ink/80 leading-relaxed">
                  Laporan akan diproses oleh tim operasional dalam waktu maksimal 24 jam kerja. Pastikan data yang Anda lampirkan akurat untuk mempercepat proses investigasi.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual & Location */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Photo Attachment */}
            <div className="bg-brand-canvas p-6 md:p-8 rounded-[2rem] border border-brand-hairline shadow-sm space-y-6 transition-colors">
              <label className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em] ml-1">Lampiran Foto Bukti</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group h-72 cursor-pointer border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center overflow-hidden ${
                  preview ? 'border-brand-primary bg-brand-canvas-soft shadow-xl' : 'border-brand-hairline hover:border-brand-primary bg-brand-canvas-soft/30'
                }`}
              >
                {preview ? (
                  <>
                    <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removePreview(); }}
                        className="bg-brand-canvas p-4 rounded-2xl text-red-500 shadow-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                      >
                        <X size={18} /> Ganti Gambar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="h-20 w-20 bg-brand-canvas rounded-3xl flex items-center justify-center text-brand-ink/20 mx-auto shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all border border-brand-hairline">
                      <Camera size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em]">Klik untuk Mengunggah</p>
                      <p className="text-[9px] font-medium text-brand-ink/40 mt-2 uppercase tracking-widest">Max Size 5MB (JPG/PNG)</p>
                      {fileError && (
                        <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-2 max-w-[250px] mx-auto leading-relaxed">{fileError}</p>
                      )}
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} name="image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            {/* Location & Metadata */}
            <div className="bg-brand-canvas p-6 md:p-8 rounded-[2rem] border border-brand-hairline shadow-sm space-y-8 transition-colors">
               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em] ml-1">Koordinat Lokasi</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={20} />
                    <input 
                      name="location"
                      type="text" 
                      required
                      placeholder="Contoh: Dekat Pos Security Utama"
                      className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl pl-14 pr-4 py-4.5 text-[15px] font-bold text-brand-ink placeholder:text-brand-ink/30 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] outline-none transition-all duration-300"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3 text-center">
                    <label className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em] block">RT</label>
                    <input name="rt" type="text" required defaultValue={profile?.rt || ''} placeholder="001" className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl px-4 py-4.5 text-[15px] font-bold text-center text-brand-ink focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] outline-none transition-all duration-300" />
                  </div>
                  <div className="space-y-3 text-center">
                    <label className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em] block">RW</label>
                    <input name="rw" type="text" required defaultValue={profile?.rw || ''} placeholder="001" className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl px-4 py-4.5 text-[15px] font-bold text-center text-brand-ink focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] outline-none transition-all duration-300" />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-[0.2em] ml-1">Waktu Temuan</label>
                  <div className="relative group">
                    <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={20} />
                    <input 
                      name="incidentDate"
                      type="date" 
                      required
                      className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-brand-ink focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] outline-none transition-all duration-300 appearance-none"
                    />
                  </div>
               </div>
            </div>

            {/* Submit Button */}
            <SubmitButton 
              className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-6 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 cursor-pointer"
              loadingText="Mengirim Data..."
              icon={<Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            >
              Terbitkan Laporan
            </SubmitButton>
          </div>
        </form>
      </main>
    </div>
  )
}
