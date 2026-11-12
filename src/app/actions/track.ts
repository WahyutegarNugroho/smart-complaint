'use server';

import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

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
  const headerList = await headers();
  const ip =
    headerList.get('x-real-ip') ||
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const rl = await checkRateLimit(ip, { keyPrefix: 'track', max: 15, windowMs: 60_000 });
  if (!rl.allowed) {
    return {
      found: false,
      message: `Terlalu banyak permintaan pelacakan. Silakan coba kembali dalam ${rl.retryAfter} detik.`,
    };
  }

  const ticketId = rawTicketId.trim().replace(/^#/, '').replace(/^LP-/i, '');

  if (!ticketId || !/^[a-zA-Z0-9_-]{6,}$/.test(ticketId)) {
    return {
      found: false,
      message: 'Masukkan minimal 6 karakter kode tiket yang valid (contoh: 6 karakter terakhir ID atau format LP-XXXXXX).',
    };
  }

  try {
    // Cari complaint berdasarkan id persis atau suffix minimal 6 karakter (tanpa startsWith agar tidak bisa di-enumerate)
    const matches = await prisma.complaint.findMany({
      where: {
        OR: [
          { id: { equals: ticketId, mode: 'insensitive' } },
          { id: { endsWith: ticketId, mode: 'insensitive' } },
        ],
      },
      take: 2,
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

    if (matches.length === 0) {
      return {
        found: false,
        message: 'Nomor tiket belum ditemukan. Pastikan kode sudah sesuai atau periksa kembali riwayat pengaduan Anda.',
      };
    }

    if (matches.length > 1) {
      return {
        found: false,
        message: 'Kode tiket cocok dengan lebih dari satu laporan. Masukkan ID tiket yang lebih lengkap.',
      };
    }

    const complaint = matches[0];

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
