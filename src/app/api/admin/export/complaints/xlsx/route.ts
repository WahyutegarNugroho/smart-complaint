import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { guardAdminExport } from '@/lib/admin-export'
import ExcelJS from 'exceljs'

export async function GET(request: NextRequest) {
  const ctx = await guardAdminExport(request, 'export:xlsx')
  if (ctx instanceof NextResponse) return ctx

  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = Math.min(Math.max(1, parseInt(limitParam || '500')), 5000)

    const complaints = await prisma.complaint.findMany({
      take: limit,
      include: { author: true, categoryRel: true },
      orderBy: { createdAt: 'desc' }
    })

    const wb = new ExcelJS.Workbook()
    wb.creator = 'Smart Complaint App'
    wb.created = new Date()

    // Sheet 1: Detail Laporan
    const ws = wb.addWorksheet('Laporan')

    ws.columns = [
      { header: 'ID', key: 'ID', width: 30 },
      { header: 'Tanggal Dibuat', key: 'Tanggal Dibuat', width: 18 },
      { header: 'Pelapor', key: 'Pelapor', width: 25 },
      { header: 'Judul', key: 'Judul', width: 35 },
      { header: 'Kategori', key: 'Kategori', width: 15 },
      { header: 'Isi Laporan', key: 'Isi Laporan', width: 50 },
      { header: 'Lokasi', key: 'Lokasi', width: 25 },
      { header: 'Lat', key: 'Lat', width: 12 },
      { header: 'Lng', key: 'Lng', width: 12 },
      { header: 'RT', key: 'RT', width: 6 },
      { header: 'RW', key: 'RW', width: 6 },
      { header: 'Status', key: 'Status', width: 12 },
      { header: 'Prioritas', key: 'Prioritas', width: 10 },
      { header: 'Tingkat Eskalasi', key: 'Tingkat Eskalasi', width: 18 },
      { header: 'Tanggal Kejadian', key: 'Tanggal Kejadian', width: 18 },
      { header: 'Terakhir Diupdate', key: 'Terakhir Diupdate', width: 18 },
    ]

    const rows = complaints.map(c => ({
      ID: c.id,
      'Tanggal Dibuat': new Date(c.createdAt).toLocaleDateString('id-ID'),
      Pelapor: c.author?.name || 'Anonim',
      Judul: c.title,
      Kategori: c.categoryRel?.name || c.category,
      'Isi Laporan': (c.content || '').replace(/\n/g, ' '),
      Lokasi: c.location,
      Lat: c.latitude ?? '',
      Lng: c.longitude ?? '',
      RT: c.rt || '',
      RW: c.rw || '',
      Status: c.status,
      Prioritas: c.isUrgent ? 'YA' : 'TIDAK',
      'Tingkat Eskalasi': c.escalationLevel,
      'Tanggal Kejadian': new Date(c.incidentDate).toLocaleDateString('id-ID'),
      'Terakhir Diupdate': new Date(c.updatedAt).toLocaleDateString('id-ID'),
    }))

    ws.addRows(rows)

    // Style header row
    ws.getRow(1).font = { bold: true }
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    }

    // Sheet 2: Ringkasan
    const wsSummary = wb.addWorksheet('Ringkasan')
    wsSummary.columns = [
      { header: 'Metrik', key: 'Metrik', width: 25 },
      { header: 'Nilai', key: 'Nilai', width: 15 },
    ]

    const summaryRows = [
      { Metrik: 'Total Laporan', Nilai: complaints.length },
      { Metrik: 'Menunggu', Nilai: complaints.filter(c => c.status === 'PENDING').length },
      { Metrik: 'Diproses', Nilai: complaints.filter(c => c.status === 'PROCESSING').length },
      { Metrik: 'Selesai', Nilai: complaints.filter(c => c.status === 'COMPLETED').length },
      { Metrik: 'Prioritas', Nilai: complaints.filter(c => c.isUrgent && c.status !== 'COMPLETED').length },
    ]

    wsSummary.addRows(summaryRows)
    wsSummary.getRow(1).font = { bold: true }

    const buf = await wb.xlsx.writeBuffer()

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=laporan-smart-complaint-${new Date().toISOString().split('T')[0]}.xlsx`
      }
    })
  } catch (err) {
    console.error('XLSX Export Error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
