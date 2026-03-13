import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log("Initiating secure session for:", email);
  };

  return (
    // bg-transparent ensures it floats over the App.jsx background atmosphere
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 font-[Poppins] relative z-10">
      
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        
        {/* --- BRANDING AREA --- */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-[2rem] bg-white border border-sky-100 shadow-xl shadow-sky-200/50 mb-6 group hover:scale-110 transition-transform duration-500">
            <ShieldCheck className="text-sky-600 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Access Your <span className="text-sky-500">Vault</span></h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Enter your credentials to decrypt your environment.</p>
        </div>

        {/* --- LOGIN CARD --- */}
        <div className="bg-white/80 border border-sky-100 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl shadow-sky-200/40">
          <form onSubmit={handleSignIn} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Password</label>
                <a href="#" className="text-[10px] text-sky-600 hover:text-sky-700 font-black uppercase tracking-widest transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-slate-50 border border-sky-100 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-sky-600 text-white py-4.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 flex items-center justify-center gap-2 group active:scale-95 mt-4"
            >
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-10">
            <div className="flex-1 h-px bg-sky-100" />
            <span className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Secure Gateway</span>
            <div className="flex-1 h-px bg-sky-100" />
          </div>

          {/* OAuth Options */}
          <div className="grid grid-cols-1 gap-4">
             <button className="flex items-center justify-center gap-3 w-full bg-white border border-sky-100 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-sky-50 hover:border-sky-200 transition-all shadow-sm">
                <Github size={18} className="text-slate-900" /> Continue with GitHub
             </button>
          </div>
        </div>

        {/* --- FOOTER LINK --- */}
        <p className="text-center mt-10 text-slate-500 text-sm font-medium">
          Don't have an organization? {' '}
          <Link to="/create-org" className="text-sky-600 font-black hover:text-sky-700 transition-colors underline decoration-sky-100 underline-offset-4">
            Create One Now
          </Link>
        </p>

        {/* Bottom Badge */}
        <div className="mt-12 flex justify-center items-center gap-2 text-[10px] font-black text-sky-900/20 uppercase tracking-[0.2em]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          SSL & Client-Side AES Active
        </div>
      </div>
    </div>
  );
};

export default SignIn;