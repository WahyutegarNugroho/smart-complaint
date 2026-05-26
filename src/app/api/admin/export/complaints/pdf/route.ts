import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import PDFDocument from 'pdfkit'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { role: true, name: true }
  })

  if (!profile || profile.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = Math.min(Math.max(1, parseInt(limitParam || '500')), 5000)

    const complaints = await prisma.complaint.findMany({
      take: limit,
      include: { author: true, categoryRel: true },
      orderBy: { createdAt: 'desc' }
    })

    const total = complaints.length
    const pending = complaints.filter(c => c.status === 'PENDING').length
    const processing = complaints.filter(c => c.status === 'PROCESSING').length
    const completed = complaints.filter(c => c.status === 'COMPLETED').length
    const urgent = complaints.filter(c => c.isUrgent && c.status !== 'COMPLETED').length
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const buffers: Buffer[] = []
    doc.on('data', (chunk: Buffer) => buffers.push(chunk))

    await new Promise<void>((resolve) => {
      doc.on('end', () => resolve())

      // ===== COVER PAGE =====
      doc.fontSize(28).font('Helvetica-Bold').text('LAPORAN PENGADUAN MASYARAKAT', { align: 'center' })
      doc.moveDown(0.5)
      doc.fontSize(14).font('Helvetica').fillColor('#666').text('SmartComplaint', { align: 'center' })
      doc.moveDown(0.5)
      doc.fontSize(11).fillColor('#333')
      doc.text(`Periode: Seluruh Data`, { align: 'center' })
      doc.text(`Tanggal Cetak: ${today}`, { align: 'center' })
      doc.text(`Diekspor oleh: ${profile.name}`, { align: 'center' })
      doc.moveDown(2)
      doc.fontSize(9).fillColor('#999').text('Dokumen ini berisi ringkasan seluruh laporan pengaduan masyarakat', { align: 'center' })

      doc.addPage()

      // ===== EXECUTIVE SUMMARY =====
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#000').text('Ringkasan Eksekutif')
      doc.moveDown(0.3)
      doc.fontSize(9).fillColor('#999').text(today)
      doc.moveDown(1)

      const kpiData = [
        { label: 'Total Laporan', value: total, color: '#1e293b' },
        { label: 'Menunggu', value: pending, color: '#f59e0b' },
        { label: 'Diproses', value: processing, color: '#3b82f6' },
        { label: 'Selesai', value: completed, color: '#10b981' },
      ]

      const cellW = 110
      const cellH = 60
      const startX = 50
      const startY = doc.y
      kpiData.forEach((kpi, i) => {
        const x = startX + i * (cellW + 10)
        doc.roundedRect(x, startY, cellW, cellH, 8).stroke('#e2e8f0')
        doc.fontSize(22).font('Helvetica-Bold').fillColor(kpi.color)
          .text(String(kpi.value), x, startY + 10, { width: cellW, align: 'center' })
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#94a3b8')
          .text(kpi.label.toUpperCase(), x, startY + cellH - 18, { width: cellW, align: 'center' })
      })

      if (urgent > 0) {
        doc.moveDown(4)
        doc.fontSize(10).fillColor('#dc2626')
          .text(`! ${urgent} laporan berprioritas tinggi masih memerlukan penanganan segera.`)
      }

      doc.moveDown(2)
      const statuses = [
        { label: 'MENUNGGU', count: pending, color: '#f59e0b' },
        { label: 'DIPROSES', count: processing, color: '#3b82f6' },
        { label: 'SELESAI', count: completed, color: '#10b981' },
      ]
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#000').text('Distribusi Status')
      doc.moveDown(0.5)
      statuses.forEach(s => {
        const pct = total > 0 ? Math.round((s.count / total) * 100) : 0
        doc.fontSize(9).font('Helvetica').fillColor('#333').text(`${s.label}: ${s.count} laporan (${pct}%)`)
        doc.rect(50, doc.y + 2, 400 * (pct / 100), 6).fill(s.color)
        doc.moveDown(1.2)
      })

      doc.addPage()

      // ===== DETAIL TABLE =====
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Daftar Laporan')
      doc.moveDown(0.3)
      doc.fontSize(8).fillColor('#666').text(`${total} laporan tercatat`)
      doc.moveDown(1)

      const tableTop = doc.y
      const columns = ['No', 'Judul', 'Kategori', 'Pelapor', 'Status', 'Tanggal']
      const colW = [20, 170, 70, 80, 55, 65]

      doc.fontSize(7).font('Helvetica-Bold').fillColor('#fff')
      let xPos = 50
      columns.forEach((col, i) => {
        doc.rect(xPos, tableTop, colW[i], 18).fill('#1e293b')
        doc.fillColor('#fff').text(col, xPos + 3, tableTop + 5, { width: colW[i] - 6, align: 'left' })
        xPos += colW[i]
      })

      let y = tableTop + 18
      complaints.forEach((c, i) => {
        if (y > 720) {
          doc.addPage()
          y = 50
          xPos = 50
          doc.fontSize(7).font('Helvetica-Bold').fillColor('#fff')
          columns.forEach((col, ci) => {
            doc.rect(xPos, y, colW[ci], 18).fill('#1e293b')
            doc.fillColor('#fff').text(col, xPos + 3, y + 5, { width: colW[ci] - 6, align: 'left' })
            xPos += colW[ci]
          })
          y += 18
        }

        const bgColor = i % 2 === 0 ? '#ffffff' : '#f8fafc'
        doc.rect(50, y, 460, 16).fill(bgColor)
        xPos = 50

        const rowData = [
          String(i + 1),
          c.title,
          c.categoryRel?.name || c.category || '-',
          c.author?.name || 'Anonim',
          c.status,
          new Date(c.createdAt).toLocaleDateString('id-ID'),
        ]

        doc.fontSize(6.5).font('Helvetica').fillColor('#333')
        rowData.forEach((val, ci) => {
          doc.text(val, xPos + 3, y + 4, { width: colW[ci] - 6, align: 'left' })
          xPos += colW[ci]
        })
        y += 16
      })

      // ===== SIGNATURE =====
      doc.moveDown(3)
      const signatureY = doc.y + 20
      doc.fontSize(9).fillColor('#666').text('Mengetahui,', 350, signatureY, { align: 'right' })
      doc.moveDown(5)
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text(profile.name, { align: 'right' })
      doc.moveDown(0.3)
      doc.fontSize(8).font('Helvetica').fillColor('#999').text('SmartComplaint — Platform Pengaduan Warga', { align: 'right' })

      doc.end()
    })

    const pdfBuffer = Buffer.concat(buffers)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=laporan-smart-complaint-${new Date().toISOString().split('T')[0]}.pdf`
      }
    })
  } catch (err) {
    console.error('PDF Export Error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
