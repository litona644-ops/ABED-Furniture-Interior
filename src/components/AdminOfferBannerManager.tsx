import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, 
  Flame, 
  Sparkles, 
  Tag, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  Check, 
  Eye, 
  ExternalLink, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Image as ImageIcon, 
  Sliders, 
  CheckCircle2,
  Copy,
  Layout,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AdminOfferBannerManagerProps {
  siteSettings: any;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSaveSiteSettings: () => void;
  phone1?: string;
  onShowNotification?: (msg: string, type: 'success' | 'error') => void;
}

const PRESET_TEMPLATES = [
  {
    name: '🔥 মেগা ছাড় অফার',
    type: 'offer',
    badge: '🔥 বিশেষ মূল্যছাড়',
    title: 'চিটাগাং সেগুন কাঠের সকল আসবাবে ১০% পর্যন্ত বিশেষ ছাড়!',
    desc: 'সীমিত সময়ের জন্য সকল রয়্যাল বেডরুম ও ড্রইংরুম ফার্নিচারে আকর্ষণীয় মূল্যছাড় এবং ফ্রি হোম ডেলিভারি। সরাসরি যোগাযোগ করে এখনই অর্ডার কনফার্ম করুন।',
    btnText: 'WhatsApp-এ অফার বুক করুন',
    btnAction: 'whatsapp',
    coupon: 'ABED10',
    expiry: 'সীমিত সময়ের জন্য প্রযোজ্য',
    style: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: '🌙 ঈদ স্পেশাল কালেকশন',
    type: 'festival',
    badge: '✨ ঈদ মোবারক অফার',
    title: 'পবিত্র ঈদ উপলক্ষে নতুন রাজকীয় ফার্নিচার কালেকশন ও স্পেশাল গিফট!',
    desc: 'আপনার পছন্দের ডিজাইনের মেহগনি ও সেগুন কাঠের খোদাই করা ফার্নিচারে আকর্ষণীয় ক্যাশব্যাক ও ফ্রি ইন্টেরিয়র মেজারমেন্ট সুবিধা।',
    btnText: 'কালেকশন দেখুন ও বুক করুন',
    btnAction: 'whatsapp',
    coupon: 'EID2026',
    expiry: 'চাঁদরাত পর্যন্ত প্রযোজ্য',
    style: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: '🚚 ফ্রি ডেলিভারি ও পরিমাপ',
    type: 'announcement',
    badge: '📢 ক্লায়েন্ট পরামর্শ ও সেবা',
    title: 'ঢাকা শহরের যেকোনো প্রান্তে ফ্রি হোম মেজারমেন্ট ও দ্রুত ডেলিভারি!',
    desc: 'আপনার নতুন ফ্ল্যাট বা অফিসের সাইজ অনুযায়ী এক্সপার্ট পরামর্শ নিতে লিটন আলীর টিমের সাথে আজই যোগাযোগ করুন।',
    btnText: 'ফ্রি পরিমাপের বুকিং দিন',
    btnAction: 'call',
    coupon: 'FREEDELIVERY',
    expiry: 'চলতি মাস জুড়ে',
    style: 'both',
    imageUrl: ''
  },
  {
    name: '⚡ ফ্ল্যাশ সেল ১৫% ছাড়',
    type: 'discount',
    badge: '⚡ ফ্ল্যাশ ডিসকাউন্ট',
    title: 'আজকের স্পেশাল ফ্ল্যাশ ডিল: আধুনিক ডাইনিং টেবিল সেটে ১৫% ছাড়!',
    desc: 'অরিজিনাল সেগুন কাঠের ৬ চেয়ারের লাক্সারি ডাইনিং টেবিল এখন পাচ্ছেন অবিশ্বাস্য মূল্যে। স্টক থাকা পর্যন্ত স্টক সীমিত।',
    btnText: 'সরাসরি হটলাইনে কল করুন',
    btnAction: 'call',
    coupon: 'FLASH15',
    expiry: 'মাত্র ৪৮ ঘণ্টার জন্য',
    style: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: '🚨 জরুরি নোটিশ ও বিজ্ঞপ্তি',
    type: 'urgent',
    badge: '🚨 জরুরি নোটিশ',
    title: 'শোরুমের সময়সূচি পরিবর্তন ও সাপ্তাহিক ছুটির বিজ্ঞপ্তি',
    desc: 'শুক্রবার বিকেল ৩টা থেকে রাত ৯টা পর্যন্ত এবং অন্যান্য দিন সকাল ১০টা থেকে রাত ৯টা পর্যন্ত আমাদের গেন্ডারিয়া শোরুম খোলা থাকবে।',
    btnText: 'শোরুমের ঠিকানা দেখুন',
    btnAction: 'contact',
    coupon: '',
    expiry: 'সকল গ্রাহকদের জন্য',
    style: 'bar',
    imageUrl: ''
  }
];

