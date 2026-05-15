'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function SessionErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl max-w-md text-center space-y-6">
         <div className="h-20 w-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center text-amber-500 mx-auto">
            <AlertTriangle size={40} />
         </div>
         <div className="space-y-2">
           <h2 className="text-xl font-bold">Koneksi Terputus</h2>
           <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
             Kami kesulitan memvalidasi profil Anda saat ini karena beban server yang tinggi. 
             Sesi Anda <strong>tetap aktif</strong>, silakan muat ulang halaman.
           </p>
         </div>
         <button 
           onClick={() => window.location.reload()} 
           className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group"
         >
           <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
           Coba Muat Ulang
         </button>
      </div>
    </div>
  )
}
