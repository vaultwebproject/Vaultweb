import { sha256 } from 'crypto-hash';

const STORAGE_KEY = 'vaultweb_audit_logs';

export const LOG_ACTIONS = {
  LOGIN_SUCCESS:   'Login Success',
  LOGIN_FAILED:    'Login Failed',
  LOGOUT:          'Logout',
  SECRET_VIEWED:   'Secret Viewed',
  SECRET_COPIED:   'Secret Copied',
  SECRET_CREATED:  'Secret Created',
  SECRET_DELETED:  'Secret Deleted',
  SECRET_MODIFIED: 'Secret Modified',
  USER_INVITED:    'User Invited',
  ROLE_CHANGED:    'Role Changed',
  ORG_CREATED:     'Organisation Created',
  VAULT_ACCESSED:  'Vault Accessed',
};

export const SEVERITY = {
  INFO:     'INFO',
  WARN:     'WARN',
  CRITICAL: 'CRITICAL',
};

// Severity map: auto-assign severity by action when not specified
const DEFAULT_SEVERITY = {
  [LOG_ACTIONS.LOGIN_FAILED]:   SEVERITY.WARN,
  [LOG_ACTIONS.SECRET_DELETED]: SEVERITY.WARN,
  [LOG_ACTIONS.SECRET_VIEWED]:  SEVERITY.INFO,
  [LOG_ACTIONS.SECRET_COPIED]:  SEVERITY.INFO,
};

const getStoredLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const computeEntryHash = async (entry) => {
  const data = [entry.prevHash, entry.timestamp, entry.action, entry.userId, entry.target, entry.details].join('|');
  return sha256(data);
};

/**
 * Log a security event. Returns the completed log entry.
 */
export const logEvent = async ({
  action,
  userId   = 'anonymous',
  userName = 'Unknown',
  target   = 'N/A',
  details  = '',
  severity,
}) => {
  const logs     = getStoredLogs();
  const prevHash = logs.length > 0 ? logs[logs.length - 1].hash : '0'.repeat(64);
  const timestamp = new Date().toISOString();
  const resolvedSeverity = severity ?? DEFAULT_SEVERITY[action] ?? SEVERITY.INFO;

  const entry = {
    id: crypto.randomUUID(),
    timestamp,
    action,
    severity: resolvedSeverity,
    userId,
    userName,
    target,
    details,
    prevHash,
  };

  entry.hash = await computeEntryHash(entry);
  logs.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  return entry;
};

/** Return all stored log entries (newest-first for display). */
export const getLogs = () => [...getStoredLogs()].reverse();

/** Clear all stored logs (admin-only operation). */
export const clearLogs = () => localStorage.removeItem(STORAGE_KEY);

/**
 * Verify the entire hash chain.
 * Returns { valid: boolean, tamperedIds: string[] }
 */
export const verifyChain = async () => {
  const logs = getStoredLogs();
  if (logs.length === 0) return { valid: true, tamperedIds: [] };

  const tamperedIds = [];

  for (let i = 0; i < logs.length; i++) {
    const entry = logs[i];
    const expectedPrevHash = i === 0 ? '0'.repeat(64) : logs[i - 1].hash;

    if (entry.prevHash !== expectedPrevHash) {
      tamperedIds.push(entry.id);
      continue;
    }

    const { hash: storedHash, ...fields } = entry;
    const recomputed = await computeEntryHash(fields);
    if (recomputed !== storedHash) {
      tamperedIds.push(entry.id);
    }
  }

  return { valid: tamperedIds.length === 0, tamperedIds };
};

/** Trigger a browser download of audit logs as a CSV file. */
export const exportLogsCSV = () => {
  const logs = getStoredLogs();
  const headers = ['Timestamp', 'Action', 'Severity', 'User', 'User ID', 'Target', 'Details', 'Hash'];
  const rows = logs.map(l => [
    l.timestamp, l.action, l.severity, l.userName, l.userId, l.target, l.details, l.hash,
  ]);

  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `vaultweb_audit_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};




