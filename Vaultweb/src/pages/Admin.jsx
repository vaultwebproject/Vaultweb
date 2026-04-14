import React, { useState } from 'react';
import { Users, Activity, ShieldCheck, UserPlus, MoreVertical, Search, FileText } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Mock Data for Users
  const users = [
    { id: 1, name: "Sarah Connor", email: "sarah@vault.com", role: "Organiser", status: "Active" },
    { id: 2, name: "John Doe", email: "john@vault.com", role: "Member", status: "Active" },
    { id: 3, name: "Kyle Reese", email: "kyle@vault.com", role: "Auditor", status: "Pending" },
  ];

  // Mock Data for Audit Logs
  const logs = [
    { id: 1, action: "Secret Decrypted", user: "John Doe", target: "AWS_PROD_KEY", time: "2 mins ago" },
    { id: 2, action: "User Invited", user: "Sarah Connor", target: "Kyle Reese", time: "1 hour ago" },
    { id: 3, action: "Login Success", user: "John Doe", target: "N/A", time: "3 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-[Poppins] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-purple-500" /> Organization Admin
            </h1>
            <p className="text-slate-400 mt-1">Manage infrastructure access and monitor security compliance.</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
            <UserPlus size={18} /> Add Member
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-white/5 mb-8">
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'users' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Team Management
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`pb-4 text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'logs' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Security Audit
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
          
          {activeTab === 'users' ? (
            <div className="animate-in fade-in duration-500">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Member</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Access Level</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.role === 'Organiser' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {user.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-purple-500" /> System Logs (Last 24h)
                </div>
                <button className="text-[10px] text-purple-400 font-bold uppercase hover:underline">Export CSV</button>
              </div>
              <div className="divide-y divide-white/5">
                {logs.map((log) => (
                  <div key={log.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center text-slate-500">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{log.action}</div>
                        <div className="text-xs text-slate-500">User: <span className="text-slate-300">{log.user}</span> • Target: <span className="text-slate-300">{log.target}</span></div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 uppercase">{log.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;