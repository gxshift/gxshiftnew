import { NextResponse } from 'next/server';

export function middleware() {
  // MIDDLEWARE DINONAKTIFKAN UNTUK OTENTIKASI
  // Karena bug Cloudflare Edge yang tidak bisa membaca process.env
  return NextResponse.next();
}

export const config = {
  matcher: [], // Kosongkan agar Middleware tidak mencegat apapun
};