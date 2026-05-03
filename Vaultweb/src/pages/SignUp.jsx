import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { submitAccount } from '../utilites/netUtilities';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault(); // Fixed: Prevent page refresh
    
    try {
      // Fixed: Properly handling the response from your utility
      const result = await submitAccount(email, "", password, organisation);
      console.log("Account provisioned:", result);
      navigate("/signin");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-20 font-[Poppins] relative z-10">
      
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        
        {/* --- BRANDING AREA --- */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-[2rem] bg-white border border-sky-100 shadow-xl shadow-sky-200/50 mb-6 group hover:rotate-6 transition-transform">
            <ShieldCheck className="text-sky-600 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Join the <span className="text-sky-500">Vault</span></h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Create your secure identity and provision your workspace.</p>
        </div>

        {/* --- SIGNUP CARD --- */}
        <div className="bg-white/80 border border-sky-100 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl shadow-sky-200/40">
          <form onSubmit={handleSignUp} className="space-y-6">
            
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
              <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">Master Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Organisation Field */}
            <div>
              <label className="block text-[10px] font-black text-sky-900/40 uppercase mb-2 ml-1 tracking-[0.2em]">Organisation Name</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="text" 
                  required
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300"
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-sky-600 text-white py-4.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 flex items-center justify-center gap-2 group active:scale-95 mt-4"
            >
              Initialize Account <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-10">
            <div className="flex-1 h-px bg-sky-100" />
            <span className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Security Policy</span>
            <div className="flex-1 h-px bg-sky-100" />
          </div>

          <p className="text-[10px] text-center text-slate-400 leading-relaxed px-4">
            By signing up, you agree to our zero-knowledge encryption protocols and enterprise security standards.
          </p>
        </div>

        {/* --- FOOTER LINK --- */}
        <p className="text-center mt-10 text-slate-500 text-sm font-medium">
          Already have an account? {' '}
          <Link to="/signin" className="text-sky-600 font-black hover:text-sky-700 transition-colors underline decoration-sky-100 underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;