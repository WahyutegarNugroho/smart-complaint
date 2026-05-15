'use client'

import React, { useState, useRef } from 'react'
import { 
  Camera, 
  MapPin, 
  Calendar as CalendarIcon, 
  Send, 
  ArrowLeft,
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

export default function CreateComplaintForm({ profile }: { profile: any }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [category, setCategory] = useState('umum')
  const [isUrgent, setIsUrgent] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
      setPreview(URL.createObjectURL(file))
    }
  }

  const removePreview = () => {
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

  const categories = [
    { id: 'keamanan', label: 'Keamanan', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'kebersihan', label: 'Kebersihan', icon: Trash2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'fasilitas', label: 'Fasilitas', icon: Hammer, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'umum', label: 'Lainnya', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-32">
      
      <main className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Layanan Warga</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Buat Laporan Baru</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base">Sampaikan keluhan atau masukan Anda secara rinci dan objektif.</p>
          </div>

          {/* Urgent Toggle */}
          <button 
            type="button"
            onClick={() => setIsUrgent(!isUrgent)}
            className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all duration-300 ${
              isUrgent 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-xl shadow-red-500/5' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isUrgent ? 'bg-red-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
              <AlertTriangle size={20} />
            </div>
            <div className="text-left">
              <p className={`text-[9px] font-bold uppercase tracking-widest ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-600'}`}>Tingkat Urgensi</p>
              <p className="text-sm font-bold">{isUrgent ? 'Darurat / Penting' : 'Normal / Rutin'}</p>
            </div>
          </button>
        </section>

        <form 
          action={createComplaint}
          onSubmit={() => setIsSubmitting(true)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
        >
          {/* Hidden inputs */}
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="isUrgent" value={isUrgent.toString()} />
          
          {/* LEFT: Main Information */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 transition-colors">
              
              {/* Category Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 italic">Pilih Kategori Masalah</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center justify-center gap-4 p-5 rounded-2xl border transition-all ${
                          category === cat.id 
                            ? `bg-slate-900 dark:bg-blue-600 text-white border-transparent shadow-xl shadow-slate-900/10` 
                            : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800'
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
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 italic">Judul / Subjek</label>
                <input 
                  name="title"
                  type="text" 
                  required
                  placeholder="Contoh: Perbaikan Lampu Jalan Mati"
                  className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 italic">Detail Kronologi</label>
                <textarea 
                  name="content"
                  rows={6}
                  required
                  placeholder="Jelaskan detail masalah, perkiraan waktu kejadian, dan dampak yang dirasakan..."
                  className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed italic"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 md:p-8 rounded-[2rem] border border-blue-100 dark:border-blue-800 flex gap-6 transition-colors group">
              <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0 border border-blue-50 dark:border-blue-800 transition-transform group-hover:rotate-6">
                <Info size={28} />
              </div>
              <div className="space-y-1.5 pt-1">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Standar Pelayanan</p>
                <p className="text-[13px] font-medium text-blue-800 dark:text-blue-300 leading-relaxed italic">
                  Laporan akan diproses oleh tim operasional dalam waktu maksimal 24 jam kerja. Pastikan data yang Anda lampirkan akurat untuk mempercepat proses investigasi.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual & Location */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Photo Attachment */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 italic">Lampiran Foto Bukti</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group h-72 cursor-pointer border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center overflow-hidden ${
                  preview ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 shadow-xl shadow-blue-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/30 dark:bg-slate-800/30'
                }`}
              >
                {preview ? (
                  <>
                    <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removePreview(); }}
                        className="bg-white dark:bg-slate-900 p-4 rounded-2xl text-red-500 dark:text-red-400 shadow-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                      >
                        <X size={18} /> Ganti Gambar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="h-20 w-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-700 mx-auto shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all border border-slate-50 dark:border-slate-800">
                      <Camera size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">Klik untuk Mengunggah</p>
                      <p className="text-[9px] font-medium text-slate-500 dark:text-slate-500 mt-2 uppercase tracking-widest">Max Size 5MB (JPG/PNG)</p>
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} name="image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            {/* Location & Metadata */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 italic">Koordinat Lokasi</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      name="location"
                      type="text" 
                      required
                      placeholder="Contoh: Dekat Pos Security Utama"
                      className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-4 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3 text-center">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-600 uppercase tracking-[0.2em] block italic">RT</label>
                    <input name="rt" type="text" required defaultValue={profile?.rt || ''} placeholder="001" className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-4.5 text-[15px] font-bold text-center text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-3 text-center">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-600 uppercase tracking-[0.2em] block italic">RW</label>
                    <input name="rw" type="text" required defaultValue={profile?.rw || ''} placeholder="001" className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-4.5 text-[15px] font-bold text-center text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 italic">Waktu Temuan</label>
                  <div className="relative group">
                    <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      name="incidentDate"
                      type="date" 
                      required
                      className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all appearance-none"
                    />
                  </div>
               </div>
            </div>

            {/* Submit Button */}
            <SubmitButton 
              className="w-full bg-slate-900 dark:bg-blue-600 text-white py-6 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 dark:shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
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
