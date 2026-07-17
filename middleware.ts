import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isDashboard = path.startsWith('/dashboard');
  const isLogin = path.startsWith('/login');

  // BYPASS: Jika bukan ke /login atau /dashboard, langsung loloskan.
  // Ini akan menyelamatkan Beranda (/) Anda dari masalah ikon Cloudflare.
  if (!isDashboard && !isLogin) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // PERBAIKAN TYPESCRIPT: Tipe data eksplisit ditambahkan di sini
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          
          supabaseResponse = NextResponse.next({ request });
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (isDashboard && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLogin && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

// MATCHER OPTIMASI TINGKAT DEWA
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ],
};