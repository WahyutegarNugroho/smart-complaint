'use client'

import { updateComplaint } from '@/app/dashboard/actions'
import Link from 'next/link'
import Image from 'next/image'
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-24">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 mb-1">
              <Link 
                href={`/dashboard/complaint/${id}`} 
                aria-label="Kembali ke detail laporan"
                className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <ChevronLeft size={20} />
              </Link>
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                Koreksi Laporan Warga
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Edit Informasi Pengaduan
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Lakukan perbaikan rincian laporan sebelum diverifikasi dan ditindaklanjuti oleh petugas.
            </p>
          </div>
        </section>

        <form action={updateComplaint} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <input type="hidden" name="id" value={id} />
          
          {/* LEFT: Main Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="space-y-2">
                <label htmlFor="title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Judul / Subjek Laporan
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={complaint.title}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="incidentDate" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Tanggal Kejadian
                  </label>
                  <input
                    id="incidentDate"
                    name="incidentDate"
                    type="date"
                    required
                    defaultValue={new Date(complaint.incidentDate).toISOString().split('T')[0]}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Lokasi Spesifik
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    defaultValue={complaint.location}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Detail Penjelasan Laporan
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={6}
                  required
                  defaultValue={complaint.content}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Visuals & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Foto Bukti Kejadian
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Perbarui foto bukti jika tersedia dokumentasi yang lebih jelas.
                </p>
              </div>
              
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
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-600 bg-slate-50/50 dark:bg-slate-850 h-56 transition-colors cursor-pointer group"
                  >
                    <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-blue-700 dark:text-blue-400 mb-3 border border-blue-200/50 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pilih Foto Baru</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format JPG, PNG, atau WebP (Maks 5MB)</p>
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video group">
                    <Image
                      src={previewUrl}
                      alt="Pratinjau foto bukti"
                      fill
                      unoptimized={previewUrl.startsWith('blob:')}
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center">
                      <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer bg-white text-slate-900 min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 transition-colors flex items-center"
                      >
                        Ganti Foto Bukti
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Hapus lampiran"
                      className="absolute top-3 right-3 h-9 w-9 bg-rose-600 text-white rounded-xl shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center z-10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <Save size={18} /> Simpan Pembaruan
              </button>
              <Link 
                href={`/dashboard/complaint/${id}`}
                className="w-full min-h-[44px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white text-center transition-colors flex items-center justify-center shadow-sm"
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

