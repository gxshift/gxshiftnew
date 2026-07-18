'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Star, Activity, ChevronDown, CheckCircle2, Zap } from 'lucide-react';
import PackageCarousel from '@/components/ui/PackageCarousel';
import { Level, Faq, Testimonial } from '@/types';

interface LandingContentProps {
  levels: Level[];
  faqs: Faq[];
  testimonials: Testimonial[];
  whatsappNumber: string;
}

export default function LandingContent({ levels, faqs, testimonials, whatsappNumber }: LandingContentProps) {
  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const formatWaLink = () => `https://wa.me/${whatsappNumber}`;

  return (
    <div className="relative w-full overflow-hidden">
      
      {/* HERO SECTION DENGAN PARALLAX */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 px-4 sm:px-6 z-10">
        <motion.div 
          style={{ y: yHeroBg, opacity: opacityHero }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {/* Background Grid & Glow (AAA Style) */}
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center opacity-10" />
        </motion.div>

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col gap-6 text-center lg:text-left"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black uppercase tracking-tighter leading-[0.85]">
              Rank Up.<br/>
              <span className="text-primary glow-text drop-shadow-[0_0_30px_rgba(166,255,0,0.4)]">Dominate.</span><br/>
              Be Legendary.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
              Professional <strong className="text-white font-bold">Mobile Legends</strong> Rank Boosting by Verified Pro Players. Secure, Fast, and Reliable.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start"
            >
              <a 
                href={formatWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_25px_rgba(166,255,0,0.4)] hover:scale-105 hover:shadow-[0_0_40px_rgba(166,255,0,0.6)] w-full sm:w-auto text-center"
              >
                ORDER VIA WHATSAPP
              </a>
              <a 
                href="#packages"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all w-full sm:w-auto text-center backdrop-blur-sm"
              >
                LIHAT PAKET
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-md perspective-1000"
          >
            {/* KARTU TARGET ACHIEVED YANG SUDAH DIROMBAK */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary/30 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu hover:rotate-y-[-5deg] hover:rotate-x-[5deg] transition-all duration-500">
              
              {/* Efek Glow Latar Belakang */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[60px] group-hover:bg-primary/40 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10 gap-2">
                
                {/* SISI KIRI (Teks & List) */}
                <div className="flex-1">
                  <h3 className="text-xs text-primary font-bold mb-2 tracking-[0.3em] uppercase">Target Achieved</h3>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 uppercase tracking-tight leading-none">MYTHICAL<br/>GLORY</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                      <CheckCircle2 size={16} className="text-primary shrink-0"/> 100% Safe Account
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                      <CheckCircle2 size={16} className="text-primary shrink-0"/> Verified Pro Players
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                      <CheckCircle2 size={16} className="text-primary shrink-0"/> Live Progress Tracking
                    </div>
                  </div>
                </div>

                {/* SISI KANAN (Gambar Myhical Glory) */}
                <div className="w-[110px] sm:w-[140px] shrink-0 relative z-10 flex justify-end">
                  <img
                    src="/mytical-glory.png"
                    alt="Mythical Glory Rank"
                    className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(166,255,0,0.3)] transform transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-6 group-hover:drop-shadow-[0_0_35px_rgba(166,255,0,0.6)]"
                  />
                </div>
              </div>

              {/* WIN RATE BAR */}
              <div className="w-full bg-black/60 p-4 rounded-xl border border-white/5 flex justify-between items-center relative overflow-hidden mt-2 z-10">
                <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-[85.4%] shadow-[0_0_10px_rgba(166,255,0,1)]"></div>
                <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Win Rate</span>
                <span className="text-xl font-black text-primary glow-text">85.4%</span>
              </div>
              
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative z-20 border-y border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {[
              { icon: Activity, value: "2,500+", label: "Completed Orders" },
              { icon: Star, value: "99.8%", label: "Satisfaction Rate" },
              { icon: Shield, value: "100%", label: "Safe & Secure" },
              { icon: Zap, value: "24/7", label: "Active Pro Players" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center px-4"
              >
                <stat.icon className="w-6 h-6 text-primary mb-4 opacity-50" />
                <h4 className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</h4>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR BOOST (CAROUSEL) */}
      <section id="packages" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 text-center">
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-primary text-sm font-bold tracking-[0.2em] mb-2 uppercase"
          >
            Select Service
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight"
          >
            Choose Your Boost
          </motion.h2>
        </div>
        
        <PackageCarousel levels={levels} whatsappNumber={whatsappNumber} />
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-black/30 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Easy 5 Steps</h2>
            <p className="text-gray-400 mt-4 text-sm tracking-widest uppercase">From zero to hero in no time</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { title: "PILIH GAME", desc: "Pilih game kompetitif yang ingin kamu mainkan." },
              { title: "PILIH PAKET & LEVEL", desc: "Tentukan paket dan level target boost kamu." },
              { title: "PESAN VIA WHATSAPP", desc: "Kirim detail pesanan langsung ke WhatsApp admin." },
              { title: "PEMBAYARAN", desc: "Selesaikan transaksi melalui metode pembayaran aman." },
              { title: "GRINDING RANKING", desc: "Duduk manis, pro player kami akan selesaikan targetmu." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center relative group"
              >
                <div className="w-16 h-16 bg-black border-2 border-primary/30 group-hover:border-primary text-primary font-black text-2xl flex items-center justify-center rotate-45 mb-8 transition-colors shadow-[0_0_20px_rgba(166,255,0,0)] group-hover:shadow-[0_0_20px_rgba(166,255,0,0.3)]">
                  <span className="-rotate-45">{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2 uppercase">{step.title}</h4>
                <p className="text-[10px] text-gray-400 px-2 leading-relaxed">{step.desc}</p>
                
                {idx < 4 && (
                  <div className="hidden md:block absolute top-8 right-[-50%] w-full h-px bg-linear-to-r from-primary/50 to-transparent -z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Verified Reviews</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((testi, idx) => (
                <motion.div 
                  key={testi.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-8 rounded-2xl relative"
                >
                  <div className="flex text-primary mb-4 text-sm gap-1">
                    {[...Array(testi.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">"{testi.review}"</p>
                  <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      {testi.customer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase">{testi.customer_name}</p>
                      <p className="text-[10px] text-primary uppercase">{testi.game_purchased}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-24 bg-black/40 border-y border-white/5 relative z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">FAQ</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div 
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel rounded-xl overflow-hidden border border-white/5"
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold text-sm text-white">{faq.question}</span>
                    <ChevronDown className={`text-primary transition-transform duration-300 ${activeFaq === faq.id ? 'rotate-180' : ''}`} size={20} />
                  </button>
                  <motion.div 
                    initial={false}
                    animate={{ height: activeFaq === faq.id ? 'auto' : 0, opacity: activeFaq === faq.id ? 1 : 0 }}
                    className="overflow-hidden bg-black/20"
                  >
                    <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}