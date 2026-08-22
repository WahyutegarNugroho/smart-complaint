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
    <form action={action} className="space-y-8">
      <div className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label htmlFor="settings-name" className="block text-[10px] font-semibold text-brand-ink/60 uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative group">
                <User aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={18} />
                <input
                  id="settings-name"
                  name="name"
                  type="text"
                  defaultValue={profile.name}
                  required
                  className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg pl-11 pr-4 py-2.5 text-sm font-medium text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* NIK */}
            <div className="space-y-2">
              <label htmlFor="settings-nik" className="block text-[10px] font-semibold text-brand-ink/60 uppercase tracking-wider">Nomor Induk Kependudukan (NIK)</label>
              <div className="relative group">
                <Shield aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={18} />
                <input
                  id="settings-nik"
                  name="nik"
                  type="text"
                  value={nik}
                  onChange={handleNikChange}
                  placeholder="16 digit NIK"
                  maxLength={16}
                  inputMode="numeric"
                  className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg pl-11 pr-4 py-2.5 text-sm font-mono tabular-nums text-brand-ink placeholder:text-brand-ink/30 focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Nomor Kontak WhatsApp */}
          <div className="space-y-2">
            <label htmlFor="settings-phone" className="block text-[10px] font-semibold text-brand-ink/60 uppercase tracking-wider">Nomor Kontak WhatsApp</label>
            <div className="relative group">
              <Phone aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                id="settings-phone"
                name="phone"
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Contoh: 08xxxxxxxxxx"
                inputMode="tel"
                className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg pl-11 pr-4 py-2.5 text-sm font-mono tabular-nums text-brand-ink placeholder:text-brand-ink/30 focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* RT & RW */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-center">
              <label htmlFor="settings-rt" className="block text-[10px] font-semibold text-brand-ink/60 uppercase tracking-wider">RT</label>
              <input
                id="settings-rt"
                name="rt"
                type="text"
                defaultValue={profile.rt || ''}
                placeholder="001"
                inputMode="numeric"
                className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-mono tabular-nums font-bold text-center text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
              />
            </div>
            <div className="space-y-2 text-center">
              <label htmlFor="settings-rw" className="block text-[10px] font-semibold text-brand-ink/60 uppercase tracking-wider">RW</label>
              <input
                id="settings-rw"
                name="rw"
                type="text"
                defaultValue={profile.rw || ''}
                placeholder="001"
                inputMode="numeric"
                className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-mono tabular-nums font-bold text-center text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div className="space-y-2">
            <label htmlFor="settings-address" className="block text-[10px] font-semibold text-brand-ink/60 uppercase tracking-wider">Alamat Lengkap Domisili</label>
            <div className="relative group">
              <Home aria-hidden="true" className="absolute left-4 top-3 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={18} />
              <textarea
                id="settings-address"
                name="address"
                rows={3}
                defaultValue={profile.address || ''}
                placeholder="Sebutkan Blok dan Nomor Rumah Anda..."
                className="block w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg pl-11 pr-4 py-3 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:ring-2 focus:ring-brand-primary outline-none resize-none leading-relaxed transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <a href="/dashboard" className="text-xs font-semibold text-brand-ink/60 uppercase tracking-wider hover:text-brand-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded px-1 py-2">Batalkan</a>
        <SubmitButton
          className="bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] px-6 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
          loadingText="Menyimpan..."
          icon={<Save aria-hidden="true" size={16} />}
        >
          Simpan Perubahan
        </SubmitButton>
      </div>
    </form>
  )
}

