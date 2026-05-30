# AI Agent Rules of Engagement & Code Preservation Protocol

> **Project:** Smart Complaint App (Layanan Pengaduan Masyarakat)
> **Stack:** Next.js 16 App Router · React 19 · Tailwind CSS v4 · TypeScript Strict · Prisma + PostgreSQL · Supabase SSR Auth · vitest
> **Compatibility:** Claude, Gemini Flash, Agentic IDEs (Cursor, Roo Code, Antigravity)

Dokumen ini adalah **undang-undang tertinggi** bagi AI Agent. Anda WAJIB mematuhi seluruh arsitektur kerja dan batasan ketat (*guardrails*) di bawah ini tanpa pengecualian.

---

## K-01: The 3-Tier Architecture (Universal Workflow)

Untuk mencegah *compounding errors*, pisahkan proses berpikir, perencanaan, dan eksekusi:

1. **Tier 1 — The Blueprint (Directives & PRD)**
   - `AGENTS.md`, PRD docs, folder `directives/`, atau instruksi manusia.
   - Panduan absolut yang menentukan hasil akhir.
2. **Tier 2 — The Brain (Orchestration & Planning)**
   - Peran utama Anda sebagai AI. Baca Blueprint, analisis codebase, gunakan **Plan Mode**, rancang perubahan sebelum menyentuh kode.
3. **Tier 3 — The Muscle (Target Codebase)**
   - Kode sumber: `src/`, `prisma/`, konfigurasi. Wilayah deterministik — jaga kebersihan, keandalan, dan keamanan.

---

## K-02: Clean Code Standards for This Project

### TypeScript & Imports
- **Strict mode** (`tsconfig.json: strict: true`). Dilarang `any`, `as any`, `@ts-ignore`, atau `@ts-expect-error` tanpa alasan tertulis.
- Gunakan **`@/` path alias** untuk semua impor internal (`@/lib/`, `@/components/`, `@/utils/`, `@/app/`).
- Tipe Prisma otomatis dari `@prisma/client`. Jangan buat tipe duplikat untuk model.
- `React.FC`/`React.ReactNode` untuk tipe props. `Promise<>` untuk async params.

### Component Patterns
- **Server Components adalah default.** Tambahkan `'use client'` hanya jika butuh: state (`useState`), efek (`useEffect`), event handler (`onClick`), hooks browser, atau context.
- Client Components harus *leaf nodes* — serendah mungkin di pohon komponen.
- Server Actions di `src/app/*/actions/` (satu file per domain: `complaints.crud.ts`, `complaints.status.ts`, `auth.actions.ts`, dll).
- Gunakan `SubmitButton` dari `@/components/SubmitButton` untuk form submissions.

### Styling (Tailwind CSS v4)
- Gunakan **Tailwind utility classes**. Dilarang CSS-in-JS atau module CSS kecuali untuk fallback ekstrem.
- Gunakan **design tokens** yang sudah ditetapkan:
  - `--brand-*` untuk warna brand (hijau/sage/slate)
  - `--radius-*` untuk border-radius (konsisten)
  - `--spacing-*` untuk jarak
  - `--color-*` untuk palette warna
- Jangan hardcode warna/radius/spacing. Selalu gunakan variabel CSS atau Tailwind classes yang sesuai.
- Ikon: `lucide-react` sudah tersedia — gunakan komponen langsung.

### Database (Prisma + Supabase)
- Semua query database melalui **Prisma Client** (`@/lib/prisma`).
- Schema di `prisma/schema.prisma`. Baca schema dulu sebelum query model apapun.
- Auth session via **Supabase SSR** (`@/utils/supabase/server`, `@/utils/supabase/client`, `@/utils/supabase/middleware`).
- Migrasi: `prisma migrate dev` / `prisma migrate deploy`.

### Form & Validation
- Server-side validation via `@/lib/validate` (`validateString`, `validateRTRW`, `validateEnum`).
- Client-side validation via HTML attribute atau state lokal.
- File upload via `@/lib/upload` — selalu wrapping error dengan `UPLOAD_ERROR_MAP`.

### Testing (vitest)
- Test file di samping file yang diuji atau di folder `__tests__/`.
- `npm test` = `vitest run`. `npm run test:watch` = `vitest`.
- Gunakan `@testing-library/react` untuk component test.

---

## K-03: Build from Scratch Protocol

### Routing Structure (Next.js App Router)
```
src/app/                  ← Route groups & pages
  (auth)/login/           ← public
  (auth)/register/        ← public
  (auth)/forgot-password/ ← public
  dashboard/              ← protected (static)
  dashboard/(list)/       ← complaint list (tab groups)
  dashboard/create/       ← new complaint
  dashboard/complaint/[id]/ ← complaint detail
  dashboard/admin/        ← admin only
  dashboard/users/        ← admin only
  api/                    ← API routes
auth/actions.ts           ← Server Actions: login, signup, logout
```

