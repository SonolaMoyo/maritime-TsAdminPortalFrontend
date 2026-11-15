import { useState, useEffect } from "react";
import { Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destination = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, destination]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed. Please verify your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f5] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(8,18,22,0.06)] border border-[#dce5da] p-6 sm:p-8 md:p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#b9f74e] to-brand-green2 flex items-center justify-center shadow-[0_12px_30px_rgba(0,86,66,0.16)] mb-5 sm:mb-6">
          <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-ink mb-2">Welcome</h1>
        <p className="text-sm sm:text-base text-text mb-6 sm:mb-8">Sign in to your account.</p>
        
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-left flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="w-full h-12 px-4 rounded-xl border border-[#dce5da] bg-bg focus:bg-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-ink" htmlFor="password">Password</label>
              <button 
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs font-bold text-brand-green hover:text-brand-green2 transition-colors cursor-pointer flex items-center gap-1 focus:outline-none"
              >
                {showPassword ? "" : ""}
              </button>
            </div>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-4 pr-12 rounded-xl border border-[#dce5da] bg-bg focus:bg-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a949d] hover:text-ink transition-colors p-1.5 rounded-lg focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 rounded-xl bg-brand-green text-white font-black hover:-translate-y-0.5 transition-transform shadow-[0_12px_24px_rgba(0,86,66,0.22)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Operations"}
          </button>
        </form>
        
      </div>
    </div>
  );
}
