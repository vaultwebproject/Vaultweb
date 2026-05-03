import React, { useState, useContext } from 'react';
import { ShieldCheck, Lock, ArrowUpCircle, CheckCircle } from 'lucide-react';
import { submitSecret } from '../utilites/netUtilities';
import { UserContext } from '../UserContext';

const Upload = () => {
  const [formData, setFormData] = useState({ name: '', value: '', vaultId: '' });
  const [status, setStatus] = useState('idle'); // idle | encrypting | uploading | success
  const { userKey, uuID } = useContext(UserContext);

  async function sendToVault(e) {
    e.preventDefault();
    setStatus('encrypting');
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    try {
      await submitSecret(userKey, formData.value, uuID, formData.vaultId, formData.name, iv);
      setStatus('success');
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-[Poppins] pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-sky-100 border border-sky-200 text-sky-600 mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Deposit New Secret</h1>
          <p className="text-slate-500 mt-2">Data is encrypted locally before leaving your device.</p>
        </div>

        {/* Upload Form */}
        <form onSubmit={sendToVault} className="relative bg-white/80 border border-sky-100 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl shadow-sky-200/40 space-y-6">
          
          {/* Status Overlay */}
          {status !== 'idle' && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2.5rem] transition-all">
              {status === 'encrypting' && (
                <>
                  <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-bold text-slate-900 tracking-widest uppercase text-xs">Performing AES Encryption...</p>
                </>
              )}
              {status === 'uploading' && (
                <>
                  <ArrowUpCircle size={48} className="text-sky-500 animate-bounce mb-4" />
                  <p className="font-bold text-slate-900 tracking-widest uppercase text-xs">Transmitting Ciphertext...</p>
                </>
              )}
              {status === 'success' && (
                <div className="text-center animate-in zoom-in-95">
                  <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">Upload Secured</h3>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-sky-600 text-sm font-bold uppercase hover:underline">Deposit Another</button>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">Vault ID</label>
            <input 
              required
              type="text" 
              placeholder="Enter vault ID" 
              className="w-full bg-slate-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
              value={formData.vaultId}
              onChange={(e) => setFormData({...formData, vaultId: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">Secret Identifier</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Production Database Password" 
              className="w-full bg-slate-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">Secret Value</label>
            <textarea 
              required
              rows="4"
              placeholder="Paste sensitive data here..." 
              className="w-full bg-slate-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-900 font-mono text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all resize-none placeholder:text-slate-300"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
            />
            <div className="mt-3 flex items-start gap-2 text-slate-500 bg-sky-50 p-3 rounded-lg">
              <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
              <p className="text-[10px] leading-relaxed italic">
                Your input is handled by the **Web Crypto API**. Plaintext never touches our servers.
              </p>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-sky-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <Lock size={18} /> Securely Upload to Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
