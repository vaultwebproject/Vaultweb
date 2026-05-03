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

  // get orgId from shared context so page knows which organisation to load
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
    if (!newVaultName.trim() || !orgId || !uuID) return;

    const wrappedKey = userKey || "temporary_wrapped_key";

    const result = await createVault(orgId, newVaultName.trim(), uuID, wrappedKey);
    if (result) {
      setNewVaultName("");
      await loadOrganisationData();
    }
  };

  // handler for assigning a user to a vault
  const handleAddUserToVault = async () => {
    if (!selectedUserId || !selectedVaultId) return;

    const wrappedKey = userKey || "temporary_wrapped_key";

    const result = await addUserToVault(
      selectedUserId,
      selectedVaultId,
      wrappedKey
    );

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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-[Poppins] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-purple-500" /> Organization Admin
            </h1>
            <p className="text-slate-400 mt-1">
              Manage infrastructure access and monitor security compliance.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
            <UserPlus size={18} /> Add Member
          </button>
        </div>

        <div className="flex gap-8 border-b border-white/5 mb-8">
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'users' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Team Management
          </button>

          {/* added a new Vault Management tab for organisation vault actions */}
          <button 
            onClick={() => setActiveTab('vaults')}
            className={`pb-4 text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'vaults' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Vault Management
          </button>

          <button 
            onClick={() => setActiveTab('logs')}
            className={`pb-4 text-sm font-bold tracking-widest uppercase transition-all ${activeTab === 'logs' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Security Audit
          </button>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
          
          {/* added loading check before showing page content */}
          {loading ? (
            <div className="p-8 text-slate-400">Loading organisation data...</div>

          ) : activeTab === 'users' ? (
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
                  {/* users are now loaded from backend state instead of hardcoded array */}
                  {users.length > 0 ? users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-white">{user.name || user.email}</div>
                        <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-slate-800 text-slate-400">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {user.status || "Active"}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    // added empty-state fallback
                    <tr>
                      <td colSpan="4" className="px-8 py-8 text-slate-500 text-center">
                        No organisation users available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          ) : activeTab === 'vaults' ? (
            // added Vault Management tab content
            <div className="animate-in fade-in duration-500 p-8 space-y-8">

              {/* Create Vault section */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Create Vault</h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                    placeholder="Enter vault name"
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                  />
                  <button
                    onClick={handleCreateVault}
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-white font-bold"
                  >
                    Create
                  </button>
                </div>
              </div>

              {/* Add User To Vault section */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Add User To Vault</h2>
                <div className="grid md:grid-cols-3 gap-3">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white"
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
                    className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white"
                  >
                    <option value="">Select Vault</option>
                    {vaults.map((vault) => (
                      <option key={vault.id} value={vault.id}>
                        {vault.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAddUserToVault}
                    className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl text-white font-bold"
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* Vault list section with deactivate and remove-access actions */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Vault List</h2>
                <div className="space-y-4">
                  {vaults.length > 0 ? vaults.map((vault) => (
                    <div key={vault.id} className="bg-slate-950 border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-white">{vault.name}</div>
                          <div className="text-xs text-slate-500">
                            Users Assigned: {vault.users?.length || 0}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeactivateVault(vault.id)}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-bold"
                        >
                          Deactivate
                        </button>
                      </div>

                      {vault.users?.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {vault.users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between text-sm text-slate-300 bg-white/[0.02] rounded-lg px-3 py-2">
                              <span>{user.name || user.email}</span>
                              <button
                                onClick={() => handleRemoveUserVaultAccess(user.id, vault.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Remove Access
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-slate-500">No vaults available.</div>
                  )}
                </div>
              </div>
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
                        <div className="text-xs text-slate-500">
                          User: <span className="text-slate-300">{log.user}</span> • Target: <span className="text-slate-300">{log.target}</span>
                        </div>
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