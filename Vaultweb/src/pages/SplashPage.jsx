import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Cpu, Globe } from 'lucide-react';

const SplashPage = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Environment");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) setStatus("Generating RSA-4096 Pairs...");
        else if (prev < 60) setStatus("Syncing Encrypted Shards...");
        else if (prev < 90) setStatus("Verifying Session Integrity...");
        else setStatus("Environment Ready");
        
        return prev < 100 ? prev + 1 : 100;
      });
    }, 30); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-sky-50 overflow-hidden font-[Poppins]">
      
      {/* 1. AMBIENT BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none">
        {/* The Blueprint Grid */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Soft Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/40 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/40 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* 2. THE CENTRAL CORE (Icon) */}
        <div className="relative mb-12">
          {/* Outer Ripple Effects */}
          <div className="absolute inset-0 bg-sky-400/20 rounded-[2.5rem] blur-2xl animate-ping opacity-20" />
          
          <div className="relative p-8 rounded-[2.5rem] bg-white border border-sky-100 shadow-2xl shadow-sky-200/50 flex items-center justify-center group hover:scale-105 transition-transform duration-500">
            <ShieldCheck className="w-16 h-16 text-sky-600 animate-in zoom-in duration-1000" />
            
            {/* Pulsing Lock Badge */}
            <div className="absolute -bottom-2 -right-2 bg-sky-600 p-2.5 rounded-2xl shadow-lg border-4 border-white animate-bounce">
              <Lock size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* 3. BRANDING & STATUS */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">
            VAULT<span className="text-sky-500">WEB</span>
          </h1>
          <div className="flex items-center gap-3 justify-center">
            <Cpu size={14} className="text-sky-400 animate-pulse" />
            <p className="text-sky-800/60 text-[10px] font-black uppercase tracking-[0.4em]">
              {status}
            </p>
          </div>
        </div>

        {/* 4. PROGRESS ARCHITECTURE */}
        <div className="w-80 px-6">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Globe size={10} /> Node_Localhost_01
            </span>
            <span className="text-[12px] font-mono font-black text-sky-600">
              {progress}%
            </span>
          </div>
          
          {/* Progress Bar Container */}
          <div className="h-2 w-full bg-white border border-sky-100 rounded-full overflow-hidden p-[3px] shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(14,165,233,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5. FOOTER COMPLIANCE */}
      <div className="absolute bottom-12 flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/50 border border-white backdrop-blur-md shadow-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex gap-4">
          <span>AES-256-GCM</span>
          <span className="text-slate-200">|</span>
          <span>Zero-Knowledge</span>
        </span>
      </div>
    </div>
  );
};

export default SplashPage;