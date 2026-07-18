'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Send, AlertCircle, ChevronDown, Gamepad2, Target, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { orderSchema, OrderFormValues } from '@/lib/validations';
import { Level } from '@/types';

// Inisialisasi Supabase
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

  // STATE UNTUK KALKULATOR
  const [currentLevelId, setCurrentLevelId] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      levelId: preselectedLevelId || '',
      notes: '',
      currentRank: '', // Akan diisi otomatis oleh sistem
    },
  });

  const watchLevelId = watch('levelId');

  // --- LOGIKA KALKULATOR AKUMULASI HARGA ---
  const selectedTargetLevel = useMemo(() => levels.find((l) => l.id === watchLevelId), [levels, watchLevelId]);
  
  // Ambil semua level dari game yang sama dengan target, lalu urutkan
  const gameLevels = useMemo(() => {
    if (!selectedTargetLevel) return [];
    return levels
      .filter(l => l.game_id === selectedTargetLevel.game_id)
      .sort((a, b) => a.order_index - b.order_index);
  }, [levels, selectedTargetLevel]);

  // Saring level yang urutannya DI BAWAH target level (untuk pilihan Level Saat Ini)
  const availableCurrentLevels = useMemo(() => {
    if (!selectedTargetLevel) return [];
    return gameLevels.filter(l => l.order_index < selectedTargetLevel.order_index);
  }, [selectedTargetLevel, gameLevels]);

  const selectedCurrentLevel = useMemo(() => gameLevels.find(l => l.id === currentLevelId), [currentLevelId, gameLevels]);

  // Reset Level Saat Ini jika target berubah dan level saat ini menjadi tidak valid (misal pindah game)
  useEffect(() => {
    if (currentLevelId && !availableCurrentLevels.find(l => l.id === currentLevelId)) {
      setCurrentLevelId('');
    }
  }, [availableCurrentLevels, currentLevelId]);

  // Hitung Akumulasi Total Harga
  const calculatedPrice = useMemo(() => {
    if (!selectedTargetLevel) return 0;
    if (availableCurrentLevels.length === 0) return selectedTargetLevel.price; // Jika target adalah rank paling bawah
    if (!currentLevelId) return 0;

    // Jumlahkan harga dari (Level Saat Ini + 1) hingga (Target Level)
    return gameLevels
      .filter(l => l.order_index > selectedCurrentLevel!.order_index && l.order_index <= selectedTargetLevel.order_index)
      .reduce((sum, l) => sum + l.price, 0);
  }, [selectedTargetLevel, availableCurrentLevels, currentLevelId, selectedCurrentLevel, gameLevels]);

  // Sinkronisasi dengan validasi Zod (Agar currentRank tetap terisi tanpa diketik user)
  useEffect(() => {
    if (!selectedTargetLevel) {
      setValue('currentRank', '');
    } else if (availableCurrentLevels.length === 0) {
      setValue('currentRank', 'Level Dasar (Awal)');
    } else if (currentLevelId) {
      setValue('currentRank', `${selectedCurrentLevel?.name} (${selectedCurrentLevel?.sub_level})`);
    } else {
      setValue('currentRank', ''); // Sengaja kosong agar validasi Zod memblokir jika belum pilih
    }
  }, [selectedTargetLevel, currentLevelId, availableCurrentLevels.length, selectedCurrentLevel, setValue]);
  // -----------------------------------------

  const onSubmit = async (data: OrderFormValues) => {
    try {
      if (!selectedTargetLevel) throw new Error("Paket tidak ditemukan");

      const gameName = (selectedTargetLevel as any)?.games?.name || 'Mobile Legends / Sesuai Target';
      const currentLevelStr = selectedCurrentLevel ? `${selectedCurrentLevel.name} (${selectedCurrentLevel.sub_level})` : 'Level Dasar (Awal)';

      // 1. SIMPAN DATA KE SUPABASE
      const { error: dbError } = await supabase.from('orders').insert([{
        customer_name: data.customerName,
        nickname: data.nickname,
        whatsapp_number: "6282120002589",
        game_id: selectedTargetLevel.game_id,
        level_id: selectedTargetLevel.id,
        total_price: calculatedPrice, // Harga akumulasi masuk ke DB
        status: 'pending',
        notes: `Level Saat Ini: ${currentLevelStr} | Notes: ${data.notes || '-'}`
      }]);

      if (dbError) throw new Error("Gagal menyimpan ke database");

      // 2. BENTUK PESAN WHATSAPP & REDIRECT
      const priceText = calculatedPrice === 0 ? 'Harga Dinamis (Custom)' : `Rp ${calculatedPrice.toLocaleString('id-ID')}`;
      const waText = `*NEW BOOSTING ORDER (GXSHIFT)*\n------------------------\n*Data Pemesan:*\nNama: ${data.customerName}\nWhatsApp: ${data.whatsappNumber}\n\n*Data Akun:*\nGame: ${gameName}\nNickname: ${data.nickname}\nServer ID: ${data.serverId}\n\n*Target Boost:*\nRank Saat Ini: ${currentLevelStr}\nRank Tujuan: ${selectedTargetLevel.name} (${selectedTargetLevel.sub_level})\nCatatan: ${data.notes || '-'}\n------------------------\n*Total Tagihan:* ${priceText}\n\nMohon informasi metode pembayaran.`;

      const encodedText = encodeURIComponent(waText);
      const cleanAdminNumber = adminWhatsapp.replace(/\D/g, ''); 
      const waUrl = `https://wa.me/${cleanAdminNumber}?text=${encodedText}`;

      toast.success('Pesanan Berhasil Dicatat!', { description: 'Mengalihkan ke WhatsApp...' });
      window.open(waUrl, '_blank');
      
    } catch (error) {
      toast.error('Gagal memproses pesanan', { description: 'Silakan periksa kembali data Anda.' });
    }
  };

  return (
    // Z-INDEX 9999 + BLUR BACKGROUND UNTUK MEMASTIKAN FORM SELALU DI ATAS
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="w-full max-w-5xl mx-auto glass-panel p-6 md:p-10 rounded-3xl border border-primary/30 shadow-[0_0_80px_rgba(166,255,0,0.1)] relative overflow-hidden z-[9999] bg-[#050505]/80 backdrop-blur-2xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6 relative z-10">
        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-[0_0_20px_rgba(166,255,0,0.3)]">
          <Shield size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Formulir Pesanan</h2>
          <p className="text-xs text-primary uppercase tracking-widest font-bold mt-1">100% Secure & Encrypted</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        
        {/* KOLOM 1: SETUP BOOST (Target & Level) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
            <Target size={16} className="text-primary"/> 1. Pengaturan Target
          </h3>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white uppercase tracking-wider">Pilih Target Rank / Paket</label>
            <div className="relative">
              <select 
                {...register('levelId')}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-white appearance-none cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                <option value="" disabled className="text-gray-600">-- Pilih Target Boost --</option>
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id} className="bg-[#0a0a0a] text-white">
                    {lvl.name} {lvl.sub_level && `(${lvl.sub_level})`}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
            </div>
            {errors.levelId && <p className="text-red-400 text-[10px] mt-1">{errors.levelId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white uppercase tracking-wider">Nama Game</label>
            <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-primary font-bold cursor-not-allowed flex items-center gap-2">
              <Gamepad2 size={16} className="text-gray-500" />
              {selectedTargetLevel ? (selectedTargetLevel as any).games?.name || 'Sesuai Paket' : 'Menunggu Pilihan Target...'}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {availableCurrentLevels.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                <label className="text-xs font-bold text-white uppercase tracking-wider">Posisi Rank Saat Ini</label>
                <div className="relative">
                  <select 
                    value={currentLevelId}
                    onChange={(e) => setCurrentLevelId(e.target.value)}
                    className="w-full bg-black/60 border border-yellow-500/30 rounded-xl px-4 py-3.5 text-sm focus:border-yellow-500 focus:outline-none transition-all text-white appearance-none cursor-pointer shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                  >
                    <option value="" disabled>-- Wajib Pilih Rank Awal --</option>
                    {availableCurrentLevels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id} className="bg-[#0a0a0a] text-white">
                        {lvl.name} {lvl.sub_level && `(${lvl.sub_level})`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none" />
                </div>
                {errors.currentRank && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12}/>Wajib pilih rank saat ini untuk kalkulasi harga.</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <input type="hidden" {...register('currentRank')} />
        </div>

        {/* KOLOM 2: DATA PEMAIN & AKUN */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
            <User size={16} className="text-primary"/> 2. Data Pemain & Akun
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Nama Lengkap</label>
              <input 
                {...register('customerName')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-600"
                placeholder="Nama Anda"
              />
              {errors.customerName && <p className="text-red-400 text-[10px] mt-1">{errors.customerName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">No. WhatsApp</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  {...register('whatsappNumber')} type="tel"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-gray-600"
                  placeholder="0812..."
                />
              </div>
              {errors.whatsappNumber && <p className="text-red-400 text-[10px] mt-1">{errors.whatsappNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Nickname Game</label>
              <input 
                {...register('nickname')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all placeholder:text-gray-600"
                placeholder="IGN Anda"
              />
              {errors.nickname && <p className="text-red-400 text-[10px] mt-1">{errors.nickname.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase">Server ID</label>
              <input 
                {...register('serverId')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all placeholder:text-gray-600"
                placeholder="(1234)"
              />
              {errors.serverId && <p className="text-red-400 text-[10px] mt-1">{errors.serverId.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase">Catatan / Request Hero (Opsional)</label>
            <input 
              {...register('notes')}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:outline-none transition-all placeholder:text-gray-600"
              placeholder="Contoh: Tolong pakai hero Mage, jam login malam..."
            />
          </div>
        </div>
      </div>

      {/* FOOTER TOTAL HARGA & SUBMIT */}
      <div className="mt-10 p-6 sm:p-8 bg-black/50 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 shadow-[inset_0_0_30px_rgba(166,255,0,0.05)]">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Total Tagihan Akumulasi</p>
          <p className="text-3xl md:text-4xl font-black text-white glow-text tracking-tight">
            {selectedTargetLevel && availableCurrentLevels.length > 0 && !currentLevelId ? (
              <span className="text-lg text-yellow-400 italic">Pilih Rank Saat Ini...</span>
            ) : calculatedPrice === 0 ? (
              'Harga Dinamis'
            ) : (
              `Rp ${calculatedPrice.toLocaleString('id-ID')}`
            )}
          </p>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || (availableCurrentLevels.length > 0 && !currentLevelId)}
          className="w-full md:w-auto px-10 py-5 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_20px_rgba(166,255,0,0.3)] hover:shadow-[0_0_40px_rgba(166,255,0,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          {isSubmitting ? 'MEMPROSES...' : 'ORDER SEKARANG VIA WA'}
          {!isSubmitting && <Send size={20} />}
        </button>
      </div>
    </motion.form>
  );
}