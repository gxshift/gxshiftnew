"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, AlertCircle, Edit2, Trash2, Plus, Image as ImageIcon, UploadCloud, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression'; // Library Kompresi

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Game = { id: string; name: string; };

type Level = {
  id: string;
  game_id: string;
  name: string;
  sub_level: string;
  estimated_time: string;
  price: number;
  order_index: number;
  is_active: boolean;
  icon_url: string | null;
  games?: Game;
};

export default function AdminLevels() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // State loading upload
  
  const [formData, setFormData] = useState({
    game_id: '',
    name: '',
    sub_level: '',
    estimated_time: '',
    price: 0,
    order_index: 0,
    is_active: true,
    icon_url: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    if (!supabaseUrl || !supabaseAnonKey) return setIsLoading(false);
    try {
      const { data: gamesData } = await supabase.from('games').select('id, name');
      if (gamesData) {
        setGames(gamesData);
        if (!formData.game_id && gamesData.length > 0) setFormData(prev => ({ ...prev, game_id: gamesData[0].id }));
      }
      const { data: levelsData } = await supabase.from('levels').select('*, games(name)').order('order_index');
      if (levelsData) setLevels(levelsData);
    } catch (error) {
      toast.error('Gagal mengambil data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
  };

  // --- FUNGSI KOMPRESI DAN UPLOAD GAMBAR ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading('Mengompres gambar...', { id: 'upload-toast' });

    try {
      // 1. Proses Kompresi (Maks 500kb, Resize max 512px)
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      toast.loading('Mengunggah ke server...', { id: 'upload-toast' });

      // 2. Buat nama file unik agar tidak bentrok
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `levels/${fileName}`; // Disimpan di folder 'levels' dalam bucket 'images'

      // 3. Upload ke Supabase Storage (Bucket 'images')
      const { error: uploadError } = await supabase.storage
        .from('rank-icon')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // 4. Dapatkan Public URL
      const { data: publicUrlData } = supabase.storage
        .from('rank-icon')
        .getPublicUrl(filePath);

      // 5. Masukkan URL ke Form Data
      setFormData(prev => ({ ...prev, icon_url: publicUrlData.publicUrl }));
      toast.success('Gambar berhasil diunggah!', { id: 'upload-toast' });

    } catch (error: any) {
      console.error(error);
      toast.error('Gagal upload gambar', { id: 'upload-toast', description: 'Pastikan Bucket "images" sudah dibuat dan Public.' });
    } finally {
      setIsUploading(false);
      // Reset input file
      e.target.value = '';
    }
  };

  const handleEdit = (level: Level) => {
    setIsEditing(level.id);
    setFormData({
      game_id: level.game_id, name: level.name, sub_level: level.sub_level || '',
      estimated_time: level.estimated_time, price: level.price, order_index: level.order_index,
      is_active: level.is_active, icon_url: level.icon_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ game_id: games.length > 0 ? games[0].id : '', name: '', sub_level: '', estimated_time: '', price: 0, order_index: 0, is_active: true, icon_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.game_id) return toast.error('Gagal', { description: 'Pilih Game terlebih dahulu!' });
    setIsLoading(true);
    try {
      if (isEditing) {
        await supabase.from('levels').update(formData).eq('id', isEditing);
        toast.success('Berhasil', { description: 'Paket berhasil diperbarui!' });
      } else {
        await supabase.from('levels').insert([formData]);
        toast.success('Berhasil', { description: 'Paket baru berhasil ditambahkan!' });
      }
      cancelEdit();
      await fetchData();
    } catch (error: any) {
      toast.error('Gagal Menyimpan', { description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus paket (level) ini?')) {
      setIsLoading(true);
      try {
        await supabase.from('levels').delete().eq('id', id);
        toast.success('Berhasil', { description: 'Paket dihapus.' });
        await fetchData();
      } catch (error: any) {
        toast.error('Gagal Hapus', { description: error.message });
      }
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex justify-between items-end pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Kelola Paket (Levels)</h1>
          <p className="text-gray-400 text-sm mt-1">Atur harga, nama, estimasi waktu, dan upload gambar icon paket.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* KOLOM FORM INPUT */}
        <div className="xl:col-span-1 glass-panel p-6 rounded-2xl h-fit border border-primary/20 shadow-[0_0_30px_rgba(166,255,0,0.05)]">
          <h2 className="text-lg font-bold mb-6 uppercase text-primary flex items-center gap-2">
            {isEditing ? <Edit2 size={18}/> : <Plus size={18}/>}
            {isEditing ? 'Edit Paket' : 'Tambah Paket Baru'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Pilih Game</label>
              <select required name="game_id" value={formData.game_id} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-white">
                <option value="" disabled>-- Pilih Game --</option>
                {games.map(g => ( <option key={g.id} value={g.id}>{g.name}</option> ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nama Paket (Rank)</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-white" placeholder="Contoh: EPIC TO LEGEND" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Sub Level / Detail</label>
              <input type="text" name="sub_level" value={formData.sub_level} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-white" placeholder="Contoh: All Tiers atau Bintang 1-5" />
            </div>

            {/* --- BAGIAN UPLOAD GAMBAR --- */}
            <div className="p-4 border border-white/10 rounded-xl bg-black/30">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Icon Paket (Upload / URL)</label>
              
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
                  {isUploading ? 'MENGOMPRES & MENGUNGGAH...' : 'KLIK UNTUK UPLOAD FILE GAMBAR'}
                </div>
              </div>

              {/* Input URL (Fallback jika mau paste link) */}
              <input type="url" name="icon_url" value={formData.icon_url} onChange={handleChange} className="w-full bg-black/80 border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-primary focus:outline-none text-white mb-3 placeholder:text-gray-600" placeholder="Atau paste URL gambar di sini..." />
              
              {/* Preview Gambar */}
              {formData.icon_url && (
                <div className="flex justify-center p-3 border border-white/10 rounded-lg bg-black/80 relative group">
                  <img src={formData.icon_url} alt="Preview Icon" className="h-16 w-16 object-contain drop-shadow-[0_0_15px_rgba(166,255,0,0.2)]" />
                  <button type="button" onClick={() => setFormData({...formData, icon_url: ''})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"><X size={12}/></button>
                </div>
              )}
            </div>
            {/* --------------------------- */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Harga (Rp)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Urutan Tampil</label>
                <input required type="number" name="order_index" value={formData.order_index} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Estimasi Waktu</label>
              <input required type="text" name="estimated_time" value={formData.estimated_time} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-white" placeholder="Contoh: 1-2 Days" />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors text-white">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="accent-primary w-4 h-4" />
                Paket Aktif (Tampil di Web)
              </label>
            </div>

            <div className="pt-4 flex gap-2">
              <button type="submit" disabled={isLoading || isUploading} className="flex-1 bg-primary text-black font-extrabold py-3 rounded-lg hover:bg-[#b5ff2b] transition-colors disabled:opacity-50 uppercase tracking-widest text-xs">
                {isEditing ? 'Update Data' : 'Simpan Paket'}
              </button>
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="px-6 bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-colors uppercase tracking-widest text-xs">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* KOLOM DAFTAR PAKET */}
        <div className="xl:col-span-2">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-black mb-6 uppercase flex items-center gap-2">
              <Trophy className="text-primary"/> Daftar Paket Aktif
            </h2>
            
            {isLoading && levels.length === 0 ? (
              <div className="text-center py-20 text-gray-500 animate-pulse flex flex-col items-center gap-4"><Loader2 size={30} className="animate-spin text-primary"/> Memuat data...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="p-4 font-bold text-gray-400 w-12 text-center uppercase tracking-widest text-[10px]">Icon</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Game & Urutan</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Nama Paket</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Harga & Waktu</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {levels.map((level) => (
                      <tr key={level.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4 text-center">
                          {level.icon_url ? (
                            <img src={level.icon_url} alt="icon" className="w-8 h-8 object-contain mx-auto drop-shadow-md" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mx-auto text-gray-600"><ImageIcon size={14}/></div>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white text-xs uppercase">{level.games?.name}</p>
                          <p className="text-[10px] text-gray-500">Index: {level.order_index}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-primary uppercase">{level.name}</p>
                          <p className="text-[10px] text-gray-400">{level.sub_level}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-black text-white">{level.price === 0 ? 'DYNAMIC' : `Rp ${level.price.toLocaleString('id-ID')}`}</p>
                          <p className="text-[10px] text-gray-400">{level.estimated_time}</p>
                        </td>
                        <td className="p-4 flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(level)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 hover:text-primary transition-colors text-white"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(level.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}