// Theme & Color Customizer Manager for Abed Furniture & Interior

export interface ThemeColors {
  // Brand Core Accents
  primaryColor: string;          // Main brand gold/accent (default: #d4a762)
  primaryHoverColor: string;     // Lighter hover/glow (default: #fdbf5e)
  secondaryColor: string;        // Darker gold/bronze (default: #b07e35)
  accentGlowColor: string;       // Drop shadow & neon glow hue (default: rgba(212, 167, 98, 0.4))
  
  // Header / Navigation
  navbarBg: string;              // Top navbar background (default: #0d0802)
  brandNameLeftColor: string;    // Brand text left (default: #ffffff)
  brandNameRightColor: string;   // Brand text right (default: #d4a762)
  navLinkColor: string;          // Nav link text (default: #fffaf0)
  navLinkHoverColor: string;     // Nav link hover (default: #d4a762)

  // Hero Section
  heroOverlayStart: string;      // Hero overlay start (default: rgba(23, 14, 2, 0.97))
  heroOverlayEnd: string;        // Hero overlay end (default: rgba(20, 12, 1, 0.99))
  heroTitleGradStart: string;    // Hero title gradient start (default: #fffbf4)
  heroTitleGradMid: string;      // Hero title gradient middle (default: #fbdca7)
  heroTitleGradEnd: string;      // Hero title gradient end (default: #e4c391)
  heroSubtitleGradStart: string; // Hero subtitle gradient start (default: #e3b26c)
  heroSubtitleGradEnd: string;   // Hero subtitle gradient end (default: #ecbe7b)

  // Buttons & CTAs
  btnPrimaryStart: string;       // Main CTA button gradient start (default: #d4a762)
  btnPrimaryEnd: string;         // Main CTA button gradient end (default: #fdbf5e)
  btnPrimaryText: string;        // Main CTA button text color (default: #1a1200)
  btnSecondaryBorder: string;    // Secondary outline button border (default: rgba(255, 255, 255, 0.2))
  btnSecondaryText: string;      // Secondary outline button text (default: #fffaf0)

  // Body & Sections
  bodyBg: string;                // Global body background (default: #fbfaf6)
  sectionLightBg: string;        // Light section background (default: #faf9f4)
  sectionHeadingColor: string;   // Headings text color (default: #2c1d07)
  cardBorderColor: string;       // Card border color (default: rgba(212, 167, 98, 0.25))

  // Gradients
  activeGradientPreset?: string; // Preset gradient id
  gradientDirection: string;     // 'to right' | 'to bottom' | '135deg'
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primaryColor: '#d4a762',
  primaryHoverColor: '#fdbf5e',
  secondaryColor: '#b07e35',
  accentGlowColor: 'rgba(212, 167, 98, 0.4)',
  navbarBg: '#0d0802',
  brandNameLeftColor: '#ffffff',
  brandNameRightColor: '#d4a762',
  navLinkColor: '#fffaf0',
  navLinkHoverColor: '#d4a762',
  heroOverlayStart: 'rgba(23, 14, 2, 0.97)',
  heroOverlayEnd: 'rgba(20, 12, 1, 0.99)',
  heroTitleGradStart: '#fffbf4',
  heroTitleGradMid: '#fbdca7',
  heroTitleGradEnd: '#e4c391',
  heroSubtitleGradStart: '#e3b26c',
  heroSubtitleGradEnd: '#ecbe7b',
  btnPrimaryStart: '#d4a762',
  btnPrimaryEnd: '#fdbf5e',
  btnPrimaryText: '#1a1200',
  btnSecondaryBorder: 'rgba(255, 255, 255, 0.2)',
  btnSecondaryText: '#fffaf0',
  bodyBg: '#fbfaf6',
  sectionLightBg: '#faf9f4',
  sectionHeadingColor: '#2c1d07',
  cardBorderColor: 'rgba(212, 167, 98, 0.25)',
  gradientDirection: 'to right',
};

