🛡️ VaultWebVaultWeb is a high-security, Zero-Knowledge web application designed for organizational secret management. It leverages Client-Side Cryptography to ensure that sensitive data is encrypted before it ever leaves the user's browser.🔑 Core Security Principle: Zero-KnowledgeThe server acts as a "blind" storage provider.Encryption/Decryption: Happens exclusively in the browser using the Web Crypto API.Key Management: Private keys are stored in the browser's IndexedDB and are never transmitted to the server.Master Keys: RSA-4096 bit key pairs are generated during organization setup.✨ Features[x] Client-Side Cryptography: End-to-end encryption using industry-standard protocols.[x] Hierarchical RBAC: Role-Based Access Control (Organiser, Member, Auditor).[x] Automated Audit Trail: Immutable logs of all vault interactions for compliance.[x] Transient State UI: Decrypted secrets are wiped from application memory after 60 seconds.[x] Emergency Recovery: Secure account recovery via local seed phrase derivation.🛠️ Technical StackFrontend: React 19, Vite, Tailwind CSSCryptography: Web Crypto API (SubtleCrypto)Icons: Lucide ReactRouting: React Router 7Authentication: Auth0 Integration🚀 Getting StartedPrerequisitesNode.js (v18 or higher)npm or yarnInstallationClone the repository:Bashgit clone https://github.com/your-username/vaultweb.git
cd vaultweb
Install dependencies:Bashnpm install
Set up environment variables:Create a .env file in the root directory:Code snippetVITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_API_URL=http://localhost:5000
Run the development server:Bashnpm run dev
📂 Project StructurePlaintextsrc/
├── components/     # Reusable UI (Navbar, Layouts)
├── crypto/         # Web Crypto API logic & Key management
├── pages/          # Hero, MyVault, Admin, Upload, Sign-in
├── hooks/          # useAuth, useEncryption, useVault
└── App.jsx         # Routing & Global Providers
🔒 Security Architecture DetailsEncryption FlowPlaintext Input $\rightarrow$ Public Key Encryption (RSA-OAEP) $\rightarrow$ Ciphertext (Base64)Ciphertext $\rightarrow$ POST to API $\rightarrow$ Stored in DBDecryption FlowGET Ciphertext from API $\rightarrow$ Retrieve Private Key from IndexedDB $\rightarrow$ Decryption $\rightarrow$ Transient Memory Storage
