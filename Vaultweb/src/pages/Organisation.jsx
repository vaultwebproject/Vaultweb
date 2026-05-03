import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, Settings, Users, Key, 
  Globe, Copy, ShieldAlert, Server, Zap, Loader2, Check
} from 'lucide-react';

import { retrieveUserInfo } from "../utilites/netUtilities"; 

const Organization = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [userRole, setUserRole] = useState('Member');

  useEffect(() => {
    const initializeOrgPage = async () => {
      const currentUserID = localStorage.getItem("vault_user_id") || "default_id";
      
      try {
        const response = await retrieveUserInfo(currentUserID);
        
        if (response.success) {
          const user = response.result.user;
          setOrgData({
            name: user.org?.name || "Unknown Organization",
            id: user.org?.id || "N/A",
            tier: "Enterprise", 
            region: "AU-South (Swinburne Node)",
            publicKey: "rsa-4096-7b2...vault_api_key_99af", 
            shardCount: 1242
          });
          setUserRole(user.role || 'Member');
        }
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeOrgPage();
  }, []);

  const copyToClipboard = () => {
    if (orgData?.id) {
      navigator.clipboard.writeText(orgData.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-sky-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black tracking-widest uppercase text-xs">Decrypting Org Environment...</p>
      </div>
    );
  }

  return (
    /* Amy's Theme Fix: Ensure the parent container supports the background color */
    <div className="min-h-screen bg-transparent text-slate-800 font-[Poppins] pt-12 pb-12 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white border border-sky-100 rounded-[1.5rem] flex items-center justify-center text-sky-600 shadow-xl shadow-sky-200/50">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                {orgData?.name}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2 py-0.5 bg-sky-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                  {orgData?.tier}
                </span>
                <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                  <Globe size={12} /> {orgData?.region}
                </span>
              </div>
            </div>
          </div>
          
          {/* RBAC Logic: Only visible to Admins */}
          {userRole === 'Admin' && (
            <button className="flex items-center gap-2 bg-white border border-sky-100 hover:border-sky-300 px-6 py-3 rounded-2xl font-bold text-sm text-slate-600 transition-all shadow-sm active:scale-95">
              <Settings size={18} /> Edit Settings
            </button>
          )}
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Security Infrastructure Card */}
            <div className="bg-white/80 border border-sky-100 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl shadow-sky-200/30">
              <h3 className="text-[10px] font-black text-sky-900/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <ShieldCheck size={14} className="text-sky-500" /> Security Infrastructure
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-sky-50/50 border border-sky-100 rounded-2xl">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Organization ID</p>
                    <p className="font-mono text-sm font-bold text-slate-700">{orgData?.id}</p>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-2.5 hover:bg-white rounded-xl text-sky-600 transition-all shadow-sm"
                  >
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-5 bg-sky-50/50 border border-sky-100 rounded-2xl">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-sky-600 shrink-0">
                      <Key size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Master Public Key</p>
                      <p className="font-mono text-xs text-sky-700 truncate">{orgData?.publicKey}</p>
                    </div>
                  </div>
                  <span className="hidden md:inline text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shrink-0">Verified</span>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 border border-sky-100 p-6 rounded-[2rem] hover:shadow-lg hover:shadow-sky-100 transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-4 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <h4 className="font-bold text-slate-900">Manage Invitations</h4>
                <p className="text-xs text-slate-500 mt-1">Provision or revoke team access keys.</p>
              </div>
              
              <div className="bg-white/60 border border-sky-100 p-6 rounded-[2rem] hover:shadow-lg hover:shadow-sky-100 transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-4 group-hover:scale-110 transition-transform">
                  <Server size={24} />
                </div>
                <h4 className="font-bold text-slate-900">Log Forwarding</h4>
                <p className="text-xs text-slate-500 mt-1">Audit vault activity via external SIEM.</p>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-sky-900/20 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full group-hover:bg-sky-500/40 transition-all duration-700" />
              
              <h3 className="text-[10px] font-black text-sky-400/60 uppercase tracking-[0.3em] mb-8">System Health</h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold flex items-center gap-2">
                      <Zap size={14} className="text-sky-400" /> Crypto Engine
                    </span>
                    <span className="text-xs font-mono text-emerald-400">Optimal</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Shards</p>
                  <p className="text-3xl font-black text-white">{orgData?.shardCount.toLocaleString()}</p>
                </div>

                <div className="flex items-start gap-3 text-sky-200/40 text-[10px] leading-relaxed">
                  <ShieldAlert size={14} className="shrink-0 text-amber-400" />
                  <p>Next key rotation scheduled in <span className="text-sky-400 font-bold">14 days</span>.</p>
                </div>
              </div>
            </div>

            <div className="bg-sky-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-sky-200">
               <h4 className="font-black text-xl tracking-tighter mb-2">Audit Support</h4>
               <p className="text-sky-100 text-xs leading-relaxed mb-6">Forensic shard recovery requires valid Admin signature.</p>
               <button className="w-full py-3 bg-white text-sky-600 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:shadow-lg transition-all active:scale-95">
                  Contact Specialist
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;