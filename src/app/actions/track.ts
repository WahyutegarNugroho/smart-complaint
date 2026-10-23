'use server';

import prisma from '@/lib/prisma';

export interface PublicTicketStatus {
  found: boolean;
  message?: string;
  data?: {
    id: string;
    title: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
    category: string;
    rt: string | null;
    rw: string | null;
    createdAt: string;
    updatedAt: string;
    maskedAuthor: string;
    responseCount: number;
    latestResponse?: {
      content: string;
      createdAt: string;
    } | null;
  };
}

function maskName(name: string): string {
  if (!name) return 'Warga';
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 2) return part[0] + '*';
      return part[0] + '*'.repeat(Math.max(2, part.length - 2)) + part[part.length - 1];
    })
    .join(' ');
}

export async function trackTicketStatus(rawTicketId: string): Promise<PublicTicketStatus> {
  const ticketId = rawTicketId.trim().replace(/^#/, '');

  if (!ticketId || ticketId.length < 3) {
    return {
      found: false,
      message: 'Masukkan nomor tiket yang valid (contoh: ID pengaduan atau format LP-XXXX).',
    };
  }

  try {
    // Cari complaint berdasarkan id persis atau prefix/suffix
    const complaint = await prisma.complaint.findFirst({
      where: {
        OR: [
          { id: ticketId },
          { id: { endsWith: ticketId } },
          { id: { startsWith: ticketId } },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        rt: true,
        rw: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
          },
        },
        responses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    if (!complaint) {
      return {
        found: false,
        message: 'Nomor tiket belum ditemukan. Pastikan kode sudah sesuai atau periksa kembali riwayat pengaduan Anda.',
      };
    }

    return {
      found: true,
      data: {
        id: complaint.id,
        title: complaint.title,
        status: complaint.status as 'PENDING' | 'PROCESSING' | 'COMPLETED',
        category: complaint.category,
        rt: complaint.rt,
        rw: complaint.rw,
        createdAt: complaint.createdAt.toISOString(),
        updatedAt: complaint.updatedAt.toISOString(),
        maskedAuthor: maskName(complaint.author?.name || 'Warga'),
        responseCount: complaint._count.responses,
        latestResponse: complaint.responses[0]
          ? {
              content: complaint.responses[0].content,
              createdAt: complaint.responses[0].createdAt.toISOString(),
            }
          : null,
      },
    };
  } catch (error) {
    console.error('Error tracking ticket:', error);
    return {
      found: false,
      message: 'Terjadi kendala saat memeriksa status tiket. Silakan coba kembali sesaat lagi.',
    };
  }
}
