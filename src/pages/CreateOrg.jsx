import React, { useState } from "react";
import {
  Building2,
  Key,
  ShieldAlert,
  CheckCircle2,
  Download,
} from "lucide-react";

const CreateOrganisation = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // This would trigger your window.crypto logic
  const handleGenerateKeys = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 3000); // Mock generation time
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-[Poppins]">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b0764_0%,transparent_50%)] opacity-30" />

      <div className="relative w-full max-w-xl bg-slate-900/50 border border-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
        {/* Step Indicator */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-slate-800 text-slate-500"}`}
            >
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
          ))}
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              Establish Organization
            </h2>
            <p className="text-slate-400 mb-8">
              Set up your workspace and root administrator account.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Org Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. VaultCorp Industries"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  placeholder="admin@vaultweb.com"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-white text-black py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform active:scale-95"
              >
                Continue to Key Generation
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Crypto Generation */}
        {step === 2 && (
          <div className="text-center py-8 animate-in zoom-in-95">
            <div className="relative inline-block mb-6">
              <div
                className={`absolute inset-0 bg-purple-500 blur-2xl opacity-20 ${isGenerating ? "animate-pulse" : ""}`}
              />
              <Key
                size={64}
                className={`relative ${isGenerating ? "text-purple-400 animate-bounce" : "text-slate-700"}`}
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Cryptographic Setup
            </h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              We are generating your unique **RSA-4096** master key pair locally
              in your browser.
            </p>

            {!isGenerating ? (
              <button
                onClick={handleGenerateKeys}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-900/40 transition-all"
              >
                Generate Master Keys
              </button>
            ) : (
              <div className="w-full max-w-xs mx-auto bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 animate-[progress_3s_ease-in-out]"
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Emergency Kit */}
        {step === 3 && (
          <div className="animate-in fade-in scale-95">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-4 mb-8">
              <ShieldAlert className="text-amber-500 shrink-0" />
              <p className="text-sm text-amber-200/80 leading-relaxed">
                <span className="font-bold text-amber-500">Critical:</span> We
                do not store your private keys. If you lose this device or clear
                your browser data, you must have your recovery kit to access
                your vault.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">
              Security Initialized
            </h2>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between bg-slate-950 border border-white/10 p-4 rounded-xl group hover:border-purple-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Download size={20} className="text-purple-400" />
                  <span className="text-sm font-medium">
                    Download Emergency PDF
                  </span>
                </div>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded font-bold uppercase">
                  Required
                </span>
              </button>

              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold shadow-xl shadow-purple-900/20 hover:opacity-90 transition-opacity">
                Finalize & Enter Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrganisation;
