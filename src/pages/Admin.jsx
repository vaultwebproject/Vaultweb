import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Activity, ShieldCheck, UserPlus, MoreVertical,
  FileText, Download, RefreshCw, AlertTriangle, CheckCircle2,
  XCircle, Filter, Search,
} from 'lucide-react';
import {
  getLogs, verifyChain, exportLogsCSV, clearLogs, LOG_ACTIONS, SEVERITY,
} from '../utilites/auditLogger';

// ── helpers ──────────────────────────────────────────────────────────────────

const SEVERITY_STYLES = {
  [SEVERITY.INFO]:     'bg-slate-800 text-slate-300',
  [SEVERITY.WARN]:     'bg-amber-500/20 text-amber-400',
  [SEVERITY.CRITICAL]: 'bg-red-500/20 text-red-400',
};

const ACTION_ICON_COLOR = {
  [LOG_ACTIONS.LOGIN_SUCCESS]:   'text-emerald-400',
  [LOG_ACTIONS.LOGIN_FAILED]:    'text-red-400',
  [LOG_ACTIONS.LOGOUT]:          'text-slate-400',
  [LOG_ACTIONS.SECRET_VIEWED]:   'text-purple-400',
  [LOG_ACTIONS.SECRET_COPIED]:   'text-blue-400',
  [LOG_ACTIONS.SECRET_CREATED]:  'text-emerald-400',
  [LOG_ACTIONS.SECRET_DELETED]:  'text-red-400',
  [LOG_ACTIONS.SECRET_MODIFIED]: 'text-amber-400',
  [LOG_ACTIONS.USER_INVITED]:    'text-cyan-400',
  [LOG_ACTIONS.ROLE_CHANGED]:    'text-purple-400',
  [LOG_ACTIONS.ORG_CREATED]:     'text-emerald-400',
  [LOG_ACTIONS.VAULT_ACCESSED]:  'text-slate-400',
};

const formatTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)  return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return new Date(iso).toLocaleDateString();
};

// ── mock users (replace with API data when backend is ready) ──────────────────
const MOCK_USERS = [
  { id: 1, name: 'Sarah Connor',  email: 'sarah@vault.com', role: 'Organiser', status: 'Active'  },
  { id: 2, name: 'John Doe',      email: 'john@vault.com',  role: 'Member',    status: 'Active'  },
  { id: 3, name: 'Kyle Reese',    email: 'kyle@vault.com',  role: 'Auditor',   status: 'Pending' },
];

// ── component ─────────────────────────────────────────────────────────────────