export const AdminOfferBannerManager: React.FC<AdminOfferBannerManagerProps> = ({
  siteSettings,
  setSiteSettings,
  onSaveSiteSettings,
  phone1 = '০১৮১৬-২৩৪১৫৭',
  onShowNotification
}) => {
  const [isSaving, setIsSaving] = useState(false);

  // Settings values with defaults
  const isEnabled = Boolean(siteSettings.offerBannerEnabled);
  const bannerType = siteSettings.offerBannerType || 'offer';
  const badgeText = siteSettings.offerBannerBadge || '🔥 বিশেষ অফার';
  const titleText = siteSettings.offerBannerTitle || '';
  const descText = siteSettings.offerBannerDesc || '';
  const btnText = siteSettings.offerBannerBtnText || 'অফার সম্পর্কে জানুন';
  const btnAction = siteSettings.offerBannerBtnAction || 'whatsapp';
  const customUrl = siteSettings.offerBannerCustomUrl || '';
  const coupon = siteSettings.offerBannerCoupon || '';
  const imageUrl = siteSettings.offerBannerImage || '';
  const expiry = siteSettings.offerBannerExpiry || '';
  const displayStyle = siteSettings.offerBannerStyle || 'both';

  const updateSetting = (key: string, value: any) => {
    setSiteSettings((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setSiteSettings((prev: any) => ({
      ...prev,
      offerBannerEnabled: true,
      offerBannerType: preset.type,
      offerBannerBadge: preset.badge,
      offerBannerTitle: preset.title,
      offerBannerDesc: preset.desc,
      offerBannerBtnText: preset.btnText,
      offerBannerBtnAction: preset.btnAction,
      offerBannerCoupon: preset.coupon,
      offerBannerExpiry: preset.expiry,
      offerBannerStyle: preset.style,
      offerBannerImage: preset.imageUrl
    }));
    if (onShowNotification) {
      onShowNotification(`"${preset.name}" টেমপ্লেট সফলভাবে লোড হয়েছে! সংরক্ষণ করতে সেভ বাটনে চাপুন।`, 'success');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSiteSettings();
      if (onShowNotification) {
        onShowNotification('হোমপেজ অফার ও বিজ্ঞাপনের সেটিংস সফলভাবে সেভ করা হয়েছে!', 'success');
      }
    } catch (e) {
      if (onShowNotification) {
        onShowNotification('সেটিংস সংরক্ষণে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAll = () => {
    setSiteSettings((prev: any) => ({
      ...prev,
      offerBannerEnabled: false,
      offerBannerTitle: '',
      offerBannerDesc: '',
      offerBannerBadge: '🔥 বিশেষ অফার',
      offerBannerCoupon: '',
      offerBannerImage: '',
      offerBannerExpiry: ''
    }));
    if (onShowNotification) {
      onShowNotification('অফার ও বিজ্ঞাপনের ফিল্ডগুলো পরিষ্কার করা হয়েছে।', 'success');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#d4a762]/10 border border-[#d4a762]/25 px-3 py-1 rounded-full mb-2">
            <Megaphone className="w-3.5 h-3.5 text-[#d4a762]" />
            <span className="text-[10.5px] font-black uppercase text-[#d4a762] tracking-wider font-outfit">
              Dynamic Homepage Marketing Engine
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-serif flex items-center gap-2.5">
            <span>হোমপেজ অফার ও বিজ্ঞাপন ব্যবস্থাপনা</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            এডমিন হিসেবে হোমপেজে যেকোনো অফার, নোটিশ, ছাড়, ব্যানার ছবি বা ঘোষণা তাৎক্ষণিকভাবে প্রদর্শন করুন। এটি স্থায়ী নয়—প্রয়োজন অনুযায়ী যেকোনো সময় অন বা অফ করতে পারেন।
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-400 hover:text-stone-200 text-xs font-bold border border-white/[0.08] transition-all cursor-pointer"
            title="সব টেক্সট মুছে ফেলুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>খালি করুন</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a762] via-[#e0b873] to-[#ad7d33] hover:brightness-110 active:scale-95 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-stone-950" />
            <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সেভ করুন'}</span>
          </button>
        </div>
      </div>

      {/* 1. MASTER ON/OFF POWER TOGGLE BOX */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isEnabled 
          ? 'bg-gradient-to-r from-emerald-950/40 via-stone-900/60 to-emerald-950/30 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
          : 'bg-white/[0.02] border-white/[0.08]'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-white font-sans">
                হোমপেজে অফার / বিজ্ঞাপন প্রদর্শন অবস্থা (Homepage Visibility):
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide font-outfit border ${
                isEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
                <span>{isEnabled ? '🟢 LIVE ON HOMEPAGE' : '⚪ DISABLED / HIDDEN'}</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">
              {isEnabled
                ? 'সক্রিয় অবস্থায় রয়েছে—হোমপেজে ভিজিটররা এই অফার/বিজ্ঞাপন দেখতে পাচ্ছেন।'
                : 'বর্তমানে বন্ধ রয়েছে—হোমপেজে কোনো অফার বা নোটিশ দেখাচ্ছে না। সাইটটি সাধারণ স্বাভাবিক অবস্থায় প্রদর্শিত হচ্ছে।'}
            </p>
          </div>

          {/* Big Master Toggle Switch */}
          <button
            type="button"
            onClick={() => updateSetting('offerBannerEnabled', !isEnabled)}
            className={`relative inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
              isEnabled ? 'bg-gradient-to-r from-emerald-500 to-[#10b981]' : 'bg-stone-800'
            }`}
            aria-label="Toggle Homepage Offer"
          >
            <span
              className={`pointer-events-none inline-block h-9 w-9 transform rounded-full bg-white shadow-xl ring-0 transition duration-300 ease-in-out flex items-center justify-center ${
                isEnabled ? 'translate-x-10 text-emerald-600' : 'translate-x-0 text-stone-500'
              }`}
            >
              {isEnabled ? <Check className="w-5 h-5 stroke-[3]" /> : <Flame className="w-4 h-4" />}
            </span>
          </button>
        </div>
      </div>

      {/* 2. ONE-CLICK QUICK PRESET TEMPLATES */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#d4a762]" />
          <span className="text-xs font-black uppercase text-stone-300 tracking-wider">
            ১-ক্লিকে রেডিমেড টেমপ্লেট লোড করুন (Quick Preset Templates):
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_TEMPLATES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-[#d4a762]/15 text-stone-300 hover:text-[#fdbf5e] text-xs font-bold border border-white/[0.08] hover:border-[#d4a762]/40 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. CORE CONFIGURATION CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Content Text */}
        <div className="space-y-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
          <h4 className="text-xs font-black uppercase text-[#d4a762] tracking-wider flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>অফার ও বিজ্ঞাপনের টেক্সট কনটেন্ট</span>
          </h4>

          {/* Banner Type */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              বিজ্ঞাপনের ধরণ বা থিম (Category Theme)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'offer', label: '🔥 স্পেশাল অফার' },
                { id: 'announcement', label: '📢 ঘোষণা / পরামর্শ' },
                { id: 'festival', label: '✨ উৎসব / ঈদ' },
                { id: 'discount', label: '⚡ ফ্ল্যাশ সেল' },
                { id: 'urgent', label: '🚨 জরুরি নোটিশ' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateSetting('offerBannerType', t.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    bannerType === t.id
                      ? 'bg-[#d4a762] text-stone-950 border-[#d4a762] font-black shadow-md'
                      : 'bg-black border-white/[0.1] text-stone-300 hover:bg-white/[0.04]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top Badge */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              টপ ব্যাজ টেক্সট (Top Badge Tag)
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => updateSetting('offerBannerBadge', e.target.value)}
              placeholder="যেমন: 🔥 বিশেষ অফার, 📢 জরুরি নোটিশ"
              className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
            />
          </div>

          {/* Main Headline */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              বিজ্ঞাপন বা অফারের মূল শিরোনাম (Offer Headline / Title) *
            </label>
            <input
              type="text"
              value={titleText}
              onChange={(e) => updateSetting('offerBannerTitle', e.target.value)}
              placeholder="যেমন: চিটাগাং সেগুন কাঠের আসবাবে ১০% পর্যন্ত বিশেষ ছাড়!"
              className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-[#fdbf5e] font-black focus:outline-none focus:border-[#d4a762]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              বিস্তারিত বার্তা / বিবরণ (Offer Message / Advisory Description)
            </label>
            <textarea
              rows={3}
              value={descText}
              onChange={(e) => updateSetting('offerBannerDesc', e.target.value)}
              placeholder="অফার সম্পর্কে বিস্তারিত তথ্য, সুবিধা, ডেলিভারি বা শর্তাবলী..."
              className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-[#d4a762] leading-relaxed"
            />
          </div>

          {/* Expiry & Coupon Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">
                মেয়াদ / সময়সীমা (Timeline Note)
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => updateSetting('offerBannerExpiry', e.target.value)}
                placeholder="যেমন: ৩১ অক্টোবর পর্যন্ত"
                className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">
                ডিসকাউন্ট / কুপন কোড (যদি থাকে)
              </label>
              <input
                type="text"
                value={coupon}
                onChange={(e) => updateSetting('offerBannerCoupon', e.target.value)}
                placeholder="যেমন: ABED10, EID2026"
                className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-[#fdbf5e] font-mono font-bold focus:outline-none focus:border-[#d4a762]"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Actions, Image & Display Position */}
        <div className="space-y-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
          <h4 className="text-xs font-black uppercase text-[#d4a762] tracking-wider flex items-center gap-2">
            <Layout className="w-3.5 h-3.5" />
            <span>অ্যাকশন বাটন, ছবি ও ডিসপ্লে পজিশন</span>
          </h4>

          {/* Display Style */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              হোমপেজে প্রদর্শনের পজিশন (Display Format)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'both', label: 'উভয় জায়গায় (Both)' },
                { id: 'bar', label: 'টপ ব্যানার বার' },
                { id: 'card', label: 'স্পটলাইট কার্ড' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => updateSetting('offerBannerStyle', s.id)}
                  className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border text-center transition-all cursor-pointer ${
                    displayStyle === s.id
                      ? 'bg-[#d4a762] text-stone-950 border-[#d4a762] font-black'
                      : 'bg-black border-white/[0.1] text-stone-300 hover:bg-white/[0.04]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button Label */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              অ্যাকশন বাটনের টেক্সট (Action Button Text)
            </label>
            <input
              type="text"
              value={btnText}
              onChange={(e) => updateSetting('offerBannerBtnText', e.target.value)}
              placeholder="যেমন: WhatsApp-এ অফার বুক করুন"
              className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
            />
          </div>

          {/* Action Destination */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              বাটনে ক্লিক করলে কী ঘটবে (Click Action Destination)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'whatsapp', label: 'WhatsApp চ্যাট', icon: MessageCircle },
                { id: 'call', label: 'ফোন কল (Call)', icon: Phone },
                { id: 'products', label: 'পণ্য সেকশনে স্ক্রোল', icon: Tag },
                { id: 'contact', label: 'যোগাযোগ সেকশন', icon: ExternalLink },
                { id: 'custom', label: 'কাস্টম ওয়েবসাইট লিংক', icon: ArrowRight }
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => updateSetting('offerBannerBtnAction', act.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      btnAction === act.id
                        ? 'bg-[#d4a762] text-stone-950 border-[#d4a762] font-black'
                        : 'bg-black border-white/[0.1] text-stone-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Link if selected */}
          {btnAction === 'custom' && (
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">
                কাস্টম ইউআরএল (Custom Link URL)
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => updateSetting('offerBannerCustomUrl', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
              />
            </div>
          )}

          {/* Optional Banner Image URL */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">
              বিজ্ঞাপন ব্যানার ইমেজ (Optional Banner Photo URL)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => updateSetting('offerBannerImage', e.target.value)}
                placeholder="https://images.unsplash.com/... বা যেকোনো ইমেজের লিংক"
                className="flex-1 bg-black border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
              />
              {imageUrl && (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shrink-0">
                  <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-[10.5px] text-stone-400 mt-1">
              ছবি দিলে ব্যানার ও কার্ডের পাশে আকর্ষণীয় ফার্নিচার ফটো যুক্ত হবে। ফাঁকা রাখলে শুধু টেক্সট দেখাবে।
            </p>
          </div>

        </div>

      </div>

      {/* 4. INTERACTIVE LIVE PREVIEW BOX */}
      <div className="p-6 rounded-3xl bg-black border border-white/[0.1] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#d4a762]" />
            <h4 className="text-xs font-black uppercase text-stone-300 tracking-wider">
              হোমপেজ লাইভ প্রিভিউ (Live Visitor Preview)
            </h4>
          </div>
          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
            isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'
          }`}>
            {isEnabled ? '● হোমপেজে সক্রিয় রয়েছে' : '○ প্রিভিউ (হোমপেজে বর্তমানে বন্ধ)'}
          </span>
        </div>

        {/* The Live Rendered Card */}
        <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#170e01] via-[#2f1b03] to-[#170e01] border-2 border-[#d4a762]/60 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Flame className="w-3.5 h-3.5" />
                <span>{badgeText || '🔥 বিশেষ অফার'}</span>
              </span>

              {expiry && (
                <span className="inline-flex items-center gap-1 text-[11px] text-stone-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                  <Calendar className="w-3 h-3 text-[#fdbf5e]" />
                  <span>{expiry}</span>
                </span>
              )}

              {coupon && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#fdbf5e] font-mono font-bold bg-[#d4a762]/15 border border-[#d4a762]/30 px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>কোড: {coupon}</span>
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white font-serif">
              {titleText || 'আপনার বিজ্ঞাপনের শিরোনাম এখানে প্রদর্শিত হবে'}
            </h3>

            {descText && (
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                {descText}
              </p>
            )}
          </div>

          {imageUrl && (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#d4a762]/40 shadow-lg shrink-0">
              <img src={imageUrl} alt="Offer Visual" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="shrink-0 w-full md:w-auto">
            <div className="bg-gradient-to-r from-[#d4a762] via-[#fdbf5e] to-[#d4a762] text-stone-950 font-black px-6 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2">
              <span>{btnText || 'অফার সম্পর্কে জানুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER SAVE BAR */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
        <p className="text-xs text-stone-400">
          💡 টিপস: যেকোনো পরিবর্তন করার পর অবশ্যই নিচের <strong className="text-white">"সেভ করুন"</strong> বাটনে ক্লিক করে ডেটাবেজে সংরক্ষণ করুন।
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a762] via-[#e0b873] to-[#ad7d33] hover:brightness-110 active:scale-95 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-stone-950" />
          <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সেভ করুন'}</span>
        </button>
      </div>

    </div>
  );
};

export default AdminOfferBannerManager;