export interface ThemePreset {
  id: string;
  name: string;
  enName: string;
  description: string;
  previewColors: string[];
  colors: Partial<ThemeColors>;
}

export const PRESET_THEMES: ThemePreset[] = [
  {
    id: 'royal-teak-gold',
    name: 'রাজকীয় সেগুন গোল্ড (Royal Teak Gold)',
    enName: 'Royal Teak Gold (Default)',
    description: 'আবেদ ফার্নিচারের আদি ও ঐতিহ্যবাহী রাজকীয় মেহগনি ও সেগুন কাঠের সোনালী আভা।',
    previewColors: ['#d4a762', '#fdbf5e', '#1c1202', '#0d0802'],
    colors: { ...DEFAULT_THEME_COLORS }
  },
  {
    id: 'emerald-jade',
    name: 'পান্না গ্রিন ও গোল্ড (Emerald Jade Palace)',
    enName: 'Emerald Jade Palace',
    description: 'অভিজাত রাজপ্রাসাদের পান্না সবুজ ও রাজকীয় সোনালী রত্নের মিশ্রণ।',
    previewColors: ['#10b981', '#34d399', '#064e3b', '#022c22'],
    colors: {
      primaryColor: '#10b981',
      primaryHoverColor: '#34d399',
      secondaryColor: '#059669',
      accentGlowColor: 'rgba(16, 185, 129, 0.4)',
      navbarBg: '#031f18',
      brandNameRightColor: '#10b981',
      navLinkHoverColor: '#34d399',
      heroOverlayStart: 'rgba(3, 31, 24, 0.97)',
      heroOverlayEnd: 'rgba(2, 44, 34, 0.99)',
      heroTitleGradStart: '#f0fdf4',
      heroTitleGradMid: '#a7f3d0',
      heroTitleGradEnd: '#6ee7b7',
      heroSubtitleGradStart: '#34d399',
      heroSubtitleGradEnd: '#10b981',
      btnPrimaryStart: '#10b981',
      btnPrimaryEnd: '#34d399',
      btnPrimaryText: '#022c22',
      cardBorderColor: 'rgba(16, 185, 129, 0.3)',
      sectionHeadingColor: '#064e3b'
    }
  },
  {
    id: 'sapphire-royal',
    name: 'স্যাফায়ার রয়্যাল ব্লু (Sapphire Royal Blue)',
    enName: 'Sapphire Royal Blue',
    description: 'আধুনিক লাক্সারি আর্কিটেকচারাল ব্লু ও ক্রিস্টাল ডায়মন্ডের উজ্জ্বল দ্যুতি।',
    previewColors: ['#2563eb', '#60a5fa', '#1e3a8a', '#0f172a'],
    colors: {
      primaryColor: '#2563eb',
      primaryHoverColor: '#60a5fa',
      secondaryColor: '#1d4ed8',
      accentGlowColor: 'rgba(37, 99, 235, 0.4)',
      navbarBg: '#0a1128',
      brandNameRightColor: '#3b82f6',
      navLinkHoverColor: '#60a5fa',
      heroOverlayStart: 'rgba(10, 17, 40, 0.97)',
      heroOverlayEnd: 'rgba(15, 23, 42, 0.99)',
      heroTitleGradStart: '#eff6ff',
      heroTitleGradMid: '#bfdbfe',
      heroTitleGradEnd: '#93c5fd',
      heroSubtitleGradStart: '#60a5fa',
      heroSubtitleGradEnd: '#3b82f6',
      btnPrimaryStart: '#2563eb',
      btnPrimaryEnd: '#60a5fa',
      btnPrimaryText: '#ffffff',
      cardBorderColor: 'rgba(37, 99, 235, 0.3)',
      sectionHeadingColor: '#1e3a8a'
    }
  },
  {
    id: 'ruby-rose',
    name: 'রুবি রেড ও রোজ গোল্ড (Ruby Rose Velvet)',
    enName: 'Ruby Rose Velvet',
    description: 'উষ্ণ রোমান্টিক রুবি রেড ও রোজ গোল্ডের লাক্সারি সংমিশ্রণ।',
    previewColors: ['#e11d48', '#fb7185', '#881337', '#1f040d'],
    colors: {
      primaryColor: '#e11d48',
      primaryHoverColor: '#fb7185',
      secondaryColor: '#be123c',
      accentGlowColor: 'rgba(225, 29, 72, 0.4)',
      navbarBg: '#1f040d',
      brandNameRightColor: '#fb7185',
      navLinkHoverColor: '#fda4af',
      heroOverlayStart: 'rgba(31, 4, 13, 0.97)',
      heroOverlayEnd: 'rgba(24, 2, 9, 0.99)',
      heroTitleGradStart: '#fff1f2',
      heroTitleGradMid: '#fecdd3',
      heroTitleGradEnd: '#fda4af',
      heroSubtitleGradStart: '#fb7185',
      heroSubtitleGradEnd: '#e11d48',
      btnPrimaryStart: '#e11d48',
      btnPrimaryEnd: '#fb7185',
      btnPrimaryText: '#ffffff',
      cardBorderColor: 'rgba(225, 29, 72, 0.3)',
      sectionHeadingColor: '#4c0519'
    }
  },
  {
    id: 'imperial-amethyst',
    name: 'ইম্পেরিয়াল পার্পল (Imperial Amethyst)',
    enName: 'Imperial Amethyst',
    description: 'রাজকীয় রাজবংশের আভিজাত্যপূর্ণ ডিপ পার্পল ও ভায়োলেট লাক্সারি।',
    previewColors: ['#9333ea', '#c084fc', '#581c87', '#170529'],
    colors: {
      primaryColor: '#9333ea',
      primaryHoverColor: '#c084fc',
      secondaryColor: '#7e22ce',
      accentGlowColor: 'rgba(147, 51, 234, 0.4)',
      navbarBg: '#170529',
      brandNameRightColor: '#c084fc',
      navLinkHoverColor: '#d8b4fe',
      heroOverlayStart: 'rgba(23, 5, 41, 0.97)',
      heroOverlayEnd: 'rgba(15, 2, 28, 0.99)',
      heroTitleGradStart: '#faf5ff',
      heroTitleGradMid: '#e9d5ff',
      heroTitleGradEnd: '#d8b4fe',
      heroSubtitleGradStart: '#c084fc',
      heroSubtitleGradEnd: '#9333ea',
      btnPrimaryStart: '#9333ea',
      btnPrimaryEnd: '#c084fc',
      btnPrimaryText: '#ffffff',
      cardBorderColor: 'rgba(147, 51, 234, 0.3)',
      sectionHeadingColor: '#3b0764'
    }
  },
  {
    id: 'amber-copper',
    name: 'উষ্ণ কপার ও ব্রোঞ্জ (Amber Copper Bronze)',
    enName: 'Amber Copper Bronze',
    description: 'কাঠের প্রাকৃতিক কারুশিল্পের উষ্ণ তামা, ব্রোঞ্জ ও অ্যাম্বার সানলাইট।',
    previewColors: ['#d97706', '#fbbf24', '#78350f', '#1f0d03'],
    colors: {
      primaryColor: '#d97706',
      primaryHoverColor: '#fbbf24',
      secondaryColor: '#b45309',
      accentGlowColor: 'rgba(217, 119, 6, 0.4)',
      navbarBg: '#1a0b02',
      brandNameRightColor: '#fbbf24',
      navLinkHoverColor: '#fde68a',
      heroOverlayStart: 'rgba(26, 11, 2, 0.97)',
      heroOverlayEnd: 'rgba(20, 8, 1, 0.99)',
      heroTitleGradStart: '#fffbeb',
      heroTitleGradMid: '#fde68a',
      heroTitleGradEnd: '#fcd34d',
      heroSubtitleGradStart: '#fbbf24',
      heroSubtitleGradEnd: '#d97706',
      btnPrimaryStart: '#d97706',
      btnPrimaryEnd: '#fbbf24',
      btnPrimaryText: '#1c0c02',
      cardBorderColor: 'rgba(217, 119, 6, 0.3)',
      sectionHeadingColor: '#451a03'
    }
  },
  {
    id: 'midnight-obsidian',
    name: 'অবসিডিয়ান ও শ্যাম্পেন (Midnight Obsidian)',
    enName: 'Midnight Obsidian',
    description: 'আল্ট্রা-লাক্সারি ব্ল্যাক মিনিমালিজম ও শ্যাম্পেন পার্ল ফিনিশ।',
    previewColors: ['#e5c07b', '#f5d799', '#111111', '#000000'],
    colors: {
      primaryColor: '#e5c07b',
      primaryHoverColor: '#f5d799',
      secondaryColor: '#c89d53',
      accentGlowColor: 'rgba(229, 192, 123, 0.4)',
      navbarBg: '#050505',
      brandNameRightColor: '#f5d799',
      navLinkHoverColor: '#fbe7bb',
      heroOverlayStart: 'rgba(5, 5, 5, 0.98)',
      heroOverlayEnd: 'rgba(10, 10, 10, 0.99)',
      heroTitleGradStart: '#ffffff',
      heroTitleGradMid: '#fbe7bb',
      heroTitleGradEnd: '#e5c07b',
      heroSubtitleGradStart: '#f5d799',
      heroSubtitleGradEnd: '#c89d53',
      btnPrimaryStart: '#e5c07b',
      btnPrimaryEnd: '#f5d799',
      btnPrimaryText: '#0a0a0a',
      cardBorderColor: 'rgba(229, 192, 123, 0.3)',
      sectionHeadingColor: '#171717'
    }
  },
  {
    id: 'ocean-cyan',
    name: 'অ্যাকোয়া সায়ান ও টিল (Ocean Breeze Cyan)',
    enName: 'Ocean Breeze Cyan',
    description: 'আধুনিক তাজা বাতাস, সমুদ্রের নীল ও সায়ান ক্রিস্টাল।',
    previewColors: ['#06b6d4', '#22d3ee', '#0f766e', '#042f2e'],
    colors: {
      primaryColor: '#06b6d4',
      primaryHoverColor: '#22d3ee',
      secondaryColor: '#0891b2',
      accentGlowColor: 'rgba(6, 182, 212, 0.4)',
      navbarBg: '#021e20',
      brandNameRightColor: '#22d3ee',
      navLinkHoverColor: '#67e8f9',
      heroOverlayStart: 'rgba(2, 30, 32, 0.97)',
      heroOverlayEnd: 'rgba(4, 47, 46, 0.99)',
      heroTitleGradStart: '#ecfeff',
      heroTitleGradMid: '#a5f3fc',
      heroTitleGradEnd: '#67e8f9',
      heroSubtitleGradStart: '#22d3ee',
      heroSubtitleGradEnd: '#06b6d4',
      btnPrimaryStart: '#06b6d4',
      btnPrimaryEnd: '#22d3ee',
      btnPrimaryText: '#042f2e',
      cardBorderColor: 'rgba(6, 182, 212, 0.3)',
      sectionHeadingColor: '#164e63'
    }
  }
];

