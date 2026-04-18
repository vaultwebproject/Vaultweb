import React from "react";
import { ShieldCheck, ChevronRight, Lock, Terminal } from "lucide-react";

const Banner = () => {
  return (
    // relative and z-10 ensure it floats cleanly on top of the App.jsx background glows.
    // min-h-[90vh] gives a hero feel while allowing the footer to be visible.
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden font-[Poppins] bg-transparent pt-12 pb-16">
      
      {/* 1. SECTION-SPECIFIC AMBIENCE (Soft Sky Glows) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* Central bright sky-200/50 flare */}
        <div className="w-[700px] h-[500px] bg-sky-200/50 blur-[130px] rounded-full opacity-60" />
      </div>

      {/* 2. Main Content Wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-in fade-in-up duration-1000">
        
        {/* Security Badge - Transitioned to Sky-100 base */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-100/70 border border-sky-200 text-sky-700 text-xs font-black tracking-wider uppercase mb-8 shadow-sm shadow-sky-200/30">
          <ShieldCheck size={15} className="text-sky-600" />
          <span>Military Grade Client-Side Encryption</span>
        </div>

        {/* Headline - Transitioned to Slate-900 (Navy) with Sky Gradient */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-950 mb-6 tracking-tight leading-[1.05] animate-fade-in-down duration-1000">
          Your Data. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 animate-gradient-slow bg-[size:200%]">
            Your Keys.
          </span>{" "}
          Your Privacy.
        </h1>

        {/* Sub-headline - Transitions to Slate-600/700 for better light mode contrast */}
        <p className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl mb-12 leading-relaxed">
          VaultWeb leverages the modern{" "}
          <span className="text-slate-900 font-semibold bg-sky-100 px-1 rounded">Web Crypto API</span> to
          ensure that all encryption happens exclusively in your browser. Not even
          we can access what you store.
        </p>

        {/* CTAs - Light Blue Theme Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          {/* Primary CTA: Solid Sky Blue with Shadow */}
          <button className="group relative w-full sm:w-auto px-10 py-4 bg-sky-600 text-white rounded-full font-bold transition-all hover:scale-105 hover:bg-sky-700 active:scale-95 shadow-xl shadow-sky-200 hover:shadow-sky-300">
            <span className="flex items-center gap-2">
              Get Started Free{" "}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </span>
          </button>

          {/* Secondary CTA: Translucent Sky with Sky Text */}
          <button className="w-full sm:w-auto px-10 py-4 bg-white/70 text-sky-700 border border-sky-200 rounded-full font-bold hover:bg-sky-100/70 transition-all backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-sky-100">
            View Documentation
          </button>
        </div>

        {/* Tech Proof Footer - Swapped colors for light mode visibility */}
        <div className="mt-24 pt-12 border-t border-sky-100 flex flex-wrap justify-center gap-10 opacity-70 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-2.5 text-xs md:text-sm font-mono text-slate-700 tracking-wider">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center">
              <Lock size={18} className="text-sky-600" /> 
            </div>
            <span>AES-256-GCM</span>
          </div>
          
          <div className="flex items-center gap-2.5 text-xs md:text-sm font-mono text-slate-700 tracking-wider">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center">
              <Terminal size={18} className="text-cyan-600" /> 
            </div>
            <span>RSA-4096</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs md:text-sm font-mono text-slate-700 tracking-wider">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center">
              <ShieldCheck size={18} className="text-sky-600" /> 
            </div>
            <span>Argon2ID</span>
          </div>
        </div>
      </div>

      {/* 3. Decorative Overlays - Replaced 'noise' with ' blueprint lines' for clean tech feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
    </div>
  );
};

export default Banner;