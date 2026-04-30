# VaultWeb - Backend Integration Guide

## Fixed Issues ✅

The following critical issues have been fixed:

1. **Syntax error in `netUtilities.js`** - Fixed destructuring of encrypted data with proper async/await
2. **Missing UserContext integration** - SignIn now properly sets user context with master key for decryption
3. **Mock data removed** - MyVault now fetches real data from backend API
4. **Incomplete forms** - SignIn form now has error messages and loading states
5. **Empty functions completed** - `encryptBase64`/`decryptBase64` now fully implemented
6. **Environment configuration** - Added `.env.local` template for API base URL

## Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production, update to your actual backend URL.

## Required Backend Endpoints

Your backend must implement these endpoints:

### Authentication
- **POST** `/api/login`
  - Request: `{ email, passHash }`
  - Response: `{ confirm: boolean, id: number }`

- **POST** `/api/createAccount`
  - Request: FormData with `email`, `role`, `organisation`
  - Response: Account creation response

### User Data
- **GET** `/api/:userID`
  - Response: User profile information

### Secrets Management
- **GET** `/api/data/:userID`
  - Response: Array of user's encrypted secrets

- **GET** `/api/data/vault/:vaultID`
  - Response: Array of secrets in a vault

- **POST** `/api/data/submit`
  - Request: FormData with `userID`, `name`, `submissionData`, `iv`
  - Response: Success confirmation

- **DELETE** `/api/data/:secretID`
  - Response: Deletion confirmation

### Audit Logging
- **POST** `/api/audit/log`
  - Request: Complete audit log entry
  - Response: Success confirmation

- **GET** `/api/audit/logs`
  - Response: Array of audit logs (newest-first), mapping:
    - `audit_id` → `id`
    - `event_timestamp` → `timestamp`
    - `action_type` → `action`
    - `details_json.severity` → `severity`
    - `user_id` → `userId`
    - `organisation_id` → `organisationId`
    - `user_role` → `userRole`
    - `target_type` → `targetType`
    - `target_id` → `targetId`
    - `target_name` → `target`
    - `action_status` → `actionStatus`
    - `failure_reason` → `failureReason`
    - `session_id` → `sessionId`
    - `details_json.details` → `details`
    - `hash_prev` → `prevHash`
    - `hash_current` → `hash`

- **DELETE** `/api/audit/logs`
  - Response: Success confirmation

## Data Flow

### User Login
1. User enters email & password
2. Password hashed with SHA-256
3. Backend validates credentials
4. On success: User context set with userId and master key
5. Master key derived from password for data decryption

### Secret Decryption
1. Encrypted secrets fetched from backend
2. Master key (from UserContext) used to decrypt
3. IV (initialization vector) stored with ciphertext

### Audit Logging
1. Each action logged locally with hash chain
2. Submitted to backend asynchronously (non-blocking)
3. Falls back to localStorage if backend unavailable
4. Hash chain verifies log integrity

## Security Notes

- Passwords are hashed with SHA-256 before transmission
- Secrets encrypted with AES-GCM (256-bit keys)
- Master key derived using PBKDF2 (100,000 iterations)
- RSA-OAEP (4096-bit) for key transfer between users
- Audit logs use hash chaining for tamper detection
- All sensitive operations logged for compliance

## Frontend Encryption/Decryption

All user data is encrypted/decrypted on the frontend. Backend stores only encrypted blobs and never has access to decrypted data.

### Functions Available

```javascript
// Create master key from password
createMasterKey(password, salt)

// Encrypt data
encryptData(plainText, key) → { cipherText, iv }

// Decrypt data
decryptData(cipherText, key, iv) → plainText

// RSA key pair for user-to-user key exchange
createKeyPair() → { publicKey, privateKey }

// Public key encryption for key exchange
encryptDataPublic(plainText, publicKey)

// Private key decryption for key exchange
decryptDataPublic(cipherText, privateKey)

// Base64 encoding for storage/transmission
encryptBase64(plainText, key)
decryptBase64(cipherBase64, key, ivBase64)
```

## Testing Checklist

- [ ] User can sign in with valid credentials
- [ ] Master key is properly derived and stored
- [ ] Secrets load after authentication
- [ ] Secrets decrypt properly with master key
- [ ] Copy to clipboard works
- [ ] Audit logs are generated for all actions
- [ ] Hash chain verification passes
- [ ] CSV export of audit logs works
- [ ] New secrets can be created
- [ ] Secrets can be deleted
- [ ] Users can navigate between routes

## Next Steps

1. Set up backend API with above endpoints
2. Configure database schema for `audit_logs` table
3. Implement user authentication with password hashing
4. Test end-to-end flow with real encrypted data
5. Deploy and monitor audit logs