### Layout Conventions
- `layout.tsx` → wrap group dengan sidebar/navbar.
- `loading.tsx` → suspense fallback per segment.
- `error.tsx` → error boundary per segment (`'use client'`).
- `page.tsx` → konten utama. Default: Server Component.
- Route groups `(auth)`, `(dashboard)` untuk organisasi tanpa memengaruhi URL.

### Page Conventions (params handling)
```ts
// params adalah Promise — harus di-await
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // ...
}

// searchParams juga Promise
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  // Baca dengan use() di Client Component, atau await di Server Component
}
```

### Component Organization
```
src/
  components/           ← shared components (SubmitButton, ConfirmModal, ThemeToggle, MobileBottomNav, SessionErrorState, NotificationDropdown, map/)
  lib/                  ← utilities (auth, authorization, prisma, profile, upload, validate, escalation, constants, login-rate-limit, redirect-guard)
  utils/supabase/       ← Supabase SSR (server, client, middleware)
  app/dashboard/actions/  ← Server Actions per domain
  app/dashboard/complaint/[id]/ ← colocated sub-components (ResponseItem, StaffActionsPanel, EscalationStatus, dll)
```

### Database Flow
1. Schema → `prisma/schema.prisma`
2. Migration → `prisma migrate dev`
3. Query → Server Component (async) atau Server Action
4. Auth → Supabase SSR + Prisma Profile sync
5. Role → `MASYARAKAT` (pelapor) / `PETUGAS` (penindak) / `ADMIN` (manajemen)

---

## K-04: Maintenance & Evolution (Task-Specific Protocols)

### Bug Fixing
1. Reproduksi error dari log/stack trace. Jangan tebak.
2. `grep`/`rg` untuk cari lokasi kode relevan.
3. Baca file terkait (dependensi, schema, tipe).
4. Perbaiki bedah — hanya baris yang bermasalah.
5. Regression check: pastikan tidak merusak komponen tetangga.
6. Jalankan `npm run lint` setelah perubahan.

### Feature Addition
1. Cari pattern yang sudah ada (file sejenis) — tiru struktur, naming, imports.
2. Baca Prisma schema jika perlu model baru.
3. Baca `src/lib/constants.ts` untuk label/enum.
4. Gunakan template komponen yang sudah ada.
5. Ikuti route group convention sesuai role.

### Refactoring
- Preserve API contract — jangan ubah tipe return atau parameter fungsi publik.
- Ekstrak → jangan inline ulang.
- Pertahankan komentar developer dan anotasi penting.

### Security Audit
- Verifikasi setiap Server Action punya guard auth (`getAuthenticatedProfile()`).
- Cek RBAC: `isStaff()`, `isAdmin()`, `requireAdmin()` dari `@/lib/authorization`.
- Pastikan redirect setelah action menggunakan `isRedirectError` guard untuk `redirect()`.
- Validasi input: `validateString`, `validateEnum`, `validateRTRW`.

### Dependency Upgrades
- Cek changelog package. Jangan upgrade tanpa baca breaking changes.
- `postinstall: "patch-package"` — patch tetap dipertahankan.

---

## K-05: Anti-Deletion & Anti-Regression Protocol

### 🟢 WAJIB (DO)
1. **Surgical Modifications** — ubah hanya baris target. Biarkan 90% file tetap utuh.
2. **Context-First Reading** — baca seluruh file + dependensi sebelum modifikasi.
3. **Lock Critical Core Logic** — jangan sentuh (lihat K-06).
4. **Verifikasi Output Diff** — pastikan baris merah (dihapus) memang kode usang/rusak, bukan kode fungsional.

### 🔴 DILARANG (DON'T)
1. **Phantom Cleanup** — jangan hapus/rapikan kode di luar lingkup tugas.
2. **Full Rewrite** — jangan tulis ulang 200 baris hanya untuk ubah 5 baris.
3. **Asumsi Kode Redundan** — variabel/fungsi "tidak aktif" mungkin untuk testing, edge case, atau integrasi lain.
4. **Hapus Komentar Developer** — dokumentasi, anotasi, `noqa`, catatan khusus tetap dipertahankan.

### Anti-Regression Checklist
- [ ] Perubahan tidak menghapus/mengubah guard auth
- [ ] Perubahan tidak menghapus validasi input
- [ ] Perubahan tidak mengubah tipe return fungsi publik
- [ ] Perubahan tidak menghapus komentar/patch
- [ ] `npm run lint` lulus
- [ ] `npm test` lulus

