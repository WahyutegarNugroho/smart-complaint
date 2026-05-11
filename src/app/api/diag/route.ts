import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Tes koneksi database
    const count = await prisma.profile.count()
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database Connected!',
      total_profiles: count,
      env_db_url: process.env.DATABASE_URL ? 'Loaded (Hidden)' : 'NOT LOADED'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
