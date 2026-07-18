'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Users, DollarSign, Clock, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboardOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, revenue30Days: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!supabaseUrl || !supabaseAnonKey) return;
      try {
        // Hitung batas waktu 30 hari yang lalu
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const isoDate = thirtyDaysAgo.toISOString();

        // 1. Total Semua Form Masuk
        const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        
        // 2. Pendapatan 30 Hari Terakhir (Status: completed)
        const { data: revData } = await supabase
          .from('orders')
          .select('total_price')
          .eq('status', 'completed')
          .gte('created_at', isoDate);
        
        const totalRev = revData?.reduce((acc, curr) => acc + Number(curr.total_price || 0), 0) || 0;

        // 3. Ambil 10 Data Terbaru
        const { data } = await supabase
          .from('orders')
          .select('*, games(name)')
          .order('created_at', { ascending: false })
          .limit(10);

        setStats({ totalOrders: count || 0, revenue30Days: totalRev });
        if (data) setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getWaLink = (num: string) => {
    if (!num) return '#';
    let cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.substring(1);
    return `https://wa.me/${cleanNum}`;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="text-green-400 font-black text-[10px] flex items-center gap-1"><CheckCircle size={10}/> SUKSES</span>;
    if (status === 'cancelled') return <span className="text-red-400 font-black text-[10px] flex items-center gap-1"><XCircle size={10}/> BATAL</span>;
    return <span className="text-yellow-400 font-black text-[10px] flex items-center gap-1"><Clock size={10}/> PENDING</span>;
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-primary">
        <Loader2 size={40} className="animate-spin opacity-50 mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Menghitung Finansial...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative z-10">
      <div className="pb-6">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Command Center</h1>
        <p className="text-sm text-gray-400 mt-1">Laporan finansial dan arus pesanan platform.</p>
      </div>

      {/* KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Total Form Masuk</p>
              <h3 className="text-4xl font-black text-white">{stats.totalOrders}</h3>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-primary/30 relative overflow-hidden group shadow-[0_0_30px_rgba(166,255,0,0.05)]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[40px] group-hover:bg-primary/30 transition-colors" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs text-primary uppercase font-bold tracking-widest mb-1">Pendapatan 30 Hari Terakhir</p>
              <h3 className="text-4xl font-black text-primary glow-text">Rp {(stats.revenue30Days / 1000).toLocaleString('id-ID')}K</h3>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* TABEL SEDERHANA */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-white/5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">10 Transaksi Terbaru</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 text-[10px] uppercase text-gray-500 tracking-widest">
              <tr>
                <th className="p-5 font-bold">Klien & Game</th>
                <th className="p-5 font-bold">Waktu</th>
                <th className="p-5 font-bold">Harga & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.length > 0 ? leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-bold text-white uppercase">{lead.customer_name || lead.nickname}</p>
                        <p className="text-[10px] text-gray-500">{(lead.games as any)?.name || 'Custom Order'}</p>
                      </div>
                      <a href={getWaLink(lead.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="bg-primary/10 text-primary hover:bg-primary hover:text-black p-2 rounded-lg transition-all ml-2" title="Chat WA">
                        <MessageCircle size={14} />
                      </a>
                    </div>
                  </td>
                  <td className="p-5 text-xs text-gray-400">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock size={12} /> {new Date(lead.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                    <div>{new Date(lead.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                  </td>
                  <td className="p-5">
                    <p className="font-black text-white mb-1">Rp {Number(lead.total_price || 0).toLocaleString('id-ID')}</p>
                    {getStatusBadge(lead.status)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-gray-500">Belum ada data transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}