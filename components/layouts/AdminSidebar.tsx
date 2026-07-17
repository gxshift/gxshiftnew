'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Layers, 
  ShoppingCart, 
  Settings, 
  LogOut,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Data Games', icon: Gamepad2, path: '/dashboard/games' },
    { name: 'Data Paket (Level)', icon: Layers, path: '/dashboard/levels' },
    { name: 'Pesanan Masuk', icon: ShoppingCart, path: '/dashboard/orders' },
    { name: 'Testimonial', icon: MessageSquare, path: '/dashboard/testimonials' },
    { name: 'FAQ', icon: HelpCircle, path: '/dashboard/faqs' },
    { name: 'Pengaturan', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#050505] border-r border-white/5 flex flex-col hidden md:flex sticky top-0 z-50">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="text-2xl font-black italic tracking-tighter flex items-center drop-shadow-[0_0_10px_rgba(166,255,0,0.3)]">
          <span className="text-white">GX</span>
          <span className="text-primary">ADMIN</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2 mb-4">Main Menu</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(166,255,0,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={18} className={isActive ? 'drop-shadow-[0_0_8px_rgba(166,255,0,0.8)]' : ''} />
              <span className="text-sm font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action */}
      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
          <LogOut size={18} />
          <span className="text-sm font-bold">Keluar</span>
        </button>
      </div>
    </aside>
  );
}