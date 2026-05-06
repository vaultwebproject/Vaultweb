import React, { useState, useEffect, useContext } from 'react'; 
import { Users, Activity, ShieldCheck, UserPlus, MoreVertical, Search, FileText } from 'lucide-react';
import { UserContext } from '../UserContext';
import {
  retrieveOrgUsers,
  retrieveOrgVaults,
  createVault,
  addUserToVault,
  removeUserFromVault,
  deactivateVault,
  reactivateVault,
  retrieveOrgDepartments
} from '../utilites/netUtilities';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newVaultName, setNewVaultName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedVaultId, setSelectedVaultId] = useState("");

  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const logs = [
    { id: 1, action: "System Logs Placeholder", user: "N/A", target: "N/A", time: "Pending backend route" },
  ];

  const { orgId, uuID, userKey, role } = useContext(UserContext);

  if (role && role !== "ORG_ADMIN") {
    return <Navigate to="/vault" replace />;
  }

  const loadOrganisationData = async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const usersRes = await retrieveOrgUsers(orgId);
      const vaultsRes = await retrieveOrgVaults(orgId);
      const departmentsRes = await retrieveOrgDepartments(orgId);

      setUsers(usersRes?.result?.users || []);
      setVaults(vaultsRes?.result?.vaults || []);
      setDepartments(departmentsRes?.result?.departments || []);
    } catch (err) {
      console.error("Failed to load organisation management data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganisationData();
  }, [orgId]);

  const handleCreateVault = async () => {
    if (!newVaultName.trim() || !orgId || !uuID || !userKey || !selectedDepartmentId) return;

    const vaultKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
    const rawKey = await window.crypto.subtle.exportKey("raw", vaultKey);

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, userKey, rawKey
    );
    const wrappedKey = btoa(String.fromCharCode(...iv, ...new Uint8Array(encrypted)));

    const result = await createVault(orgId, newVaultName.trim(), uuID, wrappedKey, selectedDepartmentId);
    if (result) {
      setNewVaultName("");
      setSelectedDepartmentId("");
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

  const handleRemoveUserVaultAccess = async (userId, vaultId) => {
    const result = await removeUserFromVault(userId, vaultId);
    if (result) {
      await loadOrganisationData();
    }
  };

  const handleDeactivateVault = async (vaultId) => {
    const result = await deactivateVault(vaultId);
    if (result) {
      await loadOrganisationData();
    }
  };

  const handleReactivateVault = async (vaultId) => {
    const result = await reactivateVault(vaultId);
    if (result) {
      await loadOrganisationData();
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-[Poppins] pt-24 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              <ShieldCheck size={14} />
              Organisation Control
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <ShieldCheck className="text-sky-500" /> Organization Admin
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Manage infrastructure access and monitor security compliance.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 active:scale-95">
            <UserPlus size={16} /> Add Member
          </button>
        </div>

        <div className="flex gap-8 border-b border-sky-100 mb-8">
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-xs font-black tracking-[0.2em] uppercase transition-all ${
              activeTab === 'users'
                ? 'text-sky-600 border-b-2 border-sky-500'
                : 'text-slate-400 hover:text-sky-600'
            }`}
          >
            Team Management
          </button>

          <button 
            onClick={() => setActiveTab('vaults')}
            className={`pb-4 text-xs font-black tracking-[0.2em] uppercase transition-all ${
              activeTab === 'vaults'
                ? 'text-sky-600 border-b-2 border-sky-500'
                : 'text-slate-400 hover:text-sky-600'
            }`}
          >
            Vault Management
          </button>

          <button 
            onClick={() => setActiveTab('logs')}
            className={`pb-4 text-xs font-black tracking-[0.2em] uppercase transition-all ${
              activeTab === 'logs'
                ? 'text-sky-600 border-b-2 border-sky-500'
                : 'text-slate-400 hover:text-sky-600'
            }`}
          >
            Security Audit
          </button>
        </div>

        <div className="bg-white/80 border border-sky-100 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl shadow-sky-200/30">
          
          {loading ? (
            <div className="p-10 text-slate-500 font-medium">Loading organisation data...</div>

          ) : activeTab === 'users' ? (
            <div className="animate-in fade-in duration-500 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-sky-50/60 border-b border-sky-100">
                    <th className="px-8 py-5 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Member</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Access Level</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em] text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {users.length > 0 ? users.map((user) => (
                    <tr key={user.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">{user.name || user.email}</div>
                        <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] bg-sky-100 text-sky-700 border border-sky-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium">
                        <div className="flex items-center gap-2 text-slate-600">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          {user.status || "Active"}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-sky-100 rounded-xl text-slate-400 hover:text-sky-600 transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-10 text-slate-400 text-center">
                        No organisation users available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          ) : activeTab === 'vaults' ? (
            <div className="animate-in fade-in duration-500 p-8 space-y-8">

              <div className="bg-sky-50/50 border border-sky-100 rounded-[2rem] p-6">
                <h2 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Create Vault</h2>
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                    placeholder="Enter vault name"
                    className="bg-white border border-sky-100 rounded-2xl px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 placeholder:text-slate-300"
                  />

                  <select
                    value={selectedDepartmentId}
                    onChange={(e) => setSelectedDepartmentId(e.target.value)}
                    className="bg-white border border-sky-100 rounded-2xl px-4 py-3 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400"
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleCreateVault}
                    className="bg-sky-600 hover:bg-sky-700 px-5 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-200 transition-all active:scale-95"
                  >
                    Create
                  </button>
                </div>
              </div>

              <div className="bg-sky-50/50 border border-sky-100 rounded-[2rem] p-6">
                <h2 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Add User To Vault</h2>
                <div className="grid md:grid-cols-3 gap-3">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="bg-white border border-sky-100 rounded-2xl px-4 py-3 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedVaultId}
                    onChange={(e) => setSelectedVaultId(e.target.value)}
                    className="bg-white border border-sky-100 rounded-2xl px-4 py-3 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400"
                  >
                    <option value="">Select Vault</option>
                    {vaults
                      .filter((vault) => vault.active)
                      .map((vault) => (
                        <option key={vault.id} value={vault.id}>
                          {vault.name}
                        </option>
                      ))}
                  </select>

                  <button
                    onClick={handleAddUserToVault}
                    className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95"
                  >
                    Assign
                  </button>
                </div>
              </div>

              <div className="bg-sky-50/50 border border-sky-100 rounded-[2rem] p-6">
                <h2 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Vault List</h2>
                <div className="space-y-4">
                  {vaults.length > 0 ? vaults.map((vault) => (
                    <div key={vault.id} className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-black text-slate-900">{vault.name}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            Users Assigned: {vault.users?.length || 0}
                          </div>
                          <div className="text-xs mt-2">
                            Status:{" "}
                            <span className={vault.active ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                              {vault.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        {vault.active ? (
                          <button
                            onClick={() => handleDeactivateVault(vault.id)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivateVault(vault.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>

                      {vault.active && vault.users?.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {vault.users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between text-sm text-slate-700 bg-sky-50 rounded-xl px-3 py-3 border border-sky-100">
                              <span>{user.name || user.email}</span>
                              <button
                                onClick={() => handleRemoveUserVaultAccess(user.id, vault.id)}
                                className="text-red-500 hover:text-red-600 font-bold"
                              >
                                Remove Access
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-slate-400">No vaults available.</div>
                  )}
                </div>
              </div>
            </div>

          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="p-6 border-b border-sky-100 flex justify-between items-center bg-sky-50/60">
                <div className="text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} className="text-sky-500" /> System Logs (Last 24h)
                </div>
                <button className="text-[10px] text-sky-600 font-black uppercase hover:underline">Export CSV</button>
              </div>
              <div className="divide-y divide-sky-50">
                {logs.map((log) => (
                  <div key={log.id} className="px-8 py-5 flex items-center justify-between hover:bg-sky-50/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-slate-400">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{log.action}</div>
                        <div className="text-xs text-slate-400">
                          User: <span className="text-slate-600">{log.user}</span> • Target: <span className="text-slate-600">{log.target}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase">{log.time}</div>
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