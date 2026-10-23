'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { User, Shield, Phone, Home, Save } from 'lucide-react'
import SubmitButton from '@/components/SubmitButton'

interface SettingsFormProps {
  profile: {
    name: string
    nik: string | null
    phone: string | null
    rt: string | null
    rw: string | null
    address: string | null
  }
  action: (formData: FormData) => Promise<void>
}

export default function SettingsForm({ profile, action }: SettingsFormProps) {
  const [nik, setNik] = useState(profile.nik || '')
  const [phone, setPhone] = useState(profile.phone || '')

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '').slice(0, 16)
    setNik(cleanValue)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value
    // Auto-convert prefix 08... to +628...
    if (raw.startsWith('08')) {
      raw = '+628' + raw.slice(2)
    } else if (raw.startsWith('628')) {
      raw = '+' + raw
    }
    const cleanValue = raw.replace(/[^\d+]/g, '')
    setPhone(cleanValue)
  }

  return (
    <form action={action} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label htmlFor="settings-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <div className="relative group">
                <User aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" size={18} />
                <input
                  id="settings-name"
                  name="name"
                  type="text"
                  defaultValue={profile.name}
                  required
                  className="block w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
                />
              </div>
            </div>

            {/* NIK */}
            <div className="space-y-2">
              <label htmlFor="settings-nik" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Nomor Induk Kependudukan (NIK)
              </label>
              <div className="relative group">
                <Shield aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" size={18} />
                <input
                  id="settings-nik"
                  name="nik"
                  type="text"
                  value={nik}
                  onChange={handleNikChange}
                  placeholder="16 digit NIK"
                  maxLength={16}
                  inputMode="numeric"
                  className="block w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Nomor Kontak WhatsApp */}
          <div className="space-y-2">
            <label htmlFor="settings-phone" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Nomor Kontak WhatsApp
            </label>
            <div className="relative group">
              <Phone aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" size={18} />
              <input
                id="settings-phone"
                name="phone"
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Contoh: 08xxxxxxxxxx"
                inputMode="tel"
                className="block w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* RT & RW */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-center">
              <label htmlFor="settings-rt" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                RT
              </label>
              <input
                id="settings-rt"
                name="rt"
                type="text"
                defaultValue={profile.rt || ''}
                placeholder="001"
                inputMode="numeric"
                className="block w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono tabular-nums font-bold text-center text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2 text-center">
              <label htmlFor="settings-rw" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                RW
              </label>
              <input
                id="settings-rw"
                name="rw"
                type="text"
                defaultValue={profile.rw || ''}
                placeholder="001"
                inputMode="numeric"
                className="block w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono tabular-nums font-bold text-center text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div className="space-y-2">
            <label htmlFor="settings-address" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Alamat Lengkap Domisili
            </label>
            <div className="relative group">
              <Home aria-hidden="true" className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" size={18} />
              <textarea
                id="settings-address"
                name="address"
                rows={3}
                defaultValue={profile.address || ''}
                placeholder="Sebutkan Blok dan Nomor Rumah Anda..."
                className="block w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none leading-relaxed transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
        <Link 
          href="/dashboard" 
          className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 sm:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Batalkan
        </Link>
        <SubmitButton
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white min-h-[48px] sm:min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer"
          loadingText="Menyimpan..."
          icon={<Save aria-hidden="true" size={16} />}
        >
          Simpan Perubahan
        </SubmitButton>
      </div>
    </form>
  )
}

