import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Tag, 
  Megaphone, 
  Flame, 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  X, 
  Calendar,
  AlertCircle,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';

interface HomepageOfferBannerProps {
  settings: Record<string, any>;
  phone1?: string;
  onNavigateToProducts?: () => void;
  onNavigateToContact?: () => void;
  mode?: 'bar' | 'card'; // 'bar' for top announcement bar, 'card' for homepage spotlight
}

export const HomepageOfferBanner: React.FC<HomepageOfferBannerProps> = ({
  settings,
  phone1 = '+8801816234157',
  onNavigateToProducts,
  onNavigateToContact,
  mode = 'bar'
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // If not enabled by Admin or dismissed by user for current session, don't show anything
  if (!settings.offerBannerEnabled || isDismissed) {
    return null;
  }

  const displayStyle = settings.offerBannerStyle || 'both';
  // If mode is 'bar' but style is only 'card', skip
  if (mode === 'bar' && displayStyle === 'card') {
    return null;
  }
  // If mode is 'card' but style is only 'bar', skip
  if (mode === 'card' && displayStyle === 'bar') {
    return null;
  }

  const bannerType = settings.offerBannerType || 'offer';
  const badgeText = settings.offerBannerBadge || '🔥 বিশেষ অফার';
  const titleText = settings.offerBannerTitle || 'বিশেষ অফার চলছে';
  const descText = settings.offerBannerDesc || '';
  const btnText = settings.offerBannerBtnText || 'অফার সম্পর্কে জানুন';
  const btnAction = settings.offerBannerBtnAction || 'whatsapp';
  const customUrl = settings.offerBannerCustomUrl || '';
  const coupon = settings.offerBannerCoupon || '';
  const imageUrl = settings.offerBannerImage || '';
  const expiryText = settings.offerBannerExpiry || '';

  // Theme styles based on banner type
  const getThemeStyles = () => {
    switch (bannerType) {
      case 'festival':
        return {
          wrapperBg: 'bg-gradient-to-r from-[#1f0f00] via-[#3a1d00] to-[#1f0f00]',
          border: 'border-[#d4a762]/60',
          badgeBg: 'bg-[#d4a762]/20 text-[#fdbf5e] border-[#d4a762]/40',
          badgeIcon: Sparkles,
          glow: 'from-[#d4a762]/25 to-transparent',
          btnBg: 'bg-gradient-to-r from-[#d4a762] to-[#fdbf5e] hover:brightness-110 text-stone-950 font-black'
        };
      case 'announcement':
        return {
          wrapperBg: 'bg-gradient-to-r from-[#0b1726] via-[#10233b] to-[#0b1726]',
          border: 'border-sky-500/40',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          badgeIcon: Megaphone,
          glow: 'from-sky-500/20 to-transparent',
          btnBg: 'bg-gradient-to-r from-sky-500 to-sky-400 hover:brightness-110 text-stone-950 font-black'
        };
      case 'urgent':
        return {
          wrapperBg: 'bg-gradient-to-r from-[#210909] via-[#381111] to-[#210909]',
          border: 'border-rose-500/50',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          badgeIcon: AlertCircle,
          glow: 'from-rose-500/20 to-transparent',
          btnBg: 'bg-gradient-to-r from-rose-500 to-rose-400 hover:brightness-110 text-white font-black'
        };
      case 'discount':
        return {
          wrapperBg: 'bg-gradient-to-r from-[#170e01] via-[#382305] to-[#170e01]',
          border: 'border-amber-400/60',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          badgeIcon: Tag,
          glow: 'from-amber-400/25 to-transparent',
          btnBg: 'bg-gradient-to-r from-[#d4a762] via-[#fdbf5e] to-[#d4a762] hover:brightness-110 text-stone-950 font-black'
        };
      case 'offer':
      default:
        return {
          wrapperBg: 'bg-gradient-to-r from-[#170e01] via-[#2f1b03] to-[#170e01]',
          border: 'border-[#d4a762]/60',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          badgeIcon: Flame,
          glow: 'from-amber-500/20 to-transparent',
          btnBg: 'bg-gradient-to-r from-[#d4a762] via-[#fdbf5e] to-[#d4a762] hover:brightness-110 text-stone-950 font-black'
        };
    }
  };

  const theme = getThemeStyles();
  const BadgeIcon = theme.badgeIcon;

  const handleActionClick = () => {
    if (btnAction === 'whatsapp') {
      const cleanPhone = phone1.replace(/[^0-9]/g, '');
      const couponNote = coupon ? ` (কুপন কোড: ${coupon})` : '';
      const msg = encodeURIComponent(`আসসালামু আলাইকুম, আমি আপনাদের ওয়েবসাইটের বিশেষ অফার "${titleText}"${couponNote} সম্পর্কে বিস্তারিত জানতে ও বুক করতে চাই।`);
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    } else if (btnAction === 'call') {
      window.location.href = `tel:${phone1}`;
    } else if (btnAction === 'products' && onNavigateToProducts) {
      onNavigateToProducts();
    } else if (btnAction === 'contact' && onNavigateToContact) {
      onNavigateToContact();
    } else if (btnAction === 'custom' && customUrl) {
      window.open(customUrl, '_blank');
    }
  };

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (coupon) {
      navigator.clipboard.writeText(coupon);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  // SPOTLIGHT CARD DISPLAY (used on Homepage between Hero and Products)
  if (mode === 'card') {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 relative z-20 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`relative ${theme.wrapperBg} ${theme.border} border-2 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden text-white`}
        >
          {/* Ambient Lighting */}
          <div className={`absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-br ${theme.glow} rounded-full blur-3xl pointer-events-none`} />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* Left Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1 rounded-full border backdrop-blur-md ${theme.badgeBg}`}>
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{badgeText}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </span>

                {expiryText && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-stone-300 font-semibold bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3 text-[#fdbf5e]" />
                    <span>{expiryText}</span>
                  </span>
                )}

                {coupon && (
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#fdbf5e] font-mono font-bold bg-[#d4a762]/15 border border-[#d4a762]/40 hover:bg-[#d4a762]/25 px-2.5 py-0.5 rounded-full cursor-pointer transition-all active:scale-95"
                    title="ক্লিক করে কোড কপি করুন"
                  >
                    <Tag className="w-3 h-3" />
                    <span>কোড: {coupon}</span>
                    {copiedCoupon ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#fdbf5e]" />}
                  </button>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-serif leading-tight">
                {titleText}
              </h3>

              {descText && (
                <p className="text-xs sm:text-sm md:text-base text-stone-300 leading-relaxed font-medium max-w-3xl">
                  {descText}
                </p>
              )}
            </div>

            {/* Optional Banner Photo */}
            {imageUrl && (
              <div className="w-full sm:w-48 h-32 sm:h-36 rounded-2xl overflow-hidden border border-[#d4a762]/30 shadow-xl shrink-0">
                <img src={imageUrl} alt={titleText} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Action CTA Button */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleActionClick}
                className={`${theme.btnBg} px-7 py-4 rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95 w-full sm:w-auto`}
              >
                {btnAction === 'whatsapp' && <MessageCircle className="w-4.5 h-4.5" />}
                {btnAction === 'call' && <Phone className="w-4.5 h-4.5" />}
                {btnAction === 'products' && <Tag className="w-4.5 h-4.5" />}
                {btnAction === 'custom' && <ExternalLink className="w-4.5 h-4.5" />}
                <span>{btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  // TOP ANNOUNCEMENT BAR DISPLAY
  return (
    <AnimatePresence>
      <motion.aside 
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full px-4 sm:px-6 md:px-8 py-3.5 relative z-30 font-sans"
        aria-label="বিশেষ ঘোষণা ও অফার ব্যানার"
      >
        <div className="max-w-7xl mx-auto">
          <div className={`relative ${theme.wrapperBg} ${theme.border} border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white`}>
            
            {/* Ambient Corner Flare */}
            <div className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${theme.glow} rounded-full blur-3xl pointer-events-none -mr-20 -mt-20`} />

            {/* Left Content Area */}
            <div className="flex-1 pr-8 md:pr-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1 rounded-full border backdrop-blur-md ${theme.badgeBg}`}>
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{badgeText}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </span>

                {expiryText && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-stone-300 font-semibold bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3 text-[#fdbf5e]" />
                    <span>{expiryText}</span>
                  </span>
                )}

                {coupon && (
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#fdbf5e] font-mono font-bold bg-[#d4a762]/15 border border-[#d4a762]/40 hover:bg-[#d4a762]/25 px-2.5 py-0.5 rounded-full cursor-pointer transition-all active:scale-95"
                    title="ক্লিক করে কোড কপি করুন"
                  >
                    <Tag className="w-3 h-3" />
                    <span>কোড: {coupon}</span>
                    {copiedCoupon ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#fdbf5e]" />}
                  </button>
                )}
              </div>

              <h2 className="text-base sm:text-xl md:text-2xl font-black text-white font-serif leading-snug">
                {titleText}
              </h2>

              {descText && (
                <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed max-w-3xl font-medium">
                  {descText}
                </p>
              )}
            </div>

            {/* Optional Thumbnail Image */}
            {imageUrl && (
              <div className="hidden sm:block w-20 h-20 rounded-xl overflow-hidden border border-[#d4a762]/30 shadow-md shrink-0">
                <img src={imageUrl} alt={titleText} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Right Action Button & Dismiss */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <button
                type="button"
                onClick={handleActionClick}
                className={`${theme.btnBg} px-6 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 w-full md:w-auto`}
              >
                {btnAction === 'whatsapp' && <MessageCircle className="w-4 h-4" />}
                {btnAction === 'call' && <Phone className="w-4 h-4" />}
                {btnAction === 'products' && <Tag className="w-4 h-4" />}
                {btnAction === 'custom' && <ExternalLink className="w-4 h-4" />}
                <span>{btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Dismiss close button */}
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="absolute top-3.5 right-3.5 md:relative md:top-auto md:right-auto p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="ব্যানারটি বন্ধ করুন"
                aria-label="Close Announcement Banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default HomepageOfferBanner;
