import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Fungsi utama ini WAJIB bernama "middleware"
export function middleware(request: NextRequest) {
  // Untuk saat ini, kita biarkan semua lalu lintas lewat dengan mulus
  return NextResponse.next();
}

// Konfigurasi ini memberi tahu Next.js di rute mana saja middleware harus berjalan
export const config = {
  matcher: [
    /*
     * Mengecualikan jalur yang tidak perlu diproses oleh middleware agar performa tetap cepat:
     * - Rute internal Next.js (_next/static, _next/image)
     * - File statis & gambar (favicon.ico, svg, png, webp, dll)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};