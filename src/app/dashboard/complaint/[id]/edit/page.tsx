'use client'

import { updateComplaint } from '@/app/dashboard/actions'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Camera, X, UploadCloud, ArrowLeft, Save, ChevronLeft, Calendar as CalendarIcon, MapPin, Edit3 } from 'lucide-react'
import { use } from 'react'

export default function EditComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [complaint, setComplaint] = useState<any>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch initial data (client-side)
  useEffect(() => {
    fetch(`/api/complaint/${id}`)
      .then(res => res.json())
      .then(data => {
        setComplaint(data)
        if (data.imageUrl) setPreviewUrl(data.imageUrl)
      })
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const removeFile = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!complaint) return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 flex items-center justify-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-32">
      
      <main className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href={`/dashboard/complaint/${id}`} className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Koreksi Laporan</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Informasi Pengaduan</h1>
            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm md:text-base">Lakukan perubahan pada data laporan sebelum masuk tahap verifikasi petugas.</p>
          </div>
        </section>

        <form action={updateComplaint} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <input type="hidden" name="id" value={id} />
          
          {/* LEFT: Main Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
              
              <div className="space-y-3">
                <label htmlFor="title" className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1 italic">Judul / Subjek Laporan</label>
                <div className="relative group">
                   <Edit3 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                   <input
                     id="title"
                     name="title"
                     type="text"
                     required
                     defaultValue={complaint.title}
                     className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <label htmlFor="incidentDate" className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1 italic">Tanggal Kejadian</label>
                  <div className="relative group">
                     <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                     <input
                       id="incidentDate"
                       name="incidentDate"
                       type="date"
                       required
                       defaultValue={new Date(complaint.incidentDate).toISOString().split('T')[0]}
                       className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                     />
                  </div>
                </div>
                <div className="space-y-3">
                  <label htmlFor="location" className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1 italic">Lokasi Spesifik</label>
                  <div className="relative group">
                     <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                     <input
                       id="location"
                       name="location"
                       type="text"
                       required
                       defaultValue={complaint.location}
                       className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                     />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="content" className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1 italic">Detail Penjelasan</label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  required
                  defaultValue={complaint.content}
                  className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-[15px] font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none resize-none leading-relaxed italic"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Visuals & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1 italic">Visual Bukti Kejadian</label>
              
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
                    className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 h-72 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
                  >
                    <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 shadow-inner group-hover:scale-110 transition-transform">
                       <UploadCloud size={32} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Unggah Foto Baru</p>
                  </label>
                ) : (
                  <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl group h-80">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <label htmlFor="image-upload" className="cursor-pointer bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Ganti Foto Bukti</label>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-6 right-6 h-10 w-10 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all flex items-center justify-center z-10 active:scale-90"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
               <button
                 type="submit"
                 className="w-full bg-slate-900 dark:bg-blue-600 py-6 rounded-[2rem] text-[11px] font-bold text-white uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 dark:shadow-blue-600/20 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
               >
                 <Save size={20} /> Simpan Pembaruan
               </button>
               <Link 
                 href={`/dashboard/complaint/${id}`}
                 className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-6 rounded-[2rem] text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] hover:text-slate-900 dark:hover:text-white text-center transition-all shadow-sm"
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
