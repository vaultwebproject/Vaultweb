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

export const retriveUserInfo = async (userID) => {
    const res = await axios.get(`http://localhost:3000/users/${userID}`);
    return res.data;
}

export const retriveUserSecrets = async (userID) => {
    const res = await axios.get(`http://localhost:3000/data/${userID}`);
    return res.data;
}

export const retriveSecretByVault = async (vaultID) => {
    const res = await axios.get(`http://localhost:3000/data/vault/${vaultID}`);
    const items = res.data.result.items.map((item) => {
        const { iv, submissionData } = JSON.parse(item.submissionData);
        return { ...item, iv, submissionData };
    });
    return items;
}

