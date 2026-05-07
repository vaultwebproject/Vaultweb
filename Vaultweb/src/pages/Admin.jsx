import React, { useState, useEffect, useContext } from 'react'; 
import { Users, Activity, ShieldCheck, UserPlus, MoreVertical, Search,FileText } from 'lucide-react';
import { UserContext } from '../UserContext';
import { retrieveOrgUsers, retrieveOrgVaults, createVault, addUserToVault, removeUserFromVault, deactivateVault
} from '../utilites/netUtilities';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  // replaced hardcoded users with dynamic state
  const [users, setUsers] = useState([]);
  // added dynamic vault state for vault management
  const [vaults, setVaults] = useState([]);
  // added loading state for backend data loading
  const [loading, setLoading] = useState(true);
  // added state for create vault input
  const [newVaultName, setNewVaultName] = useState("");
  // added state for assigning a user to a vault
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedVaultId, setSelectedVaultId] = useState("");
  // logs left as placeholder for now because audit backend route is not part of this
  const logs = [
    { id: 1, action: "System Logs Placeholder", user: "N/A", target: "N/A", time: "Pending backend route" },
  ];

  // get orgId, user ID, and master key from shared context
  const { orgId, uuID, userKey } = useContext(UserContext);

  // load users and vaults from backend for the current organisation
  const loadOrganisationData = async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const usersRes = await retrieveOrgUsers(orgId);
      const vaultsRes = await retrieveOrgVaults(orgId);

      setUsers(usersRes?.result?.users || []);
      setVaults(vaultsRes?.result?.vaults || []);
    } catch (err) {
      console.error("Failed to load organisation management data", err);
    } finally {
      setLoading(false);
    }
  };

  // automatically load organisation data when orgId becomes available
  useEffect(() => {
    loadOrganisationData();
  }, [orgId]);

  // handler for creating a new vault
  const handleCreateVault = async () => {
    if (!newVaultName.trim() || !orgId || !userKey) return;

    // Generate a unique AES-256 symmetric key for this vault
    const vaultKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
    const rawKey = await window.crypto.subtle.exportKey("raw", vaultKey);

    // Wrap (encrypt) the vault key with the admin's master key
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, userKey, rawKey
    );
    // Store as base64( iv || ciphertext )
    const wrappedKey = btoa(String.fromCharCode(...iv, ...new Uint8Array(encrypted)));

    const result = await createVault(orgId, newVaultName.trim(), uuID, wrappedKey);
    if (result) {
      setNewVaultName("");
      await loadOrganisationData();
    }
  };
  
  const handleAddUserToVault = async () => {
    if (!selectedUserId || !selectedVaultId || !userKey) return;

    const tempVaultKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
    const rawKey = await window.crypto.subtle.exportKey("raw", tempVaultKey);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, userKey, rawKey
    );
    const wrappedKey = btoa(String.fromCharCode(...iv, ...new Uint8Array(encrypted)));

    const result = await addUserToVault(selectedUserId, selectedVaultId, wrappedKey);
    if (result) {
      setSelectedUserId("");
      setSelectedVaultId("");
      await loadOrganisationData();
    }
  };

  // handler for removing a user’s vault access
  const handleRemoveUserVaultAccess = async (userId, vaultId) => {
    const result = await removeUserFromVault(userId, vaultId);
    if (result) {
      await loadOrganisationData();
    }
  };

  // handler for deactivating a vault
  const handleDeactivateVault = async (vaultId) => {
    const result = await deactivateVault(vaultId);
    if (result) {
      await loadOrganisationData();
    }
  };

  return (
    /* Amy's Fix: Deep Navy Background to match Organization Page */
    <div className="min-h-screen bg-transparent text-slate-200 font-[Poppins] pt-24 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
              <ShieldCheck className="text-sky-400" size={36} /> Admin Control
            </h1>
            <p className="text-sky-200/60 mt-1 font-medium">
              Infrastructure Governance & RBAC Management
            </p>
          </div>
          <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-95">
            <UserPlus size={18} /> Provision Member
          </button>
        </div>

        {/* --- TABS --- */}
        <div className="flex gap-8 border-b border-white/10 mb-8">
          {['users', 'vaults', 'logs'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab 
                ? 'text-sky-400 border-b-2 border-sky-400' 
                : 'text-slate-400 hover:text-sky-200'
              }`}
            >
              {tab === 'users' ? 'Team Management' : tab === 'vaults' ? 'Vault Control' : 'Security Audit'}
            </button>
          ))}
        </div>

        {/* --- MAIN CONTENT CARD --- */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl overflow-hidden shadow-2xl">
          
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-sky-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest">Syncing Org Data...</p>
            </div>

          ) : activeTab === 'users' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-5 text-[10px] font-black text-sky-200/40 uppercase tracking-[0.2em]">Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sky-200/40 uppercase tracking-[0.2em]">Privileges</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sky-200/40 uppercase tracking-[0.2em]">Connection</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length > 0 ? users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-white group-hover:text-sky-300 transition-colors">{user.name || user.email}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{user.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          {user.status || "Active"}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-sky-500/20 rounded-xl text-slate-400 hover:text-sky-300 transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-500 italic">No network identities found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

          ) : activeTab === 'vaults' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 p-10 space-y-10">

              {/* Create Vault */}
              <div className="bg-sky-500/5 border border-sky-500/10 rounded-3xl p-8">
                <h2 className="text-sm font-black text-sky-400 uppercase tracking-widest mb-6">Initialize New Vault</h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                    placeholder="e.g. Finance-Internal-S3"
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-sky-500/50 transition-all"
                  />
                  <button
                    onClick={handleCreateVault}
                    className="bg-sky-500 hover:bg-sky-400 px-8 py-4 rounded-2xl text-white font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                  >
                    Provision
                  </button>
                </div>
              </div>

              {/* Assign User */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6">Access Granting</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-2xl px-4 py-4 text-white"
                  >
                    <option value="">Target Identity</option>
                    {users.map((user) => <option key={user.id} value={user.id}>{user.name || user.email}</option>)}
                  </select>
                  <select
                    value={selectedVaultId}
                    onChange={(e) => setSelectedVaultId(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-2xl px-4 py-4 text-white"
                  >
                    <option value="">Target Vault</option>
                    {vaults.map((vault) => <option key={vault.id} value={vault.id}>{vault.name}</option>)}
                  </select>
                  <button
                    onClick={handleAddUserToVault}
                    className="bg-emerald-600 hover:bg-emerald-500 px-5 py-4 rounded-2xl text-white font-bold transition-all active:scale-95"
                  >
                    Grant Access
                  </button>
                </div>
              </div>

              {/* Vault List */}
              <div className="space-y-6">
                <h2 className="text-sm font-black text-white uppercase tracking-widest px-2">Active Infrastructure</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vaults.length > 0 ? vaults.map((vault) => (
                    <div key={vault.id} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-sky-500/30 transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="font-black text-lg text-white">{vault.name}</div>
                          <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mt-1">
                            {vault.users?.length || 0} Authorized Users
                          </div>
                        </div>
                        <button onClick={() => handleDeactivateVault(vault.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                          Deactivate
                        </button>
                      </div>

                      <div className="space-y-2">
                        {vault.users?.map((user) => (
                          <div key={user.id} className="flex items-center justify-between text-xs bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                            <span className="font-medium text-slate-300">{user.name || user.email}</span>
                            <button onClick={() => handleRemoveUserVaultAccess(user.id, vault.id)} className="text-red-400/60 hover:text-red-400 font-bold uppercase text-[9px] tracking-widest">
                              Revoke
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : <div className="text-slate-500 p-4">No active vaults discovered.</div>}
                </div>
              </div>
            </div>

          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={16} /> Forensic Audit Logs (24H)
                </div>
                <button className="text-[10px] text-sky-400 font-black uppercase hover:underline tracking-widest">Export Dataset</button>
              </div>
              <div className="divide-y divide-white/5 p-4">
                {logs.map((log) => (
                  <div key={log.id} className="px-6 py-5 flex items-center justify-between hover:bg-white/5 rounded-2xl transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-sky-500 shadow-inner">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{log.action}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
                          Subject: <span className="text-sky-300">{log.user}</span> • Object: <span className="text-sky-300">{log.target}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-600 bg-black/20 px-3 py-1 rounded-lg border border-white/5">{log.time}</div>
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