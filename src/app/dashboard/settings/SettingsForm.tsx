'use client'

import React, { useState } from 'react'
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
  action: (formData: FormData) => Promise<any>
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
    <form action={action} className="space-y-10">
      <div className="bg-brand-canvas p-6 md:p-10 rounded-[2rem] border border-brand-hairline shadow-sm transition-all">
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Nama Lengkap */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-brand-ink/75 uppercase tracking-[0.2em] ml-1 transition-colors">Nama Lengkap</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  name="name"
                  type="text"
                  defaultValue={profile.name}
                  required
                  className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-brand-ink focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] transition-all duration-300 outline-none"
                />
              </div>
            </div>

            {/* NIK */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-brand-ink/75 uppercase tracking-[0.2em] ml-1 transition-colors">Nomor Induk Kependudukan (NIK)</label>
              <div className="relative group">
                <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  name="nik"
                  type="text"
                  value={nik}
                  onChange={handleNikChange}
                  placeholder="Masukkan 16 digit NIK"
                  maxLength={16}
                  className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-brand-ink placeholder:text-brand-ink/30 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] transition-all duration-300 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Nomor Kontak WhatsApp */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-brand-ink/75 uppercase tracking-[0.2em] ml-1 transition-colors">Nomor Kontak WhatsApp</label>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={20} />
              <input
                name="phone"
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Contoh: 08xxxxxxxxxx"
                className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-brand-ink placeholder:text-brand-ink/30 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* RT & RW */}
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-3 text-center">
              <label className="block text-[10px] font-bold text-brand-ink/75 uppercase tracking-[0.2em] transition-colors">RT</label>
              <input
                name="rt"
                type="text"
                defaultValue={profile.rt || ''}
                placeholder="001"
                className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl px-6 py-4.5 text-[15px] font-bold text-center text-brand-ink focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] transition-all duration-300 outline-none"
              />
            </div>
            <div className="space-y-3 text-center">
              <label className="block text-[10px] font-bold text-brand-ink/75 uppercase tracking-[0.2em] transition-colors">RW</label>
              <input
                name="rw"
                type="text"
                defaultValue={profile.rw || ''}
                placeholder="001"
                className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl px-6 py-4.5 text-[15px] font-bold text-center text-brand-ink focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-brand-ink/75 uppercase tracking-[0.2em] ml-1 transition-colors">Alamat Lengkap Domisili</label>
            <div className="relative group">
              <Home className="absolute left-5 top-5 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={20} />
              <textarea
                name="address"
                rows={4}
                defaultValue={profile.address || ''}
                placeholder="Sebutkan Blok dan Nomor Rumah Anda..."
                className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl pl-14 pr-6 py-5 text-[15px] font-medium text-brand-ink placeholder:text-brand-ink/30 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(0,217,146,0.15)] transition-all duration-300 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-6 transition-colors">
        <a href="/dashboard" className="text-[10px] font-bold text-brand-ink/80 uppercase tracking-[0.3em] hover:text-brand-ink transition-colors">Batalkan</a>
        <SubmitButton
          className="bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] px-12 py-5 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center gap-3 cursor-pointer"
          loadingText="Menyimpan..."
          icon={<Save size={18} />}
        >
          Simpan Perubahan
        </SubmitButton>
      </div>
    </form>
  )
}
