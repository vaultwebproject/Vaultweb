
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Creates a Master Key for a user (Symmetric Key Encryption) based on their password and a salt value. For use with encrypting and decrypting user's data.
export const createMasterKey = async (source, salt) => {
    const sourceBuffer = textEncoder.encode(source);

    const sourceKey = await window.crypto.subtle.importKey("raw", sourceBuffer, {name: "PBKDF2"}, false, ["deriveKey"])

    const derivedKey = await window.crypto.subtle.deriveKey({name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256"}, sourceKey, {name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);

    return derivedKey;
};

// Creates a Key Pair (Public Key Encryption). For use with transferring keys between users.
export const createKeyPair = async () => {

    const keyPair = await window.crypto.subtle.generateKey({name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256"}, true, ["encrypt", "decrypt"]);

    return keyPair;
};

// Encrypts plaintext data using entered key. For use with encrypting user data.
export const encryptData = async (plainText, key) => {
    const plainTextBuffer = textEncoder.encode(plainText);
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    const cipherText = await window.crypto.subtle.encrypt({name: "AES-GCM", iv:iv}, key, plainTextBuffer);

    return {cipherText, iv};
};

// Decrypts cipherText using entered key and iv. For use with decrypting retrived user data.
export const decryptData = async (cipherText, key, iv) => {
    const decyptedData = await window.crypto.subtle.decrypt({name: "AES-GCM", iv:iv}, key, cipherText);
    
    const plainText = textDecoder.decode(decyptedData);

    return(plainText);
};

// Encrypts plainText data using entered Public Key. For use with transmitting keys.
export const encryptDataPublic = async (plainText, key) => {
    const plainTextBuffer = textEncoder.encode(plainText);

    const cipherText = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, plainTextBuffer);

    return cipherText;
};

// Decrypts cipherText using entered Private Key. For use with transmitting keys.
export const decryptDataPublic = async (cipherText, key) => {
    const decyptedData = await window.crypto.subtle.decrypt({name: "RSA-OAEP"}, key, cipherText);
    
    const plainText = textDecoder.decode(decyptedData);

    return(plainText);
};

export const encryptBase64 = async (plainText) => {

}

export const decryptBase64 = async (cipherText) => {

}

// Exports a public CryptoKey to a base64 string for sending to the backend.
export const exportPublicKey = async (publicKey) => {
    const exported = await window.crypto.subtle.exportKey("spki", publicKey);
    const bytes = new Uint8Array(exported);
    return btoa(String.fromCharCode(...bytes));
};

// Generates a random salt for master key derivation.
export const generateSalt = () => {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    return btoa(String.fromCharCode(...salt));
};

// Encrypts the private RSA key with the master key for server storage.
export const encryptPrivateKey = async (privateKey, masterKey) => {
    const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, masterKey, exported);
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const dataBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    return `${ivBase64}.${dataBase64}`;
};
