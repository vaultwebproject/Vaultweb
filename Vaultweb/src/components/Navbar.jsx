import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Menu, X, Upload as UploadIcon } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  // Helper to highlight active links
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-[100] bg-white/70 backdrop-blur-xl border-b border-sky-100/50 font-[Poppins] transition-all">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* 1. LOGO SECTION */}
        <Link to="/" className="flex items-center space-x-3 group z-[110]">
          <div className="relative">
            {/* Soft Cyan Glow behind logo */}
            <div className="absolute -inset-1.5 bg-sky-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-white border border-sky-100 rounded-xl p-2 shadow-sm shadow-sky-200/50 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
            </div>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">
            VAULT<span className="text-sky-500">WEB</span>
          </span>
        </Link>

        {/* 2. DESKTOP MENU (Absolute Center) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-8 text-[11px] font-black tracking-[0.2em] text-slate-400">
          {[
            { name: "HOME", path: "/" },
            { name: "VAULTS", path: "/vault" },
            { name: "ORGANISATION", path: "/create-org" },
            { name: "ADMIN", path: "/admin" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-sky-600 transition-colors ${
                isActive(link.path) ? "text-sky-600" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* 3. RIGHT SIDE: Actions */}
        <div className="flex items-center space-x-6 z-[110]">
          <Link
            to="/signin"
            className="hidden md:block text-[11px] font-black text-slate-500 hover:text-sky-600 uppercase tracking-widest transition-colors"
          >
            Sign In
          </Link>

          <Link to="/upload">
            <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white text-[11px] rounded-full font-black hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-200 transition-all active:scale-95 uppercase tracking-widest">
              <UploadIcon size={14} />
              Upload
            </button>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
