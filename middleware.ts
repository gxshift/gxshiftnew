import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Buat response default
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Inisialisasi Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // PERBAIKAN: Menambahkan tipe data eksplisit untuk cookiesToSet agar TypeScript tidak protes
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          // Update cookie di request
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          
          // Perbarui response dengan cookie terbaru
          supabaseResponse = NextResponse.next({
            request,
          });
          
          // Terapkan cookie ke response yang akan dikirim kembali ke browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Validasi User
  const { data: { user } } = await supabase.auth.getUser();

  // 4. ATURAN KEAMANAN (Routing Guard)
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/login') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

// 5. MATCHER OPTIMASI PERFORMA
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};