import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would authenticate here. For now, just navigate to the dashboard.
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f7f9f5] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(8,18,22,0.06)] border border-[#dce5da] p-8 md:p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#b9f74e] to-brand-green2 flex items-center justify-center shadow-[0_12px_30px_rgba(0,86,66,0.16)] mb-6">
          <Lock className="w-7 h-7 text-white" />
        </div>
        
        <h1 className="text-3xl font-black tracking-tight text-ink mb-2">Welcome back</h1>
        <p className="text-text mb-8">Sign in to the Maritama Trading Operations Portal.</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              required
              placeholder="admin@maritamatrading.com"
              className="w-full h-12 px-4 rounded-xl border border-[#dce5da] bg-bg focus:bg-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-ink" htmlFor="password">Password</label>
              <a href="#" className="text-sm font-bold text-brand-green hover:underline">Forgot password?</a>
            </div>
            <input 
              id="password"
              type="password" 
              required
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border border-[#dce5da] bg-bg focus:bg-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full h-12 mt-2 rounded-xl bg-brand-green text-white font-black hover:-translate-y-0.5 transition-transform shadow-[0_12px_24px_rgba(0,86,66,0.22)] cursor-pointer"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-sm text-[#8a949d]">
          <p>Secure operations environment</p>
        </div>
      </div>
    </div>
  );
}
