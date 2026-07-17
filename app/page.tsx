import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white font-sans overflow-hidden">
      
      {/* HEADER / NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          {/* Placeholder Logo */}
          <div className="text-2xl font-black italic tracking-tighter flex items-center">
            <span className="text-white">GX</span>
            <span className="text-primary">SHIFT</span>
            <span className="text-xs text-primary font-normal not-italic ml-1 mt-3">.com</span>
          </div>
        </div>
        <Link 
          href="https://wa.me/6281234567890" 
          target="_blank"
          className="hidden md:flex items-center gap-2 border border-primary/50 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-primary/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ORDER VIA WHATSAPP
        </Link>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-24 relative z-10">
        
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 relative">
          {/* Background decoration */}
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
            
            {/* Features Row */}
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

            <div className="mt-6 border-l-2 border-primary/50 pl-4">
              <p className="text-sm text-gray-400">Starting with <span className="text-primary font-bold">Mobile Legends.</span></p>
              <p className="text-xs text-gray-600">Expanding to the complete gaming services ecosystem.</p>
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
              <Link href="https://wa.me/6281234567890" className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_15px_rgba(166,255,0,0.3)] hover:scale-[1.02]">
                ORDER VIA WHATSAPP
                <span className="text-[10px] font-normal block absolute mt-8">FAST RESPONSE</span>
              </Link>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5 text-center">
          <div>
            <h4 className="text-4xl font-black text-primary mb-1">1,250+</h4>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Completed Orders</p>
          </div>
          <div>
            <h4 className="text-4xl font-black text-primary mb-1">98.7%</h4>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Customer Satisfaction</p>
          </div>
          <div>
            <h4 className="text-4xl font-black text-primary mb-1">24/7</h4>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Fast Support</p>
          </div>
          <div>
            <h4 className="text-4xl font-black text-primary mb-1">48</h4>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Verified Pro Players</p>
          </div>
        </section>

        {/* PACKAGES SECTION */}
        <section className="flex flex-col items-center">
          <p className="text-primary text-sm font-bold tracking-[0.2em] mb-2 uppercase">Our Boosting Packages</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-12 text-center">
            Choose Your Boost
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Package 1 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover-glow relative">
              <h3 className="text-xl font-black text-white italic mb-6">EPIC TO LEGEND</h3>
              {/* Image Placeholder - Replace src with actual rank image */}
              <div className="w-32 h-32 mb-8 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs text-gray-500">Image Epic</span>
              </div>
              <div className="w-full flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                <div className="text-left">
                  <p className="text-xs text-gray-500">Estimasi Waktu</p>
                  <p className="text-sm font-bold">1-2 Days</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Starting Price</p>
                  <p className="text-xl font-black text-primary">Rp 150K</p>
                </div>
              </div>
              <Link href="https://wa.me/6281234567890" className="w-full py-3 bg-primary/10 border border-primary/50 text-primary font-bold rounded-xl hover:bg-primary hover:text-black transition-all">
                ORDER VIA WHATSAPP
              </Link>
            </div>

            {/* Package 2 (Most Popular) */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center border-primary/50 relative shadow-[0_0_30px_rgba(166,255,0,0.15)] transform md:-translate-y-4">
              <div className="absolute -top-3 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
              <h3 className="text-xl font-black text-white italic mb-6">LEGEND TO MYTHIC</h3>
              <div className="w-32 h-32 mb-8 bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-500">Image Legend</span>
              </div>
              <div className="w-full flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                <div className="text-left">
                  <p className="text-xs text-gray-500">Estimasi Waktu</p>
                  <p className="text-sm font-bold">2-3 Days</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Starting Price</p>
                  <p className="text-2xl font-black text-primary">Rp 250K</p>
                </div>
              </div>
              <Link href="https://wa.me/6281234567890" className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-lg">
                ORDER VIA WHATSAPP
              </Link>
            </div>

            {/* Package 3 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover-glow relative">
              <h3 className="text-xl font-black text-white italic mb-6">MYTHICAL GLORY</h3>
              <div className="w-32 h-32 mb-8 bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-500">Image Mythic</span>
              </div>
              <div className="w-full flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                <div className="text-left">
                  <p className="text-xs text-gray-500">Estimasi Waktu</p>
                  <p className="text-sm font-bold">Dynamic</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Starting Price</p>
                  <p className="text-xl font-black text-primary">Custom</p>
                </div>
              </div>
              <Link href="https://wa.me/6281234567890" className="w-full py-3 bg-primary/10 border border-primary/50 text-primary font-bold rounded-xl hover:bg-primary hover:text-black transition-all">
                ORDER VIA WHATSAPP
              </Link>
            </div>
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

        {/* TESTIMONIALS SECTION */}
        <section className="flex flex-col items-center mb-12">
          <p className="text-primary text-sm font-bold tracking-[0.2em] mb-2 uppercase">Player Reviews</p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-12 text-center">
            What Players Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="glass-panel p-8 rounded-2xl text-left">
              <div className="flex text-primary mb-4 text-sm">★★★★★</div>
              <p className="text-gray-300 text-sm md:text-base italic mb-6">
                "Gila cepet banget! Baru order semalem, besok sorenya udah naik dari Epic ke Legend. Dashboard trackingnya juga mempermudah banget buat pantau."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-400">B</div>
                <div>
                  <p className="text-sm font-bold text-white">Budi_Gamer</p>
                  <p className="text-xs text-primary">Epic to Legend Boost</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl text-left">
              <div className="flex text-primary mb-4 text-sm">★★★★★</div>
              <p className="text-gray-300 text-sm md:text-base italic mb-6">
                "Sempet ragu awalnya, tapi ternyata beneran pro player yang main. Win rate hero favorit gue malah naik drastis. Recommended banget buat yang stuck di tier badak!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-400">A</div>
                <div>
                  <p className="text-sm font-bold text-white">Alex_MVP</p>
                  <p className="text-xs text-primary">Legend to Mythic Boost</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER / CTA */}
      <footer className="w-full bg-black/50 border-t border-white/5 pt-16 pb-8 px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight text-center mb-2">
          Ready to Rank Up?
        </h2>
        <p className="text-gray-400 text-sm mb-8 text-center uppercase tracking-widest">
          Let our pros handle the grind.
        </p>
        
        <Link href="https://wa.me/6281234567890" className="flex items-center gap-2 px-8 py-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_20px_rgba(166,255,0,0.4)] hover:scale-105 mb-12">
          ORDER VIA WHATSAPP
          <span className="text-[10px] font-normal block absolute mt-10">FAST RESPONSE</span>
        </Link>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-xs text-gray-500 mb-16">
          <div className="flex items-center gap-2">
            <span className="text-primary">⏱️</span>
            <div><p className="font-bold text-white">FAST RESPONSE</p><p>1-5 Minutes</p></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">🛡️</span>
            <div><p className="font-bold text-white">100% SECURE</p><p>Your Account</p></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">⭐</span>
            <div><p className="font-bold text-white">SATISFACTION</p><p>Guaranteed</p></div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-xs text-gray-600">
          <div className="text-xl font-black italic tracking-tighter mb-4 md:mb-0">
            <span className="text-white">GX</span><span className="text-primary">SHIFT</span><span className="text-[10px] font-normal not-italic">.com</span>
          </div>
          <div className="flex gap-6 mb-4 md:mb-0">
            <Link href="#" className="hover:text-primary transition-colors">TERMS OF SERVICE</Link>
            <Link href="#" className="hover:text-primary transition-colors">PRIVACY POLICY</Link>
            <Link href="#" className="hover:text-primary transition-colors">REFUND POLICY</Link>
          </div>
          <p>© 2026 GXSHIFT.COM<br/>All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}