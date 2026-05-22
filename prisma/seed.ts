import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Upsert parent categories
  const keamanan = await prisma.category.upsert({
    where: { slug: 'keamanan' },
    update: { name: 'Keamanan', description: 'Masalah keamanan dan ketertiban lingkungan', icon: 'ShieldAlert' },
    create: { slug: 'keamanan', name: 'Keamanan', description: 'Masalah keamanan dan ketertiban lingkungan', icon: 'ShieldAlert' },
  })

  const kebersihan = await prisma.category.upsert({
    where: { slug: 'kebersihan' },
    update: { name: 'Kebersihan', description: 'Masalah kebersihan dan lingkungan', icon: 'Trash2' },
    create: { slug: 'kebersihan', name: 'Kebersihan', description: 'Masalah kebersihan dan lingkungan', icon: 'Trash2' },
  })

  const fasilitas = await prisma.category.upsert({
    where: { slug: 'fasilitas' },
    update: { name: 'Fasilitas', description: 'Masalah fasilitas umum dan infrastruktur', icon: 'Hammer' },
    create: { slug: 'fasilitas', name: 'Fasilitas', description: 'Masalah fasilitas umum dan infrastruktur', icon: 'Hammer' },
  })

  const umum = await prisma.category.upsert({
    where: { slug: 'umum' },
    update: { name: 'Umum', description: 'Laporan lainnya yang tidak termasuk kategori di atas', icon: 'Lightbulb' },
    create: { slug: 'umum', name: 'Umum', description: 'Laporan lainnya yang tidak termasuk kategori di atas', icon: 'Lightbulb' },
  })

  // Upsert subcategories for Keamanan
  const keamananChildren = [
    { slug: 'keamanan-pencurian', name: 'Pencurian' },
    { slug: 'keamanan-perampokan', name: 'Perampokan' },
    { slug: 'keamanan-perkelahian', name: 'Perkelahian' },
    { slug: 'keamanan-narkoba', name: 'Narkoba' },
    { slug: 'keamanan-lainnya', name: 'Lainnya' },
  ]
  for (const child of keamananChildren) {
    await prisma.category.upsert({
      where: { slug: child.slug },
      update: { name: child.name, parentId: keamanan.id },
      create: { slug: child.slug, name: child.name, parentId: keamanan.id, icon: 'ShieldAlert' },
    })
  }

  // Upsert subcategories for Kebersihan
  const kebersihanChildren = [
    { slug: 'kebersihan-sampah', name: 'Sampah' },
    { slug: 'kebersihan-selokan', name: 'Selokan Mampet' },
    { slug: 'kebersihan-banjir', name: 'Banjir' },
    { slug: 'kebersihan-limbah', name: 'Limbah' },
    { slug: 'kebersihan-lainnya', name: 'Lainnya' },
  ]
  for (const child of kebersihanChildren) {
    await prisma.category.upsert({
      where: { slug: child.slug },
      update: { name: child.name, parentId: kebersihan.id },
      create: { slug: child.slug, name: child.name, parentId: kebersihan.id, icon: 'Trash2' },
    })
  }

  // Upsert subcategories for Fasilitas
  const fasilitasChildren = [
    { slug: 'fasilitas-jalan-rusak', name: 'Jalan Rusak' },
    { slug: 'fasilitas-lampu-mati', name: 'Lampu Mati' },
    { slug: 'fasilitas-pipa-bocor', name: 'Pipa Bocor' },
    { slug: 'fasilitas-taman-rusak', name: 'Taman Rusak' },
    { slug: 'fasilitas-lainnya', name: 'Lainnya' },
  ]
  for (const child of fasilitasChildren) {
    await prisma.category.upsert({
      where: { slug: child.slug },
      update: { name: child.name, parentId: fasilitas.id },
      create: { slug: child.slug, name: child.name, parentId: fasilitas.id, icon: 'Hammer' },
    })
  }

  // Upsert subcategories for Umum
  const umumChildren = [
    { slug: 'umum-lainnya', name: 'Lainnya' },
  ]
  for (const child of umumChildren) {
    await prisma.category.upsert({
      where: { slug: child.slug },
      update: { name: child.name, parentId: umum.id },
      create: { slug: child.slug, name: child.name, parentId: umum.id, icon: 'Lightbulb' },
    })
  }

  console.log('✅ Categories seeded successfully')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
