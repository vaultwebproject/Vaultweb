import axios from 'axios';
import { encryptData } from './cryptoUtilities';
import { sha256 } from 'crypto-hash';

const API_BASE = "http://localhost:3000";

/**
 * Registers a new account and provisions an organization.
 * Updated to send JSON to match Amy's PostAccount receiver.
 */
export const submitAccount = async (email, role, password, organisationName) => {
    const passwordHash = await sha256(password);

    try {
        const result = await axios.post(`${API_BASE}/createAccount`, {
            email,
            role,
            passwordHash,
            organisationName // Matches schema in PostAccount.ts
        });
        return result.data;
    } catch (err) {
        console.error("Account creation failed:", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Authenticates user and returns session/org data.
 */
export const submitLogin = async (email, password) => {
    const passwordHash = await sha256(password);
    try {
        const result = await axios.post(`${API_BASE}/auth/login`, { 
            email, 
            passwordHash 
        });
        return result.data;
    } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Encrypts and submits a secret to the vault.
 * Fixed: Encryption variable assignment and switched to JSON payload.
 */
export const submitSecret = async (key, data, userID, vaultID, name) => {
    // Correctly destructure the encrypted payload and IV from your utility
    const { encryptedData, iv } = encryptData(data, key);

    try {
        const result = await axios.post(`${API_BASE}/data/submit`, {
            userID,
            vaultID,
            name,
            submissionData: encryptedData,
            iv: iv // Sent as string to be handled by Amy's JSON.stringify logic
        });
        return result.data;
    } catch (err) {
        console.error("Secret submission failed:", err.response?.data || err.message);
        throw err;
    }
}

/**
 * Retrieves specific user metadata and role.
 */
export const retrieveUserInfo = async (userID) => {
    try {
        const res = await axios.get(`${API_BASE}/users/${userID}`);
        return { confirm: true, ...res.data };
    } catch (err) {
        console.error("User retrieval failed:", err);
        return { confirm: false };
    }
}

/**
 * Retrieves all secrets owned by a specific user.
 */
export const retrieveUserSecrets = async (userID) => {
    const res = await axios.get(`${API_BASE}/data/${userID}`);
    return res.data;
}

/**
 * Retrieves secrets associated with a specific vault/department.
 */
export const retrieveSecretByVault = async (vaultID) => {
    const res = await axios.get(`${API_BASE}/data/vault/${vaultID}`);
    return res.data;
}
