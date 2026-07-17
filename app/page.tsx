import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase untuk pembacaan data publik
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 0; // Memastikan data yang dirender selalu aktual dari database

export default async function Home() {
  // Mengambil data dari tabel 'boosting_packages'
  const { data: packages } = await supabase
    .from('boosting_packages')
    .select('*')
    .order('order_index');

  // Fallback data jika tabel belum ada atau masih kosong
  const defaultPackages = [
    { id: '1', title: 'EPIC TO LEGEND', rank_image_url: null, estimated_time: '1-2 Days', starting_price: 150000, is_popular: false, is_dynamic_price: false },
    { id: '2', title: 'LEGEND TO MYTHIC', rank_image_url: null, estimated_time: '2-3 Days', starting_price: 250000, is_popular: true, is_dynamic_price: false },
    { id: '3', title: 'MYTHICAL GLORY', rank_image_url: null, estimated_time: 'Dynamic', starting_price: 0, is_popular: false, is_dynamic_price: true }
  ];

  const displayPackages = packages && packages.length > 0 ? packages : defaultPackages;

  return (
    <div className="flex flex-col min-h-screen bg-background text-white font-sans overflow-hidden">
      
      {/* HEADER / NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-black italic tracking-tighter flex items-center">
            <span className="text-white">GX</span>
            <span className="text-primary">SHIFT</span>
            <span className="text-xs text-primary font-normal not-italic ml-1 mt-3">.com</span>
          </div>
        </div>
        <a 
          href="https://wa.me/6281234567890" 
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 border border-primary/50 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/10 transition-colors"
        >
          ORDER VIA WHATSAPP
        </a>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-24 relative z-10">
        
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
              Rank Up.<br/>
              <span className="text-primary glow-text">Dominate.</span><br/>
              Be Legendary.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl">
              Professional <strong className="text-white font-bold">Mobile Legends</strong> Rank Boosting by Verified Pro Players.
            </p>
            
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">🛡️</div>
                <div>
                  <p className="text-xs font-bold text-white uppercase">100% Safe</p>
                  <p className="text-[10px] text-gray-500">Secure & Private</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">⭐</div>
                <div>
                  <p className="text-xs font-bold text-white uppercase">Verified Pro</p>
                  <p className="text-[10px] text-gray-500">Mythical Glory Players</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">📊</div>
                <div>
                  <p className="text-xs font-bold text-white uppercase">Live Tracking</p>
                  <p className="text-[10px] text-gray-500">Real-time Progress</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="glass-panel p-8 rounded-2xl border border-primary/20 relative overflow-hidden group hover-glow">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[50px]" />
              <h3 className="text-sm text-gray-400 font-bold mb-1 tracking-widest">REACH</h3>
              <h2 className="text-3xl font-black text-primary mb-4 glow-text">MYTHICAL GLORY</h2>
              <p className="text-sm text-gray-300 mb-8">
                Faster. Safer. Smarter.<br/>
                We handle the grind,<br/>
                you enjoy the rank.
              </p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_15px_rgba(166,255,0,0.3)] hover:scale-[1.02]">
                ORDER VIA WHATSAPP
                <span className="text-[10px] font-normal block absolute mt-8">FAST RESPONSE</span>
              </a>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5 text-center">
          <div><h4 className="text-4xl font-black text-primary mb-1">1,250+</h4><p className="text-xs text-gray-400 uppercase tracking-wider">Completed Orders</p></div>
          <div><h4 className="text-4xl font-black text-primary mb-1">98.7%</h4><p className="text-xs text-gray-400 uppercase tracking-wider">Customer Satisfaction</p></div>
          <div><h4 className="text-4xl font-black text-primary mb-1">24/7</h4><p className="text-xs text-gray-400 uppercase tracking-wider">Fast Support</p></div>
          <div><h4 className="text-4xl font-black text-primary mb-1">48</h4><p className="text-xs text-gray-400 uppercase tracking-wider">Verified Pro Players</p></div>
        </section>

        {/* DYNAMIC PACKAGES SECTION */}
        <section className="flex flex-col items-center">
          <p className="text-primary text-sm font-bold tracking-[0.2em] mb-2 uppercase">Our Boosting Packages</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-12 text-center">
            Choose Your Boost
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {displayPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`glass-panel p-6 rounded-2xl flex flex-col items-center text-center relative ${
                  pkg.is_popular 
                    ? 'border-primary/50 shadow-[0_0_30px_rgba(166,255,0,0.15)] transform md:-translate-y-4' 
                    : 'hover-glow'
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-black text-white italic mb-6">{pkg.title}</h3>
                
                <div className="w-32 h-32 mb-8 bg-white/5 rounded-full flex items-center justify-center">
                  {pkg.rank_image_url ? (
                    <img src={pkg.rank_image_url} alt={pkg.title} className="w-24 h-24 object-contain" />
                  ) : (
                    <span className="text-xs text-gray-500">Image {pkg.title}</span>
                  )}
                </div>

                <div className="w-full flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Estimasi Waktu</p>
                    <p className="text-sm font-bold">{pkg.estimated_time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Starting Price</p>
                    <p className={`font-black text-primary ${pkg.is_dynamic_price ? 'text-xl' : 'text-2xl'}`}>
                      {pkg.is_dynamic_price ? 'Custom' : `Rp ${pkg.starting_price / 1000}K`}
                    </p>
                  </div>
                </div>
                
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-full py-3 font-bold rounded-xl transition-all ${
                    pkg.is_popular 
                      ? 'bg-primary text-black hover:bg-[#b5ff2b] shadow-lg' 
                      : 'bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-black'
                  }`}
                >
                  ORDER VIA WHATSAPP
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">Note: Estimasi waktu dapat berubah tergantung kondisi akun dan antrian.</p>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="flex flex-col items-center w-full">
          <p className="text-primary text-sm font-bold tracking-[0.2em] mb-2 uppercase">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-12 text-center">
            Easy 5 Steps
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full text-center">
            {[
              { num: 1, title: "CHOOSE PACKAGE", desc: "Pilih paket boost sesuai kebutuhanmu" },
              { num: 2, title: "CONTACT US", desc: "Order via WhatsApp, kirim detail akun" },
              { num: 3, title: "LOGIN AMAN", desc: "Kami login dengan aman tanpa akses ke email" },
              { num: 4, title: "BOOSTING PROCESS", desc: "Pro player mulai push rank dengan winrate tinggi" },
              { num: 5, title: "RANK UP COMPLETE", desc: "Pantau progress live sampai rank tujuan tercapai" }
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-primary text-primary font-black text-2xl flex items-center justify-center rotate-45 mb-6">
                  <span className="-rotate-45">{step.num}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-gray-400 px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="flex flex-col items-center">
          <p className="text-primary text-sm font-bold tracking-[0.2em] mb-2 uppercase">Why Choose GXSHIFT?</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-12 text-center">
            Your Trust, Our Priority
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary text-2xl">🔒</div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Secure & Private</h4>
                <p className="text-xs text-gray-400">Akun kamu aman 100%. Kami tidak pernah meminta password email.</p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-start gap-4 border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
              <div className="p-3 bg-primary/20 rounded-xl text-primary text-2xl">🏆</div>
              <div>
                <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Verified Pro Players</h4>
                <p className="text-xs text-gray-300">Hanya player Mythical Glory ke atas dengan winrate terjamin.</p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary text-2xl">📈</div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Real-Time Tracking</h4>
                <p className="text-xs text-gray-400">Pantau progress rank dan status secara live dari WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-black/50 border-t border-white/5 pt-16 pb-8 px-4 flex flex-col items-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight text-center mb-2">
          Ready to Rank Up?
        </h2>
        <p className="text-gray-400 text-sm mb-8 text-center uppercase tracking-widest">
          Let our pros handle the grind.
        </p>
        
        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_20px_rgba(166,255,0,0.4)] hover:scale-105 mb-12">
          ORDER VIA WHATSAPP
          <span className="text-[10px] font-normal block absolute mt-10">FAST RESPONSE</span>
        </a>

        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-xs text-gray-600">
          <div className="text-xl font-black italic tracking-tighter mb-4 md:mb-0">
            <span className="text-white">GX</span><span className="text-primary">SHIFT</span><span className="text-[10px] font-normal not-italic">.com</span>
          </div>
          <p>© 2026 GXSHIFT.COM All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}