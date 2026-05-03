
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Creates a Master Key for a user (Symmetric Key Encryption) based on their password and a salt value. For use with encrypting and decrypting user's data.
export const createMasterKey = async (source, salt) => {
    const sourceBuffer = textEncoder.encode(source);
    const saltBuffer = typeof salt === 'string' ? textEncoder.encode(salt) : salt;

    const sourceKey = await window.crypto.subtle.importKey("raw", sourceBuffer, {name: "PBKDF2"}, false, ["deriveKey"])

    const derivedKey = await window.crypto.subtle.deriveKey({name: "PBKDF2", salt: saltBuffer, iterations: 100000, hash: "SHA-256"}, sourceKey, {name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);

    return derivedKey;
};

// Creates a Key Pair (Public Key Encryption). For use with transferring keys between users.
export const createKeyPair = async () => {

    const keyPair = await window.crypto.subtle.generateKey({name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256"}, true, ["encrypt", "decrypt"]);

    return keyPair;
};

// Encrypts plaintext data using entered key. For use with encrypting user data.
export const encryptData = async (plainText, key, iv) => {
    const plainTextBuffer = textEncoder.encode(plainText);

    const cipherText = await window.crypto.subtle.encrypt({name: "AES-GCM", iv:iv}, key, plainTextBuffer);

    return {cipherText};
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

export const encryptBase64 = async (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export const decryptBase64 = async (base64String) => {
    const binary = atob(base64String);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}
