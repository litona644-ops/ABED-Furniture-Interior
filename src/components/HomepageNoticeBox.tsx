import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Sparkles, 
  AlertCircle, 
  X, 
  Info, 
  Megaphone,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export interface LightGradientTheme {
  id: string;
  name: string;
  enName: string;
  gradientClass: string;
  borderClass: string;
  titleColor: string;
  subtitleColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconColor: string;
  closeBtnHover: string;
  shadowClass: string;
  previewBg: string;
}

export const LIGHT_GRADIENT_PALETTES: Record<string, LightGradientTheme> = {
  'gold-champagne': {
    id: 'gold-champagne',
    name: 'গোল্ড শ্যাম্পেন (Gold Champagne)',
    enName: 'Gold Champagne',
    gradientClass: 'bg-gradient-to-r from-[#fffdf7] via-[#fff5dc] to-[#fde9b8]',
    borderClass: 'border-[#d4a762]/60',
    titleColor: 'text-[#2a1702]',
    subtitleColor: 'text-[#57390f]',
    badgeBg: 'bg-[#d4a762]/20',
    badgeText: 'text-[#6e4610]',
    badgeBorder: 'border-[#d4a762]/40',
    iconColor: 'text-[#a07436]',
    closeBtnHover: 'hover:bg-[#d4a762]/20 text-[#6e4610]',
    shadowClass: 'shadow-[0_4px_25px_rgba(212,167,98,0.22)]',
    previewBg: 'linear-gradient(135deg, #fffdf7 0%, #fff5dc 50%, #fde9b8 100%)'
  },
  'rose-blush': {
    id: 'rose-blush',
    name: 'রোজ পিচ ব্লাশ (Rose Blossom)',
    enName: 'Rose Blossom',
    gradientClass: 'bg-gradient-to-r from-[#fff5f5] via-[#ffe8ec] to-[#fed7e2]',
    borderClass: 'border-[#f43f5e]/40',
    titleColor: 'text-[#4c0519]',
    subtitleColor: 'text-[#881337]',
    badgeBg: 'bg-[#f43f5e]/15',
    badgeText: 'text-[#9f1239]',
    badgeBorder: 'border-[#f43f5e]/30',
    iconColor: 'text-[#e11d48]',
    closeBtnHover: 'hover:bg-[#f43f5e]/20 text-[#881337]',
    shadowClass: 'shadow-[0_4px_25px_rgba(244,63,94,0.18)]',
    previewBg: 'linear-gradient(135deg, #fff5f5 0%, #ffe8ec 50%, #fed7e2 100%)'
  },
  'mint-emerald': {
    id: 'mint-emerald',
    name: 'প্যাসটেল মিন্ট (Mint & Emerald)',
    enName: 'Mint & Emerald',
    gradientClass: 'bg-gradient-to-r from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]',
    borderClass: 'border-[#16a34a]/40',
    titleColor: 'text-[#064e3b]',
    subtitleColor: 'text-[#14532d]',
    badgeBg: 'bg-[#16a34a]/15',
    badgeText: 'text-[#166534]',
    badgeBorder: 'border-[#16a34a]/30',
    iconColor: 'text-[#15803d]',
    closeBtnHover: 'hover:bg-[#16a34a]/20 text-[#14532d]',
    shadowClass: 'shadow-[0_4px_25px_rgba(22,163,74,0.18)]',
    previewBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
  },
  'sky-azure': {
    id: 'sky-azure',
    name: 'স্কাই অজুর ব্রিজ (Sky Azure)',
    enName: 'Sky Azure',
    gradientClass: 'bg-gradient-to-r from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]',
    borderClass: 'border-[#0284c7]/40',
    titleColor: 'text-[#082f49]',
    subtitleColor: 'text-[#075985]',
    badgeBg: 'bg-[#0284c7]/15',
    badgeText: 'text-[#0369a1]',
    badgeBorder: 'border-[#0284c7]/30',
    iconColor: 'text-[#0284c7]',
    closeBtnHover: 'hover:bg-[#0284c7]/20 text-[#075985]',
    shadowClass: 'shadow-[0_4px_25px_rgba(2,132,199,0.18)]',
    previewBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
  },
  'lavender-iris': {
    id: 'lavender-iris',
    name: 'সফট ল্যাভেন্ডার (Lavender Mist)',
    enName: 'Lavender Mist',
    gradientClass: 'bg-gradient-to-r from-[#faf5ff] via-[#f3e8ff] to-[#e9d5ff]',
    borderClass: 'border-[#9333ea]/40',
    titleColor: 'text-[#3b0764]',
    subtitleColor: 'text-[#581c87]',
    badgeBg: 'bg-[#9333ea]/15',
    badgeText: 'text-[#6b21a8]',
    badgeBorder: 'border-[#9333ea]/30',
    iconColor: 'text-[#7e22ce]',
    closeBtnHover: 'hover:bg-[#9333ea]/20 text-[#581c87]',
    shadowClass: 'shadow-[0_4px_25px_rgba(147,51,234,0.18)]',
    previewBg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)'
  },
  'honey-amber': {
    id: 'honey-amber',
    name: 'হানি সানশাইন (Honey Amber)',
    enName: 'Honey Amber',
    gradientClass: 'bg-gradient-to-r from-[#fefce8] via-[#fef9c3] to-[#fef08a]',
    borderClass: 'border-[#ca8a04]/40',
    titleColor: 'text-[#422006]',
    subtitleColor: 'text-[#713f12]',
    badgeBg: 'bg-[#ca8a04]/15',
    badgeText: 'text-[#854d0e]',
    badgeBorder: 'border-[#ca8a04]/30',
    iconColor: 'text-[#a16207]',
    closeBtnHover: 'hover:bg-[#ca8a04]/20 text-[#713f12]',
    shadowClass: 'shadow-[0_4px_25px_rgba(202,138,4,0.18)]',
    previewBg: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 50%, #fef08a 100%)'
  },
  'peach-sunset': {
    id: 'peach-sunset',
    name: 'পিচ শরবত (Peach Sorbet)',
    enName: 'Peach Sorbet',
    gradientClass: 'bg-gradient-to-r from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]',
    borderClass: 'border-[#ea580c]/40',
    titleColor: 'text-[#431407]',
    subtitleColor: 'text-[#7c2d12]',
    badgeBg: 'bg-[#ea580c]/15',
    badgeText: 'text-[#9a3412]',
    badgeBorder: 'border-[#ea580c]/30',
    iconColor: 'text-[#c2410c]',
    closeBtnHover: 'hover:bg-[#ea580c]/20 text-[#7c2d12]',
    shadowClass: 'shadow-[0_4px_25px_rgba(234,88,12,0.18)]',
    previewBg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)'
  },
  'pearl-silver': {
    id: 'pearl-silver',
    name: 'মুনলাইট পার্ল (Moonlight Pearl)',
    enName: 'Moonlight Pearl',
    gradientClass: 'bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]',
    borderClass: 'border-[#64748b]/40',
    titleColor: 'text-[#0f172a]',
    subtitleColor: 'text-[#334155]',
    badgeBg: 'bg-[#64748b]/15',
    badgeText: 'text-[#1e293b]',
    badgeBorder: 'border-[#64748b]/30',
    iconColor: 'text-[#475569]',
    closeBtnHover: 'hover:bg-[#64748b]/20 text-[#334155]',
    shadowClass: 'shadow-[0_4px_25px_rgba(100,116,139,0.16)]',
    previewBg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
  },
  'teak-luxury': {
    id: 'teak-luxury',
    name: 'রয়্যাল সেগুন ক্রিম (Teak Luxury Cream)',
    enName: 'Teak Luxury Cream',
    gradientClass: 'bg-gradient-to-r from-[#fcfbf9] via-[#f7f2e7] to-[#ede0c8]',
    borderClass: 'border-[#a07436]/40',
    titleColor: 'text-[#2b1803]',
    subtitleColor: 'text-[#5c3a0d]',
    badgeBg: 'bg-[#a07436]/15',
    badgeText: 'text-[#6e4610]',
    badgeBorder: 'border-[#a07436]/30',
    iconColor: 'text-[#85581b]',
    closeBtnHover: 'hover:bg-[#a07436]/20 text-[#5c3a0d]',
    shadowClass: 'shadow-[0_4px_25px_rgba(160,116,54,0.18)]',
    previewBg: 'linear-gradient(135deg, #fcfbf9 0%, #f7f2e7 50%, #ede0c8 100%)'
  },
  'coral-sunset': {
    id: 'coral-sunset',
    name: 'কোরাল সানসেট (Coral Sunset Pearl)',
    enName: 'Coral Sunset Pearl',
    gradientClass: 'bg-gradient-to-r from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]',
    borderClass: 'border-[#e11d48]/40',
    titleColor: 'text-[#4c0519]',
    subtitleColor: 'text-[#9f1239]',
    badgeBg: 'bg-[#e11d48]/15',
    badgeText: 'text-[#be123c]',
    badgeBorder: 'border-[#e11d48]/30',
    iconColor: 'text-[#e11d48]',
    closeBtnHover: 'hover:bg-[#e11d48]/20 text-[#9f1239]',
    shadowClass: 'shadow-[0_4px_25px_rgba(225,29,72,0.18)]',
    previewBg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)'
  }
};

