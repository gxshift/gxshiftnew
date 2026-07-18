'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Send, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js'; // KUNCI: Import Supabase
import { orderSchema, OrderFormValues } from '@/lib/validations';
import { Level } from '@/types';

// Inisialisasi Klien Supabase untuk menyimpan pesanan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface OrderFormProps {
  levels: Level[];
  adminWhatsapp: string;
}

export default function OrderForm({ levels, adminWhatsapp }: OrderFormProps) {
  const searchParams = useSearchParams();
  const preselectedLevelId = searchParams.get('level');

  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      levelId: preselectedLevelId || '',
      notes: '',
    },
  });

  const watchLevelId = watch('levelId');

  // Update harga saat paket berubah
  useEffect(() => {
    if (watchLevelId) {
      const level = levels.find((l) => l.id === watchLevelId);
      setSelectedPrice(level ? level.price : 0);
    }
  }, [watchLevelId, levels]);

  const onSubmit = async (data: OrderFormValues) => {
    try {
      const selectedLevel = levels.find((l) => l.id === data.levelId);
      if (!selectedLevel) throw new Error("Paket tidak ditemukan");

      // 1. SIMPAN DATA KE SUPABASE (AGAR TAMPIL DI DASBOR)
      const { error: dbError } = await supabase.from('orders').insert([{
        customer_name: data.customerName,
        nickname: data.nickname,
        whatsapp_number: data.whatsappNumber, // Nomor WA berhasil direkam!
        game_id: selectedLevel.game_id,
        level_id: selectedLevel.id,
        total_price: selectedLevel.price,
        status: 'pending'
      }]);

      if (dbError) {
        console.error("Supabase Error:", dbError);
        throw new Error("Gagal menyimpan ke database");
      }

      // 2. BENTUK PESAN WHATSAPP & REDIRECT
      const priceText = selectedLevel.price === 0 ? 'Harga Dinamis (Custom)' : `Rp ${selectedLevel.price.toLocaleString('id-ID')}`;
      const waText = `*NEW BOOSTING ORDER (GXSHIFT)*\n------------------------\n*Data Pemesan:*\nNama: ${data.customerName}\nWhatsApp: ${data.whatsappNumber}\n\n*Data Akun:*\nGame: Mobile Legends\nNickname: ${data.nickname}\nServer ID: ${data.serverId}\n\n*Target Boost:*\nRank Awal: ${data.currentRank}\nRank Tujuan: ${selectedLevel.name} (${selectedLevel.sub_level})\nCatatan: ${data.notes || '-'}\n------------------------\n*Total Tagihan:* ${priceText}\n\nMohon informasi metode pembayaran.`;

      const encodedText = encodeURIComponent(waText);
      // Bersihkan nomor admin dari spasi/karakter aneh
      const cleanAdminNumber = adminWhatsapp.replace(/\D/g, ''); 
      const waUrl = `https://wa.me/${cleanAdminNumber}?text=${encodedText}`;

      toast.success('Pesanan Berhasil Dicatat!', {
        description: 'Mengalihkan ke WhatsApp...',
      });

      // Buka WhatsApp di tab baru
      window.open(waUrl, '_blank');
      
    } catch (error) {
      toast.error('Gagal memproses pesanan', {
        description: 'Silakan periksa kembali data Anda atau hubungi admin.',
      });
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="w-full max-w-4xl mx-auto glass-panel p-6 md:p-10 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(166,255,0,0.05)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Formulir Pesanan</h2>
          <p className="text-xs text-primary uppercase tracking-widest font-bold">100% Secure & Encrypted</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* KOLOM 1: DATA KONTAK */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Informasi Kontak</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase">Nama Lengkap</label>
            <input 
              {...register('customerName')}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-600"
              placeholder="Masukkan nama Anda"
            />
            {errors.customerName && <p className="text-red-400 text-[10px] flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errors.customerName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase">Nomor WhatsApp Anda</label>
            <input 
              {...register('whatsappNumber')}
              type="tel"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-600"
              placeholder="Contoh: 081234567890"
            />
            {errors.whatsappNumber && <p className="text-red-400 text-[10px] flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errors.whatsappNumber.message}</p>}
          </div>
        </div>

        {/* KOLOM 2: DATA GAME */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Detail Akun (Mobile Legends)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase">Nickname</label>
              <input 
                {...register('nickname')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all placeholder:text-gray-600"
                placeholder="IGN Anda"
              />
              {errors.nickname && <p className="text-red-400 text-[10px] mt-1">{errors.nickname.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase">Server ID</label>
              <input 
                {...register('serverId')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all placeholder:text-gray-600"
                placeholder="(1234)"
              />
              {errors.serverId && <p className="text-red-400 text-[10px] mt-1">{errors.serverId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase">Rank Saat Ini</label>
              <input 
                {...register('currentRank')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all placeholder:text-gray-600"
                placeholder="Contoh: Epic II"
              />
              {errors.currentRank && <p className="text-red-400 text-[10px] mt-1">{errors.currentRank.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase">Pilih Paket Rank</label>
              <select 
                {...register('levelId')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all text-white appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-600">-- Pilih Target --</option>
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id} className="bg-background text-white">
                    {lvl.name} ({lvl.sub_level})
                  </option>
                ))}
              </select>
              {errors.levelId && <p className="text-red-400 text-[10px] mt-1">{errors.levelId.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase">Catatan Tambahan (Opsional)</label>
            <input 
              {...register('notes')}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all placeholder:text-gray-600"
              placeholder="Contoh: Hero request, jam login, dll"
            />
          </div>
        </div>
      </div>

      {/* FOOTER TOTAL HARGA & SUBMIT */}
      <div className="mt-10 p-6 bg-black/40 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Tagihan Estimasi</p>
          <p className="text-3xl font-black text-primary glow-text">
            {selectedPrice === 0 ? 'Harga Dinamis' : `Rp ${selectedPrice.toLocaleString('id-ID')}`}
          </p>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full md:w-auto px-10 py-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_20px_rgba(166,255,0,0.3)] hover:shadow-[0_0_30px_rgba(166,255,0,0.6)] hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 uppercase"
        >
          {isSubmitting ? 'MEMPROSES...' : 'ORDER SEKARANG VIA WHATSAPP'}
          {!isSubmitting && <Send size={18} />}
        </button>
      </div>
    </motion.form>
  );
}