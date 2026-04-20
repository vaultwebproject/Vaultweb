import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserProvider from './UserContext';

// Layout Components
import Navbar from './components/Navbar';

// Page Components
import Banner from './components/Banner';
import MyVault from './pages/MyVault';
import CreateOrg from './pages/CreateOrg'; 
import Admin from './pages/Admin';
import Upload from './pages/Upload';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="bg-slate-950 min-h-screen selection:bg-purple-500/30">
          {/* Navbar stays visible across all routes */}
          <Navbar />

          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Banner />} />

            {/* Secure Vault Dashboard */}
            <Route path="/vault" element={<MyVault />} />
            <Route path="/create-org" element={<CreateOrg />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp></SignUp>}></Route>
            
            {/* Fallback for 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-screen text-white">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-slate-400">Vault Area Restricted</p>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
