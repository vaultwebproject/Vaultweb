
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

// Helper function to convert bytes to Base64
const bytesToBase64 = (bytes) => {
    const binary = String.fromCharCode.apply(null, new Uint8Array(bytes));
    return btoa(binary);
};

// Helper function to convert Base64 to bytes
const base64ToBytes = (base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

// Encrypts plainText to Base64 encoded string using provided key (or generates one)
export const encryptBase64 = async (plainText, key = null) => {
    if (!key) {
        // Generate a default key if none provided
        key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }
    
    const { cipherText, iv } = await encryptData(plainText, key);
    const cipherBase64 = bytesToBase64(cipherText);
    const ivBase64 = bytesToBase64(iv);
    
    return { cipherBase64, ivBase64, key };
};

// Decrypts Base64 encoded cipherText using provided key and iv
export const decryptBase64 = async (cipherBase64, key, ivBase64) => {
    const cipherText = base64ToBytes(cipherBase64);
    const iv = base64ToBytes(ivBase64);
    
    return await decryptData(cipherText, key, iv);
};