export const GRADIENT_PRESETS = [
  { id: 'gold-sunrise', name: 'Golden Sunrise', start: '#d4a762', mid: '#ffd700', end: '#fdbf5e' },
  { id: 'emerald-mint', name: 'Emerald Glow', start: '#059669', mid: '#10b981', end: '#34d399' },
  { id: 'sapphire-glow', name: 'Sapphire Wave', start: '#1d4ed8', mid: '#2563eb', end: '#60a5fa' },
  { id: 'rose-sunset', name: 'Rose Sunset', start: '#be123c', mid: '#e11d48', end: '#fb7185' },
  { id: 'purple-aurora', name: 'Royal Aurora', start: '#7e22ce', mid: '#9333ea', end: '#c084fc' },
  { id: 'amber-fire', name: 'Amber Copper', start: '#b45309', mid: '#d97706', end: '#fbbf24' },
  { id: 'platinum-silver', name: 'Platinum Star', start: '#cbd5e1', mid: '#f1f5f9', end: '#ffffff' },
  { id: 'neon-cyber', name: 'Cyber Neon', start: '#06b6d4', mid: '#3b82f6', end: '#9333ea' }
];

const STORAGE_KEY = 'abed_theme_colors';
const STYLE_TAG_ID = 'abed-dynamic-theme-style';

