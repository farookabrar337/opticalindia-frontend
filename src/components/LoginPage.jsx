import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.jpeg';

export default function LoginPage({ onLoginSuccess, registeredStaff = [], isDarkMode, isAdminPortal = false }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(isAdminPortal ? 'admin' : 'salesperson'); // 'salesperson' | 'admin'
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Keep role in sync with portal mode
  useEffect(() => {
    if (isAdminPortal) {
      setRole('admin');
    } else {
      setRole('salesperson');
    }
    setErrorMsg('');
  }, [isAdminPortal]);

  // Default hardcoded admin (Store Phone) & sample salespersons
  const DEFAULT_ADMIN = { phone: '7339334042', pin: '1234', name: 'Admin (Optics India)', role: 'admin', branch: 'All' };
  const DEFAULT_SALESPERSON = { phone: '9123456789', pin: '1111', name: 'Sales Executive (Optics India)', role: 'salesperson', branch: 'Optics India' };
  const DEFAULT_SALESPERSON_AYNCARE = { phone: '9876543210', pin: '2222', name: 'Sales Executive (Ayncare)', role: 'salesperson', branch: 'Ayncare' };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!pin || pin.length < 4) {
      setErrorMsg('Please enter your 4-digit PIN.');
      return;
    }

    const effectiveRole = isAdminPortal ? 'admin' : role;

    // Prevent Admin credentials from being used on the Salesperson /login portal
    if (!isAdminPortal && (cleanedPhone === DEFAULT_ADMIN.phone || registeredStaff.some(s => s.role === 'admin' && s.phone === cleanedPhone))) {
      setErrorMsg('Access restricted. Please use your designated administrator portal.');
      return;
    }

    // Admin Authentication Check
    if (effectiveRole === 'admin') {
      if (cleanedPhone === DEFAULT_ADMIN.phone && pin === DEFAULT_ADMIN.pin) {
        onLoginSuccess(DEFAULT_ADMIN);
        return;
      }
      // Check if user is registered as admin staff
      const foundAdmin = registeredStaff.find(s => s.role === 'admin' && s.phone === cleanedPhone && s.pin === pin);
      if (foundAdmin) {
        onLoginSuccess({
          ...foundAdmin,
          branch: foundAdmin.branch || 'All'
        });
        return;
      }
      setErrorMsg('Invalid Admin Phone Number or PIN. Default: 7339334042 / 1234');
      return;
    }

    // Salesperson Authentication Check
    if (effectiveRole === 'salesperson') {
      if (cleanedPhone === DEFAULT_SALESPERSON.phone && pin === DEFAULT_SALESPERSON.pin) {
        onLoginSuccess(DEFAULT_SALESPERSON);
        return;
      }

      if (cleanedPhone === DEFAULT_SALESPERSON_AYNCARE.phone && pin === DEFAULT_SALESPERSON_AYNCARE.pin) {
        onLoginSuccess(DEFAULT_SALESPERSON_AYNCARE);
        return;
      }

      const foundStaff = registeredStaff.find(s => s.phone === cleanedPhone && s.pin === pin);
      if (foundStaff) {
        onLoginSuccess({
          ...foundStaff,
          branch: (foundStaff.branch || 'Optics India').trim()
        });
        return;
      }

      setErrorMsg('No matching Salesperson found with this Phone & PIN. Ask Admin to register your number.');
      return;
    }
  };

  const fillDemoCredentials = (demoType) => {
    setErrorMsg('');
    if (demoType === 'admin') {
      setRole('admin');
      setPhone('7339334042');
      setPin('1234');
    } else if (demoType === 'salesperson_ayncare') {
      setRole('salesperson');
      setPhone('9876543210');
      setPin('2222');
    } else {
      setRole('salesperson');
      setPhone('9123456789');
      setPin('1111');
    }
  };

  const bgClass = isDarkMode ? 'aurora-bg-dark text-slate-100' : 'aurora-bg-light text-slate-900';
  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${bgClass}`}>
      <div className={`${panelClass} max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden border border-white/20`}>
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#0B2D5B]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-3xl bg-[#0B2D5B] mx-auto flex items-center justify-center border border-[#D4AF37]/50 shadow-xl overflow-hidden ring-4 ring-[#D4AF37]/20 p-1.5">
            <img 
              src={logoImg} 
              alt="Optics India Logo" 
              className="w-full h-full object-contain scale-110 rounded-2xl" 
            />
          </div>
          
          <h1 className="text-3xl font-brand font-semibold tracking-tight flex items-center justify-center gap-0.5">
            <span className={isDarkMode ? 'text-slate-100' : 'text-[#0B2D5B]'}>Optics</span>
            <span className="text-[#D4AF37] font-extrabold tracking-wide">India</span>
          </h1>

          {isAdminPortal ? (
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-widest shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Executive Admin Portal</span>
              </div>
              <p className="text-xs font-semibold opacity-70 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Enterprise Store Control & Multi-Branch Access
              </p>
            </div>
          ) : (
            <p className="text-xs font-semibold opacity-70 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> POS & Inventory Management System
            </p>
          )}
        </div>

        {/* Role Banner (Only on Salesperson Portal) */}
        {!isAdminPortal && (
          <div className="py-2.5 px-4 rounded-2xl bg-[#0B2D5B]/10 dark:bg-[#061833] border border-[#0B2D5B]/20 dark:border-[#D4AF37]/30 flex items-center justify-between font-bold text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0B2D5B]/10 dark:bg-[#D4AF37]/20 border border-[#0B2D5B]/20 dark:border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-[#0B2D5B] dark:text-[#D4AF37]" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-[#0B2D5B] dark:text-white text-[12px] tracking-tight">Salesperson Portal</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Branch Sales Staff & POS Billing</div>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#0B2D5B]/15 dark:bg-[#D4AF37]/20 border border-[#0B2D5B]/20 dark:border-[#D4AF37]/40 text-[#0B2D5B] dark:text-[#D4AF37] font-black uppercase tracking-wider shrink-0">
              STAFF ACCESS
            </span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-semibold text-center animate-in fade-in duration-200">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
          {/* Phone Number Input */}
          <div className="space-y-1.5">
            <label className="block opacity-80 font-bold">
              {isAdminPortal || role === 'admin' ? 'Admin Phone Number (Login ID):' : 'Salesperson Phone Number:'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type="text"
                maxLength={10}
                placeholder={isAdminPortal ? "10-digit admin mobile (e.g. 7339334042)" : "10-digit mobile number"}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className={`w-full rounded-2xl pl-10 pr-4 py-2.5 font-mono font-bold ${inputClass}`}
              />
            </div>
          </div>

          {/* PIN Input */}
          <div className="space-y-1.5">
            <label className="block opacity-80 font-bold">4-Digit Security PIN:</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className={`w-full rounded-2xl pl-10 pr-10 py-2.5 font-mono font-bold tracking-widest text-center text-sm ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl text-[#061833] font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 bg-gradient-to-r from-[#D4AF37] via-[#E5C358] to-[#B89025] hover:from-[#E5C358] hover:to-[#D4AF37] shadow-[#D4AF37]/30 ring-1 ring-amber-200/50"
          >
            <span>Sign In as {isAdminPortal || role === 'admin' ? 'Administrator' : 'Salesperson'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Action - Credentials Badge for Admin */}
        {isAdminPortal && (
          <div className="pt-2 border-t border-slate-400/20 text-center space-y-2">
            <p className="text-[11px] opacity-60 font-semibold">Quick Action:</p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="px-3.5 py-1.5 rounded-xl bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/50 border border-[#0B2D5B]/20 dark:border-[#D4AF37]/30 text-[#0B2D5B] dark:text-[#D4AF37] hover:bg-[#0B2D5B]/20 dark:hover:bg-[#D4AF37]/20 text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>👑 Admin (All Branches)</span>
              </button>
            </div>
          </div>
        )}

        {/* Demo Quick-Fill Buttons (Only on Salesperson Login) */}
        {!isAdminPortal && (
          <div className="pt-2 border-t border-slate-400/20 text-center space-y-2">
            <p className="text-[11px] opacity-60 font-semibold">Quick Demo Login Shortcuts:</p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => fillDemoCredentials('salesperson')}
                className="px-3 py-1.5 rounded-xl bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/50 border border-[#0B2D5B]/20 dark:border-[#D4AF37]/30 text-[#0B2D5B] dark:text-[#D4AF37] hover:bg-[#0B2D5B]/20 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                👤 Sales: Optics India
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('salesperson_ayncare')}
                className="px-3 py-1.5 rounded-xl bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/50 border border-[#0B2D5B]/20 dark:border-[#D4AF37]/30 text-[#0B2D5B] dark:text-[#D4AF37] hover:bg-[#0B2D5B]/20 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                👤 Sales: Ayncare
              </button>
            </div>
          </div>
        )}

        {/* Admin Portal Switcher (Only visible on the /optics-admin portal) */}
        {isAdminPortal && (
          <div className="pt-2 border-t border-slate-400/20 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-slate-500 hover:text-[#0B2D5B] dark:text-slate-400 dark:hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>← Switch to Staff / Salesperson Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
