export function requireAdmin(profile: { role: string } | null): asserts profile is { role: 'ADMIN' } {
  if (!profile || profile.role !== 'ADMIN') {
    throw new Error('Akses ditolak. Hanya admin yang diizinkan.')
  }
}

export function isStaff(profile: { role: string } | null): boolean {
  return profile?.role === 'ADMIN' || profile?.role === 'PETUGAS'
}

export function isAdmin(profile: { role: string } | null): boolean {
  return profile?.role === 'ADMIN'
}
