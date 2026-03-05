'use client';

import { useState } from 'react';
import { Shield, Lock, ChevronRight } from 'lucide-react';

type LoginPageProps = {
  onLogin: (email: string) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [stage, setStage] = useState<'landing' | 'microsoft' | 'loading'>('landing');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleMicrosoftSignIn = () => {
    setStage('microsoft');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Enter a valid email address, phone number, or Skype name.');
      return;
    }
    if (!email.includes('@')) {
      setEmailError('Enter a valid email address, phone number, or Skype name.');
      return;
    }
    setEmailError('');
    setStage('loading');
    setTimeout(() => {
      onLogin(email);
    }, 2200);
  };

  // ── Stage 3: Loading / Redirecting ──
  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#0078d4] animate-spin" />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">Authenticating with Microsoft Entra ID...</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">Verifying credentials and loading your session</p>
        </div>
      </div>
    );
  }

  // ── Stage 2: Microsoft Sign-In Modal ──
  if (stage === 'microsoft') {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4">
        {/* Microsoft sign-in card */}
        <div className="w-full max-w-[440px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] animate-fadeInUp">
          {/* EasyPay org banner */}
          <div className="px-11 pt-8 pb-4 flex items-center gap-3 border-b border-[#e8e8e8]">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">EP</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1b1b1b]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>EasyPay Analytics Center</p>
              <p className="text-[11px] text-[#767676]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>easypay.com</p>
            </div>
          </div>

          {/* Microsoft logo bar */}
          <div className="px-11 pt-6 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="108" height="24" viewBox="0 0 108 24" fill="none">
              <text x="28" y="18" fontFamily="Segoe UI, sans-serif" fontSize="16" fontWeight="600" fill="#242424">Microsoft</text>
              <rect x="0" y="2" width="10" height="10" fill="#f25022"/>
              <rect x="12" y="2" width="10" height="10" fill="#7fba00"/>
              <rect x="0" y="14" width="10" height="10" fill="#00a4ef"/>
              <rect x="12" y="14" width="10" height="10" fill="#ffb900"/>
            </svg>
          </div>

          <div className="px-11 pb-10">
            <h1 className="text-2xl font-light text-[#1b1b1b] mb-4" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              Sign in
            </h1>

            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="Email, phone, or Skype"
                  autoFocus
                  className="w-full px-2 py-1.5 text-[15px] border-0 border-b-[1px] border-[#767676] outline-none focus:border-b-2 focus:border-[#0067b8] placeholder:text-[#767676] text-[#1b1b1b] transition-colors bg-transparent"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                />
                {emailError && (
                  <p className="text-[13px] text-[#e81123] mt-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                    {emailError}
                  </p>
                )}
              </div>

              <p className="text-[13px] text-[#1b1b1b] mb-4" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                No account?{' '}
                <a href="#" className="text-[#0067b8] hover:underline hover:text-[#005a9e]" onClick={(e) => e.preventDefault()}>
                  Create one!
                </a>
              </p>

              <p className="text-[13px] text-[#0067b8] hover:underline hover:text-[#005a9e] cursor-pointer mb-8" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                Can&apos;t access your account?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setStage('landing'); setEmail(''); setEmailError(''); }}
                  className="px-6 py-1.5 bg-white text-[#1b1b1b] text-[15px] font-normal border border-[#8c8c8c] hover:bg-[#f2f2f2] transition-colors cursor-pointer"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 bg-[#0067b8] text-white text-[15px] font-normal hover:bg-[#005a9e] transition-colors cursor-pointer"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  Next
                </button>
              </div>
            </form>
          </div>

          {/* Sign-in options */}
          <div className="border-t border-[#e8e8e8] px-11 py-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => e.preventDefault()}>
              <div className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 1.5c.83 0 1.5.67 1.5 1.5S8.83 6.5 8 6.5 6.5 5.83 6.5 5 7.17 3.5 8 3.5zM8 13c-1.5 0-2.83-.77-3.6-1.94C4.42 9.84 6.83 9.25 8 9.25s3.58.59 3.6 1.81C10.83 12.23 9.5 13 8 13z" fill="#767676"/></svg>
              </div>
              <span className="text-[13px] text-[#0067b8] group-hover:underline" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                Sign-in options
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Stage 1: EasyPay Landing ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1e3a5f] to-[#1a2332] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10b981]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#3b82f6]/8 rounded-full blur-3xl" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        {/* Logo & branding */}
        <div className="text-center mb-8">
          <img src="/easypay-logo.svg" alt="EasyPay" className="h-12 mx-auto mb-3" />
          <p className="text-xs text-[#94a3b8] uppercase tracking-widest font-medium">Analytics Center</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Welcome back</h2>
            <p className="text-sm text-[#64748b]">Sign in to access the EasyPay Analytics Center</p>
          </div>

          {/* SSO Button */}
          <div className="px-8 pb-6">
            <button
              onClick={handleMicrosoftSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-[#e2e8f0] rounded-xl hover:bg-[#f8fafc] hover:border-[#cbd5e1] active:bg-[#f1f5f9] transition-all cursor-pointer group"
            >
              {/* Microsoft logo */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                <rect x="0" y="0" width="9.5" height="9.5" fill="#f25022"/>
                <rect x="10.5" y="0" width="9.5" height="9.5" fill="#7fba00"/>
                <rect x="0" y="10.5" width="9.5" height="9.5" fill="#00a4ef"/>
                <rect x="10.5" y="10.5" width="9.5" height="9.5" fill="#ffb900"/>
              </svg>
              <span className="text-sm font-medium text-[#1e293b]">Sign in with Microsoft</span>
              <ChevronRight size={16} className="text-[#94a3b8] group-hover:text-[#64748b] transition-colors ml-auto" />
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#e2e8f0]" />
              <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium">SSO Required</span>
              <div className="flex-1 h-px bg-[#e2e8f0]" />
            </div>

            {/* Security info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0]">
                <Shield size={16} className="text-[#10b981] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#166534]">Microsoft Entra ID Protected</p>
                  <p className="text-[11px] text-[#15803d] mt-0.5">Authentication managed by your organization&apos;s identity provider</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                <Lock size={16} className="text-[#64748b] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#334155]">Role-Based Access</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">Dashboard access is restricted to authorized EasyPay personnel only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-[#f8fafc] border-t border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-medium">EasyPay Analytics Center v2.4</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[10px] text-[#10b981] font-medium">Systems Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-[#64748b]">
            Having trouble signing in?{' '}
            <a href="#" className="text-[#10b981] hover:underline" onClick={(e) => e.preventDefault()}>Contact IT Support</a>
          </p>
          <p className="text-[10px] text-[#475569]">
            &copy; {new Date().getFullYear()} EasyPay Financial Services. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
