import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  ArrowUpCircle,
  Info,
  CheckCircle,
  Fingerprint,
  RefreshCcw,
   Cpu
} from "lucide-react";
import { submitSecret } from "../utilites/netUtilities";

const Upload = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    value: "",
  });
  const [status, setStatus] = useState("idle"); // idle | encrypting | uploading | success

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-[Poppins] pt-20 pb-12 px-6 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* --- HEADER --- */}
        <div className="mb-10 text-center">
          <div className="inline-flex p-4 rounded-[2rem] bg-white border border-sky-100 text-sky-600 mb-6 shadow-xl shadow-sky-200/50 group hover:rotate-12 transition-transform duration-500">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Deposit New <span className="text-sky-500">Secret</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium italic">
            Zero-knowledge architecture. Local encryption only.
          </p>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={submitSecret}
          className="relative bg-white/80 border border-sky-100 rounded-[2.5rem] p-10 backdrop-blur-2xl shadow-2xl shadow-sky-200/40 space-y-7"
        >
          {/* Status Overlay */}
          {status !== "idle" && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center rounded-[2.5rem] transition-all animate-in fade-in duration-300">
              {status === "encrypting" && (
                <div className="text-center">
                  <div className="relative w-20 h-20 mb-6 mx-auto">
                    <div className="absolute inset-0 border-4 border-sky-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
                    <Cpu
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-600"
                      size={28}
                    />
                  </div>
                  <p className="font-black text-slate-900 tracking-widest uppercase text-xs mb-2">
                    RSA-4096 Wrapping
                  </p>
                  <p className="font-mono text-sky-500 text-lg font-bold">
                    {scramble}
                  </p>
                </div>
              )}
              {status === "uploading" && (
                <div className="text-center">
                  <ArrowUpCircle
                    size={64}
                    className="text-sky-600 animate-bounce mb-4 mx-auto"
                  />
                  <p className="font-black text-slate-900 tracking-widest uppercase text-xs">
                    Transmitting Ciphertext...
                  </p>
                </div>
              )}
              {status === "success" && (
                <div className="text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-100">
                    <CheckCircle size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
                    Vault Secured
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Secret added to your encrypted registry.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 flex items-center gap-2 mx-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-600 transition-all active:scale-95"
                  >
                    <RefreshCcw size={14} /> Deposit Another
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">
              Secret Identifier
            </label>
            <input
              required
              type="text"
              placeholder="e.g. AWS Production Key"
              className="w-full bg-slate-50 border border-sky-100 rounded-2xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">
              Access Category
            </label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-sky-100 rounded-2xl px-5 py-4 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all appearance-none cursor-pointer">
                <option>Infrastructure</option>
                <option>Finance</option>
                <option>Internal Keys</option>
                <option>General</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sky-400">
                ▼
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
              Secret Value
            </label>
            <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">
              Sensitive Payload
            </label>
            <textarea
              required
              rows="5"
              placeholder="Paste your private key, password, or secret blob here..."
              className="w-full bg-slate-50 border border-sky-100 rounded-3xl px-6 py-5 text-slate-900 font-mono text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all resize-none placeholder:text-slate-300"
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
            />
            <div className="mt-3 flex items-start gap-2 text-slate-500 bg-white/5 p-3 rounded-lg">
              <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
              <p className="text-[10px] leading-relaxed italic">
                Your input is handled by the **Web Crypto API**. Plaintext never
                touches our servers.
              </p>
            </div>
            {/* Security Info Box */}
            <div className="mt-5 flex items-start gap-4 text-sky-800 bg-sky-50/50 border border-sky-100 p-5 rounded-2xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Fingerprint size={18} className="text-sky-600" />
              </div>
              <p className="text-[11px] leading-relaxed font-medium">
                Your input is processed via{" "}
                <span className="font-black text-sky-700">AES-256-GCM</span>{" "}
                within a secure window.crypto context. No unencrypted data is
                ever transmitted or stored on our infrastructure.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-cyan-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-sky-200 hover:shadow-sky-300 transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            <ShieldCheck
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            Securely Upload to Vault
          </button>
        </form>
      </div>
      {/* --- BOTTOM SECURITY BADGES --- */}
      <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <ShieldCheck size={14} /> FIPS 140-2 Compliant
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <Lock size={14} /> Zero Knowledge
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <Cpu size={14} /> Client-Side Only
        </div>
      </div>
    </div>
  );
};

export default Upload;
