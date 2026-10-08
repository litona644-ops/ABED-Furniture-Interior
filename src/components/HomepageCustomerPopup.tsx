import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Award,
  ChevronUp
} from 'lucide-react';

// ==========================================================
// 1. POPUP BACKGROUND COLOR GRADIENTS (10 Luxury Presets)
// ==========================================================
export interface CustomerPopupBgTheme {
  id: string;
  name: string;
  enName: string;
  gradientClass: string;
  textColor: string;
  subtextColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  buttonClass: string;
  previewBg: string;
}

export const CUSTOMER_POPUP_BG_THEMES: Record<string, CustomerPopupBgTheme> = {
  'royal-gold': {
    id: 'royal-gold',
    name: 'রয়্যাল গোল্ড সেগুন (Royal Gold & Teak)',
    enName: 'Royal Gold Teak',
    gradientClass: 'bg-gradient-to-br from-[#1f1304] via-[#331e05] to-[#120a01]',
    textColor: 'text-[#fff8ed]',
    subtextColor: 'text-[#dfc8a5]',
    badgeBg: 'bg-[#d4a762]/20',
    badgeText: 'text-[#fdbf5e]',
    badgeBorder: 'border-[#d4a762]/40',
    accentColor: 'text-[#fdbf5e]',
    buttonClass: 'bg-gradient-to-r from-[#d4a762] to-[#fdbf5e] hover:brightness-110 text-stone-950 font-black',
    previewBg: 'linear-gradient(135deg, #1f1304 0%, #331e05 50%, #120a01 100%)'
  },
  'deep-obsidian': {
    id: 'deep-obsidian',
    name: 'ডিপ ওবসিডিয়ান ব্ল্যাক (Deep Obsidian Dark)',
    enName: 'Deep Obsidian Dark',
    gradientClass: 'bg-gradient-to-br from-[#0c0f17] via-[#161c28] to-[#06080e]',
    textColor: 'text-white',
    subtextColor: 'text-stone-300',
    badgeBg: 'bg-white/10',
    badgeText: 'text-stone-200',
    badgeBorder: 'border-white/20',
    accentColor: 'text-sky-400',
    buttonClass: 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:brightness-110 text-white font-bold',
    previewBg: 'linear-gradient(135deg, #0c0f17 0%, #161c28 50%, #06080e 100%)'
  },
  'emerald-forest': {
    id: 'emerald-forest',
    name: 'এমেরাল্ড জেইড লাক্সারি (Emerald Jade Luxury)',
    enName: 'Emerald Jade Luxury',
    gradientClass: 'bg-gradient-to-br from-[#042013] via-[#093c24] to-[#02140b]',
    textColor: 'text-[#f0fdf4]',
    subtextColor: 'text-[#bbf7d0]',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    accentColor: 'text-emerald-400',
    buttonClass: 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-stone-950 font-black',
    previewBg: 'linear-gradient(135deg, #042013 0%, #093c24 50%, #02140b 100%)'
  },
  'ruby-velvet': {
    id: 'ruby-velvet',
    name: 'রিচ রুবি ভেলভেট (Rich Ruby Velvet)',
    enName: 'Rich Ruby Velvet',
    gradientClass: 'bg-gradient-to-br from-[#26050a] via-[#460914] to-[#170306]',
    textColor: 'text-[#fff1f2]',
    subtextColor: 'text-[#fecdd3]',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    accentColor: 'text-rose-400',
    buttonClass: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-110 text-white font-bold',
    previewBg: 'linear-gradient(135deg, #26050a 0%, #460914 50%, #170306 100%)'
  },
  'sapphire-ocean': {
    id: 'sapphire-ocean',
    name: 'রয়্যাল স্যাফায়ার নেভি (Royal Sapphire Ocean)',
    enName: 'Royal Sapphire Ocean',
    gradientClass: 'bg-gradient-to-br from-[#06182c] via-[#0b2b4e] to-[#030e1a]',
    textColor: 'text-[#f0f9ff]',
    subtextColor: 'text-[#bae6fd]',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/40',
    accentColor: 'text-sky-400',
    buttonClass: 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-stone-950 font-black',
    previewBg: 'linear-gradient(135deg, #06182c 0%, #0b2b4e 50%, #030e1a 100%)'
  },
  'sunset-amber': {
    id: 'sunset-amber',
    name: 'সানসেট অ্যাম্বার ওয়ার্মথ (Sunset Amber Glow)',
    enName: 'Sunset Amber Glow',
    gradientClass: 'bg-gradient-to-br from-[#2a1005] via-[#4d1f0a] to-[#180802]',
    textColor: 'text-[#fff7ed]',
    subtextColor: 'text-[#fed7aa]',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    accentColor: 'text-amber-400',
    buttonClass: 'bg-gradient-to-r from-amber-500 to-orange-400 hover:brightness-110 text-stone-950 font-black',
    previewBg: 'linear-gradient(135deg, #2a1005 0%, #4d1f0a 50%, #180802 100%)'
  },
  'purple-nebula': {
    id: 'purple-nebula',
    name: 'অ্যামেথিস্ট পার্পল নেবুলা (Amethyst Purple Nebula)',
    enName: 'Amethyst Purple Nebula',
    gradientClass: 'bg-gradient-to-br from-[#200833] via-[#3c105e] to-[#12031e]',
    textColor: 'text-[#faf5ff]',
    subtextColor: 'text-[#e9d5ff]',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/40',
    accentColor: 'text-purple-400',
    buttonClass: 'bg-gradient-to-r from-purple-500 to-fuchsia-400 hover:brightness-110 text-white font-bold',
    previewBg: 'linear-gradient(135deg, #200833 0%, #3c105e 50%, #12031e 100%)'
  },
  'ivory-champagne': {
    id: 'ivory-champagne',
    name: 'লাইট আইভরি শ্যাম্পেন (Light Ivory Pearl)',
    enName: 'Light Ivory Pearl',
    gradientClass: 'bg-gradient-to-br from-[#fffdf9] via-[#fdf7ea] to-[#f6ecda]',
    textColor: 'text-[#2a1702]',
    subtextColor: 'text-[#6e4610]',
    badgeBg: 'bg-[#d4a762]/20',
    badgeText: 'text-[#6e4610]',
    badgeBorder: 'border-[#d4a762]/40',
    accentColor: 'text-[#a07436]',
    buttonClass: 'bg-gradient-to-r from-[#2a1702] to-[#452706] hover:brightness-125 text-[#fdf7ea] font-black',
    previewBg: 'linear-gradient(135deg, #fffdf9 0%, #fdf7ea 50%, #f6ecda 100%)'
  },
  'rose-quartz': {
    id: 'rose-quartz',
    name: 'সফট রোজ কোয়ার্টজ (Soft Rose Blossom)',
    enName: 'Soft Rose Blossom',
    gradientClass: 'bg-gradient-to-br from-[#fff5f6] via-[#ffe8ec] to-[#fcd5dc]',
    textColor: 'text-[#4c0519]',
    subtextColor: 'text-[#881337]',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-[#9f1239]',
    badgeBorder: 'border-rose-500/30',
    accentColor: 'text-[#e11d48]',
    buttonClass: 'bg-gradient-to-r from-[#be123c] to-[#e11d48] hover:brightness-110 text-white font-bold',
    previewBg: 'linear-gradient(135deg, #fff5f6 0%, #ffe8ec 50%, #fcd5dc 100%)'
  },
  'cyber-carbon': {
    id: 'cyber-carbon',
    name: 'সাইবার টাইটানিয়াম কার্বন (Cyber Titanium Carbon)',
    enName: 'Cyber Titanium Carbon',
    gradientClass: 'bg-gradient-to-br from-[#12141a] via-[#1e222d] to-[#0b0c10]',
    textColor: 'text-stone-100',
    subtextColor: 'text-stone-400',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/40',
    accentColor: 'text-teal-400',
    buttonClass: 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:brightness-110 text-stone-950 font-black',
    previewBg: 'linear-gradient(135deg, #12141a 0%, #1e222d 50%, #0b0c10 100%)'
  }
};

// ==========================================================
// 2. ANIMATED BORDER GRADIENTS (10 Glowing Themes)
// ==========================================================
export interface CustomerPopupBorderTheme {
  id: string;
  name: string;
  enName: string;
  borderGradient: string; // CSS gradient used for moving border
  conicGradient: string;  // CSS conic-gradient used for spinning border
  shadowColor: string;
  previewGradient: string;
}

export const CUSTOMER_POPUP_BORDER_THEMES: Record<string, CustomerPopupBorderTheme> = {
  'gold-radiance': {
    id: 'gold-radiance',
    name: 'গোল্ডেন রেডিয়ান্স (Gold Radiance)',
    enName: 'Gold Radiance',
    borderGradient: 'linear-gradient(90deg, #d4a762, #fff0b8, #ffd700, #a07436, #d4a762)',
    conicGradient: 'conic-gradient(from 0deg, #d4a762, #fff0b8, #ffd700, #a07436, #d4a762)',
    shadowColor: 'rgba(212, 167, 98, 0.45)',
    previewGradient: 'linear-gradient(90deg, #d4a762, #ffd700, #fff0b8, #d4a762)'
  },
  'rainbow-neon': {
    id: 'rainbow-neon',
    name: 'রংধনু নিয়ন লেজার (Rainbow Neon Laser)',
    enName: 'Rainbow Neon Laser',
    borderGradient: 'linear-gradient(90deg, #ff007f, #ff7b00, #ffee00, #00ff66, #00e5ff, #8a2be2, #ff007f)',
    conicGradient: 'conic-gradient(from 0deg, #ff007f, #ff7b00, #ffee00, #00ff66, #00e5ff, #8a2be2, #ff007f)',
    shadowColor: 'rgba(255, 0, 127, 0.4)',
    previewGradient: 'linear-gradient(90deg, #ff007f, #ffbb00, #00ff66, #00e5ff, #8a2be2)'
  },
  'emerald-aurora': {
    id: 'emerald-aurora',
    name: 'এমেরাল্ড অরোরা (Emerald Aurora Glow)',
    enName: 'Emerald Aurora Glow',
    borderGradient: 'linear-gradient(90deg, #10b981, #34d399, #a7f3d0, #059669, #10b981)',
    conicGradient: 'conic-gradient(from 0deg, #10b981, #34d399, #a7f3d0, #059669, #10b981)',
    shadowColor: 'rgba(16, 185, 129, 0.45)',
    previewGradient: 'linear-gradient(90deg, #059669, #10b981, #6ee7b7, #059669)'
  },
  'cyber-blue': {
    id: 'cyber-blue',
    name: 'সাইবার ইলেকট্রিক ব্লু (Cyber Electric Blue)',
    enName: 'Cyber Electric Blue',
    borderGradient: 'linear-gradient(90deg, #06b6d4, #38bdf8, #818cf8, #0284c7, #06b6d4)',
    conicGradient: 'conic-gradient(from 0deg, #06b6d4, #38bdf8, #818cf8, #0284c7, #06b6d4)',
    shadowColor: 'rgba(6, 182, 212, 0.45)',
    previewGradient: 'linear-gradient(90deg, #0284c7, #06b6d4, #38bdf8, #818cf8)'
  },
  'crimson-blaze': {
    id: 'crimson-blaze',
    name: 'ক্রিমসন ফায়ার ব্লেইজ (Crimson Fire Blaze)',
    enName: 'Crimson Fire Blaze',
    borderGradient: 'linear-gradient(90deg, #ef4444, #f97316, #fbbf24, #b91c1c, #ef4444)',
    conicGradient: 'conic-gradient(from 0deg, #ef4444, #f97316, #fbbf24, #b91c1c, #ef4444)',
    shadowColor: 'rgba(239, 68, 68, 0.45)',
    previewGradient: 'linear-gradient(90deg, #b91c1c, #ef4444, #f97316, #fbbf24)'
  },
  'purple-nebula': {
    id: 'purple-nebula',
    name: 'রয়্যাল পার্পল নেবুলা (Royal Purple Nebula)',
    enName: 'Royal Purple Nebula',
    borderGradient: 'linear-gradient(90deg, #8b5cf6, #d946ef, #f43f5e, #6d28d9, #8b5cf6)',
    conicGradient: 'conic-gradient(from 0deg, #8b5cf6, #d946ef, #f43f5e, #6d28d9, #8b5cf6)',
    shadowColor: 'rgba(139, 92, 246, 0.45)',
    previewGradient: 'linear-gradient(90deg, #6d28d9, #8b5cf6, #d946ef, #f43f5e)'
  },
  'sunset-flare': {
    id: 'sunset-flare',
    name: 'সানসেট ফ্লেয়ার অ্যাম্বার (Sunset Flare Amber)',
    enName: 'Sunset Flare Amber',
    borderGradient: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f97316, #d97706, #f59e0b)',
    conicGradient: 'conic-gradient(from 0deg, #f59e0b, #fbbf24, #f97316, #d97706, #f59e0b)',
    shadowColor: 'rgba(245, 158, 11, 0.45)',
    previewGradient: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24, #f97316)'
  },
  'diamond-ice': {
    id: 'diamond-ice',
    name: 'ডায়মন্ড আইস সিলভার (Diamond Ice Silver)',
    enName: 'Diamond Ice Silver',
    borderGradient: 'linear-gradient(90deg, #e2e8f0, #ffffff, #94a3b8, #cbd5e1, #ffffff)',
    conicGradient: 'conic-gradient(from 0deg, #e2e8f0, #ffffff, #94a3b8, #cbd5e1, #ffffff)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    previewGradient: 'linear-gradient(90deg, #94a3b8, #ffffff, #cbd5e1, #ffffff)'
  },
  'teak-bronze': {
    id: 'teak-bronze',
    name: 'চিটাগাং সেগুন ব্রোঞ্জ (Teak Wood Bronze)',
    enName: 'Teak Wood Bronze',
    borderGradient: 'linear-gradient(90deg, #92400e, #d97706, #fde68a, #78350f, #92400e)',
    conicGradient: 'conic-gradient(from 0deg, #92400e, #d97706, #fde68a, #78350f, #92400e)',
    shadowColor: 'rgba(146, 64, 14, 0.5)',
    previewGradient: 'linear-gradient(90deg, #78350f, #92400e, #d97706, #fde68a)'
  },
  'electric-lime': {
    id: 'electric-lime',
    name: 'ইলেকট্রিক লাইম এনার্জি (Electric Lime Energy)',
    enName: 'Electric Lime Energy',
    borderGradient: 'linear-gradient(90deg, #84cc16, #a3e635, #facc15, #4d7c0f, #84cc16)',
    conicGradient: 'conic-gradient(from 0deg, #84cc16, #a3e635, #facc15, #4d7c0f, #84cc16)',
    shadowColor: 'rgba(132, 204, 22, 0.45)',
    previewGradient: 'linear-gradient(90deg, #4d7c0f, #84cc16, #a3e635, #facc15)'
  }
};

// ==========================================================
// 3. HOMEPAGE CUSTOMER POPUP COMPONENT
// ==========================================================
interface HomepageCustomerPopupProps {
  settings: Record<string, any>;
  onExploreProjects?: () => void;
  onContactClick?: () => void;
}

export const HomepageCustomerPopup: React.FC<HomepageCustomerPopupProps> = ({
  settings,
  onExploreProjects,
  onContactClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Configuration from settings
  const isEnabled = settings.customerPopupEnabled !== false;
  const count = (settings.customerPopupCount || '900+').trim();
  const title = (settings.customerPopupTitle || '৯০০+ সন্তুষ্ট গ্রাহকের আস্থা').trim();
  const subtitle = (
    settings.customerPopupSubtitle || 
    'সারা দেশে বিশ্বস্ততার সাথে সেরা চিটাগাং সেগুন কাঠের আসবাব ডেলিভারি সম্পন্ন!'
  ).trim();
  const badge = (settings.customerPopupBadge || '🏆 গ্রাহক সন্তুষ্টি').trim();
  const rating = (settings.customerPopupRating || '4.9 ★★★★★').trim();
  const bgThemeKey = settings.customerPopupBgGradient || 'royal-gold';
  const borderThemeKey = settings.customerPopupBorderGradient || 'gold-radiance';
  const borderStyle = settings.customerPopupBorderStyle || 'flow'; // 'flow' | 'spin' | 'pulse'
  const position = settings.customerPopupPosition || 'bottom-right'; // 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right'
  const delayMs = typeof settings.customerPopupDelay === 'number' ? settings.customerPopupDelay : 1200;

  const bgTheme = CUSTOMER_POPUP_BG_THEMES[bgThemeKey] || CUSTOMER_POPUP_BG_THEMES['royal-gold'];
  const borderTheme = CUSTOMER_POPUP_BORDER_THEMES[borderThemeKey] || CUSTOMER_POPUP_BORDER_THEMES['gold-radiance'];

  // Trigger popup after the configured delay
  useEffect(() => {
    if (!isEnabled) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, Math.max(200, delayMs));

    return () => clearTimeout(timer);
  }, [isEnabled, delayMs]);

  if (!isEnabled || isDismissed) {
    return null;
  }

  // Positioning utility
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 sm:bottom-6 left-3 sm:left-6 items-start';
      case 'bottom-center':
        return 'bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 items-center';
      case 'top-right':
        return 'top-20 sm:top-24 right-3 sm:right-6 items-end';
      case 'bottom-right':
      default:
        return 'bottom-4 sm:bottom-6 right-3 sm:right-6 items-end';
    }
  };

  // Minimized state pill button (so visitor can easily re-open)
  if (isMinimized) {
    return (
      <div className={`fixed ${getPositionClasses()} z-40 transition-all`}>
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMinimized(false)}
          className="p-[2px] rounded-full shadow-2xl cursor-pointer group"
          style={{ background: borderTheme.borderGradient }}
        >
          <div className="bg-[#120a01] px-4 py-2 rounded-full flex items-center gap-2 text-white border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Award className="w-4 h-4 text-[#fdbf5e]" />
            <span className="font-outfit font-black text-xs text-[#fdbf5e]">{count} Customers</span>
            <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-white" />
          </div>
        </motion.button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className={`fixed ${getPositionClasses()} z-40 max-w-[94vw] sm:max-w-md pointer-events-auto`}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl p-[2.5px] shadow-[0_12px_45px_rgba(0,0,0,0.55)] group transition-all"
            style={{
              boxShadow: `0 12px 40px ${borderTheme.shadowColor}`
            }}
          >
            {/* Animated Border Layer */}
            {borderStyle === 'spin' ? (
              <div className="absolute inset-0 rounded-3xl overflow-hidden -z-10">
                <div
                  className="anim-border-spin-inner"
                  style={{ background: borderTheme.conicGradient }}
                />
              </div>
            ) : borderStyle === 'pulse' ? (
              <div
                className="absolute inset-0 rounded-3xl anim-border-pulse -z-10"
                style={{ background: borderTheme.borderGradient }}
              />
            ) : (
              // Default: Smooth flowing gradient
              <div
                className="absolute inset-0 rounded-3xl anim-border-flow -z-10"
                style={{ background: borderTheme.borderGradient }}
              />
            )}

            {/* Inner Content Card with Admin-Selected Color Gradient */}
            <div className={`relative rounded-[22px] ${bgTheme.gradientClass} p-4 sm:p-5 backdrop-blur-xl border border-white/10 text-left`}>
              
              {/* Header row: Badge, Count, and Controls */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {badge && (
                    <span className={`inline-flex items-center gap-1 text-[10.5px] font-black px-2.5 py-0.5 rounded-full ${bgTheme.badgeBg} ${bgTheme.badgeText} border ${bgTheme.badgeBorder}`}>
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

                <div className="flex items-center gap-1 shrink-0">
                  {/* Minimize button */}
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="ছোট করুন (Minimize)"
                    aria-label="Minimize"
                  >
                    <span className="block w-2.5 h-0.5 bg-current rounded" />
                  </button>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsDismissed(true)}
                    className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="বন্ধ করুন (Close)"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Visual: Big Customer Counter & Shield */}
              <div className="flex items-start gap-3 mb-2.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <Users className={`w-5 h-5 ${bgTheme.accentColor}`} />
                  <span className="text-[9px] font-black uppercase text-stone-300 font-mono tracking-tighter">VERIFIED</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h4 className={`text-2xl sm:text-3xl font-black ${bgTheme.textColor} font-outfit tracking-tight leading-none`}>
                      {count}
                    </h4>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5 uppercase tracking-wider font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      CUSTOMERS
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm font-extrabold ${bgTheme.textColor} mt-1 leading-snug line-clamp-2 font-sans`}>
                    {title}
                  </p>
                </div>
              </div>

              {/* Subtitle Description */}
              {subtitle && (
                <p className={`text-[11.5px] sm:text-xs font-normal ${bgTheme.subtextColor} mb-3.5 leading-relaxed font-sans`}>
                  {subtitle}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.08]">
                {onExploreProjects && (
                  <button
                    type="button"
                    onClick={() => {
                      onExploreProjects();
                      setIsMinimized(true);
                    }}
                    className={`flex-1 ${bgTheme.buttonClass} py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer`}
                  >
                    <span>হ্যান্ডওভার প্রজেক্ট দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {onContactClick && (
                  <button
                    type="button"
                    onClick={onContactClick}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white border border-white/15 transition-all cursor-pointer"
                  >
                    যোগাযোগ
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
