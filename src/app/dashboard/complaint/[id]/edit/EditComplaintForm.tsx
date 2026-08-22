'use client'

import { updateComplaint } from '@/app/dashboard/actions'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { X, UploadCloud, Save, ChevronLeft } from 'lucide-react'

interface ComplaintData {
  title: string
  incidentDate: Date
  location: string
  content: string
  imageUrl?: string | null
}

export default function EditComplaintForm({
  id,
  complaint: initialComplaint
}: {
  id: string,
  complaint: ComplaintData
}) {
  const [complaint] = useState<ComplaintData>(initialComplaint)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialComplaint.imageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const removeFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className="min-h-screen bg-brand-canvas text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-20">
      
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
               <Link href={`/dashboard/complaint/${id}`} className="h-8 w-8 bg-brand-canvas border border-brand-hairline rounded-lg flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-colors shadow-sm">
                  <ChevronLeft size={18} />
               </Link>
               <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider">Koreksi Laporan</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-ink">Edit Informasi Pengaduan</h1>
            <p className="text-sm text-brand-ink/60 font-medium">Lakukan perubahan pada data laporan sebelum masuk tahap verifikasi petugas.</p>
          </div>
        </section>

        <form action={updateComplaint} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <input type="hidden" name="id" value={id} />
          
          {/* LEFT: Main Form */}
          <div className="lg:col-span-7 space-y-8">
<div className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline shadow-sm space-y-6">
            
            <div className="space-y-2">
              <label htmlFor="title" className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Judul / Subjek Laporan</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={complaint.title}
                className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-3 text-sm font-medium text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="incidentDate" className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Tanggal Kejadian</label>
                <input
                  id="incidentDate"
                  name="incidentDate"
                  type="date"
                  required
                  defaultValue={new Date(complaint.incidentDate).toISOString().split('T')[0]}
                  className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-3 text-sm font-mono tabular-nums text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Lokasi Spesifik</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  defaultValue={complaint.location}
                  className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-3 text-sm font-medium text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Detail Penjelasan</label>
              <textarea
                id="content"
                name="content"
                rows={6}
                required
                defaultValue={complaint.content}
                className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-3 text-sm font-medium text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
          </div>

          {/* RIGHT: Visuals & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline shadow-sm space-y-4">
              <label className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Visual Bukti Kejadian</label>
              
              <div className="relative">
                <input 
                  ref={fileInputRef}
                  id="image-upload" 
                  name="image" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />

                {!previewUrl ? (
                  <label 
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-hairline h-56 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="h-12 w-12 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/40 mb-4">
                       <UploadCloud size={28} />
                    </div>
                    <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider">Unggah Foto Baru</p>
                  </label>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-brand-hairline aspect-video group">
                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label htmlFor="image-upload" className="cursor-pointer bg-brand-canvas text-brand-ink px-6 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider shadow-lg hover:bg-brand-canvas-soft transition-colors">Ganti Foto Bukti</label>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Hapus lampiran"
                      className="absolute top-3 right-3 h-8 w-8 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center z-10 active:scale-95"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <button
                 type="submit"
                 className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-3 rounded-lg font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
               >
                 <Save size={16} /> Simpan Pembaruan
               </button>
               <Link 
                 href={`/dashboard/complaint/${id}`}
                 className="w-full bg-brand-canvas border border-brand-hairline py-3 rounded-lg text-xs font-semibold text-brand-ink/60 hover:text-brand-ink text-center transition-colors"
               >
                 Batalkan Perubahan
               </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

