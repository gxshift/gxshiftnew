'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

// Skema Validasi
const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Inisialisasi Supabase khusus untuk Client Component (otomatis sinkronisasi dengan Cookies)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsAuthenticating(true);
    
    // Proses Autentikasi Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error('Akses Ditolak', {
        description: 'Email atau password salah.',
      });
      setIsAuthenticating(false);
      return;
    }

    toast.success('Otentikasi Berhasil', {
      description: 'Membuka gerbang Command Center...',
    });
    
    // KUNCI PERBAIKAN: Menggunakan Native Browser Redirect (Hard Navigation)
    // Ini memastikan seluruh state browser di-refresh dan Cookies terkirim sempurna ke Middleware
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-10 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(166,255,0,0.05)] relative overflow-hidden backdrop-blur-xl">
          {/* Top Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 border border-primary/20 shadow-[0_0_20px_rgba(166,255,0,0.2)]">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Admin Login</h1>
            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-2">GXSHIFT Command Center</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={16} />
                </div>
                <input 
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-600 text-white"
                  placeholder="admin@gxshift.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-[10px] flex items-center gap-1 mt-1 ml-1"><AlertCircle size={12}/>{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock size={16} />
                </div>
                <input 
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-600 text-white"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-[10px] flex items-center gap-1 mt-1 ml-1"><AlertCircle size={12}/>{errors.password.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isAuthenticating}
              className="w-full py-4 mt-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_20px_rgba(166,255,0,0.3)] hover:shadow-[0_0_30px_rgba(166,255,0,0.6)] flex items-center justify-center gap-2 disabled:opacity-70 text-sm uppercase tracking-wider group"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  MEMVERIFIKASI...
                </>
              ) : (
                <>
                  MASUK KE SISTEM
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}