import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Sparkles, 
  Palette, 
  Maximize2, 
  MapPin, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Save, 
  RefreshCw, 
  Check, 
  Eye, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { LIGHT_GRADIENT_PALETTES, LightGradientTheme } from './HomepageNoticeBox';
import { saveSiteSettingsToSupabase } from '../lib/supabase';
import { doc, setDoc } from 'firebase/firestore';
import { db, ensureAuthSession } from '../lib/firebase';

interface AdminNoticeManagerProps {
  siteSettings: Record<string, any>;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSaveSiteSettings?: () => void;
  onShowNotification: (msg: string, type: 'success' | 'error') => void;
}

export const AdminNoticeManager: React.FC<AdminNoticeManagerProps> = ({
  siteSettings,
  setSiteSettings,
  onSaveSiteSettings,
  onShowNotification
}) => {
  // Local state initialized from siteSettings (default to true so it works immediately)
  const [enabled, setEnabled] = useState<boolean>(siteSettings.noticeEnabled !== false);
  const [noticeText, setNoticeText] = useState<string>(
    siteSettings.noticeText || 'জরুরি বিজ্ঞপ্তি: আমাদের শোরুমে নতুন প্রিমিয়াম চিটাগাং সেগুন কাঠের এক্সক্লুসিভ কালেকশন যুক্ত হয়েছে।'
  );
  const [subtitle, setSubtitle] = useState<string>(
    siteSettings.noticeSubtitle || 'সরাসরি শোরুমে এসে আসবাবপত্র যাচাই করুন অথবা ফোনে বিস্তারিত জেনে অর্ডার কনফার্ম করুন।'
  );
  const [badge, setBadge] = useState<string>(siteSettings.noticeBadge || '📢 বিশেষ নোটিশ');
  const [gradient, setGradient] = useState<string>(siteSettings.noticeGradient || 'gold-champagne');
  const [position, setPosition] = useState<string>(siteSettings.noticePosition || 'above_products');
  const [size, setSize] = useState<string>(siteSettings.noticeSize || 'md');
  const [align, setAlign] = useState<string>(siteSettings.noticeAlign || 'center');
  const [borderGlow, setBorderGlow] = useState<boolean>(siteSettings.noticeBorderGlow !== false);
  const [dismissible, setDismissible] = useState<boolean>(siteSettings.noticeDismissible !== false);

  const [isSaving, setIsSaving] = useState(false);

  // Quick Preset Templates for Instant One-Click Fill
  const PRESET_NOTICES = [
    {
      label: '🌟 নতুন সেগুন কালেকশন',
      badge: '🌟 নতুন আগমনী',
      text: 'আমাদের শোরুমে নতুন ১০০% চিটাগাং সেগুন কাঠের বেডরুম ও সোফা সেট এসে পৌঁছেছে!',
      subtitle: 'আকর্ষণীয় ফিনিশিং ও লাইফটাইম ঘুণের গ্যারান্টি সহ আজই দেখে আসুন।',
      gradient: 'gold-champagne'
    },
    {
      label: '🚚 ফ্রি ডেলিভারি অফার',
      badge: '🚚 ডেলিভারি নোটিশ',
      text: 'ঢাকা সিটির যেকোনো প্রান্তে সকল পূর্ণাঙ্গ আসবাব ক্রয়ে সম্পূর্ণ ফ্রি হোম ডেলিভারি!',
      subtitle: 'সীমিত সময়ের এই সুযোগ নিতে সরাসরি যোগাযোগ করুন বা হোয়াটসঅ্যাপে ইনকোয়ারি দিন।',
      gradient: 'mint-emerald'
    },
    {
      label: '⏰ শোরুমের সময়সূচী',
      badge: '⏰ শোরুম নোটিশ',
      text: 'আমাদের গেন্ডারিয়া শোরুম প্রতিদিন সকাল ৯:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত খোলা থাকে।',
      subtitle: 'শুক্রবার জুমার নামাজের পর ব্যতীত সারাদিনই শোরুম খোলা রয়েছে।',
      gradient: 'sky-azure'
    },
    {
      label: '📢 রমজান / ঈদ নোটিশ',
      badge: '🌙 বিশেষ ঘোষণা',
      text: 'আসন্ন ঈদ উপলক্ষে স্পেশাল ডিজাইনার হোম ইন্টেরিয়র ও আসবাবের বুকিং চলছে!',
      subtitle: 'সঠিক সময়ে ডেলিভারি পেতে অগ্রিম বুকিং নিশ্চিত করার অনুরোধ জানানো হচ্ছে।',
      gradient: 'peach-sunset'
    },
    {
      label: '🛠️ কাস্টম অর্ডার তথ্য',
      badge: '🛠️ কাস্টমাইজেশন',
      text: 'আপনার ঘরের মাপ ও নিজস্ব পছন্দের কাঠের রঙে কাস্টমাইজড ফার্নিচার অর্ডার নেওয়া হচ্ছে।',
      subtitle: 'আমাদের চিফ ডিজাইনার লিটন আলীর সাথে সরাসরি ড্রয়িং পরামর্শ নিন।',
      gradient: 'teak-luxury'
    }
  ];

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    const updatedSettings = {
      ...siteSettings,
      noticeEnabled: enabled,
      noticeText: noticeText.trim(),
      noticeSubtitle: subtitle.trim(),
      noticeBadge: badge.trim(),
      noticeGradient: gradient,
      noticePosition: position,
      noticeSize: size,
      noticeAlign: align,
      noticeBorderGlow: borderGlow,
      noticeDismissible: dismissible,
    };

    setSiteSettings(updatedSettings);

    try {
      localStorage.setItem('abed_settings', JSON.stringify(updatedSettings));

      // 1. Save to Supabase
      try {
        await saveSiteSettingsToSupabase(updatedSettings);
      } catch (sbErr) {
        console.warn('Supabase notice save note:', sbErr);
      }

      // 2. Save to Firestore
      try {
        await ensureAuthSession();
        await setDoc(doc(db, 'site_settings', 'current'), updatedSettings, { merge: true });
      } catch (fbErr) {
        console.warn('Firebase notice save note:', fbErr);
      }

      if (onSaveSiteSettings) onSaveSiteSettings();

      onShowNotification(
        enabled 
          ? 'হোমপেজে নোটিশ ও কালার গ্রেডিয়েন্ট সফলভাবে সেভ ও লাইভ করা হয়েছে!' 
          : 'নোটিশ সেটিংস সেভ করা হয়েছে (বর্তমানে হোমপেজে বন্ধ রাখা হয়েছে)।',
        'success'
      );
    } catch (err: any) {
      console.error('Failed to save notice:', err);
      onShowNotification('নোটিশ সেভ করতে সমস্যা হয়েছে: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const activeTheme = LIGHT_GRADIENT_PALETTES[gradient] || LIGHT_GRADIENT_PALETTES['gold-champagne'];

  return (
    <div className="space-y-8 max-w-5xl font-sans text-stone-100">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#d4a762]/15 border border-[#d4a762]/35 px-3 py-1 rounded-full mb-2">
            <Bell className="w-3.5 h-3.5 text-[#fdbf5e]" />
            <span className="text-[11px] font-black uppercase text-[#fdbf5e] tracking-wider font-outfit">
              Homepage Notice & Text Box (হোমপেজ নোটিশ ও টেক্সট)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-serif flex items-center gap-2.5">
            <span>হোমপেজ নোটিশ বক্স ও কালার গ্রেডিয়েন্ট</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            কোনো আলাদা পেজ ছাড়াই এই বক্সে যেকোনো লেখা বা নোটিশ লিখুন। ১০টি আকর্ষণীয় লাইট কালার গ্রেডিয়েন্ট থেকে পছন্দের কালার নির্বাচন করুন, সাইজ অ্যাডজাস্ট করুন এবং হোমপেজের কাঙ্ক্ষিত স্থানে প্রদর্শন করুন।
          </p>
        </div>

        {/* Master ON/OFF Switch */}
        <div className="flex items-center gap-3 bg-stone-900/90 p-2.5 rounded-2xl border border-white/[0.1] shrink-0 shadow-lg">
          <span className="text-xs font-bold text-stone-300">
            {enabled ? 'হোমপেজে সক্রিয়' : 'বন্ধ রয়েছে'}
          </span>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
              enabled ? 'bg-emerald-500' : 'bg-stone-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                enabled ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Interactive Live Preview */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#d4a762]" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-300">
              লাইভ প্রিভিউ (Real-Time Preview on Homepage)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#fdbf5e] bg-[#d4a762]/10 border border-[#d4a762]/30 px-2.5 py-0.5 rounded-full">
            {activeTheme.enName} • {size.toUpperCase()} • {position.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Simulated Display Window */}
        <div className="p-4 sm:p-8 rounded-2xl bg-[#f8f7f2] border border-stone-300/80 min-h-[140px] flex items-center justify-center relative overflow-hidden">
          <div className="w-full">
            <div
              className={`relative ${activeTheme.gradientClass} border-2 ${activeTheme.borderClass} ${activeTheme.shadowClass} ${
                size === 'sm' ? 'py-2.5 px-4 rounded-xl' :
                size === 'lg' ? 'py-5 px-6 sm:px-8 rounded-3xl' :
                size === 'xl' ? 'py-6 px-7 sm:px-10 rounded-3xl' :
                'py-3.5 px-5 sm:px-7 rounded-2xl'
              } overflow-hidden ${borderGlow ? 'ring-2 ring-white/50' : ''}`}
            >
              <div className={`flex flex-col ${align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center'} gap-1.5`}>
                <div className="flex items-center gap-2 flex-wrap">
                  {badge && (
                    <span className={`${activeTheme.badgeBg} ${activeTheme.badgeText} ${activeTheme.badgeBorder} border rounded-full font-black text-xs px-2.5 py-0.5`}>
                      {badge}
                    </span>
                  )}
                  <Sparkles className={`w-4 h-4 ${activeTheme.iconColor} shrink-0 animate-pulse`} />
                </div>

                <p className={`${activeTheme.titleColor} ${
                  size === 'sm' ? 'text-xs sm:text-sm font-bold' :
                  size === 'lg' ? 'text-base sm:text-lg md:text-xl font-black' :
                  size === 'xl' ? 'text-lg sm:text-xl md:text-2xl font-black' :
                  'text-sm sm:text-base font-extrabold'
                } font-serif tracking-tight leading-snug`}>
                  {noticeText || 'আপনার নোটিশ বা বার্তা এখানে লিখুন...'}
                </p>

                {subtitle && (
                  <p className={`${activeTheme.subtitleColor} ${
                    size === 'sm' ? 'text-[11px]' :
                    size === 'lg' ? 'text-xs sm:text-sm font-medium' :
                    size === 'xl' ? 'text-sm sm:text-base font-semibold' :
                    'text-xs font-medium'
                  } max-w-3xl leading-relaxed`}>
                    {subtitle}
                  </p>
                )}
              </div>

              {dismissible && (
                <button
                  type="button"
                  className={`absolute top-2.5 right-2.5 p-1 rounded-full ${activeTheme.closeBtnHover} cursor-pointer`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Text & Notice Content Writing Box */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              নোটিশ ও টেক্সট লেখার বক্স (Write Notice / Custom Text)
            </h4>
          </div>
        </div>

        {/* Quick Fill Presets */}
        <div>
          <label className="text-[11px] font-bold text-stone-400 block mb-2">
            দ্রুত রেডিমেড টেমপ্লেট নির্বাচন (One-Click Preset Notice):
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_NOTICES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setBadge(p.badge);
                  setNoticeText(p.text);
                  setSubtitle(p.subtitle);
                  setGradient(p.gradient);
                  setEnabled(true);
                  onShowNotification(`"${p.label}" টেমপ্লেট লোড করা হয়েছে!`, 'success');
                }}
                className="text-xs bg-white/[0.05] hover:bg-[#d4a762]/20 text-stone-300 hover:text-[#fdbf5e] border border-white/[0.08] hover:border-[#d4a762]/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="text-xs font-bold text-stone-300 block mb-1.5">
                নোটিশ ব্যাজ / লেবেল
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="যেমনঃ 📢 বিশেষ নোটিশ"
                className="w-full bg-black border border-white/[0.12] focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-stone-300 block mb-1.5">
                মূল নোটিশের শিরোনাম / টেক্সট (Main Notice Text)*
              </label>
              <input
                type="text"
                required
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                placeholder="হোমপেজে প্রদর্শন করার জন্য মূল টেক্সট বা নোটিশ লিখুন..."
                className="w-full bg-black border border-white/[0.12] focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              অতিরিক্ত বিবরণ বা বিস্তারিত তথ্য (Optional Subtitle / Details)
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="নোটিশের নিচে ছোট করে বিস্তারিত তথ্য বা ফোন নম্বর দিতে পারেন (ঐচ্ছিক)..."
              className="w-full bg-black border border-white/[0.12] focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Color Gradient Selector (10 Light Type Color Gradients) */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              কালার গ্রেডিয়েন্ট নির্বাচন (Select Light Color Gradient — 10 Styles)
            </h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-400">
            ১০টি প্রিমিয়াম লাইট কালার থিম
          </span>
        </div>

        <p className="text-xs text-stone-400">
          যেকোনো একটি লাইট কালার গ্রেডিয়েন্ট ক্লিক করলেই হোমপেজের নোটিশের ব্যাকগ্রাউন্ড ও টেক্সট কালার সাথে সাথে পরিবর্তিত হবে:
        </p>

        {/* 10 Gradient Swatches Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
          {Object.values(LIGHT_GRADIENT_PALETTES).map((pal) => {
            const isSelected = gradient === pal.id;
            return (
              <div
                key={pal.id}
                onClick={() => setGradient(pal.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[115px] relative group ${
                  isSelected
                    ? 'border-[#d4a762] ring-2 ring-[#d4a762]/50 scale-[1.02] shadow-xl'
                    : 'border-white/[0.1] hover:border-white/[0.25]'
                }`}
                style={{ background: pal.previewBg }}
              >
                {/* Top status */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md ${pal.badgeBg} ${pal.badgeText} border ${pal.badgeBorder}`}>
                    Light
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#d4a762] text-[#1c1202] flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Bottom title in dark contrast */}
                <div className="mt-2">
                  <p className={`text-xs font-black ${pal.titleColor} leading-tight line-clamp-1`}>
                    {pal.enName}
                  </p>
                  <p className={`text-[10px] font-semibold ${pal.subtitleColor} mt-0.5 leading-tight line-clamp-1`}>
                    {pal.name.split('(')[0]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Placement & Position on Homepage */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              হোমপেজের অবস্থান নির্বাচন (Adjust Position on Homepage)
            </h4>
          </div>
        </div>

        <p className="text-xs text-stone-400">
          হোমপেজের ঠিক কোন স্থানে নোটিশ বক্সটি দেখাতে চান তা নির্বাচন করুন:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              id: 'above_products',
              label: 'পণ্য তালিকার উপরে',
              sub: 'হিরো ব্যানার এবং প্রোডাক্ট সেকশনের মাঝে [ডিফল্ট]',
              badge: 'জনপ্রিয়'
            },
            {
              id: 'top_bar',
              label: 'ওয়েবসাইটের একদম উপরে (Top Bar)',
              sub: 'মেনু বারের উপরে ফুল-উইডথ স্ট্রিপ হিসেবে',
              badge: 'হাই-নোটিস'
            },
            {
              id: 'hero_spotlight',
              label: 'হিরো ব্যানারের ভেতরে',
              sub: 'প্রধান হিরো হেডলাইন ও বাটনের ঠিক নিচে',
              badge: 'স্পটলাইট'
            },
            {
              id: 'above_handover',
              label: 'হ্যান্ডওভার প্রজেক্টের উপরে',
              sub: 'প্রজেক্ট স্ট্যাটস পাই চার্ট এবং হ্যান্ডওভার সেকশনের মাঝে',
              badge: 'সেকশন'
            },
            {
              id: 'above_team',
              label: 'টিম ইনফরমেশনের উপরে',
              sub: 'হ্যান্ডওভার প্রজেক্ট ও ডিজাইনার টিমের মাঝে',
              badge: 'মিডল'
            },
            {
              id: 'above_footer',
              label: 'যোগাযোগ ও শোরুম তথ্যের উপরে',
              sub: 'পেজের একদম নিচের কন্টাক্ট সেকশনের আগে',
              badge: 'ফুটার'
            },
            {
              id: 'floating_bottom',
              label: 'নিচে ভাসমান কার্ড (Floating Toast)',
              sub: 'ভিজিটরদের সামনে স্ক্রিনের নিচে ভেসে থাকবে',
              badge: 'ফ্লোটিং'
            }
          ].map((pos) => {
            const isSelected = position === pos.id;
            return (
              <div
                key={pos.id}
                onClick={() => setPosition(pos.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#d4a762] bg-[#d4a762]/10 shadow-lg'
                    : 'border-white/[0.08] hover:border-white/[0.2] bg-black/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#d4a762] text-black' : 'bg-white/10 text-stone-400'
                  }`}>
                    {pos.badge}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-[#d4a762]" />}
                </div>

                <div className="mt-2">
                  <p className="text-xs font-bold text-white">
                    {pos.label}
                  </p>
                  <p className="text-[10.5px] text-stone-400 mt-0.5 leading-snug">
                    {pos.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Size, Alignment & Effect Settings */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              সাইজ ও অন্যান্য স্টাইলিং (Adjust Size & Appearance)
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Size */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-2">
              নোটিশ বক্সের সাইজ (Box Size)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sm', label: 'ছোট (Small)', desc: 'কমপ্যাক্ট' },
                { id: 'md', label: 'মাঝারি (Medium)', desc: 'স্ট্যান্ডার্ড' },
                { id: 'lg', label: 'বড় (Large)', desc: 'আকর্ষণীয়' },
                { id: 'xl', label: 'জায়ান্ট (Extra Large)', desc: 'ম্যাক্সিমাম' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    size === s.id
                      ? 'border-[#d4a762] bg-[#d4a762]/15 text-white'
                      : 'border-white/[0.08] hover:border-white/[0.2] bg-black text-stone-400'
                  }`}
                >
                  <p className="text-xs font-bold">{s.label}</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-2">
              টেক্সট অ্যালাইনমেন্ট (Text Alignment)
            </label>
            <div className="flex gap-2">
              {[
                { id: 'left', label: 'বামে (Left)', icon: AlignLeft },
                { id: 'center', label: 'মাঝখানে (Center)', icon: AlignCenter },
                { id: 'right', label: 'ডানে (Right)', icon: AlignRight },
              ].map((a) => {
                const Icon = a.icon;
                const isSelected = align === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAlign(a.id)}
                    className={`flex-1 p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#d4a762] bg-[#d4a762]/15 text-white'
                        : 'border-white/[0.08] hover:border-white/[0.2] bg-black text-stone-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-bold">{a.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-2">
              অতিরিক্ত অপশন (Toggles)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-black border border-white/[0.08] cursor-pointer">
                <input
                  type="checkbox"
                  checked={borderGlow}
                  onChange={(e) => setBorderGlow(e.target.checked)}
                  className="rounded text-[#d4a762] focus:ring-0"
                />
                <span className="text-xs text-stone-300 font-medium">লাইট গ্লোয়িং বর্ডার ইফেক্ট</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-black border border-white/[0.08] cursor-pointer">
                <input
                  type="checkbox"
                  checked={dismissible}
                  onChange={(e) => setDismissible(e.target.checked)}
                  className="rounded text-[#d4a762] focus:ring-0"
                />
                <span className="text-xs text-stone-300 font-medium">ভিজিটর বন্ধ (Close Button) করতে পারবে</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Save & Deploy Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-950 p-5 rounded-3xl border border-white/[0.1] shadow-2xl">
        <div>
          <p className="text-xs font-bold text-white">
            হোমপেজে নোটিশ পরিবর্তন প্রয়োগ করুন
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            সেভ বাটনে চাপলে সাথে সাথে এটি ফায়ারবেস ও ওয়েবসাইটে লাইভ আপডেট হয়ে যাবে।
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="w-full sm:w-auto bg-gradient-to-r from-[#d4a762] via-[#e5bd7a] to-[#b07e35] hover:opacity-95 text-stone-950 font-black text-xs sm:text-sm px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>সেভ হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>নোটিশ সেভ ও লাইভ আপডেট করুন (Save Notice)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
