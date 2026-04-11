🛡️ VaultWeb
VaultWeb is a high-security, Zero-Knowledge web application designed for organizational secret management. It leverages Client-Side Cryptography to ensure that sensitive data is encrypted before it ever leaves the user's browser.
🔑 Core Security Principle: Zero-Knowledge
The server acts as a "blind" storage provider.
Encryption/Decryption: Happens exclusively in the browser using the Web Crypto API.
Key Management: Private keys are stored in the browser's IndexedDB and are never transmitted to the server.
Master Keys: RSA-4096 bit key pairs are generated during organization setup.
✨ Features
[x] Client-Side Cryptography: End-to-end encryption using industry-standard protocols.
[x] Hierarchical RBAC: Role-Based Access Control (Organiser, Member, Auditor).
[x] Automated Audit Trail: Immutable logs of all vault interactions for compliance.
[x] Transient State UI: Decrypted secrets are wiped from application memory after 60 seconds.
[x] Emergency Recovery: Secure account recovery via local seed phrase derivation.
🛠️ Technical Stack
Frontend: React 19, Vite, Tailwind 
Icons: Lucide React
Routing: React Router 7
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)
npm or yarn
Installation
Clone the repository: git clone https://github.com/vaultwebproject/Vaultweb.git
cd Vaultweb

Install dependencies:
npm install

Run the development server:
npm run dev
📂 Project StructurePlaintextsrc/
├── components/     # Reusable UI (Navbar, Layouts)
├── crypto/         # Web Crypto API logic & Key management
├── pages/          # Hero, MyVault, Admin, Upload, Sign-in
├── hooks/          # useAuth, useEncryption, useVault
└── App.jsx         # Routing & Global Providers

