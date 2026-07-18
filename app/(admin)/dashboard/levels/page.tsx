"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, AlertCircle, Edit2, Trash2, Plus, Image as ImageIcon, UploadCloud, Loader2, X, GripVertical, Clock } from 'lucide-react';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

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

// Utility class untuk custom scrollbar yang elegan
const scrollbarClass = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-primary/30 hover:[&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full transition-all";

export default function AdminLevels() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    game_id: '',
    name: '',
    sub_level: '',
    estimated_time: '',
    price: 0,
    is_active: true,
    icon_url: '',
    order_index: 0 // Tetap ada di state untuk disimpan, tapi tidak muncul di UI
  });

  // --- REFERENSI DRAG & DROP ---
  const dragItem = useRef<string | null>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading('Mengompres gambar...', { id: 'upload-toast' });

    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 512, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);

      toast.loading('Mengunggah ke server...', { id: 'upload-toast' });

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `levels/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, compressedFile);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, icon_url: publicUrlData.publicUrl }));
      toast.success('Gambar berhasil diunggah!', { id: 'upload-toast' });

    } catch (error: any) {
      toast.error('Gagal upload gambar', { id: 'upload-toast', description: 'Pastikan Bucket "images" sudah dibuat dan Public.' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // --- LOGIKA DRAG & DROP NATIVE ---
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    dragItem.current = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id); // Perbaikan untuk Firefox
    // Tambahkan style visual saat digeser
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, targetId: string) => {
    e.preventDefault();
    if (!dragItem.current || dragItem.current === targetId) return;

    const draggedIndex = levels.findIndex(l => l.id === dragItem.current);
    const targetIndex = levels.findIndex(l => l.id === targetId);

    if (draggedIndex < 0 || targetIndex < 0) return;

    const newLevels = [...levels];
    const draggedItem = newLevels[draggedIndex];
    newLevels.splice(draggedIndex, 1);
    newLevels.splice(targetIndex, 0, draggedItem);

    // Langsung update urutan sementara di state agar UI mulus
    const reorderedLevels = newLevels.map((lvl, idx) => ({ ...lvl, order_index: idx + 1 }));
    setLevels(reorderedLevels);
  };

  const handleDragEnd = async (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.opacity = '1';
    if (!dragItem.current) return;
    dragItem.current = null;

    // Simpan ke Database secara Massal (Bulk Update)
    const updatePromises = levels.map((lvl) => 
      supabase.from('levels').update({ order_index: lvl.order_index }).eq('id', lvl.id)
    );

    toast.promise(Promise.all(updatePromises), {
      loading: 'Menyimpan urutan baru...',
      success: 'Urutan Paket berhasil diperbarui!',
      error: 'Gagal memperbarui urutan.'
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault(); // Wajib agar drop bisa terjadi
  };

  // --- CRUD ACTIONS ---
  const handleEdit = (level: Level) => {
    setIsEditing(level.id);
    setFormData({
      game_id: level.game_id, name: level.name, sub_level: level.sub_level || '',
      estimated_time: level.estimated_time, price: level.price, is_active: level.is_active, 
      icon_url: level.icon_url || '', order_index: level.order_index
    });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ game_id: games.length > 0 ? games[0].id : '', name: '', sub_level: '', estimated_time: '', price: 0, is_active: true, icon_url: '', order_index: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.game_id) return toast.error('Gagal', { description: 'Pilih Game terlebih dahulu!' });
    setIsLoading(true);
    
    try {
      const submitData = { ...formData };
      
      if (isEditing) {
        await supabase.from('levels').update(submitData).eq('id', isEditing);
        toast.success('Berhasil', { description: 'Paket berhasil diperbarui!' });
      } else {
        // Otomatis menaruh paket baru di urutan paling akhir
        const maxIndex = levels.length > 0 ? Math.max(...levels.map(l => l.order_index)) : 0;
        submitData.order_index = maxIndex + 1;
        await supabase.from('levels').insert([submitData]);
        toast.success('Berhasil', { description: 'Paket baru berhasil ditambahkan!' });
      }
      
      cancelEdit();
      await fetchData();
    } catch (error: any) {
      toast.error('Gagal Menyimpan', { description: error.message });
      setIsLoading(false);
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
    // Layout Utama dengan TINGGI TETAP dan menghilangkan Scroll Global
    <div className="space-y-6 relative z-10 h-[calc(100vh-100px)] flex flex-col overflow-hidden">
      
      <div className="flex-shrink-0 flex justify-between items-end pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Kelola Paket (Levels)</h1>
          <p className="text-gray-400 text-sm mt-1">Atur harga, nama, estimasi waktu, dan upload gambar icon paket.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 overflow-hidden pb-4">
        
        {/* ============================================================== */}
        {/* KOLOM 1: FORM INPUT (FIXED HEIGHT DENGAN INTERNAL SCROLL)      */}
        {/* ============================================================== */}
        <div className="xl:col-span-1 glass-panel p-6 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(166,255,0,0.05)] flex flex-col h-full overflow-hidden">
          <h2 className="flex-shrink-0 text-lg font-bold mb-6 uppercase text-primary flex items-center gap-2">
            {isEditing ? <Edit2 size={18}/> : <Plus size={18}/>}
            {isEditing ? 'Edit Paket' : 'Tambah Paket Baru'}
          </h2>
          
          {/* Scroll Area Dalam Form */}
          <div className={`flex-1 overflow-y-auto pr-3 ${scrollbarClass}`}>
            <form onSubmit={handleSubmit} className="space-y-4 pb-4">
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

              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Icon Paket (Upload / URL)</label>
                
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
                    {isUploading ? 'MENGUNGGAH...' : 'UPLOAD FILE GAMBAR'}
                  </div>
                </div>

                <input type="url" name="icon_url" value={formData.icon_url} onChange={handleChange} className="w-full bg-black/80 border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-primary focus:outline-none text-white mb-3 placeholder:text-gray-600" placeholder="Atau paste URL gambar di sini..." />
                
                {formData.icon_url && (
                  <div className="flex justify-center p-3 border border-white/10 rounded-lg bg-black/80 relative group">
                    <img src={formData.icon_url} alt="Preview Icon" className="h-16 w-16 object-contain drop-shadow-[0_0_15px_rgba(166,255,0,0.2)]" />
                    <button type="button" onClick={() => setFormData({...formData, icon_url: ''})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"><X size={12}/></button>
                  </div>
                )}
              </div>

              {/* HANYA HARGA, URUTAN TAMPIL DIHAPUS DARI UI */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Harga (Rp)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-sm focus:border-primary focus:outline-none transition-colors text-white" />
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
        </div>

        {/* ============================================================== */}
        {/* KOLOM 2: TABEL DAFTAR PAKET (FIXED HEIGHT DENGAN INTERNAL SCROLL) */}
        {/* ============================================================== */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
          <div className="flex-shrink-0 flex justify-between items-center mb-6">
            <h2 className="text-xl font-black uppercase flex items-center gap-2">
              <Trophy className="text-primary"/> Daftar Paket Aktif
            </h2>
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hidden sm:block">
              ✨ Tarik baris untuk mengubah urutan
            </span>
          </div>
          
          {isLoading && levels.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">
              <Loader2 size={30} className="animate-spin text-primary"/> Memuat data...
            </div>
          ) : (
            
            /* Scroll Area Dalam Tabel */
            <div className={`flex-1 overflow-y-auto pr-3 ${scrollbarClass}`}>
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-20 backdrop-blur-md">
                  <tr>
                    <th className="p-4 w-10 text-center text-gray-500"><GripVertical size={14} className="mx-auto"/></th>
                    <th className="p-4 font-bold text-gray-400 w-12 text-center uppercase tracking-widest text-[10px]">Icon</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Game & Paket</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Harga & Waktu</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {levels.map((level) => (
                    <tr 
                      key={level.id} 
                      className="hover:bg-white/5 transition-colors group cursor-grab active:cursor-grabbing bg-transparent"
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, level.id)}
                      onDragEnter={(e) => handleDragEnter(e, level.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                    >
                      {/* HANDLE DRAG ICON */}
                      <td className="p-4 text-center text-gray-600 group-hover:text-primary transition-colors">
                        <GripVertical size={16} className="mx-auto" />
                      </td>

                      <td className="p-4 text-center">
                        {level.icon_url ? (
                          <img src={level.icon_url} alt="icon" className="w-8 h-8 object-contain mx-auto drop-shadow-[0_0_10px_rgba(166,255,0,0.2)]" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mx-auto text-gray-600"><ImageIcon size={14}/></div>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white text-xs uppercase">{level.games?.name}</p>
                        <p className="font-bold text-primary uppercase text-sm mt-1">{level.name}</p>
                        <p className="text-[10px] text-gray-400">{level.sub_level}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-white">{level.price === 0 ? 'DYNAMIC' : `Rp ${level.price.toLocaleString('id-ID')}`}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                          <Clock size={10} /> {level.estimated_time}
                        </p>
                      </td>
                      <td className="p-4 flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(level)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 hover:text-primary transition-colors text-white" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(level.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-colors" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {levels.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-500">Belum ada paket yang ditambahkan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}