interface HomepageNoticeBoxProps {
  settings: Record<string, any>;
  position: 'top_bar' | 'hero_spotlight' | 'above_products' | 'above_handover' | 'above_team' | 'above_footer' | 'floating_bottom';
}

export const HomepageNoticeBox: React.FC<HomepageNoticeBoxProps> = ({
  settings,
  position
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Checks if enabled, text present, and matches current position
  // Default to enabled so notice is immediately operational and visible
  const isEnabled = settings.noticeEnabled !== false;
  const text = (
    settings.noticeText || 
    'জরুরি বিজ্ঞপ্তি: আমাদের শোরুমে নতুন প্রিমিয়াম চিটাগাং সেগুন কাঠের এক্সক্লুসিভ কালেকশন যুক্ত হয়েছে।'
  ).trim();
  const currentPos = settings.noticePosition || 'above_products';

  if (!isEnabled || !text || isDismissed) {
    return null;
  }

  // Only render if this instance matches the admin-configured position
  if (currentPos !== position) {
    return null;
  }

  const gradientId = settings.noticeGradient || 'gold-champagne';
  const theme = LIGHT_GRADIENT_PALETTES[gradientId] || LIGHT_GRADIENT_PALETTES['gold-champagne'];
  const size = settings.noticeSize || 'md';
  const align = settings.noticeAlign || 'center';
  const subtitle = (
    settings.noticeSubtitle !== undefined 
      ? settings.noticeSubtitle 
      : 'সরাসরি শোরুমে এসে আসবাবপত্র যাচাই করুন অথবা ফোনে বিস্তারিত জেনে অর্ডার কনফার্ম করুন।'
  ).trim();
  const badge = (settings.noticeBadge || '📢 বিশেষ নোটিশ').trim();
  const hasBorderGlow = settings.noticeBorderGlow !== false;
  const isDismissible = settings.noticeDismissible !== false;

  // Size specific stylings
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'py-2.5 px-4 rounded-2xl',
          title: 'text-xs sm:text-sm font-bold leading-snug',
          subtitle: 'text-[11px] sm:text-xs mt-0.5 leading-relaxed',
          badge: 'text-[9.5px] px-2 py-0.5',
          icon: 'w-3.5 h-3.5'
        };
      case 'lg':
        return {
          container: 'py-5 px-6 sm:px-8 rounded-3xl',
          title: 'text-base sm:text-lg md:text-xl font-black leading-snug',
          subtitle: 'text-xs sm:text-sm md:text-base font-medium mt-1 leading-relaxed',
          badge: 'text-xs sm:text-sm px-3.5 py-1 font-black',
          icon: 'w-5 h-5'
        };
      case 'xl':
        return {
          container: 'py-6 px-6 sm:px-10 rounded-3xl',
          title: 'text-lg sm:text-xl md:text-2xl font-black leading-tight',
          subtitle: 'text-sm sm:text-base font-semibold mt-1.5 leading-relaxed',
          badge: 'text-xs sm:text-sm px-4 py-1.5 font-black uppercase tracking-wider',
          icon: 'w-6 h-6'
        };
      case 'md':
      default:
        return {
          container: 'py-3.5 px-5 sm:px-7 rounded-2xl',
          title: 'text-sm sm:text-base font-extrabold leading-snug',
          subtitle: 'text-xs sm:text-sm font-medium mt-0.5 leading-relaxed',
          badge: 'text-[10.5px] sm:text-xs px-2.5 py-0.5 font-bold',
          icon: 'w-4 h-4'
        };
    }
  };

  const sz = getSizeStyles();

  // Alignment classes
  const getAlignClass = () => {
    if (align === 'left') return 'text-left items-start';
    if (align === 'right') return 'text-right items-end';
    return 'text-center items-center';
  };

  // Floating Bottom Position
  if (position === 'floating_bottom') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-xl z-45"
        >
          <div className={`${theme.gradientClass} border-2 ${theme.borderClass} ${theme.shadowClass} ${sz.container} flex items-start gap-3 relative backdrop-blur-md`}>
            {badge && (
              <span className={`${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} border rounded-full font-sans shrink-0 ${sz.badge}`}>
                {badge}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className={`${theme.titleColor} ${sz.title}`}>
                {text}
              </p>
              {subtitle && (
                <p className={`${theme.subtitleColor} ${sz.subtitle}`}>
                  {subtitle}
                </p>
              )}
            </div>
            {isDismissible && (
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className={`p-1 rounded-lg ${theme.closeBtnHover} transition-colors cursor-pointer shrink-0 ml-1`}
                aria-label="নোটিশ বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Top Bar Position
  if (position === 'top_bar') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`w-full ${theme.gradientClass} border-b-2 ${theme.borderClass} ${theme.shadowClass} relative z-35`}
        >
          <div className={`max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 ${align === 'center' ? 'sm:justify-center' : ''}`}>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {badge && (
                <span className={`${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} border rounded-full font-bold shrink-0 ${sz.badge}`}>
                  {badge}
                </span>
              )}
              <span className={`${theme.titleColor} ${sz.title}`}>
                {text}
              </span>
              {subtitle && (
                <span className={`${theme.subtitleColor} ${sz.subtitle} hidden sm:inline`}>
                  — {subtitle}
                </span>
              )}
            </div>

            {isDismissible && (
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className={`p-1 rounded-lg ${theme.closeBtnHover} transition-colors cursor-pointer shrink-0 ml-auto`}
                aria-label="নোটিশ বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Section embedded positions (above_products, hero_spotlight, above_handover, above_team, above_footer)
  return (
    <div className={`w-full px-4 sm:px-6 md:px-8 ${position === 'hero_spotlight' ? 'my-4 max-w-3xl mx-auto' : 'my-8 sm:my-10 max-w-6xl mx-auto'}`}>
      <motion.div
        initial={{ opacity: 0.9, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative ${theme.gradientClass} border-2 ${theme.borderClass} ${theme.shadowClass} ${sz.container} overflow-hidden ${hasBorderGlow ? 'ring-2 ring-white/50' : ''}`}
      >
        {/* Subtle decorative background light flare */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/40 rounded-full blur-2xl pointer-events-none" />

        <div className={`relative z-10 flex flex-col ${getAlignClass()} gap-1.5`}>
          <div className="flex items-center gap-2 flex-wrap">
            {badge && (
              <span className={`${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} border rounded-full font-black ${sz.badge}`}>
                {badge}
              </span>
            )}
            <Sparkles className={`${sz.icon} ${theme.iconColor} shrink-0 animate-pulse`} />
          </div>

          <p className={`${theme.titleColor} ${sz.title} font-serif tracking-tight`}>
            {text}
          </p>

          {subtitle && (
            <p className={`${theme.subtitleColor} ${sz.subtitle} max-w-4xl`}>
              {subtitle}
            </p>
          )}
        </div>

        {isDismissible && (
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className={`absolute top-3 right-3 p-1.5 rounded-full ${theme.closeBtnHover} transition-colors cursor-pointer`}
            aria-label="নোটিশ বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </div>
  );
};
