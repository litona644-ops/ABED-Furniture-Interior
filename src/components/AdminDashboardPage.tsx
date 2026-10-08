import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Timer, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Package, 
  FolderCheck, 
  BarChart, 
  Settings, 
  ArrowLeft, 
  RefreshCw, 
  Activity, 
  Power, 
  Layers, 
  KeyRound, 
  Save, 
  ExternalLink,
  ChevronRight,
  Database,
  Radio,
  Sliders,
  Megaphone,
  Bell,
  Palette
} from 'lucide-react';
import { Product, CompletedProject } from '../types';
import AdminProductManager from './AdminProductManager';
import { AdminProjectManager } from './AdminProjectManager';
import VisitorAnalyticsDashboard from './VisitorAnalyticsDashboard';
import { AdminOfferBannerManager } from './AdminOfferBannerManager';
import { AdminNoticeManager } from './AdminNoticeManager';
import { AdminThemeColorManager } from './AdminThemeColorManager';
import { AdminAccessSecurityDashboard } from './AdminAccessSecurityDashboard';

interface AdminDashboardPageProps {
  isAdminUnlocked: boolean;
  adminEmail: string;
  setAdminEmail: (v: string) => void;
  adminPassword: string;
  setAdminPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  handleAdminLogin: (e: React.FormEvent) => void;
  handleAdminLogout: () => void;
  lockoutSeconds: number;
  failedAttempts: number;
  adminNotification: { message: string; type: 'success' | 'error' } | null;
  setAdminNotification: (v: { message: string; type: 'success' | 'error' } | null) => void;
  isMaintenanceMode: boolean;
  onToggleMaintenance: () => void;
  products: Product[];
  onProductCreated: (p: Product) => Promise<void>;
  onProductUpdated: (p: Product) => Promise<void>;
  onProductDeleted: (id: string, name: string) => Promise<void>;
  completedProjects: CompletedProject[];
  setCompletedProjects: React.Dispatch<React.SetStateAction<CompletedProject[]>>;
  successTarget: number;
  setSuccessTarget: (v: number) => void;
  pendingTarget: number;
  setPendingTarget: (v: number) => void;
  onUpdateStats: (s: number, p: number) => void;
  siteSettings: any;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSaveSiteSettings: () => void;
  adminMasterPasscode: string;
  onUpdateMasterPasscode: (code: string) => Promise<boolean>;
  resetAllToDefaults: () => void;
  onBackToHome: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  isAdminUnlocked,
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  showPassword,
  setShowPassword,
  handleAdminLogin,
  handleAdminLogout,
  lockoutSeconds,
  failedAttempts,
  adminNotification,
  setAdminNotification,
  isMaintenanceMode,
  onToggleMaintenance,
  products,
  onProductCreated,
  onProductUpdated,
  onProductDeleted,
  completedProjects,
  setCompletedProjects,
  successTarget,
  setSuccessTarget,
  pendingTarget,
  setPendingTarget,
  onUpdateStats,
  siteSettings,
  setSiteSettings,
  onSaveSiteSettings,
  adminMasterPasscode,
  onUpdateMasterPasscode,
  resetAllToDefaults,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'colors' | 'notice' | 'offers' | 'maintenance' | 'products' | 'projects' | 'stats' | 'site_info' | 'security'>('analytics');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode !== confirmPasscode) {
      setAdminNotification({ message: 'উভয় পাসকোড একই হতে হবে!', type: 'error' });
      return;
    }
    const success = await onUpdateMasterPasscode(newPasscode);
    if (success) {
      setNewPasscode('');
      setConfirmPasscode('');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-stone-100 flex flex-col font-sans selection:bg-[#d4a762]/30 selection:text-white relative overflow-x-hidden">
      
      {/* Background Subtle Luxury Lighting and Micro Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-stone-900/40 via-black to-black pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#d4a762]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Mesh Texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* ========================================================
          EXECUTIVE FULL-BLACK TOPBAR
          ======================================================== */}
      <header className="relative z-30 border-b border-white/[0.08] bg-[#050505]/90 backdrop-blur-2xl sticky top-0 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white text-xs font-bold border border-white/[0.08] transition-all cursor-pointer"
            title="মূল ওয়েবসাইটে ফিরে যান"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#d4a762]" />
            <span className="hidden sm:inline">ওয়েবসাইটে যান</span>
            <span className="sm:hidden">Home</span>
          </button>

          <div className="h-5 w-px bg-white/[0.08]" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4a762] via-[#b88e4f] to-[#734e1c] p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#080808] rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-xs text-[#f5d799]">A</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>{siteSettings.brandNameLeft || 'Abed'}</span>
                  <span className="text-[#d4a762] font-light">{siteSettings.brandNameRight || 'Interior'}</span>
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#f5d799] border border-white/[0.1] font-bold">
                  ADMIN
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-mono mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase & Firebase Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Status Pill */}
          <div className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md ${
            isMaintenanceMode 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isMaintenanceMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="text-[11px] font-mono">
              {isMaintenanceMode ? 'Maintenance Active' : 'Site Online'}
            </span>
          </div>

          {isAdminUnlocked && (
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="লক ও সাইনআউট করুন"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">লক ও সাইনআউট</span>
            </button>
          )}
        </div>
      </header>

      {/* Floating Notifications */}
      <AnimatePresence>
        {adminNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-16 right-4 sm:right-8 z-50 max-w-md p-4 rounded-2xl flex items-center gap-3 border shadow-2xl backdrop-blur-xl ${
              adminNotification.type === 'error'
                ? 'bg-[#180a0a]/95 text-red-200 border-red-500/40'
                : 'bg-[#0a180f]/95 text-emerald-200 border-emerald-500/40'
            }`}
          >
            {adminNotification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-semibold leading-relaxed flex-1">
              {adminNotification.message}
            </span>
            <button
              onClick={() => setAdminNotification(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MAIN BODY
          ======================================================== */}
      <main className="flex-1 relative z-10 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* ========================================================
            1. FULL-BLACK SECURED LOGIN SCREEN (When not unlocked)
            ======================================================== */}
        {!isAdminUnlocked ? (
          <div className="max-w-md mx-auto my-12 sm:my-20">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative p-8 sm:p-10 rounded-3xl bg-[#080808] border border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-center overflow-hidden"
            >
              {/* Top ambient gold highlight */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4a762]/70 to-transparent" />

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10.5px] font-black uppercase tracking-wider mb-5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted Admin Portal</span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-white/[0.1] flex items-center justify-center mx-auto mb-4 text-[#f5d799] shadow-inner">
                <Lock className="w-7 h-7 text-[#f5d799]" />
              </div>

              <h2 className="text-2xl font-black text-white font-serif uppercase tracking-tight mb-2">
                এডমিন সিকিউরড অ্যাক্সেস
              </h2>
              <p className="text-xs text-stone-400 font-medium mb-6 leading-relaxed">
                পণ্য, হ্যান্ডওভার প্রজেক্ট ও ওয়েবসাইট রক্ষণাবেক্ষণ পরিচালনায় আপনার অ্যাডমিন ক্রেডেন্সিয়াল অথবা মাস্টার পাসকোড দিন।
              </p>

              {/* Brute Force Lockout Alert */}
              {lockoutSeconds > 0 && (
                <div className="mb-5 p-3.5 bg-red-950/80 border border-red-500/40 rounded-2xl text-red-200 text-xs font-bold flex items-center gap-2.5 text-left animate-pulse">
                  <Timer className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="font-black text-red-100">অনেকবার ভুল চেষ্টা করা হয়েছে!</p>
                    <p className="text-[11px] text-red-300 mt-0.5">
                      নিরাপত্তার স্বার্থে এডমিন লগইন সাময়িক স্থগিত। পুনরায় চেষ্টার সময় বাকি: <strong className="font-mono text-red-100 underline">{lockoutSeconds} সেকেন্ড</strong>
                    </p>
                  </div>
                </div>
              )}

              {failedAttempts > 0 && lockoutSeconds === 0 && (
                <div className="mb-4 p-2.5 bg-amber-950/60 border border-amber-500/30 rounded-xl text-amber-200 text-[11px] font-bold text-left flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ভুল চেষ্টা লক্ষ্য করা হয়েছে! অবশিষ্ট সুযোগ: <strong>{5 - failedAttempts} বার</strong></span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10.5px] font-bold text-[#d4a762] uppercase mb-1.5 tracking-wider font-mono">
                    ইমেইল ঠিকানা (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    placeholder="admin@abedfurniture.com বা আপনার রেজিস্টার্ড ইমেইল"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    disabled={lockoutSeconds > 0}
                    className="w-full bg-[#020202] border border-white/[0.1] text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#d4a762] placeholder:text-stone-600 transition-all font-semibold disabled:opacity-50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10.5px] font-bold text-[#d4a762] uppercase tracking-wider font-mono">
                      পাসওয়ার্ড বা মাস্টার পাসকোড*
                    </label>
                    <span className="text-[10px] text-stone-500 font-mono">Master Key</span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="পাসওয়ার্ড লিখুন (যেমন: abed2026)"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      disabled={lockoutSeconds > 0}
                      required
                      className="w-full bg-[#020202] border border-white/[0.1] text-white rounded-xl pl-4 pr-11 py-3 text-xs focus:outline-none focus:border-[#d4a762] placeholder:text-stone-600 transition-all font-semibold disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={lockoutSeconds > 0}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 cursor-pointer transition-colors"
                      title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={lockoutSeconds > 0}
                  className="w-full bg-gradient-to-r from-[#d4a762] via-[#e2bb75] to-[#a3722a] hover:brightness-110 active:scale-[0.99] text-[#000000] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4 text-[#000000]" />
                  <span>এডমিন প্যানেল আনলক করুন</span>
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          /* ========================================================
             2. FULL-BLACK UNLOCKED DASHBOARD (Unique Arrangement)
             ======================================================== */
          <div className="space-y-6">
            
            {/* Top Arrangement: Master Maintenance Card + Quick Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* HERO CARD: SERVER STATUS & LOCKDOWN CONTROL */}
              <div className="lg:col-span-2 relative p-6 sm:p-7 rounded-3xl bg-[#080808] border border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#d4a762]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4a762]/40 to-transparent" />

                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] uppercase font-mono text-[#d4a762] mb-2 tracking-widest">
                        <Activity className="w-3.5 h-3.5 text-[#d4a762]" />
                        <span>Centralized Lockdown System</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider uppercase">
                        SERVER STATUS
                      </h2>
                    </div>

                    {/* Prominent Live Indicator Pill matching user spec */}
                    <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border font-bold text-xs sm:text-sm shadow-xl transition-all ${
                      isMaintenanceMode 
                        ? 'bg-red-500/10 border-red-500/40 text-red-400' 
                        : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    }`}>
                      <span className={`w-3 h-3 rounded-full ${isMaintenanceMode ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                      <span className="font-mono font-black uppercase tracking-wider">
                        {isMaintenanceMode ? '🔴 SERVER UNDER MAINTENANCE' : '🟢 SERVER ONLINE'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed mb-6">
                    {isMaintenanceMode ? (
                      <span className="text-red-300/90 font-mono">
                        🛑 <strong>LOCKDOWN ACTIVE:</strong> পুরো public website সাময়িকভাবে সম্পূর্ণ লকডাউন রয়েছে। কোনো visitor হোমপেজ, প্রোডাক্ট, ফর্ম বা কোনো public URL দেখতে পারবে না। শুধুমাত্র এই /admin প্যানেলটি Admin এর জন্য অ্যাক্সেসযোগ্য।
                      </span>
                    ) : (
                      <span className="text-emerald-300/90 font-mono">
                        ✅ <strong>SERVER ONLINE:</strong> ওয়েবসাইট সম্পূর্ণ উন্মুক্ত ও স্বাভাবিক রয়েছে। সব visitor হোমপেজ, প্রোডাক্ট ও হ্যান্ডওভার প্রজেক্ট গ্যালারি স্বাভাবিকভাবে ব্যবহার করতে পারছে।
                      </span>
                    )}
                  </p>
                </div>

                {/* ON / OFF Switch Row */}
                <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-stone-200 uppercase font-mono tracking-wide">
                      {isMaintenanceMode ? 'Lockdown Mode : ON' : 'Lockdown Mode : OFF'}
                    </span>

                    <button
                      type="button"
                      onClick={onToggleMaintenance}
                      className={`relative inline-flex h-9 w-20 items-center rounded-full transition-colors cursor-pointer focus:outline-none p-1 shadow-inner ${
                        isMaintenanceMode ? 'bg-red-600' : 'bg-stone-800'
                      }`}
                      title={isMaintenanceMode ? 'Maintenance Mode OFF করুন' : 'Maintenance Mode ON করুন'}
                    >
                      <span
                        className={`inline-flex items-center justify-center h-7 w-7 transform rounded-full bg-white transition-transform shadow-md text-[10px] font-black font-mono ${
                          isMaintenanceMode ? 'translate-x-11 text-red-600' : 'translate-x-0 text-stone-800'
                        }`}
                      >
                        {isMaintenanceMode ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-stone-400 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isMaintenanceMode ? 'bg-red-400' : 'bg-emerald-400'}`} />
                    <span>Persistent (Supabase + Firebase + LocalStorage)</span>
                  </div>
                </div>
              </div>

              {/* QUICK METRICS TILE */}
              <div className="p-6 rounded-3xl bg-[#080808] border border-white/[0.08] shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d4a762]" />
                    <span>System Counters</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Products</span>
                      <span className="text-2xl font-black text-white">{products.length}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Handovers</span>
                      <span className="text-2xl font-black text-white">{completedProjects.length}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Delivered</span>
                      <span className="text-2xl font-black text-emerald-400">{successTarget}+</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Pending</span>
                      <span className="text-2xl font-black text-amber-400">{pendingTarget}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-white text-xs font-bold border border-white/[0.08] transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#d4a762]" />
                    <span>Preview Site</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetAllToDefaults}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-red-950/40 text-stone-400 hover:text-red-300 text-xs font-semibold border border-white/[0.08] hover:border-red-500/40 transition-all cursor-pointer"
                    title="রিস্টোর ফ্যাক্টরি ডিফল্ট"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================
                SEGMENTED WORKSPACE DOCK (Full Black Navigation)
                ======================================================== */}
            <div className="p-1.5 rounded-2xl bg-[#080808] border border-white/[0.08] flex items-center gap-2 overflow-x-auto shadow-2xl">
              {[
                { id: 'analytics', label: 'Visitor Analytics', icon: Activity },
                { id: 'colors', label: 'Theme & Element Colors', icon: Palette },
                { id: 'notice', label: 'Notice & Custom Text', icon: Bell },
                { id: 'offers', label: 'Offers & Advertising', icon: Megaphone },
                { id: 'maintenance', label: 'Maintenance Mode', icon: Power },
                { id: 'products', label: 'Products & Images', icon: Package },
                { id: 'projects', label: 'Handover Projects', icon: FolderCheck },
                { id: 'stats', label: 'Project Stats', icon: BarChart },
                { id: 'site_info', label: 'Site Content & Branding', icon: Settings },
                { id: 'security', label: 'Admin Access & Devices', icon: ShieldCheck }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d4a762] via-[#e0b873] to-[#ad7d33] text-[#000000] font-black shadow-md'
                        : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ========================================================
                TAB CONTENT WORKSPACE
                ======================================================== */}
            <div className="p-4 sm:p-8 rounded-3xl bg-[#080808] border border-white/[0.08] shadow-2xl text-left">
              
              {/* TAB 0: VISITOR ANALYTICS */}
              {activeTab === 'analytics' && (
                <VisitorAnalyticsDashboard />
              )}

              {/* TAB 0.1: THEME & ELEMENT COLORS CUSTOMIZER */}
              {activeTab === 'colors' && (
                <AdminThemeColorManager
                  siteSettings={siteSettings}
                  setSiteSettings={setSiteSettings}
                  onSaveSiteSettings={onSaveSiteSettings}
                  onShowNotification={(msg, type) => setAdminNotification({ message: msg, type })}
                />
              )}

              {/* TAB 0.2: HOMEPAGE NOTICE & CUSTOM TEXT */}
              {activeTab === 'notice' && (
                <AdminNoticeManager
                  siteSettings={siteSettings}
                  setSiteSettings={setSiteSettings}
                  onSaveSiteSettings={onSaveSiteSettings}
                  onShowNotification={(msg, type) => setAdminNotification({ message: msg, type })}
                />
              )}

              {/* TAB 0.5: HOMEPAGE OFFERS & ADVERTISING */}
              {activeTab === 'offers' && (
                <AdminOfferBannerManager
                  siteSettings={siteSettings}
                  setSiteSettings={setSiteSettings}
                  onSaveSiteSettings={onSaveSiteSettings}
                  phone1={siteSettings.phone1}
                  onShowNotification={(msg, type) => setAdminNotification({ message: msg, type })}
                />
              )}

              {/* TAB 1: WEBSITE MAINTENANCE */}
              {activeTab === 'maintenance' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="border-b border-white/[0.08] pb-4">
                    <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                      <Power className="w-5 h-5 text-[#d4a762]" />
                      <span>Website Maintenance Management</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      ওয়েবসাইটে উন্নয়ন বা আপগ্রেড চলাকালীন Maintenance Mode নিয়ন্ত্রণ করুন।
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                            Current Server State
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black border ${
                            isMaintenanceMode 
                              ? 'bg-red-500/10 border-red-500/40 text-red-400' 
                              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${isMaintenanceMode ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                            <span>{isMaintenanceMode ? '🔴 SERVER UNDER MAINTENANCE' : '🟢 SERVER ONLINE'}</span>
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">
                          {isMaintenanceMode 
                            ? 'Public Website সম্পূর্ণ LOCKED। সাধারণ ভিজিটররা কোনো পেজ/বাটন দেখতে বা ব্যবহার করতে পারবে না।' 
                            : 'Website সম্পূর্ণ লাইভ ও সচল। ভিজিটররা স্বাভাবিকভাবে কেনাকাটা ও ব্রাউজ করতে পারছে।'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold font-mono text-stone-300">
                          {isMaintenanceMode ? 'Lockdown: ON' : 'Lockdown: OFF'}
                        </span>
                        <button
                          type="button"
                          onClick={onToggleMaintenance}
                          className={`relative inline-flex h-9 w-20 items-center rounded-full transition-colors cursor-pointer p-1 shadow-inner ${
                            isMaintenanceMode ? 'bg-red-600' : 'bg-stone-800'
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center h-7 w-7 transform rounded-full bg-white transition-transform shadow-md text-[10px] font-black font-mono ${
                              isMaintenanceMode ? 'translate-x-11 text-red-600' : 'translate-x-0 text-stone-800'
                            }`}
                          >
                            {isMaintenanceMode ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black border border-white/[0.06] text-xs text-stone-300 space-y-2">
                      <span className="text-white font-bold block text-xs">
                        রক্ষণাবেক্ষণ পেজের বৈশিষ্ট্য:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-stone-400 pl-1 text-[11.5px]">
                        <li>অফিসিয়াল কোম্পানির লোগো দৃশ্যমান থাকবে</li>
                        <li>"We are Under Maintenance! We'll Be Back Soon!" হেডিং</li>
                        <li>ল্যাপটপ, ব্যারিয়ার টেপ ও ইঞ্জিনিয়ারিং ইলাস্ট্রেশন ভিজ্যুয়াল</li>
                        <li>"আমরা খুবই শীঘ্রই আবার ফিরবো" এবং "Maintenance by Admin : Md. Alif"</li>
                        <li>জরুরি যোগাযোগ (Phone & WhatsApp) এবং এডমিন লগইন গেটওয়ে</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS CATALOG */}
              {activeTab === 'products' && (
                <AdminProductManager
                  products={products}
                  onProductCreated={onProductCreated}
                  onProductUpdated={onProductUpdated}
                  onProductDeleted={onProductDeleted}
                  showNotification={(msg, type) => setAdminNotification({ message: msg, type: type || 'success' })}
                />
              )}

              {/* TAB 3: HANDOVER PROJECTS */}
              {activeTab === 'projects' && (
                <AdminProjectManager
                  projects={completedProjects}
                  setProjects={setCompletedProjects}
                  showNotification={(msg, type) => setAdminNotification({ message: msg, type: type || 'success' })}
                  siteSettings={siteSettings}
                  setSiteSettings={setSiteSettings}
                  onSaveSiteSettings={onSaveSiteSettings}
                />
              )}

              {/* TAB 4: PROJECT STATS */}
              {activeTab === 'stats' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="border-b border-white/[0.08] pb-4">
                    <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                      <BarChart className="w-5 h-5 text-[#d4a762]" />
                      <span>হোমপেজ পাই চার্ট ও প্রজেক্ট কাউন্টার</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      হোমপেজের সাকসেস রেশিও চার্ট ও ডেলিভারি কাউন্টারের সংখ্যা এখান থেকে পরিবর্তন করুন।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <label className="text-xs font-bold text-stone-300 block">
                        সফলভাবে হস্তান্তরিত প্রজেক্ট (Success Deliveries)
                      </label>
                      <input
                        type="number"
                        value={successTarget}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setSuccessTarget(val);
                          onUpdateStats(val, pendingTarget);
                        }}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-3 text-lg font-black text-emerald-400 focus:outline-none focus:border-[#d4a762]"
                      />
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <label className="text-xs font-bold text-stone-300 block">
                        চলমান / পেন্ডিং প্রজেক্ট (Pending Projects)
                      </label>
                      <input
                        type="number"
                        value={pendingTarget}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setPendingTarget(val);
                          onUpdateStats(successTarget, val);
                        }}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-3 text-lg font-black text-amber-400 focus:outline-none focus:border-[#d4a762]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SITE INFO & BRANDING */}
              {activeTab === 'site_info' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[#d4a762]" />
                        <span>কোম্পানি ব্র্যান্ডিং ও কনটেন্ট এডিটর</span>
                      </h3>
                      <p className="text-xs text-stone-400 mt-1">
                        হোমপেজের ব্যানার, ঠিকানা, ফোন নম্বর ও ডিজাইনার লিটন আলীর তথ্য পরিবর্তন করুন।
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onSaveSiteSettings}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a762] to-[#ad7d33] text-black font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>সেভ করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-400 block mb-1">Brand Name Left</label>
                      <input
                        type="text"
                        value={siteSettings.brandNameLeft || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, brandNameLeft: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-400 block mb-1">Brand Name Right</label>
                      <input
                        type="text"
                        value={siteSettings.brandNameRight || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, brandNameRight: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-400 block mb-1">Tagline</label>
                      <input
                        type="text"
                        value={siteSettings.tagline || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-400 block mb-1">Hero Badge</label>
                      <input
                        type="text"
                        value={siteSettings.heroBadge || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroBadge: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-stone-400 block mb-1">Hero Title (Line 1)</label>
                      <input
                        type="text"
                        value={siteSettings.heroTitleBn1 || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroTitleBn1: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-stone-400 block mb-1">Hero Description</label>
                      <textarea
                        rows={3}
                        value={siteSettings.heroDescBn || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroDescBn: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-400 block mb-1">ফোন নম্বর ১ (WhatsApp)</label>
                      <input
                        type="text"
                        value={siteSettings.phone1 || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phone1: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-400 block mb-1">ফোন নম্বর ২</label>
                      <input
                        type="text"
                        value={siteSettings.phone2 || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phone2: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-stone-400 block mb-1">শোরুমের পূর্ণ ঠিকানা</label>
                      <input
                        type="text"
                        value={siteSettings.showroomAddress || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, showroomAddress: e.target.value })}
                        className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SECURITY, MULTI-DEVICE & ADMIN LOGIN CAPACITY */}
              {activeTab === 'security' && (
                <AdminAccessSecurityDashboard
                  adminEmail={adminEmail}
                  adminMasterPasscode={adminMasterPasscode}
                  onUpdateMasterPasscode={onUpdateMasterPasscode}
                  onShowNotification={(msg, type) => setAdminNotification({ message: msg, type })}
                  failedAttempts={failedAttempts}
                  lockoutSeconds={lockoutSeconds}
                />
              )}

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-6 text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} {siteSettings.brandNameLeft || 'Abed'} {siteSettings.brandNameRight || 'Furniture & Interior'}. Confidential Management Panel.</p>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
