import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Pastikan route ini selalu dieksekusi secara dinamis dan tidak di-cache
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Melakukan query sangat ringan ke database untuk mengirimkan sinyal aktivitas
    // Ini akan mencegah Supabase dari mem-pause project karena inaktif
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      { 
        success: true, 
        message: 'Database connection is alive and active', 
        timestamp: new Date().toISOString() 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Keep-alive ping error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to database' 
      },
      { status: 500 }
    );
  }
}
