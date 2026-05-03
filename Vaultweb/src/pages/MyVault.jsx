import React, { useContext, useEffect, useState } from "react";
import { Lock, Eye, EyeOff, Search, Plus, Trash2, Copy, ShieldCheck} from "lucide-react";
import { decryptData } from "../utilites/cryptoUtilities";
import { retriveSecretByVault, retriveUserSecrets } from "../utilites/netUtilities";
import UserProvider from "../UserContext";

const MyVault = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [decryptedId, setDecryptedId] = useState(null);
  const userInfo = useContext(UserProvider);
  const [vaultItems, setVaultItems] = useState([]);

  useEffect(() => {
    async () => {
      const result = retriveUserSecrets(userInfo.uuID);
      const decrypted = [];
      for (items in result) {
        const plainText = await decryptData(item.submissionData, userInfo.userKey, item.iv);
        decrypted.push({ ...item, submissionData: plainText });
      }
      setVaultItems(decrypted);
    }
  }, []);
  
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
  };

  // Mock Data: In reality, 'value' would be an Encrypted Blob from your DB

  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-[Poppins] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
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
                className="bg-white border border-sky-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none w-64 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-sky-900/20">
              <Plus size={18} /> New Secret
            </button>
          </div>
        </div>
        {/* Vault Table Card */}
        <div className="bg-white/80 border border-sky-100 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl shadow-sky-200/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/50 border-b border-sky-100">
                <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">
                  Secret Name
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">
                  Category
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">
                  Modified
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {vaultItems
                .filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-sky-50/40 transition-colors group"
                  >
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 border border-sky-200">
                          <Lock size={18} />
                        </div>
                        <span className="font-bold text-slate-900">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-sm text-slate-400 font-medium italic">
                      {item.updatedAt}
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center justify-end gap-4">
                        <div
                          className={`px-5 py-2.5 rounded-xl font-mono text-sm transition-all duration-500 border ${decryptedId === item.id ? "bg-sky-50 border-sky-200 text-sky-700 shadow-inner" : "bg-slate-50 border-slate-100 text-slate-300 blur-[3px] select-none"}`}
                        >
                          {decryptedId === item.id
                            ? item.submissionData
                            : "••••••••••••"}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button
                            className="p-2.5 hover:bg-sky-100 rounded-lg text-slate-400 hover:text-sky-600 transition-all"
                            title="Copy"
                          >
                            <Copy size={18} />
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

          {/* Empty State Mockup */}
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