/**
 * Loads current theme colors from localStorage or defaults
 */
export function loadThemeColors(): ThemeColors {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_THEME_COLORS, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to parse theme colors:', e);
  }
  return { ...DEFAULT_THEME_COLORS };
}

/**
 * Applies theme colors dynamically to document root and CSS rules
 */
export function applyThemeColors(theme: ThemeColors): void {
  try {
    const root = document.documentElement;

    // Set core CSS variables
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-primary-hover', theme.primaryHoverColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-accent-glow', theme.accentGlowColor);
    root.style.setProperty('--theme-navbar-bg', theme.navbarBg);
    root.style.setProperty('--theme-btn-primary-start', theme.btnPrimaryStart);
    root.style.setProperty('--theme-btn-primary-end', theme.btnPrimaryEnd);
    root.style.setProperty('--theme-btn-primary-text', theme.btnPrimaryText);
    root.style.setProperty('--theme-section-heading', theme.sectionHeadingColor);
    root.style.setProperty('--theme-card-border', theme.cardBorderColor);

    // Dynamic high-priority CSS stylesheet for instant whole-website color adaptation
    let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = STYLE_TAG_ID;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
      :root {
        --color-theme-p: ${theme.primaryColor};
        --color-theme-p-hover: ${theme.primaryHoverColor};
      }
      
      /* Global Theme Overrides based on Admin Color Settings */
      #hero .bg-gradient-to-r.from-\\[\\#d4a762\\] {
        background-image: linear-gradient(${theme.gradientDirection || 'to right'}, ${theme.btnPrimaryStart}, ${theme.btnPrimaryEnd}) !important;
        color: ${theme.btnPrimaryText} !important;
      }
      
      header nav button:hover,
      header a:hover {
        color: ${theme.primaryColor} !important;
      }

      /* Buttons & CTA Badges */
      .bg-\\[\\#d4a762\\],
      .bg-gradient-to-r.from-\\[\\#d4a762\\] {
        background-image: linear-gradient(${theme.gradientDirection || 'to right'}, ${theme.btnPrimaryStart}, ${theme.btnPrimaryEnd}) !important;
      }

      .text-\\[\\#d4a762\\] {
        color: ${theme.primaryColor} !important;
      }

      .text-\\[\\#fdbf5e\\] {
        color: ${theme.primaryHoverColor} !important;
      }

      .border-\\[\\#d4a762\\] {
        border-color: ${theme.primaryColor} !important;
      }

      /* Hero Title Gradients */
      #hero h2 span.bg-gradient-to-r.from-\\[\\#fffbf4\\] {
        background-image: linear-gradient(to right, ${theme.heroTitleGradStart}, ${theme.heroTitleGradMid}, ${theme.heroTitleGradEnd}) !important;
      }
      #hero h2 span.bg-gradient-to-r.from-\\[\\#e3b26c\\] {
        background-image: linear-gradient(to right, ${theme.heroSubtitleGradStart}, ${theme.heroSubtitleGradEnd}) !important;
      }
      
      /* Glowing animations border colors */
      .handover-mini-shine {
        border-color: ${theme.primaryColor} !important;
      }
    `;

    // Persist to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (err) {
    console.error('Error applying theme colors:', err);
  }
}
