"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, Lock, Save, Loader2, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Profil
  const [profileForm, setProfileForm] = useState({ email: '', username: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // State untuk Password
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Mengambil Data User (Sesi Saat Ini) dari Supabase Auth
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (user) {
          // Mengambil username dari user_metadata (bawaan Supabase Auth)
          setProfileForm({
            email: user.email || '',
            username: user.user_metadata?.username || user.user_metadata?.full_name || 'Admin',
          });
        }
      } catch (error: any) {
        console.error("Gagal memuat user:", error.message);
        toast.error("Gagal memuat data pengguna.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handler Update Profil (Username)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    try {
      // Mengupdate metadata auth (Tanpa perlu RLS Table, sangat aman)
      const { error } = await supabase.auth.updateUser({
        data: { username: profileForm.username }
      });

      if (error) throw error;
      
      toast.success('Profil Diperbarui', {
        description: 'Username berhasil disimpan ke sistem.',
      });
    } catch (error: any) {
      toast.error('Gagal Simpan', {
        description: error.message || 'Terjadi kesalahan saat memperbarui profil.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handler Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi dasar
    if (passwordForm.newPassword.length < 6) {
      return toast.error('Validasi Gagal', { description: 'Password minimal 6 karakter.' });
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Validasi Gagal', { description: 'Konfirmasi password tidak cocok!' });
    }

    setIsSavingPassword(true);
    
    try {
      // Meminta Supabase mengganti password user yang sedang login
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast.success('Password Berhasil Diubah', {
        description: 'Silakan gunakan password baru pada login berikutnya.',
      });
      
      // Kosongkan form password setelah sukses
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      
    } catch (error: any) {
      toast.error('Gagal Ganti Password', {
        description: error.message || 'Terjadi kesalahan sistem.',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-primary">
        <Loader2 size={40} className="animate-spin opacity-50 mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Memuat Pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative z-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Pengaturan Akun</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola informasi profil admin dan perbarui kata sandi keamanan Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KARTU 1: PENGATURAN PROFIL */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary/20 shadow-[0_0_30px_rgba(166,255,0,0.05)] relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-primary">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Profil Pengguna</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Informasi Identitas</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Email Login (Tidak dapat diubah)</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  value={profileForm.email} 
                  disabled
                  className="w-full bg-black/80 border border-white/5 rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Username / Nama Tampilan</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={profileForm.username} 
                  onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all text-white placeholder:text-gray-600"
                  placeholder="Nama Admin"
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSavingProfile}
                className="w-full py-4 bg-white/10 text-white font-extrabold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50"
              >
                {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSavingProfile ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </div>
          </form>
        </div>

        {/* KARTU 2: PENGATURAN KEAMANAN (PASSWORD) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)] relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Keamanan</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Ganti Kata Sandi (Password)</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5 relative z-10">
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 items-start">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-200 leading-relaxed uppercase tracking-wide">
                Setelah password diubah, Anda mungkin akan dikeluarkan (logout) secara otomatis dari perangkat lain.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Password Baru</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={passwordForm.newPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-red-500 focus:outline-none transition-all text-white placeholder:text-gray-600"
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Konfirmasi Password Baru</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={passwordForm.confirmPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-red-500 focus:outline-none transition-all text-white placeholder:text-gray-600"
                  placeholder="Ketik ulang password baru"
                  minLength={6}
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSavingPassword}
                className="w-full py-4 bg-red-500 text-white font-extrabold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50"
              >
                {isSavingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                {isSavingPassword ? 'Memproses...' : 'Ganti Password Sekarang'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}