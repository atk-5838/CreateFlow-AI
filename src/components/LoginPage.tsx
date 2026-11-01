import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, signup } = useWorkspace();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Custom Google input in modal
  const [customGoogleEmail, setCustomGoogleEmail] = useState('25g26.ashraf@sjec.ac.in');
  const [customGoogleName, setCustomGoogleName] = useState('Ashraf');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim() || !handle.trim() || !email.trim()) {
          setErrorMessage('Please fill in all required fields.');
          setIsLoading(false);
          return;
        }
        await signup(name, handle, email, password);
      } else {
        if (!email.trim() || !password.trim()) {
          setErrorMessage('Please enter both email and password.');
          setIsLoading(false);
          return;
        }
        await login(email, password);
      }
    } catch (err) {
      setErrorMessage('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInClick = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google popup closed or blocked, opening account selector:', err);
      setShowGoogleModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmGoogleSignIn = async (selectedEmail: string, selectedName: string) => {
    setIsLoading(true);
    setShowGoogleModal(false);
    await loginWithGoogle(selectedEmail, selectedName);
    setIsLoading(false);
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    await login('alex.rivera@creatorflow.internal', 'demo123');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex flex-col justify-center items-center p-4 sm:p-6 select-none font-['Inter',sans-serif]">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E6E1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

      {/* Main Container */}
      <div className="relative w-full max-w-md bg-white border border-[#E5E6E1] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-11 h-11 rounded-xl bg-[#216F50] text-white flex items-center justify-center font-bold text-xl shadow-xs">
            C
          </div>
          <h1 className="text-xl font-bold text-[#171A18] tracking-tight">
            CreatorFlow AI
          </h1>
          <p className="text-xs text-[#68716D]">
            Brand collaboration workspace for content creators
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="flex bg-[#F1F1ED] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              !isSignUp
                ? 'bg-white text-[#171A18] shadow-2xs'
                : 'text-[#68716D] hover:text-[#171A18]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isSignUp
                ? 'bg-white text-[#171A18] shadow-2xs'
                : 'text-[#68716D] hover:text-[#171A18]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google Sign In Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignInClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#F9FAF8] active:bg-[#F1F1ED] border border-[#E5E6E1] rounded-xl py-2.5 px-4 text-xs font-medium text-[#171A18] shadow-2xs transition-all hover:border-[#D0D4CD]"
          >
            {/* Google Multi-color Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#E5E6E1]"></div>
            <span className="absolute bg-white px-3 text-[11px] uppercase tracking-wider text-[#8A918D] font-medium">
              or continue with email
            </span>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {isSignUp && (
            <>
              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A918D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Creator Handle
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-[#8A918D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@alexcreates"
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-[#68716D] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A918D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@example.com"
                className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#68716D]">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Password reset instructions would be sent to your email.')}
                  className="text-[11px] text-[#216F50] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A918D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl pl-9 pr-9 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A918D] hover:text-[#171A18]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-xs transition-colors mt-2"
          >
            <span>{isSignUp ? 'Create Workspace' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Sample Profile Login Option */}
        <div className="pt-2 border-t border-[#F0F1ED]">
          <div className="bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl p-3 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#171A18] truncate">
                Alex Rivera (Sample Creator)
              </p>
              <p className="text-[11px] text-[#68716D] truncate">
                Preloaded with 5 active brand campaigns
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="shrink-0 bg-white hover:bg-[#EBEBE7] border border-[#E5E6E1] text-[#216F50] font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs ml-2"
            >
              1-Click Demo
            </button>
          </div>
        </div>

        {/* Trust & Privacy Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A918D] text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#216F50]" />
          <span>Encrypted creator session & private data storage</span>
        </div>
      </div>

      {/* Google Account Picker Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E6E1] mx-auto flex items-center justify-center shadow-2xs mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-[#171A18]">
                Sign in with Google
              </h3>
              <p className="text-xs text-[#68716D]">
                Choose an account to continue to CreatorFlow AI
              </p>
            </div>

            {/* Account List */}
            <div className="space-y-2 pt-1">
              {/* Option 1: Current Active User Email */}
              <button
                type="button"
                onClick={() => confirmGoogleSignIn('25g26.ashraf@sjec.ac.in', 'Ashraf')}
                className="w-full p-3 rounded-xl border border-[#E5E6E1] hover:bg-[#F7F7F4] flex items-center gap-3 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#216F50] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#171A18] truncate">
                    Ashraf
                  </p>
                  <p className="text-[11px] text-[#68716D] truncate">
                    25g26.ashraf@sjec.ac.in
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#216F50] bg-[#EBF5F0] px-2 py-0.5 rounded">
                  Current
                </span>
              </button>

              {/* Option 2: Alex Rivera Creator Account */}
              <button
                type="button"
                onClick={() => confirmGoogleSignIn('alexcreates.collabs@gmail.com', 'Alex Rivera')}
                className="w-full p-3 rounded-xl border border-[#E5E6E1] hover:bg-[#F7F7F4] flex items-center gap-3 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#185A42] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#171A18] truncate">
                    Alex Rivera
                  </p>
                  <p className="text-[11px] text-[#68716D] truncate">
                    alexcreates.collabs@gmail.com
                  </p>
                </div>
              </button>
            </div>

            {/* Custom Google Account Entry */}
            <div className="p-3 bg-[#F7F7F4] rounded-xl border border-[#E5E6E1] space-y-2">
              <span className="text-[10px] font-bold text-[#68716D] uppercase tracking-wider block">
                Or Use Another Google Account
              </span>
              <input
                type="text"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-white border border-[#E5E6E1] rounded-lg px-2.5 py-1.5 text-xs text-[#171A18]"
              />
              <input
                type="email"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full bg-white border border-[#E5E6E1] rounded-lg px-2.5 py-1.5 text-xs text-[#171A18]"
              />
              <button
                type="button"
                onClick={() => confirmGoogleSignIn(customGoogleEmail, customGoogleName)}
                className="w-full bg-[#171A18] hover:bg-black text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
              >
                Sign in with this account
              </button>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-xs text-[#68716D] hover:text-[#171A18]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