---

## K-06: Lock Critical Core Logic

Logika berikut **DILARANG** diubah/dihapus tanpa persetujuan eksplisit:

### Auth & Session (Supabase SSR)
- `src/utils/supabase/server.ts` — createClient untuk Server Component/Action
- `src/utils/supabase/client.ts` — createClient untuk Client Component
- `src/utils/supabase/middleware.ts` — `updateSession` refresh token
- `src/proxy.ts` — middleware matcher konfigurasi

### Auth Guards
- `src/lib/auth.ts` — `getAuthenticatedUser()`, `getAuthenticatedProfile()`, `getAuthenticatedUserOptional()`, `getAuthenticatedProfileOptional()`
- `src/lib/authorization.ts` — `requireAdmin()`, `isStaff()`, `isAdmin()`
- `src/lib/redirect-guard.ts` — `isRedirectError()`
- `src/lib/login-rate-limit.ts` — brute force protection

### Prisma & Database
- `src/lib/prisma.ts` — Prisma client singleton (jangan buat instance baru)
- `prisma/schema.prisma` — schema model, relation, enum, index (jangan ubah tanpa migrasi)
- Semua enum: `Role`, `Status`, `NotificationType`, `EscalationLevel`

### Routing & Middleware
- Route group structure `(auth)`, `(dashboard)` — redirect logic di layout
- Dashboard layout — session check + redirect ke `/login` jika tidak authenticated

---

## K-07: Self-Correction & Troubleshooting

### Root Cause Analysis
Sebelum memperbaiki error, WAJIB baca stack trace secara menyeluruh. Identifikasi dan sampaikan akar masalah ke pengguna sebelum menyusun rencana perbaikan.

### Anti-Trial-and-Error
Dilarang mengubah kode spekulatif untuk melihat apakah error hilang. Setiap perubahan harus punya dasar logis.

### Regression Check
Setelah memperbaiki masalah A, pastikan tidak menyebabkan masalah baru B di file terkait atau sistem dependen.

### Prisma-Specific Debugging
- Error `PrismaClientKnownRequestError` → cek unique constraint, foreign key, enum value.
- Error relation → cek `@@index`, field type, referential action (`onDelete`).
- Migration conflict → `prisma migrate status` dulu.

### Supabase-Specific Debugging
- Session expired → cek `updateSession` di middleware, `CookieOptions` di createClient.
- Auth error → cek `@/utils/supabase/server.ts` cookie handling.

---

## K-08: Context-First Reading Protocol

Sebelum memodifikasi file APAPUN, baca dan pahami:

| Sebelum menyentuh... | Wajib baca... |
|----------------------|---------------|
| Server Action | `src/lib/auth.ts`, `src/lib/authorization.ts`, model Prisma terkait |
| Komponen UI | imports, tipe props, komponen parent |
| Prisma query | `prisma/schema.prisma` (model, field, relation, index) |
| Halaman baru | layout segment, route group convention |
| Form | `SubmitButton`, Server Action target, validasi di `src/lib/validate.ts` |
| Styling | `--brand-*`, `--radius-*`, `--spacing-*` tokens |
| File upload | `src/lib/upload.ts`, `UPLOAD_ERROR_MAP` |

---

## K-09: Code Output Standards

### Format Output
- Berikan hasil dalam **potongan fungsi** atau format **diff sebelum vs sesudah**.
- Jangan kirim 200 baris file utuh jika hanya 5 baris berubah.
- Sertakan **path file + line number** yang relevan.

### Diff Template
```diff
// src/app/dashboard/actions/complaints.crud.ts:42
- const result = await prisma.complaint.findUnique(...)
+ const result = await prisma.complaint.findFirst(...)
```

### Commit Message Convention
Jika diminta commit:
- Format: `type(scope): brief description`
- Type: `fix`, `feat`, `refactor`, `style`, `chore`
- Scope: `auth`, `complaint`, `ui`, `db`, `config`

---

## K-10: Response Format Contract

1. **Jawab langsung** — hindari preambel "Tentu, saya akan...". Langsung ke inti.
2. **Tanya jika ambigu** — jika instruksi tidak jelas, tidak lengkap, atau berpotensi melanggar aturan di AGENTS.md ini, WAJIB berhenti dan minta klarifikasi.
3. **No emojis** — kecuali diminta pengguna.
4. **Bahasa Indonesia** untuk komunikasi dengan pengguna (dokumentasi teknis boleh Inggris).
5. **Prioritas keamanan** — jangan expose secrets, API keys, atau DATABASE_URL di output.
