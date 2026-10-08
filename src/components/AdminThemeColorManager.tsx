import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Sparkles, 
  RotateCcw, 
  Save, 
  Check, 
  Eye, 
  Sliders, 
  Layers, 
  ChevronRight, 
  Brush, 
  Compass, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Sun,
  Layout,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { 
  ThemeColors, 
  DEFAULT_THEME_COLORS, 
  PRESET_THEMES, 
  GRADIENT_PRESETS, 
  applyThemeColors 
} from '../lib/themeManager';
import { saveSiteSettingsToSupabase } from '../lib/supabase';
import { doc, setDoc } from 'firebase/firestore';
import { db, ensureAuthSession } from '../lib/firebase';

interface AdminThemeColorManagerProps {
  siteSettings: Record<string, any>;
  setSiteSettings: React.Dispatch<React.SetStateAction<any>>;
  onSaveSiteSettings?: () => void;
  onShowNotification: (msg: string, type: 'success' | 'error') => void;
}

export const AdminThemeColorManager: React.FC<AdminThemeColorManagerProps> = ({
  siteSettings,
  setSiteSettings,
  onSaveSiteSettings,
  onShowNotification
}) => {
  // Theme state initialized from siteSettings.themeColors or defaults
  const [theme, setTheme] = useState<ThemeColors>(() => {
    if (siteSettings.themeColors && typeof siteSettings.themeColors === 'object') {
      return { ...DEFAULT_THEME_COLORS, ...siteSettings.themeColors };
    }
    return { ...DEFAULT_THEME_COLORS };
  });

  const [activeCategory, setActiveCategory] = useState<'presets' | 'brand' | 'header' | 'hero' | 'buttons' | 'sections' | 'gradients'>('presets');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Sync to live site as admin edits so they see changes immediately
  useEffect(() => {
    applyThemeColors(theme);
  }, [theme]);

  // Update a single theme property
  const updateColor = (key: keyof ThemeColors, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  // Apply a full preset theme
  const handleApplyPreset = (presetId: string) => {
    const found = PRESET_THEMES.find(p => p.id === presetId);
    if (!found) return;
    const merged = { ...DEFAULT_THEME_COLORS, ...found.colors, activeGradientPreset: presetId };
    setTheme(merged);
    onShowNotification(`"${found.name}" প্যালেট সফলভাবে নির্বাচন করা হয়েছে!`, 'success');
  };

  // Apply a gradient preset to primary buttons & hero
  const handleApplyGradientPreset = (grad: typeof GRADIENT_PRESETS[0]) => {
    setTheme(prev => ({
      ...prev,
      btnPrimaryStart: grad.start,
      btnPrimaryEnd: grad.end,
      primaryColor: grad.mid,
      heroTitleGradStart: '#ffffff',
      heroTitleGradMid: grad.mid,
      heroTitleGradEnd: grad.end
    }));
    onShowNotification(`"${grad.name}" গ্রেডিয়েন্ট বাটনে প্রয়োগ করা হয়েছে!`, 'success');
  };

  // Reset to default factory colors
  const handleResetToDefault = () => {
    setTheme({ ...DEFAULT_THEME_COLORS });
    applyThemeColors(DEFAULT_THEME_COLORS);
    onShowNotification('ফ্যাক্টরি ডিফল্ট কালার রিস্টোর করা হয়েছে!', 'success');
  };

  // Save changes to cloud
  const handleSaveTheme = async () => {
    setIsSaving(true);
    const updatedSettings = {
      ...siteSettings,
      themeColors: theme
    };

    setSiteSettings(updatedSettings);

    try {
      localStorage.setItem('abed_settings', JSON.stringify(updatedSettings));
      localStorage.setItem('abed_theme_colors', JSON.stringify(theme));
      applyThemeColors(theme);

      // 1. Save to Supabase
      try {
        await saveSiteSettingsToSupabase(updatedSettings);
      } catch (sbErr) {
        console.warn('Supabase theme save note:', sbErr);
      }

      // 2. Save to Firestore
      try {
        await ensureAuthSession();
        await setDoc(doc(db, 'site_settings', 'current'), updatedSettings, { merge: true });
      } catch (fbErr) {
        console.warn('Firebase theme save note:', fbErr);
      }

      if (onSaveSiteSettings) onSaveSiteSettings();

      onShowNotification('ওয়েবসাইটের সমস্ত কালার ও গ্রেডিয়েন্ট সফলভাবে সেভ ও লাইভ করা হয়েছে!', 'success');
    } catch (err: any) {
      console.error('Failed to save theme:', err);
      onShowNotification('কালার সেভ করতে সমস্যা হয়েছে: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Color Input Component with HTML5 picker and text
  const ColorPickerRow = ({
    label,
    description,
    colorKey,
    value,
    quickColors = ['#d4a762', '#10b981', '#2563eb', '#e11d48', '#9333ea', '#d97706', '#ffffff', '#000000']
  }: {
    label: string;
    description?: string;
    colorKey: keyof ThemeColors;
    value: string;
    quickColors?: string[];
  }) => {
    return (
      <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white flex items-center gap-2">
            <span>{label}</span>
          </p>
          {description && (
            <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
              {description}
            </p>
          )}
          {/* Quick Swatches */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-[9.5px] font-mono text-stone-500 uppercase mr-1">Quick:</span>
            {quickColors.map((qc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateColor(colorKey, qc)}
                className={`w-4 h-4 rounded-full border transition-transform cursor-pointer hover:scale-125 ${
                  value.toLowerCase() === qc.toLowerCase() ? 'ring-2 ring-white scale-110 border-white' : 'border-white/20'
                }`}
                style={{ backgroundColor: qc }}
                title={qc}
              />
            ))}
          </div>
        </div>

        {/* Color picker box */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <div className="relative flex items-center">
            <input
              type="color"
              value={value.startsWith('#') ? value : '#d4a762'}
              onChange={(e) => updateColor(colorKey, e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0 overflow-hidden shadow-md"
            />
          </div>

          <div className="flex items-center bg-stone-900 border border-white/[0.12] rounded-xl px-2.5 py-1.5 font-mono text-xs text-white">
            <span className="text-stone-500 mr-1">HEX</span>
            <input
              type="text"
              value={value}
              onChange={(e) => updateColor(colorKey, e.target.value)}
              className="w-20 bg-transparent text-white font-mono focus:outline-none text-xs uppercase"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl font-sans text-stone-100">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#d4a762]/15 border border-[#d4a762]/35 px-3 py-1 rounded-full mb-2">
            <Palette className="w-3.5 h-3.5 text-[#fdbf5e]" />
            <span className="text-[11px] font-black uppercase text-[#fdbf5e] tracking-wider font-outfit">
              Website Element & Theme Color Customizer
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-serif flex items-center gap-2.5">
            <span>ওয়েবসাইটের সমস্ত এলিমেন্ট কালার ও গ্রেডিয়েন্ট পরিবর্তন</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            ওয়েবসাইটের যেকোনো উপাদানের রঙ (হেডার, ব্র্যান্ড গোল্ড, বাটন, হিরো ব্যানার, কার্ড বর্ডার ও গ্রেডিয়েন্ট) অ্যাডমিন প্যানেল থেকেই নিজের পছন্দ অনুযায়ী নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/[0.1] text-xs font-bold transition-all cursor-pointer"
            title="ফ্যাক্টরি ডিফল্ট কালার রিস্টোর করুন"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Colors</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveTheme}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a762] via-[#e5bd7a] to-[#b07e35] text-stone-950 text-xs font-black transition-all cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Colors</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Interactive Real-Time Live Site Simulator */}
      <div className="bg-stone-950/90 rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#d4a762]" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-300">
              রিয়েল-টাইম লাইভ কম্পোনেন্ট প্রিভিউ (Real-Time Live Simulation)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            লাইভ সিঙ্ক সক্রিয়
          </span>
        </div>

        {/* Live Mock Screen Window */}
        <div className="rounded-2xl border border-stone-800 overflow-hidden shadow-2xl bg-black">
          
          {/* Mock Top Navbar */}
          <div 
            className="px-5 py-3.5 flex items-center justify-between border-b border-white/[0.08] transition-colors"
            style={{ backgroundColor: theme.navbarBg }}
          >
            <div className="flex items-center gap-1.5 font-serif font-black text-sm">
              <span style={{ color: theme.brandNameLeftColor }}>আবেদ</span>
              <span style={{ color: theme.brandNameRightColor }}>ফার্নিচার</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-xs font-bold font-sans">
              <span style={{ color: theme.navLinkColor }}>Home</span>
              <span style={{ color: theme.primaryColor }}>Our Products</span>
              <span style={{ color: theme.navLinkColor }}>Handover Projects</span>
              <span style={{ color: theme.navLinkColor }}>Contact</span>
            </div>

            <button
              type="button"
              className="text-[11px] font-black px-3 py-1.5 rounded-lg border shadow-xs"
              style={{
                borderColor: theme.primaryColor,
                color: theme.primaryColor,
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            >
              Order Now
            </button>
          </div>

          {/* Mock Hero Section */}
          <div 
            className="p-6 sm:p-10 relative overflow-hidden flex flex-col items-center justify-center text-center"
            style={{
              background: `linear-gradient(${theme.gradientDirection || 'to bottom'}, ${theme.heroOverlayStart}, ${theme.heroOverlayEnd})`
            }}
          >
            {/* Mock Badge */}
            <div 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase mb-3 border backdrop-blur-md"
              style={{
                borderColor: `${theme.primaryColor}55`,
                backgroundColor: `${theme.primaryColor}22`,
                color: theme.primaryHoverColor
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>ঐতিহ্যবাহী মেহগনি ও সেগুন কাঠের ফার্নিচার</span>
            </div>

            {/* Mock Dynamic Gradient Headline */}
            <h4 
              className="text-xl sm:text-3xl font-extrabold mb-1 tracking-tight font-serif"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.heroTitleGradStart}, ${theme.heroTitleGradMid}, ${theme.heroTitleGradEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              আবেদ ফার্নিচার ও ইন্টেরিয়র
            </h4>
            <h5 
              className="text-base sm:text-2xl font-black mb-4 font-serif"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.heroSubtitleGradStart}, ${theme.heroSubtitleGradEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              প্রিমিয়াম হোম ফার্নিচার ও ডিজাইন
            </h5>

            {/* Mock Buttons */}
            <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
              <button
                type="button"
                className="px-6 py-2.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 cursor-pointer transform hover:scale-105 transition-all"
                style={{
                  background: `linear-gradient(${theme.gradientDirection || 'to right'}, ${theme.btnPrimaryStart}, ${theme.btnPrimaryEnd})`,
                  color: theme.btnPrimaryText
                }}
              >
                <span>আমাদের পণ্যসমূহ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-xs font-bold border transition-colors cursor-pointer"
                style={{
                  borderColor: theme.btnSecondaryBorder,
                  color: theme.btnSecondaryText,
                  backgroundColor: 'rgba(255,255,255,0.06)'
                }}
              >
                যোগাযোগ ও শোরুম
              </button>
            </div>
          </div>

          {/* Mock Product Card Section */}
          <div 
            className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/[0.08]"
            style={{ backgroundColor: theme.sectionLightBg }}
          >
            <div 
              className="p-4 rounded-2xl border bg-white shadow-sm flex items-center justify-between"
              style={{ borderColor: theme.cardBorderColor }}
            >
              <div>
                <span 
                  className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${theme.primaryColor}25`,
                    color: theme.primaryColor
                  }}
                >
                  বেস্টসেলার
                </span>
                <p 
                  className="text-sm font-bold mt-1 font-serif"
                  style={{ color: theme.sectionHeadingColor }}
                >
                  চিটাগাং সেগুন কাঠের খাট
                </p>
                <p className="text-xs font-bold font-mono" style={{ color: theme.primaryColor }}>
                  ৳ ৬৫,০০০ – ৳ ১,২০,০০০
                </p>
              </div>

              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                style={{
                  background: `linear-gradient(${theme.gradientDirection || 'to right'}, ${theme.btnPrimaryStart}, ${theme.btnPrimaryEnd})`,
                  color: theme.btnPrimaryText
                }}
              >
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <div 
              className="p-4 rounded-2xl border bg-white shadow-sm flex items-center justify-between"
              style={{ borderColor: theme.cardBorderColor }}
            >
              <div>
                <span 
                  className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${theme.primaryColor}25`,
                    color: theme.primaryColor
                  }}
                >
                  লাক্সারি ইন্টেরিয়র
                </span>
                <p 
                  className="text-sm font-bold mt-1 font-serif"
                  style={{ color: theme.sectionHeadingColor }}
                >
                  ডুপ্লেক্স ড্রয়িংরুম ইন্টেরিয়র
                </p>
                <p className="text-xs font-bold font-mono" style={{ color: theme.primaryColor }}>
                  সম্পন্ন প্রজেক্ট
                </p>
              </div>

              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                style={{
                  background: `linear-gradient(${theme.gradientDirection || 'to right'}, ${theme.btnPrimaryStart}, ${theme.btnPrimaryEnd})`,
                  color: theme.btnPrimaryText
                }}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Category Tabs for Intuitive Customization */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/[0.08]">
        {[
          { id: 'presets', label: '১-ক্লিক কালার প্যালেট (Presets)', icon: Palette },
          { id: 'gradients', label: 'গ্রেডিয়েন্ট অপশন (Gradients)', icon: Sparkles },
          { id: 'brand', label: 'ব্র্যান্ড কালার (Brand Accent)', icon: Brush },
          { id: 'header', label: 'হেডার ও মেনু (Header/Nav)', icon: Layout },
          { id: 'hero', label: 'হিরো ব্যানার (Hero Section)', icon: Compass },
          { id: 'buttons', label: 'বাটন ও সিলেকশন (Buttons)', icon: SlidersHorizontal },
          { id: 'sections', label: 'সেকশন ও কার্ড (Cards & BG)', icon: Layers },
        ].map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#d4a762] text-stone-950 font-black shadow-md'
                  : 'bg-white/[0.03] text-stone-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: 1-Click Color Presets */}
      {activeCategory === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              প্রস্তুতকৃত ৮টি লাক্সারি কালার প্যালেট (Select A Luxury Theme Palette)
            </h4>
            <span className="text-xs text-[#d4a762] font-medium">১-ক্লিকেই সম্পূর্ণ সাইট চেঞ্জ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {PRESET_THEMES.map((preset) => {
              const isSelected = theme.primaryColor.toLowerCase() === (preset.colors.primaryColor || '').toLowerCase();
              return (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] bg-stone-950/80 group ${
                    isSelected
                      ? 'border-[#d4a762] ring-2 ring-[#d4a762]/50 shadow-xl scale-[1.02]'
                      : 'border-white/[0.08] hover:border-white/[0.25] hover:bg-stone-900/80'
                  }`}
                >
                  <div>
                    {/* Color Swatch Circles */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center -space-x-1.5">
                        {preset.previewColors.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-5 h-5 rounded-full border border-black/40 shadow-xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#d4a762] text-stone-950 flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h5 className="text-xs font-black text-white group-hover:text-[#fdbf5e] transition-colors leading-snug">
                      {preset.enName}
                    </h5>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-bold">
                    <span className="text-stone-500 font-mono">Accent: {preset.colors.primaryColor || '#d4a762'}</span>
                    <span className="text-[#d4a762] group-hover:underline">প্রয়োগ করুন</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Gradients Customizer */}
      {activeCategory === 'gradients' && (
        <div className="space-y-6">
          <div className="bg-stone-950/80 p-5 rounded-2xl border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-white">
                  কুল গ্রেডিয়েন্ট অপশন (Cool Gradient Presets & Direction)
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  যেসব উপাদান গ্রেডিয়েন্ট সমর্থন করে (বাটন, শিরোনাম, ব্যাজ), সেগুলোতে নিচের গ্রেডিয়েন্ট এক ক্লিকেই প্রয়োগ করতে পারেন:
                </p>
              </div>
            </div>

            {/* Gradient Direction Selector */}
            <div className="p-3.5 bg-black/60 rounded-xl border border-white/[0.08] flex items-center justify-between gap-4 flex-wrap">
              <span className="text-xs font-bold text-stone-300">
                গ্রেডিয়েন্টের দিক / অ্যাঙ্গেল (Gradient Direction):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'to right', label: 'বাম থেকে ডানে (Left to Right)' },
                  { id: 'to bottom', label: 'উপর থেকে নিচে (Top to Bottom)' },
                  { id: '135deg', label: 'কর্ণ বরাবর (135° Diagonal)' },
                  { id: '45deg', label: 'উর্ধ্বমুখী (45° Angle)' }
                ].map(dir => (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => updateColor('gradientDirection', dir.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      theme.gradientDirection === dir.id
                        ? 'bg-[#d4a762] text-stone-950 font-black'
                        : 'bg-white/[0.05] text-stone-400 hover:text-white'
                    }`}
                  >
                    {dir.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Swatches Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              {GRADIENT_PRESETS.map((grad) => (
                <div
                  key={grad.id}
                  onClick={() => handleApplyGradientPreset(grad)}
                  className="p-3.5 rounded-2xl border border-white/[0.1] hover:border-white/[0.3] transition-all cursor-pointer flex flex-col justify-between min-h-[90px] group shadow-md"
                  style={{
                    background: `linear-gradient(${theme.gradientDirection || 'to right'}, ${grad.start}, ${grad.end})`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md">
                      Gradient
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-white/80 group-hover:rotate-12 transition-transform" />
                  </div>

                  <p className="text-xs font-black text-white drop-shadow-md">
                    {grad.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Brand Core Accent Colors */}
      {activeCategory === 'brand' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              মূল ব্র্যান্ড কালার (Core Brand Accent Palette)
            </h4>
          </div>

          <div className="space-y-3">
            <ColorPickerRow
              label="প্রধান ব্র্যান্ড কালার (Primary Brand Accent)"
              description="ওয়েবসাইটের সমস্ত গোল্ডেন আইকন, টাইটেল হাইলাইট, বর্ডার ও স্টার রেটিং এই রঙে পরিবর্তিত হবে।"
              colorKey="primaryColor"
              value={theme.primaryColor}
            />

            <ColorPickerRow
              label="হোভার ও গ্লোয়িং কালার (Primary Hover & Glow)"
              description="বাটন হোভার, জ্বলন্ত নিয়ন ডট ও স্পার্কল হাইলাইট এই রঙে প্রদর্শিত হবে।"
              colorKey="primaryHoverColor"
              value={theme.primaryHoverColor}
            />

            <ColorPickerRow
              label="গভীর সেকেন্ডারি গোল্ড (Secondary Deep Bronze)"
              description="সাবটাইটেল, ব্যাজ বর্ডার ও সেকেন্ডারি অ্যাক্সেন্ট টেক্সটে ব্যবহৃত রঙ।"
              colorKey="secondaryColor"
              value={theme.secondaryColor}
            />
          </div>
        </div>
      )}

      {/* TAB 4: Header & Navbar */}
      {activeCategory === 'header' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              হেডার ও নেভিগেশন বার কালার (Header & Navigation Elements)
            </h4>
          </div>

          <div className="space-y-3">
            <ColorPickerRow
              label="হেডার ব্যাকগ্রাউন্ড কালার (Navbar Background)"
              description="ওয়েবসাইটের একদম উপরের মূল নেভিগেশন বারের ব্যাকগ্রাউন্ড কালার।"
              colorKey="navbarBg"
              value={theme.navbarBg}
              quickColors={['#0d0802', '#000000', '#1c1202', '#031f18', '#0a1128', '#1f040d', '#111827', '#ffffff']}
            />

            <ColorPickerRow
              label="ব্র্যান্ড লোগো বাম পাশের টেক্সট (Brand Left Text)"
              description="লোগো 'আবেদ' লেখার রঙ।"
              colorKey="brandNameLeftColor"
              value={theme.brandNameLeftColor}
            />

            <ColorPickerRow
              label="ব্র্যান্ড লোগো ডান পাশের টেক্সট (Brand Right Text)"
              description="লোগো 'ফার্নিচার' লেখার রঙ।"
              colorKey="brandNameRightColor"
              value={theme.brandNameRightColor}
            />

            <ColorPickerRow
              label="নেভিগেশন মেনু লিংক কালার (Nav Links Text)"
              description="মেনু বারের লিংক টেক্সট কালার (Our Projects, Contact ইত্যাদি)।"
              colorKey="navLinkColor"
              value={theme.navLinkColor}
            />

            <ColorPickerRow
              label="নেভিগেশন লিংক হোভার কালার (Nav Links Hover)"
              description="মাউস নিয়ে গেলে লিংকের যে রঙে জ্বলবে।"
              colorKey="navLinkHoverColor"
              value={theme.navLinkHoverColor}
            />
          </div>
        </div>
      )}

      {/* TAB 5: Hero Section */}
      {activeCategory === 'hero' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              হিরো ব্যানার ও টাইটেল গ্রেডিয়েন্ট (Hero Section & Titles)
            </h4>
          </div>

          <div className="space-y-3">
            <ColorPickerRow
              label="হিরো প্রধান টাইটেল গ্রেডিয়েন্ট ১ (Title Gradient Start)"
              description="ব্যানারের বড় শিরোনামের শুরুর রঙ।"
              colorKey="heroTitleGradStart"
              value={theme.heroTitleGradStart}
            />

            <ColorPickerRow
              label="হিরো প্রধান টাইটেল গ্রেডিয়েন্ট ২ (Title Gradient Middle)"
              description="ব্যানারের বড় শিরোনামের মাঝের রঙ।"
              colorKey="heroTitleGradMid"
              value={theme.heroTitleGradMid}
            />

            <ColorPickerRow
              label="হিরো প্রধান টাইটেল গ্রেডিয়েন্ট ৩ (Title Gradient End)"
              description="ব্যানারের বড় শিরোনামের শেষের রঙ।"
              colorKey="heroTitleGradEnd"
              value={theme.heroTitleGradEnd}
            />

            <ColorPickerRow
              label="হিরো সাবটাইটেল গ্রেডিয়েন্ট শুরু (Subtitle Gradient Start)"
              description="দ্বিতীয় লাইনের সোনালী লেখার শুরুর রঙ।"
              colorKey="heroSubtitleGradStart"
              value={theme.heroSubtitleGradStart}
            />

            <ColorPickerRow
              label="হিরো সাবটাইটেল গ্রেডিয়েন্ট শেষ (Subtitle Gradient End)"
              description="দ্বিতীয় লাইনের সোনালী লেখার শেষের রঙ।"
              colorKey="heroSubtitleGradEnd"
              value={theme.heroSubtitleGradEnd}
            />
          </div>
        </div>
      )}

      {/* TAB 6: Buttons & CTAs */}
      {activeCategory === 'buttons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              বাটন ও অ্যাকশন বাটন কালার (Buttons & Primary CTAs)
            </h4>
          </div>

          <div className="space-y-3">
            <ColorPickerRow
              label="প্রধান বাটন গ্রেডিয়েন্ট শুরু (Primary Button Gradient Start)"
              description="'আমাদের পণ্যসমূহ' এবং অন্যান্য মূল বাটনের বাম পাশের রঙ।"
              colorKey="btnPrimaryStart"
              value={theme.btnPrimaryStart}
            />

            <ColorPickerRow
              label="প্রধান বাটন গ্রেডিয়েন্ট শেষ (Primary Button Gradient End)"
              description="'আমাদের পণ্যসমূহ' এবং অন্যান্য মূল বাটনের ডান পাশের রঙ।"
              colorKey="btnPrimaryEnd"
              value={theme.btnPrimaryEnd}
            />

            <ColorPickerRow
              label="প্রধান বাটনের টেক্সট কালার (Primary Button Text)"
              description="বাটনের ভেতরের লেখার রঙ।"
              colorKey="btnPrimaryText"
              value={theme.btnPrimaryText}
              quickColors={['#1a1200', '#000000', '#ffffff', '#022c22', '#0f172a', '#4c0519']}
            />

            <ColorPickerRow
              label="সেকেন্ডারি বাটন বর্ডার (Secondary Button Border)"
              description="আউটলাইন বাটনের বর্ডার রঙ।"
              colorKey="btnSecondaryBorder"
              value={theme.btnSecondaryBorder}
            />

            <ColorPickerRow
              label="সেকেন্ডারি বাটন টেক্সট (Secondary Button Text)"
              description="আউটলাইন বাটনের লেখার রঙ।"
              colorKey="btnSecondaryText"
              value={theme.btnSecondaryText}
            />
          </div>
        </div>
      )}

      {/* TAB 7: Sections & Cards */}
      {activeCategory === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              সেকশন ও কার্ড ব্যাকগ্রাউন্ড কালার (Sections & Cards)
            </h4>
          </div>

          <div className="space-y-3">
            <ColorPickerRow
              label="সেকশন শিরোনামের রঙ (Section Heading Color)"
              description="'Our Projects & Status', 'Team Information' ইত্যাদি শিরোনামের টেক্সট রঙ।"
              colorKey="sectionHeadingColor"
              value={theme.sectionHeadingColor}
              quickColors={['#2c1d07', '#1c1917', '#064e3b', '#1e3a8a', '#4c0519', '#3b0764', '#000000', '#ffffff']}
            />

            <ColorPickerRow
              label="লাইট সেকশন ব্যাকগ্রাউন্ড (Light Section Background)"
              description="ডিজাইনার টিম ও স্ট্যাটস সেকশনের ব্যাকগ্রাউন্ড রঙ।"
              colorKey="sectionLightBg"
              value={theme.sectionLightBg}
              quickColors={['#faf9f4', '#fbfaf6', '#f8fafc', '#f0fdf4', '#eff6ff', '#fff1f2', '#faf5ff', '#ffffff']}
            />

            <ColorPickerRow
              label="কার্ড বর্ডার রঙ (Card Border & Accent)"
              description="প্রোডাক্ট কার্ড এবং হ্যান্ডওভার প্রজেক্ট কার্ডের বর্ডারের রঙ।"
              colorKey="cardBorderColor"
              value={theme.cardBorderColor}
            />

            <ColorPickerRow
              label="গ্লোবাল বডি ব্যাকগ্রাউন্ড (Global Body Background)"
              description="ওয়েবসাইটের মূল বডি ব্যাকগ্রাউন্ড রঙ।"
              colorKey="bodyBg"
              value={theme.bodyBg}
              quickColors={['#fbfaf6', '#ffffff', '#000000', '#faf9f4', '#f8fafc', '#0c0a09']}
            />
          </div>
        </div>
      )}

      {/* 5. Bottom Sticky Save Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-950 p-5 rounded-3xl border border-white/[0.1] shadow-2xl">
        <div>
          <p className="text-xs font-bold text-white">
            ওয়েবসাইটের সমস্ত কালার পরিবর্তন নিশ্চিত করুন
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            সেভ বাটনে চাপলে সাথে সাথে পরিবর্তনগুলো ক্লাউড ডাটাবেস ও ওয়েবসাইটে সংরক্ষিত হবে।
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 text-xs font-bold border border-white/[0.1] transition-all cursor-pointer"
          >
            Reset
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveTheme}
            className="flex-1 sm:flex-none bg-gradient-to-r from-[#d4a762] via-[#e5bd7a] to-[#b07e35] hover:opacity-95 text-stone-950 font-black text-xs sm:text-sm px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>কালার সেভ ও লাইভ করুন (Save All Colors)</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
