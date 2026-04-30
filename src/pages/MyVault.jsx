import React, { useState, useContext, useEffect } from "react";
import { Lock, Eye, EyeOff, Search, Plus, Trash2, Copy } from "lucide-react";
import { decryptData } from "../utilites/cryptoUtilities";
import { logEvent, LOG_ACTIONS, SEVERITY } from "../utilites/auditLogger";
import { retriveUserSecrets } from "../utilites/netUtilities";
import { UserContext } from "../UserContext";

const MyVault = () => {
  const [searchTerm,   setSearchTerm]   = useState("");
  const [decryptedId,  setDecryptedId]  = useState(null);
  const [vaultItems, setVaultItems]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // UserContext may not be fully wired yet — fall back to safe defaults
  const ctx      = useContext(UserContext) ?? {};
  const userId   = ctx.uuID     || 'anonymous';
  const userName = ctx.userName || 'Unknown User';
  const userKey  = ctx.userKey  || null;

  // Fetch vault items on component mount
  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        if (!userId || userId === 'anonymous') {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        const secrets = await retriveUserSecrets(userId);
        if (Array.isArray(secrets)) {
          setVaultItems(secrets);
        } else {
          setError('Failed to load vault items');
        }
      } catch (err) {
        setError('Error loading vault: ' + (err?.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchSecrets();
  }, [userId]);

  const handleDecrypt = async (item) => {
    if (decryptedId === item.id) {
      setDecryptedId(null);
      return;
    }
    setDecryptedId(item.id);
    await logEvent({
      action:   LOG_ACTIONS.SECRET_VIEWED,
      userId,
      userName,
      target:   item.name,
      details:  `Category: ${item.category}`,
      severity: SEVERITY.INFO,
    });
  };

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.value);
    } catch {
      /* clipboard not available */
    }
    await logEvent({
      action:   LOG_ACTIONS.SECRET_COPIED,
      userId,
      userName,
      target:   item.name,
      details:  `Category: ${item.category}`,
      severity: SEVERITY.INFO,
    });
  };

  const handleDelete = async (item) => {
    await logEvent({
      action:   LOG_ACTIONS.SECRET_DELETED,
      userId,
      userName,
      target:   item.name,
      details:  `Category: ${item.category}`,
      severity: SEVERITY.WARN,
    });
    // TODO: call delete API and refresh vault items
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-[Poppins] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Personal <span className="text-purple-500">Vault</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-mono">
              End-to-End Encrypted Environment
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search secrets..."
                className="bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none w-64 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/20">
              <Plus size={18} /> New Secret
            </button>
          </div>
        </div>

        {/* Vault Table Card */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 m-6 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading && (
            <div className="py-20 text-center">
              <div className="animate-spin text-purple-500 mb-4 inline-block">
                <Lock size={48} />
              </div>
              <p className="text-slate-500 font-medium">Loading your vault...</p>
            </div>
          )}

          {!loading && !error && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Secret Name</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Modified</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vaultItems
                .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item) => (
                  <tr key={item.id} className="hover:bg-white/1 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                          <Lock size={16} />
                        </div>
                        <span className="font-semibold text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-mono italic">{item.date}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <div
                          className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                            decryptedId === item.id
                              ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30"
                              : "bg-slate-800/50 text-slate-600 blur-sm select-none"
                          }`}
                        >
                          {decryptedId === item.id ? item.value : "••••••••••••"}
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopy(item)}
                            className="p-2 hover:text-white text-slate-500 transition-colors"
                            title="Copy"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDecrypt(item)}
                            className="p-2 hover:text-white text-slate-500 transition-colors"
                            title={decryptedId === item.id ? "Hide" : "Decrypt"}
                          >
                            {decryptedId === item.id ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 hover:text-red-400 text-slate-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          )}

          {!loading && !error && vaultItems.length === 0 && (
            <div className="py-20 text-center">
              <Lock size={48} className="mx-auto text-slate-800 mb-4" />
              <p className="text-slate-500 font-medium">Your vault is empty. Start securing your data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyVault;
