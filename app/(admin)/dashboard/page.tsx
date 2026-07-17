"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Inisialisasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Package = {
  id: string;
  title: string;
  rank_image_url: string | null;
  estimated_time: string;
  starting_price: number;
  is_popular: boolean;
  is_dynamic_price: boolean;
  order_index: number;
};

export default function AdminDashboard() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // State Form
  const [formData, setFormData] = useState({
    title: '',
    estimated_time: '',
    starting_price: 0,
    is_popular: false,
    is_dynamic_price: false,
    order_index: 0,
  });

  // Ambil Data
  const fetchPackages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('boosting_packages')
      .select('*')
      .order('order_index');
    
    if (!error && data) setPackages(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  // Setup Edit
  const handleEdit = (pkg: Package) => {
    setIsEditing(pkg.id);
    setFormData({
      title: pkg.title,
      estimated_time: pkg.estimated_time,
      starting_price: pkg.starting_price,
      is_popular: pkg.is_popular,
      is_dynamic_price: pkg.is_dynamic_price,
      order_index: pkg.order_index,
    });
  };

  // Batalkan Edit
  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ title: '', estimated_time: '', starting_price: 0, is_popular: false, is_dynamic_price: false, order_index: 0 });
  };

  // Simpan Data (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEditing) {
      // Update
      await supabase.from('boosting_packages').update(formData).eq('id', isEditing);
    } else {
      // Create
      await supabase.from('boosting_packages').insert([formData]);
    }

    cancelEdit();
    await fetchPackages();
  };

  // Hapus Data
  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus paket ini?')) {
      setIsLoading(true);
      await supabase.from('boosting_packages').delete().eq('id', id);
      await fetchPackages();
    }
  };

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Admin */}
        <div className="flex justify-between items-center pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tighter uppercase">GXSHIFT Command Center</h1>
            <p className="text-gray-400 text-sm">Kelola paket boosting dan data website.</p>
          </div>
          <Link href="/" className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors text-sm">
            Lihat Website ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM FORM INPUT */}
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl h-fit border border-primary/20">
            <h2 className="text-xl font-bold mb-6 uppercase text-primary">
              {isEditing ? '✏️ Edit Paket' : '➕ Tambah Paket Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nama Paket</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Contoh: EPIC TO LEGEND" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Estimasi Waktu</label>
                <input required type="text" name="estimated_time" value={formData.estimated_time} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Contoh: 1-2 Days" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Harga Awal (Rp)</label>
                <input required type="number" name="starting_price" value={formData.starting_price} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" disabled={formData.is_dynamic_price} />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Urutan Tampil (Angka)</label>
                <input required type="number" name="order_index" value={formData.order_index} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors" />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_popular" checked={formData.is_popular} onChange={handleChange} className="accent-primary" />
                  Tandai sebagai "Most Popular"
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="is_dynamic_price" checked={formData.is_dynamic_price} onChange={handleChange} className="accent-primary" />
                  Harga Dinamis (Custom Price)
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button type="submit" disabled={isLoading} className="flex-1 bg-primary text-black font-bold py-2 rounded-lg hover:bg-[#b5ff2b] transition-colors disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : isEditing ? 'Update Data' : 'Simpan Paket'}
                </button>
                {isEditing && (
                  <button type="button" onClick={cancelEdit} className="px-4 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* KOLOM DAFTAR PAKET */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-6 uppercase">Daftar Paket Aktif</h2>
              
              {isLoading && packages.length === 0 ? (
                <div className="text-center py-10 text-gray-400 animate-pulse">Memuat data dari database...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="p-3 font-medium">Urutan</th>
                        <th className="p-3 font-medium">Paket</th>
                        <th className="p-3 font-medium">Waktu</th>
                        <th className="p-3 font-medium">Harga</th>
                        <th className="p-3 font-medium text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {packages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-gray-400">{pkg.order_index}</td>
                          <td className="p-3 font-bold">
                            {pkg.title}
                            {pkg.is_popular && <span className="ml-2 text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">Popular</span>}
                          </td>
                          <td className="p-3 text-gray-400">{pkg.estimated_time}</td>
                          <td className="p-3 text-primary font-medium">
                            {pkg.is_dynamic_price ? 'Custom' : `Rp ${pkg.starting_price.toLocaleString('id-ID')}`}
                          </td>
                          <td className="p-3 flex justify-end gap-2">
                            <button onClick={() => handleEdit(pkg)} className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors text-xs">Edit</button>
                            <button onClick={() => handleDelete(pkg.id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-colors text-xs">Hapus</button>
                          </td>
                        </tr>
                      ))}
                      {packages.length === 0 && !isLoading && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-500">Belum ada paket yang ditambahkan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
