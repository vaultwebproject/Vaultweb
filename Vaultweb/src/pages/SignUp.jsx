import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { submitAccount } from '../utilites/netUtilities';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        await submitAccount(email, password);
        navigate("/signin");
    };

    return(
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-[Poppins] overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#1e1b4b_0%,transparent_70%)] opacity-50" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

            <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500">

                {/* Logo/Brand Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
                    <ShieldCheck className="text-purple-500 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Access Your Vault</h1>
                    <p className="text-slate-400 text-sm mt-2">Enter your credentials to decrypt your environment.</p>
                </div>
        
                {/* SignUp Card */}

                <div className="bg-slate-900/50 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">

                    <form onSubmit={handleSignUp} className="space-y-5">

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Work Email</label>
                            <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                placeholder="name@company.com"
                            />
                            </div>
                        </div>
            
                        <div>
                            <div className="flex justify-between mb-2 ml-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                            </div>
                            <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
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
                        <div>
                            <div className="flex justify-between mb-2 ml-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Organisation</label>
                            </div>
                            <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input 
                                type="text" 
                                //required
                                value={organisation}
                                onChange={(e) => setOrganisation(e.target.value)}
                                className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                placeholder="Organisation Name"
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