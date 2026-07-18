'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Clock, MessageCircle, Edit2, X, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminOrdersFullList() {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  
  // State untuk Modal Update Data
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({ price: 0, status: 'pending' });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    if (!supabaseUrl || !supabaseAnonKey) return;
    try {
      const { data } = await supabase
        .from('orders')
        .select('*, games(name), levels(name)')
        .order('created_at', { ascending: false });
      if (data) setLeads(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getWaLink = (num: string) => {
    if (!num) return '#';
    let cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.substring(1);
    return `https://wa.me/${cleanNum}`;
  };

  // Fungsi Update Database
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ total_price: editForm.price, status: editForm.status })
        .eq('id', editingOrder.id);
      
      if (error) throw error;
      toast.success('Data transaksi berhasil diperbarui!');
      setEditingOrder(null);
      await fetchData();
    } catch (error) {
      toast.error('Gagal memperbarui data.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit"><CheckCircle size={12}/> Sukses</span>;
    if (status === 'cancelled') return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit"><XCircle size={12}/> Batal</span>;
    return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit"><Clock size={12}/> Pending</span>;
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-primary">
        <Loader2 size={40} className="animate-spin opacity-50 mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Mengambil Data Transaksi...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Manajemen Transaksi</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola status pesanan (Sukses/Batal) dan sesuaikan harga deal akhir.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 text-[10px] uppercase text-gray-500 tracking-widest bg-black/20">
              <tr>
                <th className="p-5 font-bold">Pelanggan</th>
                <th className="p-5 font-bold">Target Boost</th>
                <th className="p-5 font-bold">Harga Deal</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-white uppercase text-sm mb-1">{lead.customer_name || lead.nickname}</p>
                    <a href={getWaLink(lead.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] bg-white/10 text-white hover:bg-primary hover:text-black px-2 py-1 rounded transition-all">
                      <MessageCircle size={10} /> {lead.whatsapp_number}
                    </a>
                  </td>
                  <td className="p-5">
                    <p className="font-bold text-gray-300">{(lead.games as any)?.name || 'Custom'}</p>
                    <p className="text-xs text-primary">{(lead.levels as any)?.name || '-'}</p>
                    <div className="flex items-center gap-1 mt-2 text-[9px] text-gray-500">
                      <Clock size={10}/> {new Date(lead.created_at).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="p-5 font-black text-white">
                    Rp {Number(lead.total_price || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-5">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => {
                        setEditingOrder(lead);
                        setEditForm({ price: lead.total_price || 0, status: lead.status || 'pending' });
                      }}
                      className="inline-flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      <Edit2 size={12} /> Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL UPDATE STATUS & HARGA */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(166,255,0,0.1)]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h3 className="font-black text-white uppercase tracking-tight">Update Transaksi</h3>
              <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-primary"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              {/* Info Klien Singkat */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-xs text-gray-400 uppercase font-bold">Klien</p>
                <p className="text-lg font-black text-white">{editingOrder.customer_name}</p>
              </div>

              {/* Status Toggle Keren */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Transaksi</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setEditForm({...editForm, status: 'pending'})} className={`py-3 text-xs font-bold rounded-xl border transition-all ${editForm.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-white/5 text-gray-500 border-transparent hover:bg-white/10'}`}>
                    PENDING
                  </button>
                  <button type="button" onClick={() => setEditForm({...editForm, status: 'completed'})} className={`py-3 text-xs font-bold rounded-xl border transition-all ${editForm.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-white/5 text-gray-500 border-transparent hover:bg-white/10'}`}>
                    SUKSES
                  </button>
                  <button type="button" onClick={() => setEditForm({...editForm, status: 'cancelled'})} className={`py-3 text-xs font-bold rounded-xl border transition-all ${editForm.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-white/5 text-gray-500 border-transparent hover:bg-white/10'}`}>
                    BATAL
                  </button>
                </div>
              </div>

              {/* Edit Harga */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Deal (Rp)</label>
                <input 
                  type="number" 
                  value={editForm.price} 
                  onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-white font-bold"
                />
                <p className="text-[9px] text-gray-500">Sesuaikan jika klien mendapat diskon atau custom order.</p>
              </div>

              <button type="submit" disabled={isUpdating} className="w-full py-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all uppercase tracking-widest text-xs disabled:opacity-50">
                {isUpdating ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}