import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowUpCircle, Info, CheckCircle } from 'lucide-react';
import { submitSecret } from '../utilites/netUtilities';

const Upload = () => {
  const [formData, setFormData] = useState({ name: '', value: '' });
  const [status, setStatus] = useState('idle'); // idle | encrypting | uploading | success
  const userInfo = useContext(UserProvider);
  const [iv, setIV] = useState(new Uint8Array(12));

  function arrayBufferToBase64(buffer) {
      const bytes = new Uint8Array(buffer);
      return btoa(String.fromCharCode(...bytes));
  }

  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async function sendToVault() {
    setIV(window.crypto.getRandomValues(new Uint8Array(12)))
    submitSecret(userInfo.userKey, formData.value, userInfo.uuID, vaultID, formData.name, iv);
  }


  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-[Poppins] pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Deposit New Secret</h1>
          <p className="text-slate-400 mt-2">Data is encrypted locally before leaving your device.</p>
        </div>

        {/* Upload Form */}
        <form onSubmit={submitSecret} className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          
          {/* Status Overlay */}
          {status !== 'idle' && (
            <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl transition-all">
              {status === 'encrypting' && (
                <>
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-bold text-white tracking-widest uppercase text-xs">Performing RSA Encryption...</p>
                </>
              )}
              {status === 'uploading' && (
                <>
                  <ArrowUpCircle size={48} className="text-blue-500 animate-bounce mb-4" />
                  <p className="font-bold text-white tracking-widest uppercase text-xs">Transmitting Ciphertext...</p>
                </>
              )}
              {status === 'success' && (
                <div className="text-center animate-in zoom-in-95">
                  <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">Upload Secured</h3>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-purple-400 text-sm font-bold uppercase hover:underline">Deposit Another</button>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Secret Identifier</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Production Database Password" 
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Secret Value</label>
            <textarea 
              required
              rows="4"
              placeholder="Paste sensitive data here..." 
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none"
              onChange={(e) => setFormData({...formData, value: e.target.value})}
            />
            <div className="mt-3 flex items-start gap-2 text-slate-500 bg-white/5 p-3 rounded-lg">
              <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
              <p className="text-[10px] leading-relaxed italic">
                Your input is handled by the **Web Crypto API**. Plaintext never touches our servers.
              </p>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold shadow-xl shadow-purple-900/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Lock size={18} /> Securely Upload to Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;