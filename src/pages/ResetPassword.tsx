import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Forgot Password flow if no token is present
  const [forgotEmail, setForgotEmail] = useState(emailParam);
  const [forgotSent, setForgotSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Password reset token is missing. Please use the link sent to your email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!forgotEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to process password reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-line shadow-sm p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-50 text-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-ink mb-2">
            {token ? "Update Your Password" : "Reset Password"}
          </h1>
          <p className="text-sm text-[#5b6671]">
            {token
              ? emailParam
                ? `Set a new secure password for ${emailParam}`
                : "Create a new secure password to access your account"
              : "Enter your account email to receive a password reset link"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
        )}

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-brand-green mt-0.5" />
              <div>
                <p className="font-bold">Password Updated Successfully!</p>
                <p className="mt-1 text-emerald-700">
                  Your new password is now active. You can proceed to sign in with your updated credentials.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-green2 transition-colors cursor-pointer shadow-sm"
            >
              Go to Sign In
            </button>
          </div>
        ) : token ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">New Password *</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 chars)"
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a949d] hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Confirm New Password *</label>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a949d] hover:text-ink cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-green2 transition-colors cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>

            <div className="text-center pt-4">
              <Link to="/login" className="text-sm font-semibold text-brand-green hover:underline inline-flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Return to Sign In
              </Link>
            </div>
          </form>
        ) : forgotSent ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-brand-green mt-0.5" />
              <div>
                <p className="font-bold">Instructions Sent</p>
                <p className="mt-1 text-emerald-700">
                  If an account exists for <b>{forgotEmail}</b>, password reset instructions have been dispatched. Please check your inbox and spam folder.
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-block w-full py-3 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-green2 transition-colors cursor-pointer text-center"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleForgotRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Registered Email *</label>
              <input
                required
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="operator@maritamatrading.com"
                className="w-full px-3.5 py-2.5 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-brand-green"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-green2 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {loading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <div className="text-center pt-4">
              <Link to="/login" className="text-sm font-semibold text-brand-green hover:underline inline-flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

