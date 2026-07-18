"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Gamepad2, Edit2, Trash2, Plus, Image as ImageIcon, UploadCloud, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Game = { id: string; name: string; slug: string; cover_image: string | null; is_active: boolean; order_index: number; };

export default function AdminGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', slug: '', cover_image: '', is_active: true, order_index: 0 });

  const fetchData = async () => {
    setIsLoading(true);
    if (!supabaseUrl || !supabaseAnonKey) return setIsLoading(false);
    try {
      const { data } = await supabase.from('games').select('*').order('order_index');
      if (data) setGames(data);
    } catch (error) {
      toast.error('Gagal mengambil data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- FUNGSI KOMPRESI & UPLOAD GAMBAR ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading('Mengompres gambar...', { id: 'upload-toast' });

    try {
      // 1. Kompresi Gambar
      const options = {
        maxSizeMB: 0.5, // Maksimal 500kb
        maxWidthOrHeight: 800, // Dimensi sedikit lebih besar untuk Cover Game
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      toast.loading('Mengunggah ke server...', { id: 'upload-toast' });

      // 2. Buat nama unik dan tentukan folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `games/${fileName}`; // Disimpan di folder 'games'

      // 3. Upload ke Supabase
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // 4. Ambil Public URL
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // 5. Masukkan URL ke form
      setFormData(prev => ({ ...prev, cover_image: publicUrlData.publicUrl }));
      toast.success('Gambar berhasil diunggah!', { id: 'upload-toast' });

    } catch (error: any) {
      console.error(error);
      toast.error('Gagal upload gambar', { id: 'upload-toast', description: 'Pastikan Bucket "images" sudah dibuat dan Public.' });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await supabase.from('games').update(formData).eq('id', isEditing);
        toast.success('Data Game Berhasil Diupdate');
      } else {
        await supabase.from('games').insert([formData]);
        toast.success('Data Game Berhasil Ditambahkan');
      }
      setIsEditing(null);
      setFormData({ name: '', slug: '', cover_image: '', is_active: true, order_index: 0 });
      await fetchData();
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Yakin ingin menghapus game ini?')) {
      setIsLoading(true);
      await supabase.from('games').delete().eq('id', id);
      toast.success('Game dihapus');
      fetchData();
    }
  }

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex justify-between items-end pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Kelola Game</h1>
          <p className="text-gray-400 text-sm mt-1">Atur daftar game, slug, dan upload gambar sampul (cover).</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Tambah/Edit */}
        <div className="xl:col-span-1 glass-panel p-6 rounded-2xl border border-primary/20 h-fit">
          <h2 className="text-lg font-bold mb-6 uppercase text-primary flex items-center gap-2">
            {isEditing ? <Edit2 size={18}/> : <Plus size={18}/>}
            {isEditing ? 'Edit Game' : 'Tambah Game Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Nama Game</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Slug (URL)</label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none text-white" placeholder="contoh: mobile-legends" />
            </div>
            
            {/* --- BAGIAN UPLOAD GAMBAR --- */}
            <div className="p-4 border border-white/10 rounded-xl bg-black/30">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Cover Image (Upload / URL)</label>
              
              {/* Tombol Upload */}
              <div className="relative mb-3">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                />
                <div className={`w-full py-3 rounded-lg border border-dashed flex items-center justify-center gap-2 text-sm font-bold transition-all ${isUploading ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-primary'}`}>
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                  {isUploading ? 'MENGOMPRES...' : 'KLIK UNTUK UPLOAD'}
                </div>
              </div>

              {/* Input URL (Fallback jika mau paste link) */}
              <input type="url" value={formData.cover_image} onChange={(e) => setFormData({...formData, cover_image: e.target.value})} className="w-full bg-black/80 border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-primary focus:outline-none text-white mb-3 placeholder:text-gray-600" placeholder="Atau paste URL gambar di sini..." />
              
              {/* Preview Gambar */}
              {formData.cover_image && (
                <div className="flex justify-center p-3 border border-white/10 rounded-lg bg-black/80 relative group">
                  <img src={formData.cover_image} alt="Preview Cover" className="h-24 w-auto rounded object-cover drop-shadow-[0_0_15px_rgba(166,255,0,0.2)]" />
                  <button type="button" onClick={() => setFormData({...formData, cover_image: ''})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"><X size={12}/></button>
                </div>
              )}
            </div>
            {/* --------------------------- */}

            <button type="submit" disabled={isLoading || isUploading} className="w-full bg-primary text-black font-black py-3 rounded-lg hover:bg-[#b5ff2b] transition-all uppercase text-xs tracking-widest mt-4 disabled:opacity-50">
              {isEditing ? 'Update Game' : 'Simpan Game'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => {setIsEditing(null); setFormData({ name: '', slug: '', cover_image: '', is_active: true, order_index: 0 })}} className="w-full mt-2 text-xs text-gray-400 hover:text-white uppercase font-bold tracking-widest py-2">
                Batal Edit
              </button>
            )}
          </form>
        </div>

        {/* Tabel Data Games */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-2xl">
          {isLoading && games.length === 0 ? (
             <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-4"><Loader2 size={30} className="animate-spin text-primary"/> Memuat data...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] uppercase text-gray-400 border-b border-white/10">
                <tr>
                  <th className="p-4 w-16 text-center">Cover</th>
                  <th className="p-4">Game</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {games.length === 0 && !isLoading && (
                   <tr><td colSpan={4} className="p-8 text-center text-gray-500">Belum ada game. Silakan tambahkan.</td></tr>
                )}
                {games.map(game => (
                  <tr key={game.id} className="hover:bg-white/5">
                    <td className="p-4 text-center">
                      {game.cover_image ? (
                        <img src={game.cover_image} alt={game.name} className="w-10 h-10 rounded-lg object-cover border border-white/10 mx-auto" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 mx-auto"><ImageIcon size={16}/></div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-white">{game.name}</td>
                    <td className="p-4 text-gray-400">{game.slug}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => { setIsEditing(game.id); setFormData({name: game.name, slug: game.slug, cover_image: game.cover_image || '', is_active: game.is_active, order_index: game.order_index}); }} className="p-2 bg-white/10 rounded hover:bg-primary/20 hover:text-primary transition-colors text-white"><Edit2 size={14}/></button>
                      <button onClick={() => handleDelete(game.id)} className="p-2 bg-white/10 rounded hover:bg-red-500/20 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}