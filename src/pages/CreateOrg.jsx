import React, { useState } from "react";
import {
  Building2,
  Key,
  ShieldAlert,
  CheckCircle2,
  Download,
  ArrowRight,
  ShieldCheck,
  Cpu
} from "lucide-react";

const CreateOrganisation = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateKeys = () => {
    setIsGenerating(true);
    // Logic: In your real app, this triggers window.crypto.subtle.generateKey
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 font-[Poppins] relative z-10">
      
      {/* Container Card - Glassmorphism Light Mode */}
      <div className="relative w-full max-w-xl bg-white/80 border border-sky-100 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl shadow-sky-200/40 overflow-hidden">
        
        {/* Decorative Grid Overlay (Internal) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

        {/* --- STEP INDICATOR --- */}
        <div className="flex justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-sky-100 -translate-y-1/2" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`relative z-10 w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black transition-all duration-700 ${
                step >= s 
                ? "bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-200" 
                : "bg-white border-sky-100 text-sky-200"
              }`}
            >
              {step > s ? <CheckCircle2 size={22} /> : s}
              
              {/* Tooltip-style Label */}
              <span className={`absolute -bottom-7 text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${step === s ? "text-sky-600" : "text-slate-300"}`}>
                {s === 1 ? "Identity" : s === 2 ? "Security" : "Recovery"}
              </span>
            </div>
          ))}
        </div>

        {/* --- STEP 1: IDENTITY --- */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-sky-100 rounded-lg text-sky-600"><Building2 size={20}/></div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Establish Org</h2>
            </div>
            <p className="text-slate-500 mb-8 text-sm">Set up your workspace and root administrator account.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-widest">Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. SkyVault Industries"
                  className="w-full bg-slate-50 border border-sky-100 rounded-2xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-widest">Admin Email</label>
                <input
                  type="email"
                  placeholder="admin@skyvault.com"
                  className="w-full bg-slate-50 border border-sky-100 rounded-2xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-sky-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 flex items-center justify-center gap-2 group"
              >
                Setup Security <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: CRYPTO GENERATION --- */}
        {step === 2 && (
          <div className="text-center py-6 animate-in zoom-in-95 duration-500">
            <div className="relative inline-block mb-8">
              {/* Spinning Aura */}
              <div className={`absolute -inset-4 bg-sky-400/20 blur-2xl rounded-full ${isGenerating ? "animate-spin-slow opacity-100" : "opacity-0"}`} />
              <div className="relative w-20 h-20 bg-white border border-sky-100 rounded-3xl flex items-center justify-center shadow-xl shadow-sky-200/50">
                <Cpu size={40} className={isGenerating ? "text-sky-600 animate-pulse" : "text-sky-200"} />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">Cryptographic Setup</h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto text-sm leading-relaxed">
              We are generating your unique <span className="text-sky-600 font-bold underline decoration-sky-200">RSA-4096</span> master key pair locally. This process stays entirely within your browser.
            </p>

            {!isGenerating ? (
              <button
                onClick={handleGenerateKeys}
                className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-sky-200 transition-all flex items-center gap-3 mx-auto"
              >
                <Key size={18} /> Generate Master Keys
              </button>
            ) : (
              <div className="space-y-4">
                <div className="w-full max-w-xs mx-auto bg-sky-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 transition-all duration-[3000ms] ease-out" style={{ width: "100%" }} />
                </div>
                <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] animate-pulse">Entropy Gathering...</p>
              </div>
            )}
          </div>
        )}

        {/* --- STEP 3: EMERGENCY KIT --- */}
        {step === 3 && (
          <div className="animate-in fade-in scale-95 duration-500">
            <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl flex items-start gap-4 mb-8">
              <ShieldAlert className="text-sky-600 shrink-0" />
              <p className="text-xs text-sky-900/60 leading-relaxed font-medium">
                <span className="font-black text-sky-700 uppercase">Critical Warning:</span> We do not store your private keys. You must save your recovery kit to access your vault on other devices.
              </p>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter">Security Initialized</h2>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between bg-white border border-sky-100 p-5 rounded-2xl group hover:border-sky-400 hover:shadow-lg hover:shadow-sky-100 transition-all text-left">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-50 rounded-xl text-sky-600"><Download size={22} /></div>
                  <div>
                     <span className="block text-sm font-bold text-slate-900">Download Emergency Kit</span>
                     <span className="text-[10px] text-slate-400 font-medium">Key_Recovery_SkyVault.pdf</span>
                  </div>
                </div>
                <span className="text-[9px] bg-sky-100 text-sky-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">Required</span>
              </button>

              <button className="w-full mt-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-sky-200 hover:shadow-sky-300 transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={20} /> Finalize & Enter Vault
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Small Security Badge below card */}
      <div className="absolute bottom-10 flex items-center gap-2 text-sky-900/20 font-black text-[9px] uppercase tracking-widest">
         <Cpu size={12} /> Hardware-Accelerated Local Encryption
      </div>
    </div>
  );
};

export default CreateOrganisation;