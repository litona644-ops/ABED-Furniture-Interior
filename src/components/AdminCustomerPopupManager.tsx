import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Palette, 
  Save, 
  RefreshCw, 
  Check, 
  Eye, 
  Layers, 
  Star, 
  Award, 
  Sliders, 
  SlidersHorizontal,
  Clock, 
  MapPin, 
  CheckCircle2, 
  X,
  ArrowRight,
  Flame
} from 'lucide-react';
import { 
  CUSTOMER_POPUP_BG_THEMES, 
  CUSTOMER_POPUP_BORDER_THEMES,
  CustomerPopupBgTheme,
  CustomerPopupBorderTheme
} from './HomepageCustomerPopup';
import { saveSiteSettingsToSupabase } from '../lib/supabase';
import { doc, setDoc } from 'firebase/firestore';
import { db, ensureAuthSession } from '../lib/firebase';

interface AdminCustomerPopupManagerProps {
  siteSettings: Record<string, any>;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSaveSiteSettings?: () => void;
  onShowNotification: (msg: string, type: 'success' | 'error') => void;
}

export const AdminCustomerPopupManager: React.FC<AdminCustomerPopupManagerProps> = ({
  siteSettings,
  setSiteSettings,
  onSaveSiteSettings,
  onShowNotification
}) => {
  // Local form state
  const [enabled, setEnabled] = useState<boolean>(siteSettings.customerPopupEnabled !== false);
  const [count, setCount] = useState<string>(siteSettings.customerPopupCount || '900+');
  const [title, setTitle] = useState<string>(siteSettings.customerPopupTitle || '৯০০+ সন্তুষ্ট গ্রাহকের আস্থা');
  const [subtitle, setSubtitle] = useState<string>(
    siteSettings.customerPopupSubtitle || 
    'সারা দেশে বিশ্বস্ততার সাথে সেরা চিটাগাং সেগুন কাঠের আসবাব ডেলিভারি সম্পন্ন!'
  );
  const [badge, setBadge] = useState<string>(siteSettings.customerPopupBadge || '🏆 গ্রাহক সন্তুষ্টি');
  const [rating, setRating] = useState<string>(siteSettings.customerPopupRating || '4.9 ★★★★★');
  const [bgGradient, setBgGradient] = useState<string>(siteSettings.customerPopupBgGradient || 'royal-gold');
  const [borderGradient, setBorderGradient] = useState<string>(siteSettings.customerPopupBorderGradient || 'gold-radiance');
  const [borderStyle, setBorderStyle] = useState<string>(siteSettings.customerPopupBorderStyle || 'flow');
  const [position, setPosition] = useState<string>(siteSettings.customerPopupPosition || 'bottom-right');
  const [delay, setDelay] = useState<number>(
    typeof siteSettings.customerPopupDelay === 'number' ? siteSettings.customerPopupDelay : 1200
  );

  const [isSaving, setIsSaving] = useState(false);

  // Quick One-Click Presets
  const PRESET_COMBOS = [
    {
      name: '🌟 রয়্যাল গোল্ড সেগুন (Classic Luxury)',
      count: '900+',
      title: '৯০০+ সন্তুষ্ট গ্রাহকের সেরা আস্থা',
      subtitle: 'ঢাকা ও সারা দেশে শতভাগ চিটাগাং সেগুন কাঠের প্রিমিয়াম ডেলিভারি সম্পন্ন!',
      badge: '🏆 গ্রাহকের ভালোবাসা',
      rating: '4.9 ★★★★★',
      bgGradient: 'royal-gold',
      borderGradient: 'gold-radiance',
      borderStyle: 'flow'
    },
    {
      name: '🌈 নিয়ন রেইনবো ভাইব (Vibrant Laser)',
      count: '900+',
      title: '৯০০+ পরিবারের বিশ্বাস ও সন্তুষ্টি',
      subtitle: 'আকর্ষণীয় ফিনিশিং ও লাইফটাইম ঘুণের গ্যারান্টি সহ ডেলিভারি সফল!',
      badge: '✨ টপ ভেরিফায়েড',
      rating: '5.0 ★★★★★',
      bgGradient: 'deep-obsidian',
      borderGradient: 'rainbow-neon',
      borderStyle: 'spin'
    },
    {
      name: '🌿 এমারেল্ড প্রিমিয়াম (Green Jade Glow)',
      count: '900+',
      title: '৯০০+ বাস্তবায়িত প্রজেক্ট ও কাস্টমার',
      subtitle: 'অফিস, ডুপ্লেক্স ও ড্রইংরুমের পূর্ণাঙ্গ ফার্নিশিং সেবা সম্পন্ন।',
      badge: '🌿 ১০০% অরিজিনাল সেগুন',
      rating: '4.9 ★★★★★',
      bgGradient: 'emerald-forest',
      borderGradient: 'emerald-aurora',
      borderStyle: 'flow'
    },
    {
      name: '🔥 সানসেট ফায়ার অ্যাম্বার (Sunset Glow)',
      count: '900+',
      title: '৯০০+ সন্তুষ্ট ক্লায়েন্টের শুভকামনা',
      subtitle: 'সেরা কাঠের কারুকাজ ও আধুনিক ডিজাইনের মেলবন্ধন।',
      badge: '🔥 হট ট্রাস্টেড',
      rating: '4.8 ★★★★★',
      bgGradient: 'sunset-amber',
      borderGradient: 'sunset-flare',
      borderStyle: 'pulse'
    },
    {
      name: '💎 ডায়মন্ড আইস হোয়াইট (Diamond Elegant)',
      count: '900+',
      title: '৯০০+ ক্লায়েন্টের সাথে আস্থার সম্পর্ক',
      subtitle: 'সরাসরি শোরুমে এসে আসবাবপত্র যাচাই করুন অথবা অনলাইনে অর্ডার দিন।',
      badge: '💎 প্রিমিয়াম ক্লাস',
      rating: '5.0 ★★★★★',
      bgGradient: 'ivory-champagne',
      borderGradient: 'diamond-ice',
      borderStyle: 'flow'
    }
  ];

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    const updatedSettings = {
      ...siteSettings,
      customerPopupEnabled: enabled,
      customerPopupCount: count.trim(),
      customerPopupTitle: title.trim(),
      customerPopupSubtitle: subtitle.trim(),
      customerPopupBadge: badge.trim(),
      customerPopupRating: rating.trim(),
      customerPopupBgGradient: bgGradient,
      customerPopupBorderGradient: borderGradient,
      customerPopupBorderStyle: borderStyle,
      customerPopupPosition: position,
      customerPopupDelay: delay,
    };

    setSiteSettings(updatedSettings);

    try {
      localStorage.setItem('abed_settings', JSON.stringify(updatedSettings));

      // 1. Supabase save
      try {
        await saveSiteSettingsToSupabase(updatedSettings);
      } catch (sbErr) {
        console.warn('Supabase customer popup save note:', sbErr);
      }

      // 2. Firebase save
      try {
        await ensureAuthSession();
        await setDoc(doc(db, 'site_settings', 'current'), updatedSettings, { merge: true });
      } catch (fbErr) {
        console.warn('Firebase customer popup save note:', fbErr);
      }

      if (onSaveSiteSettings) onSaveSiteSettings();

      onShowNotification(
        enabled
          ? '৯০০+ কাস্টমার পপআপ ও কালার গ্রেডিয়েন্ট সেটিংস সফলভাবে সেভ ও লাইভ করা হয়েছে!'
          : 'কাস্টমার পপআপ সেটিংস সেভ করা হয়েছে (বর্তমানে বন্ধ রাখা হয়েছে)।',
        'success'
      );
    } catch (err: any) {
      console.error('Failed to save customer popup settings:', err);
      onShowNotification('সেটিংস সেভ করতে সমস্যা হয়েছে: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const currentBgTheme = CUSTOMER_POPUP_BG_THEMES[bgGradient] || CUSTOMER_POPUP_BG_THEMES['royal-gold'];
  const currentBorderTheme = CUSTOMER_POPUP_BORDER_THEMES[borderGradient] || CUSTOMER_POPUP_BORDER_THEMES['gold-radiance'];

  return (
    <div className="space-y-8 max-w-5xl font-sans text-stone-100">
      
      {/* 1. Header & Master Enable Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#d4a762]/15 border border-[#d4a762]/35 px-3 py-1 rounded-full mb-2">
            <Users className="w-3.5 h-3.5 text-[#fdbf5e]" />
            <span className="text-[11px] font-black uppercase text-[#fdbf5e] tracking-wider font-outfit">
              900+ Customers Popup & Animated Border
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
            ৯০০+ কাস্টমার পপআপ ও অ্যানিমেটেড বর্ডার গ্রেডিয়েন্ট কন্ট্রোল
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
            হোমপেজে ভিজিটরদের সামনে আসা ৯০০+ সন্তুষ্ট গ্রাহকের পপআপ কার্ডের ব্যাকগ্রাউন্ড কালার গ্রেডিয়েন্ট এবং 
            চারপাশের ঘূর্ণায়মান/প্রবাহিত অ্যানিমেটেড বর্ডারের কালার গ্রেডিয়েন্ট এখান থেকে ইচ্ছামত পরিবর্তন করুন।
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

      {/* 2. Interactive Real-Time Live Preview */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              লাইভ প্রিভিউ (Real-Time Animated Preview)
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Border: {currentBorderTheme.enName}
            </span>
            <span className="text-[10px] font-mono text-[#fdbf5e] bg-[#d4a762]/10 border border-[#d4a762]/30 px-2.5 py-0.5 rounded-full">
              Bg: {currentBgTheme.enName}
            </span>
          </div>
        </div>

        {/* Simulated Stage */}
        <div className="p-6 sm:p-12 rounded-2xl bg-[#080808] border border-stone-800 min-h-[220px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle backdrop pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#d4a762_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

          {/* The Preview Card with Animated Border */}
          <div 
            className="relative rounded-3xl p-[2.5px] max-w-md w-full shadow-2xl transition-all"
            style={{
              boxShadow: `0 14px 45px ${currentBorderTheme.shadowColor}`
            }}
          >
            {/* Animated Border Background */}
            {borderStyle === 'spin' ? (
              <div className="absolute inset-0 rounded-3xl overflow-hidden -z-10">
                <div
                  className="anim-border-spin-inner"
                  style={{ background: currentBorderTheme.conicGradient }}
                />
              </div>
            ) : borderStyle === 'pulse' ? (
              <div
                className="absolute inset-0 rounded-3xl anim-border-pulse -z-10"
                style={{ background: currentBorderTheme.borderGradient }}
              />
            ) : (
              <div
                className="absolute inset-0 rounded-3xl anim-border-flow -z-10"
                style={{ background: currentBorderTheme.borderGradient }}
              />
            )}

            {/* Inner Card with Selected Background Gradient */}
            <div className={`relative rounded-[22px] ${currentBgTheme.gradientClass} p-4 sm:p-5 border border-white/10 text-left`}>
              
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {badge && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full ${currentBgTheme.badgeBg} ${currentBgTheme.badgeText} border ${currentBgTheme.badgeBorder}`}>
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      <span>{badge}</span>
                    </span>
                  )}
                  {rating && (
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 font-mono">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300 inline" />
                      {rating}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-stone-400">
                    <X className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-2.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex flex-col items-center justify-center shrink-0">
                  <Users className={`w-5 h-5 ${currentBgTheme.accentColor}`} />
                  <span className="text-[9px] font-black uppercase text-stone-300 font-mono tracking-tighter">VERIFIED</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h4 className={`text-2xl sm:text-3xl font-black ${currentBgTheme.textColor} font-outfit tracking-tight leading-none`}>
                      {count}
                    </h4>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5 uppercase tracking-wider font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      CUSTOMERS
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm font-extrabold ${currentBgTheme.textColor} mt-1 leading-snug line-clamp-2`}>
                    {title}
                  </p>
                </div>
              </div>

              {subtitle && (
                <p className={`text-xs ${currentBgTheme.subtextColor} mb-3.5 leading-relaxed`}>
                  {subtitle}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.08]">
                <button
                  type="button"
                  className={`flex-1 ${currentBgTheme.buttonClass} py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md`}
                >
                  <span>হ্যান্ডওভার প্রজেক্ট দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 text-stone-200 border border-white/15">
                  যোগাযোগ
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick One-Click Presets */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-3 shadow-xl">
        <label className="text-xs font-bold text-stone-400 block">
          দ্রুত রেডিমেড স্টাইল লোড করুন (One-Click Preset Themes):
        </label>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_COMBOS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCount(p.count);
                setTitle(p.title);
                setSubtitle(p.subtitle);
                setBadge(p.badge);
                setRating(p.rating);
                setBgGradient(p.bgGradient);
                setBorderGradient(p.borderGradient);
                setBorderStyle(p.borderStyle);
                setEnabled(true);
                onShowNotification(`"${p.name}" থিম লোড করা হয়েছে!`, 'success');
              }}
              className="text-xs bg-white/[0.05] hover:bg-[#d4a762]/20 text-stone-300 hover:text-[#fdbf5e] border border-white/[0.08] hover:border-[#d4a762]/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4. ANIMATED BORDER COLOR GRADIENT SELECTOR (User specifically asked for this!) */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              অ্যানিমেটেড বর্ডারের কালার গ্রেডিয়েন্ট (Animated Border Gradient Color)
            </h4>
          </div>
          <span className="text-[11px] font-bold text-amber-400">
            ১০টি গ্লোয়িং বর্ডার গ্রেডিয়েন্ট
          </span>
        </div>

        <p className="text-xs text-stone-400">
          পপআপের চারপাশের অ্যানিমেটেড বর্ডারের জন্য পছন্দের কালার গ্রেডিয়েন্ট ক্লিক করুন:
        </p>

        {/* 10 Border Gradient Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
          {Object.values(CUSTOMER_POPUP_BORDER_THEMES).map((bTheme) => {
            const isSelected = borderGradient === bTheme.id;
            return (
              <div
                key={bTheme.id}
                onClick={() => setBorderGradient(bTheme.id)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[95px] relative group ${
                  isSelected
                    ? 'border-white ring-2 ring-white/60 scale-[1.02] shadow-xl'
                    : 'border-white/[0.1] hover:border-white/[0.3]'
                }`}
                style={{
                  background: '#0d0d0d'
                }}
              >
                {/* Visual Glowing Strip */}
                <div 
                  className="h-3.5 w-full rounded-full shadow-md anim-border-flow"
                  style={{ background: bTheme.borderGradient }}
                />

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-white leading-tight">
                      {bTheme.enName}
                    </p>
                    <p className="text-[9.5px] font-semibold text-stone-400 mt-0.5 leading-tight line-clamp-1">
                      {bTheme.name.split('(')[0]}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#d4a762] text-[#1c1202] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Border Animation Style Selector */}
        <div className="pt-4 border-t border-white/[0.08]">
          <label className="text-xs font-bold text-stone-300 block mb-2">
            বর্ডার অ্যানিমেশন স্টাইল (Border Animation Style):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'flow', label: 'স্মুথ ফ্লোয়িং গ্রেডিয়েন্ট (Smooth Flow)', sub: 'বর্ডার রং অবিরাম প্রবাহিত হতে থাকবে' },
              { id: 'spin', label: 'ঘূর্ণায়মান নিয়ন রশ্মি (Spinning Conic)', sub: 'একটি উজ্জ্বল লেজার রশ্মি চারদিকে ঘুরবে' },
              { id: 'pulse', label: 'পালসিং গ্লো (Breathing Glow)', sub: 'উজ্জ্বলতা ধীরে ধীরে বাড়বে ও কমবে' },
            ].map((style) => (
              <div
                key={style.id}
                onClick={() => setBorderStyle(style.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  borderStyle === style.id
                    ? 'bg-[#d4a762]/20 border-[#d4a762] text-white'
                    : 'bg-white/[0.03] border-white/[0.08] text-stone-300 hover:border-white/[0.2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{style.label}</span>
                  {borderStyle === style.id && <Check className="w-3.5 h-3.5 text-[#d4a762]" />}
                </div>
                <p className="text-[10px] text-stone-400 mt-1">{style.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. POPUP CARD BACKGROUND COLOR GRADIENT SELECTOR (User specifically asked for this!) */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              পপআপ কার্ডের কালার গ্রেডিয়েন্ট (Popup Card Background Color Gradient)
            </h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-400">
            ১০টি প্রিমিয়াম ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট
          </span>
        </div>

        <p className="text-xs text-stone-400">
          পপআপের ভেতরের ব্যাকগ্রাউন্ডের জন্য পছন্দের কালার গ্রেডিয়েন্ট বেছে নিন:
        </p>

        {/* 10 Background Gradient Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
          {Object.values(CUSTOMER_POPUP_BG_THEMES).map((bgT) => {
            const isSelected = bgGradient === bgT.id;
            return (
              <div
                key={bgT.id}
                onClick={() => setBgGradient(bgT.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[110px] relative group ${
                  isSelected
                    ? 'border-[#d4a762] ring-2 ring-[#d4a762]/50 scale-[1.02] shadow-xl'
                    : 'border-white/[0.1] hover:border-white/[0.25]'
                }`}
                style={{ background: bgT.previewBg }}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md ${bgT.badgeBg} ${bgT.badgeText} border ${bgT.badgeBorder}`}>
                    Gradient
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#d4a762] text-[#1c1202] flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <p className={`text-xs font-black ${bgT.textColor} leading-tight line-clamp-1`}>
                    {bgT.enName}
                  </p>
                  <p className={`text-[10px] font-semibold ${bgT.subtextColor} mt-0.5 leading-tight line-clamp-1`}>
                    {bgT.name.split('(')[0]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Text & Content Writing Box */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              পপআপের লেখা ও তথ্য পরিবর্তন (Customize Text & Information)
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              কাস্টমার সংখ্যা (Customer Count Number)*
            </label>
            <input
              type="text"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="যেমনঃ 900+"
              className="w-full bg-black border border-white/[0.12] focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-black font-outfit"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              টপ ব্যাজ লেবেল (Top Badge)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="যেমনঃ 🏆 গ্রাহক সন্তুষ্টি"
              className="w-full bg-black border border-white/[0.12] focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              স্টার রেটিং টেক্সট (Star Rating Text)
            </label>
            <input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="যেমনঃ 4.9 ★★★★★"
              className="w-full bg-black border border-white/[0.12] focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-300 block mb-1.5">
            মূল শিরোনাম (Popup Heading / Title)*
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমনঃ ৯০০+ সন্তুষ্ট গ্রাহকের আস্থা"
            className="w-full bg-black border border-white/[0.12] focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-bold"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-stone-300 block mb-1.5">
            বিবরণ / সাবটাইটেল (Description / Subtitle)
          </label>
          <textarea
            rows={2}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="পপআপে প্রদর্শনের জন্য বিবরণ লিখুন..."
            className="w-full bg-black border border-white/[0.12] focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* 7. Position & Delay Controls */}
      <div className="bg-stone-950/80 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-sm font-black uppercase text-stone-200 tracking-wider">
              স্ক্রিনের অবস্থান ও টাইমিং (Screen Position & Timing)
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-2">
              পপআপের অবস্থান (Position on Screen):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bottom-right', label: 'নিচে ডানে (Bottom-Right) [ডিফল্ট]' },
                { id: 'bottom-left', label: 'নিচে বামে (Bottom-Left)' },
                { id: 'bottom-center', label: 'নিচে মাঝে (Bottom-Center)' },
                { id: 'top-right', label: 'উপরে ডানে (Top-Right)' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPosition(pos.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    position === pos.id
                      ? 'bg-[#d4a762]/20 border-[#d4a762] text-[#fdbf5e]'
                      : 'bg-white/[0.03] border-white/[0.08] text-stone-300 hover:border-white/20'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-300 block mb-2">
              হোমপেজে আসার পর পপআপ আসার সময় (Entrance Delay):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 0, label: 'তাৎক্ষণিক (0 সেকেন্ড)' },
                { val: 1200, label: '১.২ সেকেন্ড [স্ট্যান্ডার্ড]' },
                { val: 3000, label: '৩ সেকেন্ড [স্মুথ]' },
                { val: 5000, label: '৫ সেকেন্ড [দেরিতে]' },
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => setDelay(d.val)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    delay === d.val
                      ? 'bg-[#d4a762]/20 border-[#d4a762] text-[#fdbf5e]'
                      : 'bg-white/[0.03] border-white/[0.08] text-stone-300 hover:border-white/20'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Save & Live Action Bar */}
      <div className="sticky bottom-4 z-30 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/[0.12] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
          <div>
            <p className="text-xs font-black text-white">
              {enabled ? '৯০০+ কাস্টমার পপআপ হোমপেজে সক্রিয়' : 'পপআপ বর্তমানে বন্ধ রাখা হয়েছে'}
            </p>
            <p className="text-[11px] text-stone-400">
              কালার গ্রেডিয়েন্ট ও অ্যানিমেটেড বর্ডার হোমপেজের সব ভিজিটরদের জন্য সাথে সাথে কাজ করবে।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="w-full sm:w-auto bg-gradient-to-r from-[#d4a762] via-[#e5bc7d] to-[#b07e35] hover:brightness-110 active:scale-95 text-[#140c01] font-black text-xs sm:text-sm px-7 py-3 rounded-xl transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#140c01]" />
                <span>সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#140c01]" />
                <span>সেটিংস সেভ করুন (Save & Apply Live)</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminCustomerPopupManager;
