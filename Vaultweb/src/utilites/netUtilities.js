import React from 'react';
import axios from 'axios';
import { encryptData, decryptData } from './cryptoUtilities';
import {sha1,sha256,sha384,sha512} from 'crypto-hash';

export const submitAccount = async(email, role, password, organisation) => {
    const passHash = await sha256(password);

    try{
        const result = await axios.post("http://localhost:3000/auth/register", {
            email,
            passHash,
            organisationName: organisation,
        });
        return result;
    } catch (err) {
        console.error("Post failed");
    }
}

export const submitLogin = async(email, password) => {
    const passHash = await sha256(password);
    try{
        const result = await axios.post("http://localhost:3000/auth/login", { email, passHash }); // Routes are defined in VaultWeb_Project_B\vault-api\src\index.ts. Then created in routes/auth/PostLogin.ts
        return result.data;
    } catch (err) {
        console.error("Post failed");
    }
}

export const submitSecret = async (key, data, userID, vaultID, name, iv) => {
    const encryptedResult = await encryptData(data, key, iv);
    const submissionData = btoa(String.fromCharCode(...new Uint8Array(encryptedResult.cipherText)));
    const ivString = btoa(String.fromCharCode(...iv));

    try{
        const result = await axios.post("http://localhost:3000/data/submit", {
            userID,
            vaultID,
            name,
            submissionData,
            iv: ivString,
        });
        return result;
    } catch (err) {
        console.error("Post failed");
    }
}

export const retrieveUserInfo = async (userID) => {
    const res = await axios.get(`http://localhost:3000/users/${userID}`);
    return res.data;
}

export const retrieveUserSecrets = async (userID) => {
    const res = await axios.get(`http://localhost:3000/data/${userID}`);
    return res.data;
}

export const retrieveSecretByVault = async (vaultID) => {
    const res = await axios.get(`http://localhost:3000/data/vault/${vaultID}`);
    const items = res.data.result.items.map((item) => {
        const { iv, submissionData } = JSON.parse(item.submissionData);
        return { ...item, iv, submissionData };
    });
    return items;
}

export const retrieveOrgUsers = async (orgId) => {
    const res = await axios.get(`http://localhost:3000/org/${orgId}/users`);
    return res.data;
}

export const retrieveOrgVaults = async (orgId) => {
    const res = await axios.get(`http://localhost:3000/org/${orgId}/vaults`);
    return res.data;
}

export const createVault = async (orgId, name, ownerUserId, wrappedKey) => {
    try {
        const result = await axios.post(`http://localhost:3000/org/${orgId}/vaults`, {
            name,
            ownerUserId,
            wrappedKey,
        });
        return result.data;
    } catch (err) {
        console.error("Post failed");
    }
}

export const addUserToVault = async (userId, vaultId, wrappedKey) => {
    try {
        const result = await axios.post(`http://localhost:3000/users/${userId}/vaults`, {
            vaultId,
            wrappedKey,
        });
        return result.data;
    } catch (err) {
        console.error("Post failed");
    }
}

export const removeUserFromVault = async (userId, vaultId) => {
    try {
        const result = await axios.delete(`http://localhost:3000/users/${userId}/vaults/${vaultId}`);
        return result.data;
    } catch (err) {
        console.error("Delete failed");
    }
}

export const deactivateVault = async (vaultId) => {
    try {
        const result = await axios.patch(`http://localhost:3000/vaults/${vaultId}/deactivate`);
        return result.data;
    } catch (err) {
        console.error("Patch failed");
    }
}

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

