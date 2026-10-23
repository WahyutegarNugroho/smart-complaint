'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, X } from 'lucide-react'

export default function ResponseFileHandler() {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearFile = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-3">
      {preview && (
        <div className="relative inline-block group">
          <div className="h-10 w-10 rounded-lg overflow-hidden border border-blue-500/40 shadow-sm relative">
            <Image
              src={preview}
              alt="Pratinjau foto tanggapan"
              fill
              unoptimized
              sizes="40px"
              className="object-cover"
            />
          </div>
          <button 
            type="button"
            onClick={clearFile}
            aria-label="Hapus lampiran foto"
            className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
          >
            <X size={10} />
          </button>
        </div>
      )}
      
      <label 
        aria-label="Lampirkan foto tanggapan"
        className={`min-h-[40px] px-3.5 rounded-xl flex items-center gap-2 transition-all border cursor-pointer text-xs font-bold select-none focus-within:ring-2 focus-within:ring-blue-600 ${
          preview 
            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-blue-400 border-slate-200 dark:border-slate-700 hover:border-blue-300'
        }`}
      >
        <Camera size={16} />
        <span className="hidden sm:inline">{preview ? 'Ganti Foto' : 'Lampirkan Foto'}</span>
        <input 
          type="file" 
          name="responseImage" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  )
}
