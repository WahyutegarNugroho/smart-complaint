import React from 'react';
import {
  MapPin,
  Trash2,
  Wrench,
  ShieldCheck,
  Building2,
  CheckCircle2,
  PhoneCall,
  Search,
  Bell,
  Clock,
  ChevronRight,
  Camera,
  Navigation,
  Check,
  PlusCircle,
  FileText
} from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  badgeText?: string;
}

export function PhoneFrame({ children, className = '', badgeText }: PhoneFrameProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[310px] sm:max-w-[330px] rounded-[44px] p-3 bg-slate-900 shadow-2xl shadow-emerald-950/20 ring-1 ring-slate-800 border-[3px] border-slate-700/60 ${className}`}>
      {/* Outer Phone Shell Highlight */}
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent rounded-t-[40px] pointer-events-none" />

      {badgeText && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold tracking-wider uppercase shadow-md whitespace-nowrap z-30">
          {badgeText}
        </div>
      )}

      {/* Screen Canvas */}
      <div className="relative rounded-[34px] overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between select-none h-[590px] border border-slate-200/80 dark:border-zinc-800/80 shadow-inner">
        {/* Dynamic Island & Status Bar */}
        <div className="relative pt-2.5 px-5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 z-20">
          <span className="font-mono text-[11px] font-bold">09:41</span>
          
          {/* Dynamic Island Pill */}
          <div className="h-4.5 w-24 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="font-mono text-[10px]">5G</span>
            <div className="h-2.5 w-4 border border-current rounded-sm p-0.5 flex items-center">
              <div className="h-full w-full bg-current rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Inner Screen Content */}
        <div className="flex-1 overflow-hidden flex flex-col px-4 pt-1 pb-2">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="py-1.5 flex justify-center bg-transparent">
          <div className="h-1 w-28 bg-slate-400/50 dark:bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Screen 1: Home Screen (Citizen Services)
 */
export function HomeScreenMockup() {
  return (
    <div className="flex flex-col h-full justify-between text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px] shadow-sm ring-2 ring-emerald-500/20">
            WS
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 block leading-tight">Halo Warga,</span>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">Pesona Serpong</h4>
          </div>
        </div>
        <div className="h-7 w-7 rounded-full bg-slate-200/70 dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-300 relative">
          <Bell size={13} />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* Search / Banner */}
      <div className="mt-2.5 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center gap-2">
        <Search size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="text-[10.5px] text-slate-600 dark:text-zinc-300">Ada kendala lingkungan hari ini?</span>
      </div>

      {/* Services Grid */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-900 dark:text-white text-[11px]">Kategori Layanan</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Semua (4)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col items-start gap-1.5 hover:border-emerald-500/40 transition-colors">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Trash2 size={14} />
            </div>
            <span className="font-bold text-[10.5px] text-slate-900 dark:text-white leading-tight">Kebersihan</span>
            <span className="text-[9px] text-slate-500 dark:text-zinc-400">Sampah & Got</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col items-start gap-1.5 hover:border-emerald-500/40 transition-colors">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wrench size={14} />
            </div>
            <span className="font-bold text-[10.5px] text-slate-900 dark:text-white leading-tight">Jalan & PJU</span>
            <span className="text-[9px] text-slate-500 dark:text-zinc-400">Fasilitas Jalan</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col items-start gap-1.5 hover:border-emerald-500/40 transition-colors">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={14} />
            </div>
            <span className="font-bold text-[10.5px] text-slate-900 dark:text-white leading-tight">Keamanan</span>
            <span className="text-[9px] text-slate-500 dark:text-zinc-400">Pos Ronda 24 Jam</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col items-start gap-1.5 hover:border-emerald-500/40 transition-colors">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 size={14} />
            </div>
            <span className="font-bold text-[10.5px] text-slate-900 dark:text-white leading-tight">Balai Warga</span>
            <span className="text-[9px] text-slate-500 dark:text-zinc-400">Fasum RT/RW</span>
          </div>
        </div>
      </div>

      {/* Ongoing Ticket Card */}
      <div className="mt-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">#SC-842</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
            Dalam Penanganan
          </span>
        </div>
        <h5 className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight">
          Lampu PJU Blok C Mati Total
        </h5>
        <div className="flex items-center gap-1.5 text-[9.5px] text-slate-500 dark:text-zinc-400 pt-0.5">
          <Clock size={11} className="text-slate-400" />
          <span>Respon RT 03: Petugas menuju lokasi</span>
        </div>
      </div>

      {/* Floating Bottom Nav */}
      <div className="mt-auto pt-2 border-t border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-around text-slate-400 dark:text-zinc-500">
        <div className="flex flex-col items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <Building2 size={14} />
          <span className="text-[8.5px]">Beranda</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 hover:text-slate-900 dark:hover:text-white">
          <FileText size={14} />
          <span className="text-[8.5px]">Aduan</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center -mt-3 shadow-md shadow-emerald-600/30">
          <PlusCircle size={18} />
        </div>
        <div className="flex flex-col items-center gap-0.5 hover:text-slate-900 dark:hover:text-white">
          <MapPin size={14} />
          <span className="text-[8.5px]">Posko</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 hover:text-slate-900 dark:hover:text-white">
          <PhoneCall size={14} />
          <span className="text-[8.5px]">Darurat</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Screen 2: Raise Complaint Screen
 */
export function RaiseComplaintMockup() {
  return (
    <div className="flex flex-col h-full justify-between text-xs">
      {/* Top Header */}
      <div className="py-2 border-b border-slate-200/60 dark:border-zinc-800/60">
        <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Form Pelaporan</span>
        <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">Buat Pengaduan Baru</h4>
      </div>

      {/* Category Buttons */}
      <div className="mt-2.5 space-y-1">
        <label className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">Pilih Kategori</label>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="px-2 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm">
            <Check size={11} />
            <span>Infrastruktur</span>
          </div>
          <div className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 text-[10px] font-semibold flex items-center justify-center">
            Kebersihan
          </div>
          <div className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 text-[10px] font-semibold flex items-center justify-center">
            Keamanan
          </div>
          <div className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 text-[10px] font-semibold flex items-center justify-center">
            Fasilitas Umum
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="mt-2 space-y-2">
        <div className="space-y-0.5">
          <label className="text-[9.5px] font-bold text-slate-600 dark:text-zinc-400">Judul Kendala</label>
          <div className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] text-slate-800 dark:text-zinc-200">
            Paving block jalan amblas Blok B4
          </div>
        </div>

        <div className="space-y-0.5">
          <label className="text-[9.5px] font-bold text-slate-600 dark:text-zinc-400">Rincian Lokasi</label>
          <div className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] text-slate-800 dark:text-zinc-200 flex items-center justify-between">
            <span>RT 02 / RW 08 (Blok B)</span>
            <ChevronRight size={12} className="text-slate-400" />
          </div>
        </div>

        {/* Photo Upload Zone Preview */}
        <div className="space-y-0.5">
          <label className="text-[9.5px] font-bold text-slate-600 dark:text-zinc-400">Lampiran Foto Bukti</label>
          <div className="p-2.5 rounded-lg border-2 border-dashed border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-12 rounded bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Camera size={14} />
              </div>
              <div className="text-left">
                <span className="font-bold text-[9.5px] block text-slate-900 dark:text-white leading-tight">bukti-jalan.jpg</span>
                <span className="text-[8.5px] text-emerald-600 dark:text-emerald-400 font-medium">Terverifikasi (1.4 MB)</span>
              </div>
            </div>
            <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-auto pt-2">
        <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors">
          <span>Kirim Pengaduan</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/**
 * Screen 3: Track Requests Screen
 */
export function TrackRequestsMockup() {
  return (
    <div className="flex flex-col h-full justify-between text-xs">
      {/* Top Header */}
      <div className="py-2 border-b border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Pantau Status</span>
          <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">Aduan #SC-842</h4>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
          Diproses
        </span>
      </div>

      {/* Ticket Details */}
      <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
        <h5 className="font-bold text-[11px] text-slate-900 dark:text-white">Drainase Saluran Air Mampet</h5>
        <div className="flex items-center gap-1.5 text-[9.5px] text-slate-500 dark:text-zinc-400 mt-1">
          <MapPin size={11} className="text-emerald-500" />
          <span>Blok B No. 12 (RT 02)</span>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div className="mt-3 flex-1 px-1">
        <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300 block mb-2">Riwayat Tindak Lanjut</span>
        
        <div className="space-y-3 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-emerald-500/30">
          {/* Step 1 */}
          <div className="flex items-start gap-3 relative">
            <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
              <Check size={11} />
            </div>
            <div>
              <span className="font-bold text-[10.5px] text-slate-900 dark:text-white block leading-tight">Laporan Diterima</span>
              <span className="text-[8.5px] text-slate-500 dark:text-zinc-400">08:30 WIB • Warga melampirkan foto</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 relative">
            <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
              <Check size={11} />
            </div>
            <div>
              <span className="font-bold text-[10.5px] text-slate-900 dark:text-white block leading-tight">Validasi Pengurus RT</span>
              <span className="text-[8.5px] text-slate-500 dark:text-zinc-400">09:15 WIB • Disetujui Ketua RT 02</span>
            </div>
          </div>

          {/* Step 3 - Active */}
          <div className="flex items-start gap-3 relative">
            <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10 shadow-md ring-4 ring-emerald-500/20 animate-pulse">
              <Clock size={11} />
            </div>
            <div>
              <span className="font-bold text-[10.5px] text-emerald-600 dark:text-emerald-400 block leading-tight">Penanganan Lapangan</span>
              <span className="text-[8.5px] text-slate-600 dark:text-zinc-300">10:00 WIB • Petugas seksi sanitasi di lokasi</span>
            </div>
          </div>

          {/* Step 4 - Next */}
          <div className="flex items-start gap-3 relative opacity-50">
            <div className="h-5 w-5 rounded-full bg-slate-300 dark:bg-zinc-700 text-slate-600 flex items-center justify-center shrink-0 z-10">
              <CheckCircle2 size={11} />
            </div>
            <div>
              <span className="font-bold text-[10.5px] text-slate-800 dark:text-zinc-300 block leading-tight">Verifikasi & Tuntas</span>
              <span className="text-[8.5px] text-slate-500">Unggah dokumentasi hasil perbaikan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Staff Box */}
      <div className="mt-auto pt-2">
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
              HN
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-900 dark:text-white block leading-tight">Bpk. Hendra</span>
              <span className="text-[8.5px] text-slate-500">Seksi Kebersihan RT 02</span>
            </div>
          </div>
          <button className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[9.5px] font-bold flex items-center gap-1">
            <PhoneCall size={10} />
            <span>Kontak</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Screen 4: Nearby Offices / Map Screen
 */
export function NearbyOfficesMockup() {
  return (
    <div className="flex flex-col h-full justify-between text-xs">
      {/* Top Header */}
      <div className="py-2 border-b border-slate-200/60 dark:border-zinc-800/60">
        <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Peta & Fasilitas</span>
        <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">Posko Sekitar Warga</h4>
      </div>

      {/* Styled Mini Map View */}
      <div className="mt-2.5 relative h-36 rounded-xl overflow-hidden border border-slate-200/80 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 shadow-inner">
        {/* Stylized Map Roads */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 inset-x-0 h-4 bg-slate-300 dark:bg-zinc-700 rotate-3" />
          <div className="absolute left-14 inset-y-0 w-4 bg-slate-300 dark:bg-zinc-700 -rotate-6" />
          <div className="absolute right-12 inset-y-0 w-3 bg-slate-300 dark:bg-zinc-700 rotate-12" />
        </div>

        {/* Map Marker 1 (Center - Active Pos Satpam) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="px-2 py-0.5 rounded bg-slate-900 text-white text-[8px] font-bold shadow-md whitespace-nowrap mb-0.5">
            Pos Utama (120 m)
          </div>
          <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-500/30 animate-bounce">
            <ShieldCheck size={12} />
          </div>
        </div>

        {/* Map Marker 2 (Balai RW) */}
        <div className="absolute top-4 left-6 flex flex-col items-center">
          <div className="h-5 w-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow">
            <Building2 size={10} />
          </div>
        </div>

        {/* Map Marker 3 (Bank Sampah) */}
        <div className="absolute bottom-4 right-6 flex flex-col items-center">
          <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
            <Trash2 size={10} />
          </div>
        </div>

        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-[8.5px] font-mono text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800">
          Pesona Serpong
        </div>
      </div>

      {/* Nearby Facilities List */}
      <div className="mt-2.5 space-y-1.5 flex-1 overflow-hidden">
        <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[10.5px] text-slate-900 dark:text-white">Pos Satpam Gerbang Utama</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold">24 Jam</span>
            </div>
            <span className="text-[9px] text-slate-500 dark:text-zinc-400 block">Jarak: ~120 meter dari lokasi Anda</span>
          </div>
          <button className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PhoneCall size={12} />
          </button>
        </div>

        <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-[10.5px] text-slate-900 dark:text-white block">Sekretariat RW 08</span>
            <span className="text-[9px] text-slate-500 dark:text-zinc-400 block">Jarak: ~350 meter • Buka 08:00 - 17:00</span>
          </div>
          <button className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center">
            <Navigation size={12} />
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-auto pt-2">
        <button className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition-colors">
          <MapPin size={12} />
          <span>Buka Peta Wilayah Penuh</span>
        </button>
      </div>
    </div>
  );
}
