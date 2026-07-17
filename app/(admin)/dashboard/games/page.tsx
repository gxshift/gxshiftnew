"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Gamepad2, Edit2, Trash2, Plus, AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

type Game = { id: string; name: string; slug: string; cover_image: string | null; is_active: boolean; order_index: number; };

export default function AdminGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', is_active: true, order_index: 0 });

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('games').select('*').order('order_index');
    if (data) setGames(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (isEditing) {
      await supabase.from('games').update(formData).eq('id', isEditing);
    } else {
      await supabase.from('games').insert([formData]);
    }
    setIsEditing(null);
    setFormData({ name: '', slug: '', is_active: true, order_index: 0 });
    await fetchData();
    toast.success('Data Game Berhasil Disimpan');
  };

  return (
    <div className="space-y-8 relative z-10">
      <h1 className="text-3xl font-black text-white uppercase tracking-tight">Kelola Game</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form */}
        <div className="xl:col-span-1 glass-panel p-6 rounded-2xl border border-primary/20">
          <h2 className="text-lg font-bold mb-6 uppercase text-primary flex items-center gap-2">
            {isEditing ? <Edit2 size={18}/> : <Plus size={18}/>}
            {isEditing ? 'Edit Game' : 'Tambah Game Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Nama Game</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Slug (URL)</label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none" placeholder="contoh: mobile-legends" />
            </div>
            <button type="submit" className="w-full bg-primary text-black font-black py-3 rounded-lg hover:bg-[#b5ff2b] transition-all uppercase text-xs tracking-widest">
              {isEditing ? 'Update Game' : 'Simpan Game'}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] uppercase text-gray-400 border-b border-white/10">
              <tr><th className="p-4">Game</th><th className="p-4">Slug</th><th className="p-4 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {games.map(game => (
                <tr key={game.id} className="hover:bg-white/5">
                  <td className="p-4 font-bold">{game.name}</td>
                  <td className="p-4 text-gray-400">{game.slug}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => { setIsEditing(game.id); setFormData(game); }} className="p-2 bg-white/10 rounded hover:bg-primary/20"><Edit2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}