import axios from 'axios';
import { encryptData, decryptData } from './cryptoUtilities';
import { sha1, sha256, sha384, sha512 } from 'crypto-hash';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export const submitAccount = async (email, role, organisation) => {
    const submission = new FormData();
    submission.append("email", email);
    submission.append("role", role);
    submission.append("organisation", organisation);

    try {
        const result = await axios.post(`${API_BASE}/createAccount`, submission);
        return result;
    } catch (err) {
        console.error("Post failed");
    }
};

export const submitLogin = async (email, password) => {
    const passHash = await sha256(password);
    try {
        const result = await axios.post(`${API_BASE}/login`, { email, passHash });
        return result.data;
    } catch (err) {
        console.error("Post failed");
    }
};

export const submitSecret = async (key, data, userID, name, iv) => {
    var submissionData = "";
    submissionData, iv = encryptData(data, key);

    const submission = new FormData();
    submission.append("userID", userID);
    submission.append("name", name);
    submission.append("submissionData", submissionData);
    submission.append("iv", iv);

    try {
        const result = await axios.post(`${API_BASE}/data/submit`, submission);
        return result;
    } catch (err) {
        console.error("Post failed");
    }
};

export const retriveUserInfo = async (userID) => {
    try {
        const result = await axios.get(`${API_BASE}/${userID}`);
        return result.data;
    } catch (err) {
        console.error("Get failed");
    }
};

export const retriveUserSecrets = async (userID) => {
    try {
        const result = await axios.get(`${API_BASE}/data/${userID}`);
        return result.data;
    } catch (err) {
        console.error("Get failed");
    }
};

export const retriveSecretByVault = async (vaultID) => {
    try {
        const result = await axios.get(`${API_BASE}/data/vault/${vaultID}`);
        return result.data;
    } catch (err) {
        console.error("Get failed");
    }
};

// --- Audit log endpoints ---

/**
 * Maps a local log entry to the audit_logs table schema and POSTs it.
 *
 * Column mapping:
 *   organisation_id  ← logEntry.organisationId
 *   user_id          ← logEntry.userId
 *   user_role        ← logEntry.userRole
 *   action_type      ← logEntry.action
 *   target_type      ← logEntry.targetType
 *   target_id        ← logEntry.targetId
 *   target_name      ← logEntry.target
 *   action_status    ← logEntry.actionStatus
 *   failure_reason   ← logEntry.failureReason
 *   ip_address       ← resolved server-side from request headers
 *   user_agent       ← navigator.userAgent
 *   session_id       ← logEntry.sessionId
 *   details_json     ← { id, severity, userName, details }  (extra metadata)
 *   hash_prev        ← logEntry.prevHash
 *   hash_current     ← logEntry.hash
 */
export const submitAuditLog = async (logEntry) => {
    try {
        const result = await axios.post(`${API_BASE}/audit/log`, {
            organisation_id: logEntry.organisationId,
            user_id:         logEntry.userId,
            user_role:       logEntry.userRole,
            action_type:     logEntry.action,
            target_type:     logEntry.targetType,
            target_id:       logEntry.targetId ?? null,
            target_name:     logEntry.target,
            action_status:   logEntry.actionStatus,
            failure_reason:  logEntry.failureReason ?? null,
            user_agent:      navigator.userAgent,
            session_id:      logEntry.sessionId ?? null,
            details_json: {
                id:       logEntry.id,
                severity: logEntry.severity,
                userName: logEntry.userName,
                details:  logEntry.details,
            },
            hash_prev:    logEntry.prevHash,
            hash_current: logEntry.hash,
        });
        return result.data;
    } catch (err) {
        console.error("Audit log submission failed:", err.message);
    }
};

/**
 * Fetches all audit log rows and maps them back to the local entry format
 * so the hash chain and CSV export continue to work correctly.
 * Expected DB response: array of audit_logs rows (newest-first).
 */
export const fetchAuditLogs = async () => {
    try {
        const result = await axios.get(`${API_BASE}/audit/logs`);
        const rows = result.data;
        if (!Array.isArray(rows)) return null;

        return rows.map(row => {
            const meta = row.details_json ?? {};
            return {
                id:             meta.id          ?? row.audit_id,
                timestamp:      row.event_timestamp,
                action:         row.action_type,
                severity:       meta.severity    ?? 'INFO',
                userId:         row.user_id,
                userName:       meta.userName    ?? '',
                organisationId: row.organisation_id,
                userRole:       row.user_role,
                targetType:     row.target_type,
                targetId:       row.target_id,
                target:         row.target_name,
                actionStatus:   row.action_status,
                failureReason:  row.failure_reason,
                sessionId:      row.session_id,
                details:        meta.details     ?? '',
                prevHash:       row.hash_prev,
                hash:           row.hash_current,
            };
        });
    } catch (err) {
        console.error("Audit log fetch failed:", err.message);
        return null;
    }
};

export const deleteAuditLogs = async () => {
    try {
        await axios.delete(`${API_BASE}/audit/logs`);
    } catch (err) {
        console.error("Audit log delete failed:", err.message);
    }
};

