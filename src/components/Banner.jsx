import React from "react";
import { ShieldCheck, ChevronRight, Lock, Terminal } from "lucide-react";

const Banner = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden font-[Poppins]">
      {/* 1. Background Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full opacity-30" />

      {/* 2. Main Content Wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Security Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
          <ShieldCheck size={14} />
          <span>Military Grade Client-Side Encryption</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Your Data. <br />
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Your Keys.
          </span>{" "}
          Your Privacy.
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
          VaultWeb uses the{" "}
          <span className="text-white font-medium">Web Crypto API</span> to
          ensure that encryption happens exclusively in your browser. Not even
          we can see what you store.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <span className="flex items-center gap-2">
              Get Started Free{" "}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </button>

          <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all backdrop-blur-md">
            View Documentation
          </button>
        </div>

        {/* Tech Proof Footer */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-60 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-2 text-sm font-mono text-white tracking-widest">
            <Lock size={16} className="text-purple-400" /> AES-256-GCM
          </div>
          <div className="flex items-center gap-2 text-sm font-mono text-white tracking-widest">
            <Terminal size={16} className="text-blue-400" /> RSA-4096
          </div>
          <div className="flex items-center gap-2 text-sm font-mono text-white tracking-widest">
            <ShieldCheck size={16} className="text-indigo-400" /> Argon2ID
          </div>
        </div>
      </div>

      {/* 3. Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
};
export default Banner;
