import React, { useState } from 'react';
import { Users, Activity, ShieldCheck, UserPlus, MoreVertical, Search, FileText, Download, Shield } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Mock Data
  const users = [
    { id: 1, name: "Sarah Connor", email: "sarah@skyvault.com", role: "Organiser", status: "Active" },
    { id: 2, name: "John Doe", email: "john@skyvault.com", role: "Member", status: "Active" },
    { id: 3, name: "Kyle Reese", email: "kyle@skyvault.com", role: "Auditor", status: "Pending" },
  ];

  const logs = [
    { id: 1, action: "Secret Decrypted", user: "John Doe", target: "AWS_PROD_KEY", time: "2 mins ago", severity: "low" },
    { id: 2, action: "User Invited", user: "Sarah Connor", target: "Kyle Reese", time: "1 hour ago", severity: "medium" },
    { id: 3, action: "Login Success", user: "John Doe", target: "N/A", time: "3 hours ago", severity: "low" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-[Poppins] pt-12 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              <Shield size={14} />
              Enterprise Administration
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              Organization <span className="text-sky-500">Admin</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm">Monitor security compliance and manage infrastructure access.</p>
          </div>
          
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-sky-200 active:scale-95 group">
            <UserPlus size={18} className="group-hover:scale-110 transition-transform" /> Add Member
          </button>
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex gap-10 border-b border-sky-100 mb-10">
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-5 text-[11px] font-black tracking-[0.2em] uppercase transition-all relative ${
                activeTab === 'users' 
                ? 'text-sky-600 border-b-2 border-sky-600' 
                : 'text-slate-400 hover:text-sky-400'
            }`}
          >
            Team Management
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`pb-5 text-[11px] font-black tracking-[0.2em] uppercase transition-all relative ${
                activeTab === 'logs' 
                ? 'text-sky-600 border-b-2 border-sky-600' 
                : 'text-slate-400 hover:text-sky-400'
            }`}
          >
            Security Audit
          </button>
        </div>

        {/* --- CONTENT AREA (Card) --- */}
        <div className="bg-white/80 border border-sky-100 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl shadow-sky-200/30">
          
          {activeTab === 'users' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-sky-50/50 border-b border-sky-100">
                      <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Member Identity</th>
                      <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Access Level</th>
                      <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-sky-50/30 transition-colors group">
                        <td className="px-10 py-7">
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[10px] text-sky-600/60 font-black uppercase tracking-widest">{user.email}</div>
                        </td>
                        <td className="px-10 py-7">
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                              user.role === 'Organiser' 
                              ? 'bg-sky-50 border-sky-200 text-sky-600' 
                              : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                            {user.status}
                          </div>
                        </td>
                        <td className="px-10 py-7 text-right">
                          <button className="p-2.5 hover:bg-sky-100 rounded-xl text-slate-400 hover:text-sky-600 transition-all">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Audit Header */}
              <div className="p-8 border-b border-sky-100 flex justify-between items-center bg-sky-50/30">
                <div className="text-[10px] font-black text-sky-700/60 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Activity size={16} className="text-sky-500" /> Real-Time Access Logs
                </div>
                <button className="flex items-center gap-2 text-[10px] text-sky-600 font-black uppercase tracking-widest hover:bg-sky-100 px-4 py-2 rounded-xl transition-all">
                  <Download size={14} /> Export CSV
                </button>
              </div>

              {/* Log List */}
              <div className="divide-y divide-sky-50">
                {logs.map((log) => (
                  <div key={log.id} className="px-10 py-6 flex items-center justify-between hover:bg-sky-50/30 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-sky-100 flex items-center justify-center text-sky-500 shadow-sm group-hover:shadow-md transition-all">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{log.action}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Executed by <span className="text-sky-600 font-bold">{log.user}</span> 
                          <span className="mx-2 text-slate-300">•</span> 
                          Target: <span className="font-mono text-slate-600 bg-slate-100 px-1 rounded">{log.target}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                      {log.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- STATS OVERVIEW (Bottom Row) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/60 border border-sky-100 p-6 rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Members</p>
                    <p className="text-2xl font-black text-slate-900">12 / 15</p>
                </div>
                <Users className="text-sky-200" size={32} />
            </div>
            <div className="bg-white/60 border border-sky-100 p-6 rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage Used</p>
                    <p className="text-2xl font-black text-slate-900">420 MB</p>
                </div>
                <ShieldCheck className="text-sky-200" size={32} />
            </div>
            <div className="bg-white/60 border border-sky-100 p-6 rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uptime Index</p>
                    <p className="text-2xl font-black text-emerald-500">99.9%</p>
                </div>
                <Activity className="text-emerald-200" size={32} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;