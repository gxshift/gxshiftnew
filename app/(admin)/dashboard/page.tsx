import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, DollarSign, Gamepad2, Trophy, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// Inisialisasi Supabase Server-Side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // Disable cache agar statistik selalu realtime

export default async function AdminDashboardOverview() {
  // 1. Ambil Total Orders
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // 2. Ambil Total Pendapatan (Hanya pesanan berstatus 'completed')
  const { data: completedOrders } = await supabase
    .from('orders')
    .select('total_price')
    .eq('status', 'completed');
  
  const totalRevenue = completedOrders?.reduce((sum, order) => sum + Number(order.total_price), 0) || 0;

  // 3. Ambil Total Game & Paket Aktif
  const { count: gameCount } = await supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true);
  const { count: levelCount } = await supabase.from('levels').select('*', { count: 'exact', head: true }).eq('is_active', true);

  // 4. Ambil 5 Pesanan Terbaru
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*, games(name), levels(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Command Center</h1>
          <p className="text-sm text-gray-400 mt-1">Ringkasan performa platform GXSHIFT.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm font-bold">
            Lihat Website <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Revenue */}
        <div className="glass-panel p-6 rounded-2xl border border-primary/20 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[40px] group-hover:bg-primary/30 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Total Pendapatan</p>
              <h3 className="text-2xl font-black text-primary glow-text">Rp {(totalRevenue / 1000).toLocaleString('id-ID')}K</h3>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Card Orders */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Total Pesanan</p>
              <h3 className="text-2xl font-black text-white">{orderCount || 0}</h3>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>

        {/* Card Games */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Game Aktif</p>
              <h3 className="text-2xl font-black text-white">{gameCount || 0}</h3>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
              <Gamepad2 size={20} />
            </div>
          </div>
        </div>

        {/* Card Packages */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Paket Level Aktif</p>
              <h3 className="text-2xl font-black text-white">{levelCount || 0}</h3>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
              <Trophy size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-black uppercase tracking-tight">Pesanan Terbaru</h2>
          <Link href="/dashboard/orders" className="text-xs text-primary hover:underline font-bold">Lihat Semua</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Pelanggan</th>
                <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Game & Target</th>
                <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Waktu</th>
                <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Harga</th>
                <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white uppercase">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">IGN: {order.nickname}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-300">{(order.games as any)?.name || 'Unknown'}</p>
                      <p className="text-xs text-primary">To: {(order.levels as any)?.name || '-'}</p>
                    </td>
                    <td className="p-4 text-xs text-gray-400 flex items-center gap-1 mt-2">
                      <Clock size={12} /> {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 font-black text-white">
                      Rp {Number(order.total_price).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'completed' ? 'bg-primary/20 text-primary' :
                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}