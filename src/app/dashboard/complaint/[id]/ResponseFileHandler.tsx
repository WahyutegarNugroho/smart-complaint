'use client'

import React, { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'
import Image from 'next/image'

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
    <div className="flex flex-col gap-3">
      {preview && (
        <div className="px-6 mb-2">
           <div className="relative inline-block group">
              <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-lg relative">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
              <button 
                type="button"
                onClick={clearFile}
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-bold text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                TERPILIH
              </div>
           </div>
        </div>
      )}
      
      <div className="absolute right-4 bottom-4 flex items-center gap-3">
        <label className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all border cursor-pointer shadow-inner ${preview ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-900/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 border-transparent hover:border-blue-100 dark:hover:border-blue-900/30'}`}>
           <Camera size={20} />
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
    </div>
  )
}
