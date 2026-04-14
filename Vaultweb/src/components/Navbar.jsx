import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Reduced height to h-20 for a cleaner look; h-30 was likely too tall.
    <nav className="relative h-20 w-full px-4 sm:px-6 bg-gradient-to-b from-gray-900 to-black shadow-2xl border-b border-indigo-500/30 font-[Poppins] overflow-hidden">
      {/* 1. MAIN WRAPPER: items-center and h-full keeps everything aligned vertically */}
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between relative">
        {/* LOGO SECTION (Left) */}
        <div className="flex items-center space-x-2 group cursor-pointer z-50">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500 animate-spin-slow"></div>
            <div className="relative bg-black rounded-full p-2 border border-white/10">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold text-white tracking-wider group-hover:text-purple-400 transition-colors">
              VAULT<span className="text-purple-500">WEB</span>
            </span>
          </div>
        </div>

        {/* 2. DESKTOP MENU (Absolute Center) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-10 text-xs font-bold text-gray-400 tracking-widest">
          <a href="#" className="hover:text-white transition-colors">
            HOME
          </a>
          <a href="/vault" className="hover:text-white transition-colors">
            VAULTS
          </a>
          <a href="/create-org" className="hover:text-white transition-colors">
            ORGANISATION
          </a>
          <a href="/admin" className="hover:text-white transition-colors">
            ADMIN
          </a>
        </div>

        {/* 3. RIGHT SIDE: Actions & Toggle */}
        <div className="flex items-center space-x-5 z-50">
            <Link to="signin">
          <button className="hidden md:block text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
            Sign In
          </button>
          </Link>

          <Link to="/upload">
            <button className="hidden md:block px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[11px] rounded-full font-black hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all active:scale-95 uppercase">
              Upload
            </button>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>
        </div>
      </div>

      {/* Decorative Background Circles - Fixed Z-index so they stay behind */}
      <div className="absolute -z-10 hidden md:block -top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border border-white/5 bg-gradient-to-b from-purple-900/20 to-transparent backdrop-blur-xl pointer-events-none" />
      <div className="absolute -z-10 hidden md:block -top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-purple-600/20 blur-2xl opacity-40 animate-pulse" />

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 transition-transform duration-500 z-[60] md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl text-white font-medium">
          <a href="#" onClick={() => setIsOpen(false)}>
            Home
          </a>
          <a href="/vault" onClick={() => setIsOpen(false)}>
            Vaults
          </a>
          <a href="#" onClick={() => setIsOpen(false)}>
            Settings
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
