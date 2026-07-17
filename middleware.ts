import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isDashboard = path.startsWith('/dashboard');
  const isLogin = path.startsWith('/login');

  // 1. BYPASS: Jika bukan ke /login atau /dashboard, langsung loloskan.
  // Ini menyelamatkan Beranda (/) Anda dari masalah ikon Cloudflare.
  if (!isDashboard && !isLogin) {
    return NextResponse.next();
  }

  // 2. Inisialisasi Response awal
  let supabaseResponse = NextResponse.next({ request });

  // 3. Konfigurasi Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          // Set cookie di request
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          
          // Perbarui response dengan cookie terbaru
          supabaseResponse = NextResponse.next({ request });
          
          // Terapkan cookie ke response yang akan dikirim kembali ke browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 4. Validasi User
  const { data: { user } } = await supabase.auth.getUser();

  // 5. ATURAN KEAMANAN (Routing Guard) DENGAN ANTI-CACHE CLOUDFLARE
  if (isDashboard && !user) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // KUNCI FIX: Memaksa Cloudflare tidak menyimpan hasil redirect "belum login"
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  }

  if (isLogin && user) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    // KUNCI FIX: Memaksa Cloudflare tidak menyimpan hasil redirect "sudah login"
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  }

  return supabaseResponse;
}

// 6. MATCHER OPTIMASI TINGKAT DEWA
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ],
};