const Admin = () => {
  const [activeTab,    setActiveTab]    = useState('users');
  const [logs,         setLogs]         = useState([]);
  const [chainStatus,  setChainStatus]  = useState(null); // null | { valid, tamperedIds }
  const [verifying,    setVerifying]    = useState(false);
  const [filterSev,    setFilterSev]    = useState('ALL');
  const [filterAction, setFilterAction] = useState('ALL');
  const [search,       setSearch]       = useState('');

  const loadLogs = useCallback(() => {
    setLogs(getLogs());
    setChainStatus(null);
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleVerify = async () => {
    setVerifying(true);
    const result = await verifyChain();
    setChainStatus(result);
    setVerifying(false);
  };

  const handleClear = () => {
    if (window.confirm('Clear all audit logs? This cannot be undone.')) {
      clearLogs();
      loadLogs();
    }
  };

  const uniqueActions = ['ALL', ...Object.values(LOG_ACTIONS)];
  const severities    = ['ALL', SEVERITY.INFO, SEVERITY.WARN, SEVERITY.CRITICAL];

  const filteredLogs = logs.filter(l => {
    if (filterSev    !== 'ALL' && l.severity !== filterSev)    return false;
    if (filterAction !== 'ALL' && l.action   !== filterAction) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.userName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)   ||
        l.target.toLowerCase().includes(q)   ||
        l.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-[Poppins] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
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
          {['users', 'logs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold tracking-widest uppercase transition-all ${
                activeTab === tab
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'users' ? 'Team Management' : 'Security Audit'}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl animate-in fade-in duration-500">
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
                {MOCK_USERS.map(user => (
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
        )}

        {/* ── AUDIT LOG TAB ── */}
        {activeTab === 'logs' && (
          <div className="animate-in fade-in duration-500 space-y-4">

            {/* Chain integrity banner */}
            {chainStatus && (
              <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold border ${
                chainStatus.valid
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {chainStatus.valid
                  ? <><CheckCircle2 size={18} /> Audit chain verified — no tampering detected.</>
                  : <><XCircle size={18} /> Chain integrity violation detected! {chainStatus.tamperedIds.length} entry/entries may have been tampered with.</>
                }
              </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              {/* Left: filters */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder="Search logs…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-slate-900 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none w-48 transition-all"
                  />
                </div>

                {/* Severity filter */}
                <div className="relative flex items-center gap-1.5">
                  <Filter size={12} className="text-slate-500" />
                  <select
                    value={filterSev}
                    onChange={e => setFilterSev(e.target.value)}
                    className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {severities.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Severities' : s}</option>)}
                  </select>
                </div>

                {/* Action filter */}
                <select
                  value={filterAction}
                  onChange={e => setFilterAction(e.target.value)}
                  className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {uniqueActions.map(a => <option key={a} value={a}>{a === 'ALL' ? 'All Actions' : a}</option>)}
                </select>
              </div>

              {/* Right: actions */}
              <div className="flex gap-2">
                <button
                  onClick={loadLogs}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all"
                >
                  <RefreshCw size={13} /> Refresh
                </button>
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                  <ShieldCheck size={13} /> {verifying ? 'Verifying…' : 'Verify Chain'}
                </button>
                <button
                  onClick={exportLogsCSV}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all"
                >
                  <Download size={13} /> Export CSV
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Log count */}
            <p className="text-xs text-slate-500 font-mono">
              {filteredLogs.length} event{filteredLogs.length !== 1 ? 's' : ''} shown
              {logs.length !== filteredLogs.length ? ` (filtered from ${logs.length} total)` : ''}
            </p>

            {/* Log table */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-white/5 flex items-center gap-2 bg-white/[0.01]">
                <Activity size={14} className="text-purple-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tamper-Evident Audit Log</span>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="py-20 text-center">
                  <FileText size={40} className="mx-auto text-slate-800 mb-4" />
                  <p className="text-slate-500 font-medium text-sm">
                    {logs.length === 0 ? 'No audit events recorded yet.' : 'No events match the current filters.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredLogs.map(log => {
                    const isTampered = chainStatus?.tamperedIds?.includes(log.id);
                    return (
                      <div
                        key={log.id}
                        className={`px-8 py-5 flex items-center justify-between hover:bg-white/[0.01] transition-colors ${isTampered ? 'bg-red-500/5 border-l-2 border-red-500' : ''}`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-8 h-8 shrink-0 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center ${ACTION_ICON_COLOR[log.action] ?? 'text-slate-500'}`}>
                            {isTampered ? <AlertTriangle size={15} /> : <FileText size={15} />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-white">{log.action}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${SEVERITY_STYLES[log.severity]}`}>
                                {log.severity}
                              </span>
                              {isTampered && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400">
                                  TAMPERED
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              User: <span className="text-slate-300">{log.userName}</span>
                              {' · '}Target: <span className="text-slate-300">{log.target}</span>
                              {log.details && <> · <span className="text-slate-400">{log.details}</span></>}
                            </div>
                            <div className="text-[10px] font-mono text-slate-700 mt-1 truncate" title={log.hash}>
                              # {log.hash}
                            </div>
                          </div>
                        </div>
                        <div className="text-[11px] font-mono text-slate-600 uppercase shrink-0 ml-6">
                          {formatTime(log.timestamp)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
