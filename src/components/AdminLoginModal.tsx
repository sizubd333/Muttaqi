import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  X,
  Lock,
  Mail,
  ShieldAlert,
  KeyRound,
  Compass,
  ShieldCheck,
  User,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { HajiRegistrationForm } from './HajiRegistrationForm';
import { SubAdminRegistrationForm } from './SubAdminRegistrationForm';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'haji' | 'sub_admin';
  initialTab?: 'haji' | 'admin';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  initialTab = 'haji'
}) => {
  const { login, hajiLogin } = useAdmin();
  const [viewMode, setViewMode] = useState<'login' | 'haji' | 'sub_admin'>(initialMode);
  const [loginTab, setLoginTab] = useState<'haji' | 'admin'>(initialTab);

  // Admin login states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Haji login states (User ID and Password)
  const [hajiUserId, setHajiUserId] = useState('');
  const [hajiPassword, setHajiPassword] = useState('');
  const [showHajiPass, setShowHajiPass] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setViewMode(initialMode);
      setLoginTab(initialTab);
      setError(null);
    }
  }, [isOpen, initialMode, initialTab]);

  if (!isOpen) return null;

  // Handle Haji Login (User ID + Password)
  const handleHajiLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const session = hajiLogin(hajiUserId, hajiPassword);
      setIsSubmitting(false);
      if (session) {
        onClose();
      } else {
        setError(
          'ভুল হাজী ইউজার আইডি অথবা পাসওয়ার্ড। সঠিক ইউজার আইডি (যেমন: HAJI-2026-XXXX, মোবাইল বা পাসপোর্ট নম্বর) ও পাসওয়ার্ড দিন।'
        );
      }
    }, 350);
  };

  // Handle Admin / Sub-Admin Login
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(adminEmail, adminPassword);
      setIsSubmitting(false);
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।');
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className={`bg-white rounded-3xl ${
          viewMode === 'login'
            ? 'max-w-md'
            : viewMode === 'haji'
            ? 'max-w-3xl'
            : 'max-w-xl'
        } w-full p-5 sm:p-7 shadow-2xl relative border border-[#DCB473]/30 max-h-[92vh] overflow-y-auto transition-all`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* View Mode 1: LOGIN PORTAL (Tabs: Haji Login & Admin Login) */}
        {viewMode === 'login' && (
          <div>
            {/* Header Login Tabs Switcher */}
            <div className="flex items-center justify-center mb-5">
              <div className="inline-flex p-1 bg-stone-100 rounded-2xl border border-stone-200 shadow-inner w-full">
                {/* Tab 1: Haji Login */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginTab('haji');
                    setError(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    loginTab === 'haji'
                      ? 'bg-[#0f2922] text-[#DCB473] shadow-md'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>হাজী লগইন (Haji Login)</span>
                </button>

                {/* Tab 2: Admin Login */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginTab('admin');
                    setError(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    loginTab === 'admin'
                      ? 'bg-[#0f2922] text-[#DCB473] shadow-md'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>এডমিন লগইন (Admin)</span>
                </button>
              </div>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* TAB CONTENT 1: HAJI LOGIN (User ID & Password) */}
            {loginTab === 'haji' && (
              <div className="animate-in fade-in duration-150">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <Compass className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f2922]">
                    হাজী লগইন (Haji Login)
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    আপনার ইউজার আইডি ও পাসওয়ার্ড দিয়ে প্রোফাইলে প্রবেশ করুন
                  </p>
                </div>

                <form onSubmit={handleHajiLoginSubmit} className="space-y-3.5">
                  {/* Field 1: User ID */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>হাজী ইউজার আইডি (User ID) *</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        Tracking ID / Mobile / Passport
                      </span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={hajiUserId}
                        onChange={(e) => setHajiUserId(e.target.value)}
                        placeholder="e.g. HAJI-2026-1001 বা ০১৭২২-৪৫৫৬৬৭"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Field 2: Password */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>পাসওয়ার্ড (Password) *</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        গোপন পাসওয়ার্ড
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type={showHajiPass ? 'text' : 'password'}
                        required
                        value={hajiPassword}
                        onChange={(e) => setHajiPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowHajiPass(!showHajiPass)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showHajiPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                  >
                    {isSubmitting ? (
                      <span>যাচাই করা হচ্ছে...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-[#DCB473]" />
                        <span>হাজী পোর্টালে লগইন করুন</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Haji Credentials Box */}
                <div className="mt-3 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold">টেস্ট ডেমো লগইন:</span> ইউজার আইডি{' '}
                    <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                      HAJI-2026-1001
                    </span>{' '}
                    বা{' '}
                    <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                      ০১৭২২-৪৫৫৬৬৭
                    </span>{' '}
                    এবং পাসওয়ার্ড:{' '}
                    <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                      Haji12
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: ADMIN & SUB-ADMIN LOGIN */}
            {loginTab === 'admin' && (
              <div className="animate-in fade-in duration-150">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0f2922] text-[#DCB473] flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f2922]">
                    এডমিন ও সাব-এডমিন লগইন
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    কন্ট্রোল প্যানেলে প্রবেশের জন্য আপনার ইমেইল ও পাসওয়ার্ড লিখুন
                  </p>
                </div>

                <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>এডমিন / সাব-এডমিন ইমেইল *</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        Registered Email
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="muttaqi.kafela@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#DCB473] focus:border-[#DCB473] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>পাসওয়ার্ড *</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        Security Key
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#DCB473] focus:border-[#DCB473] bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showAdminPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 bg-[#0f2922] hover:bg-[#184236] text-[#DCB473] font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                  >
                    {isSubmitting ? (
                      <span>যাচাই করা হচ্ছে...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>এডমিন প্যানেলে লগইন করুন</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Admin Credentials Box */}
                <div className="mt-3 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600 flex items-start gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#b88e44] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold text-stone-800">সুপার এডমিন:</span>{' '}
                    <span className="font-mono text-stone-900">muttaqi.kafela@gmail.com</span> |{' '}
                    <span className="font-mono text-stone-900">Muttaqi111@</span>
                  </div>
                </div>
              </div>
            )}

            {/* SEPARATOR & REGISTRATION BUTTONS */}
            <div className="mt-5 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px bg-stone-200 flex-1" />
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  অথবা অনলাইন নিবন্ধন করুন
                </span>
                <div className="h-px bg-stone-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Button 1: Registration as "A Haji" */}
                <button
                  type="button"
                  onClick={() => setViewMode('haji')}
                  className="p-3 text-left bg-gradient-to-br from-emerald-50/90 to-teal-50/70 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-300 hover:border-emerald-500 rounded-2xl transition-all shadow-xs hover:shadow-md group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-[#0f2922] text-[#DCB473] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f2922] block leading-tight">
                        Registration as "A Haji"
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold">
                        হাজী হিসেবে নিবন্ধন
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-600 line-clamp-1">
                    পবিত্র হজ্ব ও ওমরাহ প্রাক-নিবন্ধন ফরম
                  </p>
                </button>

                {/* Button 2: Registration as "Sub Admin" (replaces Registration as "Partner") */}
                <button
                  type="button"
                  onClick={() => setViewMode('sub_admin')}
                  className="p-3 text-left bg-gradient-to-br from-amber-50/90 to-orange-50/60 hover:from-amber-100 hover:to-orange-100 border-2 border-[#DCB473] hover:border-[#b88e44] rounded-2xl transition-all shadow-xs hover:shadow-md group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-[#0f2922] text-[#DCB473] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f2922] block leading-tight">
                        Registration as "Sub Admin"
                      </span>
                      <span className="text-[10px] text-[#b88e44] font-semibold">
                        সাব-এডমিন নিবন্ধন
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-600 line-clamp-1">
                    English Name, Email & Password
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: HAJI REGISTRATION FORM */}
        {viewMode === 'haji' && (
          <HajiRegistrationForm
            onBackToLogin={() => setViewMode('login')}
            onCloseModal={onClose}
          />
        )}

        {/* View Mode 3: SUB ADMIN REGISTRATION FORM */}
        {viewMode === 'sub_admin' && (
          <SubAdminRegistrationForm
            onBackToLogin={() => setViewMode('login')}
            onSuccessRedirectToLogin={() => {
              setViewMode('login');
              setLoginTab('admin');
            }}
          />
        )}
      </div>
    </div>
  );
};
