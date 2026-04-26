import React from 'react';
import axios from 'axios';
import { encryptData, decryptData } from './cryptoUtilities';
import {sha1,sha256,sha384,sha512} from 'crypto-hash';

export const submitAccount = async(email, role, password, organisation) => {
    const submission = new FormData();

    const passHash = await sha256(password);

    submission.append("email", email);
    submission.append("role", role);
    submission.append("passHash", passHash);
    submission.append("organisation", organisation);

    try{
        //Insert backend address here
        const result = await axios.post("http://localhost:3000/createAccount", submission);
        return result;
    } catch (err) {
        console.error("Post failed");
    }
}

export const submitLogin = async(email, password) => {
    const passHash = await sha256(password);
    try{
        const result = await axios.post("http://localhost:3000/auth/login", { email, passHash });
        return result.data;
    } catch (err) {
        console.error("Post failed");
    }
}

export const submitSecret = async (key, data, userID, vaultID, name, iv) => {
    var submissionData = "";
    submissionData, iv = encryptData(data, key);

    const submission = new FormData();
    submission.append("userID", userID);
    submission.append("vaultID", vaultID);
    submission.append("name", name);
    submission.append("submissionData", submissionData);
    submission.append("iv", iv);

    try{
        const result = await axios.post("http://localhost:3000/data/submit", submission);
        return result;
    } catch (err) {
        console.error("Post failed");
    }
}

export const retriveUserInfo = async (userID) => {
    const res = await axios.get(`http://localhost:3000/users/${userID}`);
    return res.data;
}

export const retriveUserSecrets = async (userID) => {
    const res = await axios.get(`http://localhost:3000/data/${userID}`);
    return res.data;
}

export const retriveSecretByVault = async (vaultID) => {
    const res = await axios.get(`http://localhost:3000/data/${vaultID}`);
    return res.data;
}


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
export const createVault = async (orgId, name) => {
    try {
        const res = await axios.post(`http://localhost:3000/org/${orgId}/vaults`, { name });
        return res.data;
    } catch (err) {
        console.error("Failed to create vault", err);
        return null;
    }
};
// assign a user to a vault
export const addUserToVault = async (userId, vaultId) => {
    try {
        const res = await axios.post(`http://localhost:3000/users/${userId}/vaults`, { vaultId });
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