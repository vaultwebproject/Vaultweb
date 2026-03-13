import React, { useState } from "react";
import { Lock, Eye, EyeOff, Search, Plus, Trash2, Copy, ShieldCheck, ChevronRight } from "lucide-react";

const MyVault = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [decryptedId, setDecryptedId] = useState(null);

  // Mock Data
  const vaultItems = [
    { id: 1, name: "Database Production", category: "Infrastructure", value: "db_prod_9921_xX", date: "2024-05-10" },
    { id: 2, name: "Stripe API Key", category: "Finance", value: "sk_live_51Mh...", date: "2024-05-12" },
    { id: 3, name: "Admin Panel Password", category: "Internal", value: "Admin!@#2024", date: "2024-05-15" },
  ];

  const toggleDecrypt = (id) => {
    setDecryptedId(decryptedId === id ? null : id);
  };

  return (
    // bg-transparent allows the App.jsx background glows to show through
    <div className="min-h-screen bg-transparent text-slate-800 font-[Poppins] pt-12 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              <ShieldCheck size={14} />
              Session Verified
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Personal <span className="text-sky-500">Vault</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-sky-500 transition-colors" />
              <input
                type="text"
                placeholder="Search secrets..."
                className="bg-white border border-sky-100 rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-300 outline-none w-72 transition-all shadow-sm shadow-sky-100"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-sky-200 active:scale-95">
              <Plus size={18} /> New Secret
            </button>
          </div>
        </div>

        {/* --- VAULT TABLE CARD --- */}
        <div className="bg-white/80 border border-sky-100 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl shadow-sky-200/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/50 border-b border-sky-100">
                  <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Secret Name</th>
                  <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Last Modified</th>
                  <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em] text-right">Encrypted Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {vaultItems
                  .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-sky-50/40 transition-colors group">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 border border-sky-200">
                            <Lock size={18} />
                          </div>
                          <span className="font-bold text-slate-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <span className="px-3 py-1 bg-white border border-sky-100 rounded-lg text-[10px] font-black text-sky-600 uppercase tracking-tighter">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-10 py-7 text-sm text-slate-400 font-medium italic">
                        {item.date}
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center justify-end gap-4">
                          {/* Value Display */}
                          <div
                            className={`px-5 py-2.5 rounded-xl font-mono text-sm transition-all duration-500 border ${
                              decryptedId === item.id 
                                ? "bg-sky-50 border-sky-200 text-sky-700 shadow-inner" 
                                : "bg-slate-50 border-slate-100 text-slate-300 blur-[3px] select-none"
                            }`}
                          >
                            {decryptedId === item.id ? item.value : "••••••••••••"}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button className="p-2.5 hover:bg-sky-100 rounded-lg text-slate-400 hover:text-sky-600 transition-all">
                              <Copy size={18} />
                            </button>
                            <button
                              onClick={() => toggleDecrypt(item.id)}
                              className={`p-2.5 rounded-lg transition-all ${
                                decryptedId === item.id ? "bg-sky-600 text-white" : "hover:bg-sky-100 text-slate-400 hover:text-sky-600"
                              }`}
                            >
                              {decryptedId === item.id ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button className="p-2.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {vaultItems.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-100">
                <Lock size={24} className="text-sky-200" />
              </div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                No Secrets Found
              </p>
            </div>
          )}
        </div>

        {/* --- SECURITY FOOTER --- */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black text-sky-900/20 uppercase tracking-[0.2em]">
          <span>Web Crypto API</span>
          <div className="w-1 h-1 rounded-full bg-sky-200" />
          <span>Local Decryption Only</span>
          <div className="w-1 h-1 rounded-full bg-sky-200" />
          <span>Zero Knowledge Architecture</span>
        </div>
      </div>
    </div>
  );
};

export default MyVault;