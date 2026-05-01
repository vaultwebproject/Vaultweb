import { sha256 } from 'crypto-hash';
import { submitAuditLog, fetchAuditLogs, deleteAuditLogs } from './netUtilities';

const STORAGE_KEY = 'vaultweb_audit_logs';

export const LOG_ACTIONS = {
  LOGIN_SUCCESS:   'LOGIN_SUCCESS',
  LOGIN_FAILED:    'LOGIN_FAILED',
  LOGOUT:          'LOGOUT',
  SECRET_VIEWED:   'SECRET_VIEWED',
  SECRET_COPIED:   'SECRET_COPIED',
  SECRET_CREATED:  'SECRET_CREATED',
  SECRET_DELETED:  'SECRET_DELETED',
  SECRET_MODIFIED: 'SECRET_MODIFIED',
  USER_INVITED:    'USER_INVITED',
  ROLE_CHANGED:    'ROLE_CHANGED',
  ORG_CREATED:     'ORG_CREATED',
  VAULT_ACCESSED:  'VAULT_ACCESSED',
};

export const SEVERITY = {
  INFO:     'INFO',
  WARN:     'WARN',
  CRITICAL: 'CRITICAL',
};

export const TARGET_TYPES = {
  SECRET: 'SECRET',
  USER:   'USER',
  ORG:    'ORG',
  VAULT:  'VAULT',
};

export const ACTION_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED:  'FAILED',
};

const DEFAULT_SEVERITY = {
  [LOG_ACTIONS.LOGIN_FAILED]:   SEVERITY.WARN,
  [LOG_ACTIONS.SECRET_DELETED]: SEVERITY.WARN,
  [LOG_ACTIONS.ROLE_CHANGED]:   SEVERITY.WARN,
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
 * Log a security event.
 * Persists to the backend database and keeps a local localStorage cache as fallback.
 * Returns the completed log entry.
 *
 * @param {object} params
 * @param {string} params.action          - One of LOG_ACTIONS
 * @param {number} params.userId          - BIGINT user ID (FK → users.user_id)
 * @param {string} params.userName        - Display name (stored in details_json)
 * @param {number} params.organisationId  - BIGINT org ID (FK → organisations.organisation_id)
 * @param {string} params.userRole        - 'Organiser' | 'Member' | 'Auditor'
 * @param {string} params.targetType      - One of TARGET_TYPES (SECRET / USER / ORG / VAULT)
 * @param {number} [params.targetId]      - Numeric ID of the affected object
 * @param {string} [params.target]        - Human-readable name of the affected object
 * @param {string} [params.actionStatus]  - ACTION_STATUS.SUCCESS | ACTION_STATUS.FAILED
 * @param {string} [params.failureReason] - Error message when actionStatus is FAILED
 * @param {string} [params.sessionId]     - Session identifier
 * @param {string} [params.details]       - Free-text extra context
 * @param {string} [params.severity]      - Override auto-assigned severity
 */
export const logEvent = async ({
  action,
  userId          = 0,
  userName        = 'Unknown',
  organisationId  = 0,
  userRole        = 'Member',
  targetType      = TARGET_TYPES.VAULT,
  targetId        = null,
  target          = 'N/A',
  actionStatus    = ACTION_STATUS.SUCCESS,
  failureReason   = null,
  sessionId       = null,
  details         = '',
  severity,
}) => {
  const logs      = getStoredLogs();
  const prevHash  = logs.length > 0 ? logs[logs.length - 1].hash : '0'.repeat(64);
  const timestamp = new Date().toISOString();
  const resolvedSeverity = severity ?? DEFAULT_SEVERITY[action] ?? SEVERITY.INFO;

  const entry = {
    id: crypto.randomUUID(),
    timestamp,
    action,
    severity: resolvedSeverity,
    userId,
    userName,
    organisationId,
    userRole,
    targetType,
    targetId,
    target,
    actionStatus,
    failureReason,
    sessionId,
    details,
    prevHash,
  };

  entry.hash = await computeEntryHash(entry);

  // Persist to local cache
  logs.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

  // Send to backend database (non-blocking — local cache is the fallback)
  submitAuditLog(entry);

  return entry;
};

/**
 * Return all log entries (newest-first).
 * Fetches from the backend database when available; falls back to localStorage.
 */
export const getLogs = async () => {
  const dbLogs = await fetchAuditLogs();
  if (Array.isArray(dbLogs) && dbLogs.length > 0) {
    // Keep local cache in sync with what the DB returned (DB returns newest-first)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...dbLogs].reverse()));
    return dbLogs;
  }
  return [...getStoredLogs()].reverse();
};

/**
 * Clear all stored logs (admin-only operation).
 * Removes from the backend database and the local cache.
 */
export const clearLogs = async () => {
  await deleteAuditLogs();
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Verify the entire hash chain against the local cache.
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
  const headers = [
    'Timestamp', 'Action', 'Severity', 'Status', 'User ID', 'User', 'Role',
    'Org ID', 'Target Type', 'Target ID', 'Target', 'Details', 'Hash',
  ];
  const rows = logs.map(l => [
    l.timestamp, l.action, l.severity, l.actionStatus, l.userId, l.userName,
    l.userRole, l.organisationId, l.targetType, l.targetId ?? '', l.target,
    l.details, l.hash,
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