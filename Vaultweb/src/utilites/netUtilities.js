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

export const retriveSecretByVault = async (vaultID) => {
    const res = await axios.get(`http://localhost:3000/data/${vaultID}`);
    return res.data;
}

export const submitAuditLog = async (entry) => {
    console.log("submitAuditLog placeholder", entry);
    return null;
};

export const fetchAuditLogs = async () => {
    console.log("fetchAuditLogs placeholder");
    return [];
};

export const deleteAuditLogs = async () => {
    console.log("deleteAuditLogs placeholder");
    return null;
};

// get all users in an organisation
export const retrieveOrgUsers = async (orgId) => {
    try {
        const res = await axios.get(`http://localhost:3000/org/${orgId}/users`);
        return res.data;
    } catch (err) {
        console.error("Failed to retrieve organisation users", err);
        return null;
    }
};
// get all vaults in an organisation
export const retrieveOrgVaults = async (orgId) => {
    try {
        const res = await axios.get(`http://localhost:3000/org/${orgId}/vaults`);
        return res.data;
    } catch (err) {
        console.error("Failed to retrieve organisation vaults", err);
        return null;
    }
};
// create a new vault inside an organisation
export const createVault = async (orgId, name, ownerUserId, wrappedKey) => {
    try {
        const res = await axios.post(`http://localhost:3000/org/${orgId}/vaults`, {
            name,
            ownerUserId,
            wrappedKey
        });
        return res.data;
    } catch (err) {
        console.error("Failed to create vault", err);
        return null;
    }
};
// assign a user to a vault
export const addUserToVault = async (
    userId,
    vaultId,
    wrappedKey,
    permCanCreateItems = false,
    permCanAddUserFromVault = false,
    permCanRemoveUserFromVault = false
) => {
    try {
        const res = await axios.post(`http://localhost:3000/users/${userId}/vaults`, {
            vaultId,
            wrappedKey,
            permCanCreateItems,
            permCanAddUserFromVault,
            permCanRemoveUserFromVault
        });
        return res.data;
    } catch (err) {
        console.error("Failed to add user to vault", err);
        return null;
    }
};
// remove a user’s access from a vault
export const removeUserFromVault = async (userId, vaultId) => {
    try {
        const res = await axios.delete(`http://localhost:3000/users/${userId}/vaults/${vaultId}`);
        return res.data;
    } catch (err) {
        console.error("Failed to remove user from vault", err);
        return null;
    }
};
// deactivate a vault
export const deactivateVault = async (vaultId) => {
    try {
        const res = await axios.patch(`http://localhost:3000/vaults/${vaultId}/deactivate`);
        return res.data;
    } catch (err) {
        console.error("Failed to deactivate vault", err);
        return null;
    }
};