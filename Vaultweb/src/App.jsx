import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProvider from "./UserContext";

// Layout Components
import Navbar from "./components/Navbar";

// Page Components
import Banner from "./components/Banner";
import MyVault from "./pages/MyVault";
import CreateOrg from "./pages/CreateOrg";
import Admin from "./pages/Admin";
import Upload from "./pages/Upload";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SplashPage from "./pages/SplashPage";
import Organisation from "./pages/Organisation";


const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SplashPage />;

  return (
    <UserProvider>
      <Router>
        {/* Changed bg-sky-50 to a more solid sky-100/50 for that "Light Blue" feel */}
        <div className="bg-[#f0f9ff] min-h-screen selection:bg-sky-200 text-slate-800 relative font-[Poppins] overflow-x-hidden">
          {/* --- CLEAN LIGHT BLUE AMBIENCE (No External Assets) --- */}
          <div className="fixed inset-0 pointer-events-none z-0">
            {/* Top Right Glow */}
            <div className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] bg-sky-200/50 blur-[120px] rounded-full" />

            {/* Bottom Left Glow */}
            <div className="absolute -bottom-[10%] -left-[10%] w-[50vw] h-[50vw] bg-cyan-100/40 blur-[100px] rounded-full" />

            {/* Pure CSS Grid - Using transparent borders instead of image patterns */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Banner />} />
              <Route path="/vault" element={<MyVault />} />
              <Route path="/create-org" element={<CreateOrg />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              {/* App.jsx Routes */}
              <Route
                path="/organisation"
                element={
                  <Organisation />
                }
              />
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-4xl font-bold text-slate-800">404</h1>
                    <p className="text-slate-500">Vault Area Restricted</p>
                  </div>
                }
              />
              
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
