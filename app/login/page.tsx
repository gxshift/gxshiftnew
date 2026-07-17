// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { createBrowserClient } from '@supabase/ssr'; // Gunakan Browser Client

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Inisialisasi Supabase langsung di Browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsAuthenticating(true);
    toast.loading('Memverifikasi akses...', { id: 'auth-toast' });
    
    // Otentikasi langsung dari Browser. Ini 100% menjamin Cookie tersimpan!
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error('Akses Ditolak', {
        id: 'auth-toast',
        description: 'Email atau password salah.',
      });
      setIsAuthenticating(false);
      return;
    }

    toast.success('Otentikasi Berhasil', {
      id: 'auth-toast',
      description: 'Membuka gerbang Command Center...',
    });

    // KUNCI FIX: Taktik Cache-Buster Cloudflare
    // Kita menambahkan timestamp (?t=123456...) di akhir URL.
    // Ini memaksa Cloudflare menganggap ini URL baru dan TIDAK BISA menggunakan cache redirect lamanya!
    setTimeout(() => {
      const timestamp = new Date().getTime();
      window.location.href = `/dashboard?t=${timestamp}`;
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4 overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        <div className="glass-panel p-10 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(166,255,0,0.05)] relative overflow-hidden backdrop-blur-xl">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 border border-primary/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Admin Login</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Mail size={16} /></div>
                <input {...register('email')} type="email" className="w-full bg-black/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-primary text-white" placeholder="admin@gxshift.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Lock size={16} /></div>
                <input {...register('password')} type="password" className="w-full bg-black/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-primary text-white" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={isAuthenticating} className="w-full py-4 mt-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all flex items-center justify-center gap-2 text-sm uppercase group">
              {isAuthenticating ? 'MEMVERIFIKASI...' : 'MASUK KE SISTEM'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}