import React from 'react';
import axios from 'axios';
import { encryptData, decryptData, exportPublicKey, createKeyPair, generateSalt, encryptPrivateKey, decryptPrivateKey, createMasterKey } from './cryptoUtilities';

let sessionPrivateKey = null;
export const getSessionPrivateKey = () => sessionPrivateKey;
import {sha1,sha256,sha384,sha512} from 'crypto-hash';

export const submitAccount = async(email, password) => {
    const passHash = await sha256(password);
    const saltBase64 = generateSalt();
    const saltBytes = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
    const masterKey = await createMasterKey(password, saltBytes);
    const keyPair = await createKeyPair();
    const publicKey = await exportPublicKey(keyPair.publicKey);
    const encryptedPrivKey = await encryptPrivateKey(keyPair.privateKey, masterKey);
    try {
        const result = await axios.post("http://localhost:3000/createAccount", { email, passHash, publicKey, encryptedPrivateKey: encryptedPrivKey, salt: saltBase64 });
        return result.data;
    } catch (err) {
        console.error("Post failed");
    }
}

export const submitLogin = async(email, password) => {
    const passHash = await sha256(password);
    try{
        const result = await axios.post("http://localhost:3000/auth/login", { email, passHash });
        const { confirm, encryptedPrivateKey, salt } = result.data;
        if (confirm && encryptedPrivateKey && salt) {
            const saltBytes = Uint8Array.from(atob(salt), c => c.charCodeAt(0));
            const masterKey = await createMasterKey(password, saltBytes);
            sessionPrivateKey = await decryptPrivateKey(encryptedPrivateKey, masterKey);
        }
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
        //Insert backend address here
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

