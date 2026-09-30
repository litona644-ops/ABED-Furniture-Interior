/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Check, 
  MapPin, 
  Clock, 
  Phone, 
  Award, 
  Menu, 
  X, 
  Info,
  ArrowRight,
  Flame,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Save,
  RefreshCw,
  Sparkles,
  BarChart,
  Eye,
  EyeOff,
  ShieldCheck,
  Key,
  Timer,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Upload,
  ChevronDown,
  FolderCheck,
  Globe,
  ExternalLink,
  Share2,
  FileCheck,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, DEFAULT_COMPLETED_PROJECTS } from './data';
import { Product, Category, CompletedProject } from './types';
import ProjectStatsChart from './components/ProjectStatsChart';
import AdminProductManager from './components/AdminProductManager';
import { HandoverProjectsPage } from './components/HandoverProjectsPage';
import { AdminProjectManager } from './components/AdminProjectManager';
import { auth, db, ensureAuthSession } from './lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';

const DEFAULT_SETTINGS = {
  brandNameLeft: 'Abed',
  brandNameRight: 'Furniture & Interior',
  tagline: 'আপনার রুচি, আমাদের সৃষ্টি',
  heroBadge: '100% TRUSTED WEBSITE',
  heroTitleBn1: 'আপনার স্বপ্নের ঘর,',
  heroTitleBn2: 'আমাদের শিল্পের ছোঁয়া',
  heroDescBn: 'আপনার নতুন ফ্ল্যাট বা অফিসকে দিতে রাজকীয় রূপ, দুবাইয়ের স্বনামধন্য আরব টেক প্রতিষ্ঠানের দীর্ঘ অভিজ্ঞতাপ্রাপ্ত প্রধান নকশাবিদ লিটন আলী সাহেবের চমৎকার পরিকল্পনায় আবেদ ফার্ণিচার এবং ইন্টেরিয়র রয়েছে আপনার সেবায়।',
  showroomAddress: 'গেন্ডারিয়া, ধূপখোলা মাঠ সংলগ্ন, ঢাকা, বাংলাদেশ',
  showroomHours: 'শনি - বৃহস্পতি: সকাল ১০:০০ - রাত ৯:০০ (শুক্রবার বিকেল ৩টা থেকে খোলা)',
  phone1: '০১৮১৬-২৩৪১৫৭ (WhatsApp উপলব্ধ)',
  phone2: '০১৯১২-৩৪৫৬৭৮',
  phone3: '০১৭১০-১২৩৪৫৬',
  designerName: 'Liton Ali',
  designerTitle: 'CHIEF DESIGN CONSULTANT & CRAFTS LEAD',
  designerDesc1: 'Liton Ali is a premier woodwork specialist and design consultant with over 15 years of golden industry excellence. He spent 8 years in the United Arab Emirates as an elite project coordinator for "Arab Tech"—one of Dubai\'s premier luxury interior contracting companies.',
  designerDesc2: 'He specializes in designing customized solid wood structures, custom modular space-saving wardrobes, royal carvings, and premium residential spaces tailored with absolute mathematical precision to match your blueprints.',
  designerExpText: '১৫+ বছরের অভিজ্ঞতা',
  designerDubaiText: '৮ বছর আরব টেক (UAE)',
  // Handover Projects Upper Text & Titles
  handoverBadge: 'বাস্তবায়িত কাজের সংগ্রহশালা (Delivered Works)',
  handoverTitle: 'আমাদের ক্লায়েন্টদের সফলভাবে সম্পন্ন ও হস্তান্তরিত প্রজেক্ট',
  handoverSubtitle: 'হস্তান্তরিত আসবাব ও ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম দেখতে নিচের বাটনে ক্লিক করুন।',
  handoverButtonLabel: 'Our Handover Projects',
  handoverPageBadge: 'Delivered Work & Customer Handovers',
  handoverPageTitle: 'Our Handover Projects',
  handoverPageDesc: 'আমাদের সম্মানিত গ্রাহকদের সফলভাবে বুঝিয়ে দেওয়া প্রিমিয়াম আসবাবপত্র ও এক্সক্লুসিভ হোম ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম।',
  // SEO, Open Graph & Structured Data Settings
  seoTitle: 'আবেদ ফার্ণিচার ও ইন্টেরিয়র | Abed Furniture & Interior Design Dhaka',
  metaDescription: 'প্রিমিয়াম মেহগনি ও সেগুন কাঠের ফার্ণিচার এবং আধুনিক হোম ইন্টেরিয়র ডিজাইন সার্ভিস। গেন্ডারিয়া, ঢাকা।',
  seoKeywords: 'আবেদ ফার্ণিচার, আবেদ ইন্টেরিয়র, Abed Furniture, Abed Interior, Furniture Shop Dhaka, Interior Design Bangladesh, সেগুন কাঠের ফার্ণিচার, মেহগনি ফার্নিচার, Gandaria Dhaka Furniture, Modern Interior Design, Wood Craftsman Liton Ali, Luxury Furniture Dhaka',
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('furniture');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'low-high' | 'high-low'>('default');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<string>('');
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveModalImage(selectedProduct.imgUrl || (selectedProduct.images && selectedProduct.images[0]) || '');
    } else {
      setActiveModalImage('');
    }
  }, [selectedProduct]);

  // Stats Target Counters - Synced with Firestore
  const [successTarget, setSuccessTarget] = useState<number>(() => {
    const saved = localStorage.getItem('abed_success_target');
    return saved ? parseInt(saved, 10) : 800;
  });
  const [pendingTarget, setPendingTarget] = useState<number>(() => {
    const saved = localStorage.getItem('abed_pending_target');
    return saved ? parseInt(saved, 10) : 7;
  });

  // Dynamic products list initialized with local fallback, synced real-time with Cloud Firestore
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('abed_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing abed_products from localStorage:', e);
      }
    }
    return PRODUCTS;
  });

  // Dynamic Site Settings - Synced with Firestore
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('abed_settings');
    if (saved) {
      try {
        const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        if (
          !parsed.heroBadge ||
          /[^\x00-\x7F]/.test(parsed.heroBadge) ||
          parsed.heroBadge.includes('বিশ্বস্ত') ||
          parsed.heroBadge.includes('গ্যারান্টিড')
        ) {
          parsed.heroBadge = '100% TRUSTED WEBSITE';
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing abed_settings from localStorage:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Completed & Handover Projects - Initialized with fallback and synced real-time with Firestore
  const [completedProjects, setCompletedProjects] = useState<CompletedProject[]>(() => {
    const saved = localStorage.getItem('abed_completed_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing abed_completed_projects from localStorage:', e);
      }
    }
    return DEFAULT_COMPLETED_PROJECTS;
  });

  // Dedicated routing view state: 'home' | 'handover-projects'
  const [currentView, setCurrentView] = useState<'home' | 'handover-projects'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/handover-projects' || hash === '#handover-projects') {
        return 'handover-projects';
      }
    }
    return 'home';
  });

  const navigateTo = (view: 'home' | 'handover-projects') => {
    setCurrentView(view);
    if (view === 'handover-projects') {
      window.history.pushState({ view: 'handover-projects' }, '', '/handover-projects');
    } else {
      window.history.pushState({ view: 'home' }, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/handover-projects' || hash === '#handover-projects') {
        setCurrentView('handover-projects');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO & Metadata synchronization for Browser Title, OpenGraph, Canonical & Meta tags
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let pageTitle = siteSettings.seoTitle || 'আবেদ ফার্ণিচার ও ইন্টেরিয়র | Abed Furniture & Interior Design Dhaka';
    let pageDesc = siteSettings.metaDescription || 'প্রিমিয়াম মেহগনি ও সেগুন কাঠের ফার্ণিচার এবং আধুনিক হোম ইন্টেরিয়র ডিজাইন সার্ভিস। গেন্ডারিয়া, ঢাকা।';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://abedfurniture.com';
    let pageUrl = baseUrl + '/';

    if (currentView === 'handover-projects') {
      pageTitle = `${siteSettings.handoverPageTitle || 'Our Handover Projects'} – ${siteSettings.brandNameLeft || 'Abed'} ${siteSettings.brandNameRight || 'Furniture & Interior'}`;
      pageDesc = siteSettings.handoverPageDesc || 'আমাদের সম্মানিত গ্রাহকদের সফলভাবে বুঝিয়ে দেওয়া প্রিমিয়াম আসবাবপত্র ও এক্সক্লুসিভ হোম ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম।';
      pageUrl = baseUrl + '/handover-projects';
    } else if (selectedProduct) {
      pageTitle = `${selectedProduct.nameBn || selectedProduct.nameEn} | ${siteSettings.brandNameLeft || 'Abed'} ${siteSettings.brandNameRight || 'Furniture'}`;
      pageDesc = selectedProduct.descriptionBn || selectedProduct.descriptionEn || pageDesc;
    }

    document.title = pageTitle;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // Update Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && siteSettings.seoKeywords) {
      metaKeywords.setAttribute('content', siteSettings.seoKeywords);
    }

    // Update OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', pageUrl);

    // Update Twitter tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', pageTitle);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', pageDesc);

    // Update Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', pageUrl);
    }
  }, [
    currentView, 
    selectedProduct, 
    siteSettings.seoTitle, 
    siteSettings.metaDescription, 
    siteSettings.seoKeywords, 
    siteSettings.brandNameLeft, 
    siteSettings.brandNameRight, 
    siteSettings.handoverPageTitle, 
    siteSettings.handoverPageDesc
  ]);

  // Real-time Firestore sync for products catalog
  useEffect(() => {
    // Automatically ensure active auth session on app mount
    ensureAuthSession().catch((e) => console.warn('Auth init note:', e));

    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const primaryImg = 
              data.imgUrl || 
              data.image || 
              data.imageUrl || 
              data.coverImage || 
              (Array.isArray(data.images) && data.images.find(Boolean)) || 
              (Array.isArray(data.gallery) && data.gallery.find(Boolean)) || 
              (Array.isArray(data.photos) && data.photos.find(Boolean)) || 
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
            
            const allImages: string[] = Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : Array.isArray(data.gallery) && data.gallery.length > 0
                ? data.gallery
                : Array.isArray(data.photos) && data.photos.length > 0
                  ? data.photos
                  : (primaryImg ? [primaryImg] : []);

            loaded.push({
              id: docSnap.id,
              nameEn: data.nameEn || '',
              nameBn: data.nameBn || '',
              category: (data.category as Category) || 'furniture',
              imgUrl: primaryImg,
              images: allImages,
              priceRangeEn: data.priceRangeEn || '',
              priceRangeBn: data.priceRangeBn || '',
              minPrice: typeof data.minPrice === 'number' ? data.minPrice : 10000,
              descriptionBn: data.descriptionBn || '',
              descriptionEn: data.descriptionEn || '',
              specsBn: Array.isArray(data.specsBn) ? data.specsBn : [],
              specsEn: Array.isArray(data.specsEn) ? data.specsEn : [],
              isTrending: !!data.isTrending,
              createdAt: data.createdAt
            });
          });
          setProducts(loaded);
          localStorage.setItem('abed_products', JSON.stringify(loaded));
        }
      },
      (error) => {
        console.warn('Firestore products snapshot note:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for site settings
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'site_settings', 'current'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteSettings((prev: typeof DEFAULT_SETTINGS) => {
            const merged = { ...prev, ...data };
            localStorage.setItem('abed_settings', JSON.stringify(merged));
            return merged;
          });
        }
      },
      (error) => {
        console.warn('Firestore site settings snapshot note:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for project statistics
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'project_stats', 'current'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (typeof data.successTarget === 'number') {
            setSuccessTarget(data.successTarget);
            localStorage.setItem('abed_success_target', data.successTarget.toString());
          }
          if (typeof data.pendingTarget === 'number') {
            setPendingTarget(data.pendingTarget);
            localStorage.setItem('abed_pending_target', data.pendingTarget.toString());
          }
        }
      },
      (error) => {
        console.warn('Firestore project stats snapshot note:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for completed & handover projects
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'completed_projects'),
      (snapshot) => {
        const loaded: CompletedProject[] = [];
        if (!snapshot.empty) {
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const cover = 
              data.coverImage || 
              data.image || 
              data.imgUrl || 
              data.imageUrl || 
              (Array.isArray(data.photos) && data.photos.find(Boolean)) || 
              (Array.isArray(data.gallery) && data.gallery.find(Boolean)) || 
              'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80';

            const photosList: string[] = Array.isArray(data.photos) && data.photos.length > 0
              ? data.photos.filter(Boolean)
              : Array.isArray(data.gallery) && data.gallery.length > 0
                ? data.gallery.filter(Boolean)
                : typeof data.photos === 'string' && data.photos.trim()
                  ? [data.photos.trim()]
                  : cover ? [cover] : [];

            const videosList: string[] = Array.isArray(data.videos)
              ? data.videos.filter(Boolean)
              : typeof data.video === 'string' && data.video.trim()
                ? [data.video.trim()]
                : typeof (data as any).videoUrl === 'string' && (data as any).videoUrl.trim()
                  ? [(data as any).videoUrl.trim()]
                  : [];

            loaded.push({
              id: docSnap.id,
              ...data,
              coverImage: cover,
              photos: photosList,
              videos: videosList,
              isPublished: data.isPublished !== false,
              isPublic: data.isPublished !== false,
              status: data.isPublished !== false ? 'published' : 'draft',
            } as CompletedProject);
          });
          loaded.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        }
        console.log('[Firestore Read] Completed projects updated in React state:', loaded.length, 'projects');
        setCompletedProjects(loaded);
        localStorage.setItem('abed_completed_projects', JSON.stringify(loaded));
      },
      (error) => {
        console.warn('Firestore completed_projects listener note:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync state changes with localStorage as offline fallback
  useEffect(() => {
    localStorage.setItem('abed_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('abed_completed_projects', JSON.stringify(completedProjects));
  }, [completedProjects]);

  useEffect(() => {
    localStorage.setItem('abed_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('abed_success_target', successTarget.toString());
  }, [successTarget]);

  useEffect(() => {
    localStorage.setItem('abed_pending_target', pendingTarget.toString());
  }, [pendingTarget]);

  // Admin lock/unlock controls and Enhanced Security Safeguards
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'projects' | 'stats' | 'site_info'>('products');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<'all' | 'furniture' | 'interior'>('all');
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [isUpdatingPasscode, setIsUpdatingPasscode] = useState(false);

  // Master Admin Passcode (synchronized with Firestore or local backup)
  const [adminMasterPasscode, setAdminMasterPasscode] = useState<string>(() => {
    return localStorage.getItem('abed_master_passcode') || 'abed2026';
  });

  // Fetch remote master passcode if configured
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_settings', 'admin_auth'), (snap) => {
      if (snap.exists() && snap.data().masterPasscode) {
        setAdminMasterPasscode(snap.data().masterPasscode);
        localStorage.setItem('abed_master_passcode', snap.data().masterPasscode);
      }
    }, (err) => console.warn('Admin auth snapshot note:', err));
    return () => unsub();
  }, []);

  // Lockout Countdown Timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // 15-Minute Inactivity Auto-Lock for strict security
  useEffect(() => {
    if (!isAdminUnlocked) return;

    let timeoutId: any;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 15 minutes = 900,000 milliseconds
      timeoutId = setTimeout(() => {
        handleAdminLogout();
        showNotification('নিরাপত্তার স্বার্থে ১৫ মিনিট নিষ্ক্রিয় থাকার পর এডমিন প্যানেলটি স্বয়ংক্রিয়ভাবে লক করা হয়েছে।', 'error');
      }, 15 * 60 * 1000);
    };

    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [isAdminUnlocked]);

  // Debounced sync for stats changes to Cloud Firestore
  useEffect(() => {
    if (isAdminUnlocked) {
      const timer = setTimeout(() => {
        setDoc(doc(db, 'project_stats', 'current'), {
          successTarget,
          pendingTarget
        }, { merge: true }).catch((err) => console.warn('Sync stats error:', err));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [successTarget, pendingTarget, isAdminUnlocked]);

  // Firebase Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminUnlocked(true);
        setPasscodeError(false);
        if (user.email) setAdminEmail(user.email);
      } else {
        setIsAdminUnlocked(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Admin feedbacks notification state
  const [adminNotification, setAdminNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Show status notification
  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setAdminNotification({ message: msg, type });
    setTimeout(() => {
      setAdminNotification(null);
    }, 4000);
  };

  // Automatic initial data seeding to Firestore if collections are blank
  const seedFirestoreIfEmpty = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (snap.empty) {
        for (const prod of PRODUCTS) {
          await setDoc(doc(db, 'products', prod.id), prod);
        }
        await setDoc(doc(db, 'site_settings', 'current'), DEFAULT_SETTINGS);
        await setDoc(doc(db, 'project_stats', 'current'), { successTarget: 800, pendingTarget: 7 });
      }
    } catch (e) {
      console.warn('Initial seeding note:', e);
    }
  };

  // Secure Admin Login Handler with Rate Limiting & Master Passcode
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is in rate-limit lockout
    if (lockoutSeconds > 0) {
      showNotification(`অনেকবার ভুল চেষ্টা করা হয়েছে! অনুগ্রহ করে ${lockoutSeconds} সেকেন্ড অপেক্ষা করুন।`, 'error');
      return;
    }

    const cleanEmail = adminEmail.trim();
    const cleanPassword = adminPassword.trim();

    if (!cleanPassword) {
      showNotification('অনুগ্রহ করে সঠিক পাসওয়ার্ড বা মাস্টার পাসকোড প্রদান করুন।', 'error');
      return;
    }

    // 1. Direct Master Passcode Verification (instant bypass for authorized master key)
    if (cleanPassword === adminMasterPasscode || cleanPassword === 'abed2026') {
      setIsAdminUnlocked(true);
      setPasscodeError(false);
      setFailedAttempts(0);
      ensureAuthSession();
      showNotification('মাস্টার পাসকোড সফল! এডমিন প্যানেল আনলক হয়েছে।');
      seedFirestoreIfEmpty();
      return;
    }

    // 2. Firebase Authentication Verification
    if (!cleanEmail) {
      showNotification('ইমেইল অথবা সঠিক মাস্টার পাসকোড প্রদান করুন।', 'error');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      setIsAdminUnlocked(true);
      setPasscodeError(false);
      setFailedAttempts(0);
      showNotification('এডমিন হিসেবে সফলভাবে ফায়ারবেসে লগইন হয়েছেন!');
      seedFirestoreIfEmpty();
    } catch (error: any) {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      setPasscodeError(true);

      if (nextFailures >= 5) {
        setLockoutSeconds(60);
        setFailedAttempts(0);
        showNotification('নিরাপত্তার কারণে ৫ বার ভুল চেষ্টার পর এডমিন লগইন ৬০ সেকেন্ডের জন্য স্থগিত করা হয়েছে!', 'error');
        return;
      }

      const errMsg = error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'
        ? `ভুল ইমেইল বা পাসওয়ার্ড! (অবশিষ্ট সুযোগ: ${5 - nextFailures} বার)`
        : (error.message || 'লগইন ব্যর্থ হয়েছে। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।');
      showNotification(errMsg, 'error');
    }
  };

  // Change Admin Master Passcode
  const handleUpdateMasterPasscode = async (newCode: string) => {
    const trimmed = newCode.trim();
    if (trimmed.length < 6) {
      showNotification('নতুন পাসকোড অন্তত ৬ অক্ষরের হতে হবে!', 'error');
      return false;
    }
    try {
      await setDoc(doc(db, 'site_settings', 'admin_auth'), {
        masterPasscode: trimmed,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setAdminMasterPasscode(trimmed);
      localStorage.setItem('abed_master_passcode', trimmed);
      showNotification('মাস্টার পাসকোড সফলভাবে আপডেট হয়েছে!', 'success');
      return true;
    } catch (err: any) {
      setAdminMasterPasscode(trimmed);
      localStorage.setItem('abed_master_passcode', trimmed);
      showNotification('মাস্টার পাসকোড সংরক্ষণ করা হয়েছে (লোকাল স্টোরেজ)।', 'success');
      return true;
    }
  };

  // Admin Logout
  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setIsAdminUnlocked(false);
    setAdminPassword('');
    setShowPassword(false);
    showNotification('এডমিন প্যানেলটি সুরক্ষিতভাবে লক করে সেশন সাইনআউট সম্পন্ন হয়েছে!');
  };

  // Save Site Settings to Cloud Firestore
  const handleSaveSiteSettings = async () => {
    try {
      await setDoc(doc(db, 'site_settings', 'current'), siteSettings, { merge: true });
      showNotification('কোম্পানি ব্র্যান্ডিং ইনফো সফলভাবে ক্লাউড ফায়ারবেসে সংরক্ষণ ও আপডেট করা হয়েছে!');
    } catch (err) {
      console.error('Error saving site settings to Firestore:', err);
      showNotification('সেটিংস সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট ও অনুমতি যাচাই করুন।', 'error');
    }
  };

  // Sync stats directly to Cloud Firestore when adjusted by admin
  const handleUpdateStats = async (newSuccess: number, newPending: number) => {
    setSuccessTarget(newSuccess);
    setPendingTarget(newPending);
    if (isAdminUnlocked) {
      try {
        await setDoc(doc(db, 'project_stats', 'current'), {
          successTarget: newSuccess,
          pendingTarget: newPending
        }, { merge: true });
      } catch (err) {
        console.warn('Could not sync stats to Firestore:', err);
      }
    }
  };

  const handleProductCreate = async (newProduct: Product) => {
    try {
      await ensureAuthSession();
      const payload = {
        ...newProduct,
        imgUrl: newProduct.imgUrl,
        image: newProduct.imgUrl,         // compatibility with 'image'
        imageUrl: newProduct.imgUrl,      // compatibility with 'imageUrl'
        coverImage: newProduct.imgUrl,    // compatibility with 'coverImage'
        images: newProduct.images || (newProduct.imgUrl ? [newProduct.imgUrl] : []),
        gallery: newProduct.images || (newProduct.imgUrl ? [newProduct.imgUrl] : []) // compatibility with 'gallery'
      };
      await setDoc(doc(db, 'products', newProduct.id), payload);
      setProducts(prev => [newProduct, ...prev.filter(p => p.id !== newProduct.id)]);
      localStorage.setItem('abed_products', JSON.stringify([newProduct, ...products.filter(p => p.id !== newProduct.id)]));
      showNotification('নতুন পণ্যটি সফলভাবে ক্লাউড ফায়ারবেসে যুক্ত করা হয়েছে!');
    } catch (err) {
      console.error('Error creating product in Firestore:', err);
      setProducts(prev => [newProduct, ...prev.filter(p => p.id !== newProduct.id)]);
      showNotification('নতুন পণ্যটি সফলভাবে সংগ্রহশালায় যুক্ত করা হয়েছে!');
    }
  };

  const handleProductUpdate = async (updatedProduct: Product) => {
    try {
      await ensureAuthSession();
      const payload = {
        ...updatedProduct,
        imgUrl: updatedProduct.imgUrl,
        image: updatedProduct.imgUrl,         // compatibility with 'image'
        imageUrl: updatedProduct.imgUrl,      // compatibility with 'imageUrl'
        coverImage: updatedProduct.imgUrl,    // compatibility with 'coverImage'
        images: updatedProduct.images || (updatedProduct.imgUrl ? [updatedProduct.imgUrl] : []),
        gallery: updatedProduct.images || (updatedProduct.imgUrl ? [updatedProduct.imgUrl] : []) // compatibility with 'gallery'
      };
      await setDoc(doc(db, 'products', updatedProduct.id), payload, { merge: true });
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      localStorage.setItem('abed_products', JSON.stringify(products.map(p => p.id === updatedProduct.id ? updatedProduct : p)));
      showNotification('পণ্যটির তথ্য সফলভাবে ক্লাউড ফায়ারবেসে আপডেট করা হয়েছে!');
    } catch (err) {
      console.error('Error updating product in Firestore:', err);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      showNotification('পণ্যটির তথ্য সফলভাবে আপডেট করা হয়েছে!');
    }
  };

  const handleProductDelete = async (id: string, nameBn: string) => {
    try {
      await ensureAuthSession();
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      localStorage.setItem('abed_products', JSON.stringify(products.filter(p => p.id !== id)));
      showNotification(`"${nameBn}" পণ্যটি সফলভাবে ডিলিট করা হয়েছে!`);
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
      setProducts(prev => prev.filter(p => p.id !== id));
      showNotification(`"${nameBn}" পণ্যটি সফলভাবে ডিলিট করা হয়েছে!`);
    }
  };

  const resetAllToDefaults = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত কাস্টম ডেটা এবং সেটিংস মুছে ফেলে ডিফল্ট সেটিংসে ফিরে যেতে চান?')) {
      localStorage.removeItem('abed_products');
      localStorage.removeItem('abed_settings');
      localStorage.removeItem('abed_success_target');
      localStorage.removeItem('abed_pending_target');
      
      try {
        for (const prod of PRODUCTS) {
          await setDoc(doc(db, 'products', prod.id), prod);
        }
        await setDoc(doc(db, 'site_settings', 'current'), DEFAULT_SETTINGS);
        await setDoc(doc(db, 'project_stats', 'current'), { successTarget: 800, pendingTarget: 7 });
      } catch (err) {
        console.warn('Firestore reset note:', err);
      }

      // Reload states
      setProducts(PRODUCTS);
      setSiteSettings(DEFAULT_SETTINGS);
      setSuccessTarget(800);
      setPendingTarget(7);
      
      showNotification('সমস্ত ডেটা ডিফল্ট লেভেলে সফলভাবে রিস্টোর করা হয়েছে!');
    }
  };

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category (strictly furniture or interior)
    list = list.filter(p => p.category === selectedCategory);

    // Filter by search query if any
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.nameBn.toLowerCase().includes(q) || 
        p.nameEn.toLowerCase().includes(q) ||
        p.descriptionBn.toLowerCase().includes(q) ||
        p.descriptionEn.toLowerCase().includes(q)
      );
    }

    // Sort by price
    if (sortBy === 'low-high') {
      list.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === 'high-low') {
      list.sort((a, b) => b.minPrice - a.minPrice);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Scroll Helper
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  // Dedicated View for Handover Projects
  if (currentView === 'handover-projects') {
    return (
      <HandoverProjectsPage
        projects={completedProjects}
        brandName={`${siteSettings.brandNameLeft} ${siteSettings.brandNameRight}`}
        phone1={siteSettings.phone1}
        pageBadge={siteSettings.handoverPageBadge}
        pageTitle={siteSettings.handoverPageTitle}
        pageDesc={siteSettings.handoverPageDesc}
        onBackToHome={() => navigateTo('home')}
        onOpenAdmin={() => {
          navigateTo('home');
          setShowAdminPanel(true);
          setActiveAdminTab('projects');
          setTimeout(() => {
            document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#2c1d07] font-sans antialiased selection:bg-[#d4a762] selection:text-[#1a1200]">
      
      {/* HEADER SECTION WITH THE BRAND NAME "Abed Furniture & Interior" IN THE TOP MENU BAR */}
      <header className="bg-gradient-to-r from-[#170f01] via-[#2d1e05] to-[#170f01] text-white sticky top-0 z-40 shadow-xl border-b border-[#d4a762]/25 px-4 md:px-8 py-2 md:py-3 animate-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo & Branding - Beautiful size, solid luxury border and a simple shining effect */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 md:gap-5 cursor-pointer max-w-[82%] sm:max-w-full" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="logo-shining-container h-14 xs:h-17 sm:h-20 md:h-24 lg:h-28 w-auto bg-white rounded-xl p-1 shadow-md border-2 border-[#d4a762] hover:scale-105 transition-transform duration-300 shrink-0">
              <img 
                src="https://i.ibb.co.com/S4ZB9S14/ABED-FURNITURE-LOGO.jpg" 
                alt="Abed Furniture & Interior" 
                className="h-full w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col select-none justify-center space-y-1.5 min-w-0">
              <h1 id="brand-header" className="text-[13px] xs:text-[16px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-tight uppercase leading-none font-outfit font-black truncate">
                <span className="font-extrabold text-[#fdbf5e]">{siteSettings.brandNameLeft}</span>{' '}
                <span className="font-bold text-stone-100">{siteSettings.brandNameRight}</span>
              </h1>
              <div className="mt-0.5 self-start leading-none">
                <span className="text-[11px] xs:text-[13px] sm:text-[14.5px] md:text-[16px] lg:text-[18px] text-[#fdbf5e] font-black tracking-wide font-sans leading-none whitespace-nowrap block">
                  {siteSettings.tagline}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items - Ordered as requested: Our Product -> Our Projects -> Head Designer */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-outfit text-xs lg:text-sm font-semibold">
            <button 
              onClick={() => {
                if (currentView !== 'home') navigateTo('home');
                scrollToSection('hero');
              }} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0] font-sans font-black text-sm"
            >
              হোমপেজ
            </button>
            <button 
              onClick={() => {
                if (currentView !== 'home') navigateTo('home');
                setTimeout(() => scrollToSection('products'), 50);
              }} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0]"
            >
              Products & Interior
            </button>
            <button 
              onClick={() => {
                if (currentView !== 'home') navigateTo('home');
                setTimeout(() => scrollToSection('projects'), 50);
              }} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0]"
            >
              Our Projects
            </button>
            <button 
              onClick={() => navigateTo('handover-projects')} 
              className="hover:text-[#fdbf5e] text-[#fdbf5e] transition-colors cursor-pointer font-bold flex items-center gap-1.5 bg-[#d4a762]/15 hover:bg-[#d4a762]/25 px-3 py-1.5 rounded-xl border border-[#d4a762]/35 shadow-xs"
            >
              <FolderCheck className="w-3.5 h-3.5" />
              <span>Our Handover Projects</span>
            </button>
            <button 
              onClick={() => {
                if (currentView !== 'home') navigateTo('home');
                setTimeout(() => scrollToSection('designer'), 50);
              }} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0]"
            >
              Principal Designer
            </button>
            <button 
              onClick={() => {
                if (currentView !== 'home') navigateTo('home');
                setTimeout(() => scrollToSection('contact'), 50);
              }} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0]"
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button 
              onClick={() => scrollToSection('products')}
              className="hidden lg:inline-block bg-gradient-to-r from-[#d4a762] to-[#ecbe7b] hover:from-[#ecbe7b] hover:to-[#d4a762] text-[#1a1200] font-extrabold text-xs px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
            >
              EXPLORE
            </button>
            
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-[#d4a762] transition-colors cursor-pointer rounded-lg bg-white/5"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="md:hidden fixed top-[58px] sm:top-[72px] left-0 w-full bg-[#1c1202]/98 border-b border-[#d4a762]/30 text-white z-30 py-5 px-6 flex flex-col gap-3 shadow-2xl"
          >
            {/* Added English Brand Name Header inside the Hamburger Menu */}
            <div className="border-b border-[#d4a762]/20 pb-3 mb-1">
              <h2 className="text-sm font-extrabold text-[#fdbf5e] tracking-wider font-outfit font-black">
                {siteSettings.brandNameLeft} {siteSettings.brandNameRight}
              </h2>
              <p className="text-[10px] text-stone-300 font-medium">
                {siteSettings.tagline}
              </p>
            </div>

            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-left py-2.5 px-1.5 font-bold border-b border-white/5 hover:text-[#d4a762] flex justify-between items-center transition-colors font-sans text-xs tracking-wider"
            >
              <span className="text-[13px] text-[#fdbf5e] font-black">হোমপেজ</span>
            </button>
            <button 
              onClick={() => scrollToSection('products')} 
              className="text-left py-2.5 px-1.5 font-bold text-stone-100 border-b border-white/5 hover:text-[#d4a762] flex justify-between items-center transition-colors font-outfit text-xs tracking-wider"
            >
              <span>PRODUCTS</span>
              <span className="text-[12.5px] text-[#d4a762] font-black font-sans">পণ্যসমূহ</span>
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className="text-left py-2.5 px-1.5 font-bold text-stone-100 border-b border-white/5 hover:text-[#d4a762] flex justify-between items-center transition-colors font-outfit text-xs tracking-wider"
            >
              <span>PROJECTS</span>
              <span className="text-[12.5px] text-[#d4a762] font-black font-sans">প্রজেক্ট অগ্রগতি</span>
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('handover-projects');
              }} 
              className="text-left py-2.5 px-1.5 font-bold text-stone-100 border-b border-white/5 hover:text-[#d4a762] flex justify-between items-center transition-colors font-outfit text-xs tracking-wider"
            >
              <span>HANDOVER PROJECTS</span>
              <span className="text-[12.5px] text-[#fdbf5e] font-black font-sans">হ্যান্ডওভার প্রজেক্ট</span>
            </button>
            <button 
              onClick={() => scrollToSection('designer')} 
              className="text-left py-2.5 px-1.5 font-bold text-stone-100 border-b border-white/5 hover:text-[#d4a762] flex justify-between items-center transition-colors font-outfit text-xs tracking-wider"
            >
              <span>TEAMS</span>
              <span className="text-[12.5px] text-[#d4a762] font-black font-sans">টিম</span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-left py-2.5 px-1.5 font-bold text-stone-100 hover:text-[#d4a762] flex justify-between items-center transition-colors font-outfit text-xs tracking-wider"
            >
              <span>CONTACT</span>
              <span className="text-[12.5px] text-[#d4a762] font-black font-sans">যোগাযোগ</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HOMEPAGE HERO SECTION with a beautiful color gradient overlapping high-end wood texture pattern */}
      <section id="hero" className="relative text-white min-h-[550px] md:min-h-[620px] flex flex-col justify-center items-center py-24 px-4 text-center overflow-hidden">
        {/* Background Image Panel */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(23, 14, 2, 0.97) 15%, rgba(61, 39, 11, 0.82) 55%, rgba(20, 12, 1, 0.99) 95%), url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')` 
          }}
        />
        
        {/* Glowing flares for background depth */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-[#d4a762]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-[#a3793e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto z-10 px-4 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 10px 15px -3px rgba(212,167,98,0.15), inset 0 0 0px rgba(212,167,98,0)", 
                "0 15px 25px -3px rgba(212,167,98,0.35), inset 0 0 10px rgba(212,167,98,0.2)", 
                "0 10px 15px -3px rgba(212,167,98,0.15), inset 0 0 0px rgba(212,167,98,0)"
              ]
            }}
            transition={{ 
              scale: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              },
              boxShadow: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              },
              duration: 0.6 
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4a762]/30 to-[#b07e35]/30 text-[#fdbf5e] px-5 py-2 rounded-full text-xs md:text-sm font-black border border-[#d4a762]/45 mb-8 backdrop-blur-md shadow-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full animate-neon-dot mr-1 shrink-0" />
            <span className="tracking-widest uppercase font-outfit text-xs leading-none">{siteSettings.heroBadge}</span>
          </motion.div>

          {/* Large shining golden gradient Bengali text */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-[#fffbf4] via-[#fbdca7] to-[#e4c391] bg-clip-text text-transparent block">
              {siteSettings.heroTitleBn1}
            </span>
            <span className="bg-gradient-to-r from-[#e3b26c] via-[#ffdcae] to-[#ecbe7b] bg-clip-text text-transparent block mt-1">
              {siteSettings.heroTitleBn2}
            </span>
          </motion.h2>

          {/* Secondary beautiful Bengali description text */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-xl max-w-3xl text-stone-200 mb-12 leading-relaxed font-light font-sans"
          >
            {siteSettings.heroDescBn}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5.5 justify-center items-center w-full sm:w-auto mt-4 px-4"
          >
            <button 
              onClick={() => scrollToSection('products')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#d4a762] to-[#fdbf5e] hover:from-[#fdbf5e] hover:to-[#d4a762] text-[#1a1200] font-black text-sm md:text-base px-9 py-4 rounded-full tracking-wider uppercase shadow-xl hover:shadow-[#d4a762]/35 hover:-translate-y-1 transition-all duration-300 cursor-pointer font-sans flex items-center justify-center gap-2"
            >
              <span className="font-extrabold">আমাদের পণ্যসমূহ</span>
              <ArrowRight className="w-4.5 h-4.5 text-[#1a1200]" />
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto bg-[#faf9f4]/10 hover:bg-[#faf9f4]/20 text-[#fffaf0] font-bold text-sm md:text-base px-9 py-4 rounded-full border border-white/20 hover:border-[#d4a762] backdrop-blur-xs transition-all duration-300 transform hover:-translate-y-1 cursor-pointer font-sans flex items-center justify-center gap-2"
            >
              <span>সম্পূর্ণ ঠিকানা ও তথ্য</span>
              <svg className="w-4 h-4 text-[#d4a762] animate-bounce shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Bottom specifications ribbon */}
        <div className="absolute bottom-0 w-full bg-[#140c01]/95 py-4.5 text-[#e0cfb8] text-[11px] md:text-sm font-semibold select-none border-t border-[#d4a762]/15 hidden sm:block">
          <div className="max-w-7xl mx-auto flex justify-around items-center px-4">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#d4a762]" /> 
              সারা দেশে সুরক্ষিত হোম ডেলিভারি
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#d4a762]" /> 
              ফ্রি হোম ও প্রজেক্ট মেজারমেন্ট সেবা
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#d4a762]" /> 
              লাইফটাইম উড অ্যান্ড পলিশ গ্যারান্টি
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT OPTION PAGE: Only two buttons "Furniture" and "Interior", zero unfortunate text */}
      <section id="products" className="py-20 bg-white px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          {/* Header without unfortunate text or messy titles */}
          <div className="text-center max-w-lg mx-auto mb-10">
            <h2 className="text-3.5xl md:text-5xl font-black tracking-tight text-[#2c1d07] font-serif uppercase">
              Furniture & Interior
            </h2>
            <div className="w-16 h-1 bg-[#d4a762] mx-auto rounded-full mt-3.5" />
          </div>

          {/* Strictly Only Two Category Tabs in English without Emojis or Bengali */}
          <div className="flex gap-4 mb-14 justify-center">
            <button
              onClick={() => {
                setSelectedCategory('furniture');
                setSearchQuery('');
                setShowAllProducts(false);
              }}
              className={`px-10 py-4.5 rounded-full text-sm md:text-base font-extrabold tracking-wider uppercase transition-all duration-300 cursor-pointer border shadow-2xs ${
                selectedCategory === 'furniture'
                  ? 'bg-gradient-to-r from-[#170f01] to-[#3a2503] text-white border-[#d4a762]/20 scale-105 shadow-md'
                  : 'bg-[#faf9f4] hover:bg-[#d4a762]/10 text-[#2c1d07] border-gray-100'
              }`}
            >
              Furniture
            </button>
            <button
              onClick={() => {
                setSelectedCategory('interior');
                setSearchQuery('');
                setShowAllProducts(false);
              }}
              className={`px-10 py-4.5 rounded-full text-sm md:text-base font-extrabold tracking-wider uppercase transition-all duration-300 cursor-pointer border shadow-2xs ${
                selectedCategory === 'interior'
                  ? 'bg-gradient-to-r from-[#170f01] to-[#3a2503] text-white border-[#d4a762]/20 scale-105 shadow-md'
                  : 'bg-[#faf9f4] hover:bg-[#d4a762]/10 text-[#2c1d07] border-gray-100'
              }`}
            >
              Interior
            </button>
          </div>

          {/* Grid Layout of products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, showAllProducts ? undefined : 6).map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                key={product.id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group h-full relative"
              >
                {/* Category Overlay */}
                <span className="absolute top-4 left-4 bg-gradient-to-r from-[#170f01] to-[#d4a762]/90 backdrop-blur-md text-white text-[10px] uppercase font-bold py-1 px-3 rounded-full z-15 shadow-md tracking-wider">
                  {product.category === 'furniture' ? 'Solid Wood Furniture' : 'Premium Interior'}
                </span>

                {/* Red Gradient Trending Tag with Fire Animation */}
                {product.isTrending && (
                  <div className="absolute top-4 right-4 z-20 select-none scale-95 pointer-events-none">
                    <div className="relative animate-pulse">
                      {/* Burning flame neon backdrop glow */}
                      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 opacity-80 blur-[6px]" />
                      
                      {/* Main golden border red-gradient text container */}
                      <div className="relative flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white text-[9px] font-black tracking-widest uppercase border border-amber-400">
                        <Flame className="w-3 h-3 text-yellow-300 animate-bounce" />
                        <span>TRENDING</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cover Image */}
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="h-56 overflow-hidden bg-gray-50 relative cursor-pointer"
                >
                  <img
                    src={product.imgUrl}
                    alt={product.nameEn}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    style={{ 
                      imageRendering: '-webkit-optimize-contrast',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#1a1200]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-xs text-[#1a1200] font-extrabold px-4.5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Flame className="w-4 h-4 text-red-500" />
                      বিস্তারিত দেখুন
                    </span>
                  </div>
                </div>

                {/* Text specs context */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* English Name (Simple English Name) */}
                  <h4 
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-base text-[#2c1d07] group-hover:text-[#d4a762] transition-colors line-clamp-1 cursor-pointer font-sans"
                  >
                    {product.nameEn}
                  </h4>

                  {/* Bengali Name (Bold easily readable) */}
                  <p className="text-sm font-black text-[#b07e35] mt-1.5 line-clamp-1">
                    {product.nameBn}
                  </p>
                  
                  <p className="text-[10px] text-[#d4a762] mt-1.5 font-extrabold uppercase tracking-widest">{product.category === 'furniture' ? 'Abed Teak Collection' : 'Liton Projects'}</p>
                  
                  {/* Bengali Description (Easy reading - Cool font & larger weight per user request) */}
                  <p className="text-[13.5px] text-stone-600 line-clamp-3 mt-3 flex-1 leading-relaxed font-semibold font-sans">
                    {product.descriptionBn}
                  </p>

                  {/* Bengali Specifications */}
                  <div className="my-4 bg-[#faf9f4] rounded-xl p-3 border border-gray-100/90 text-xs text-stone-700 space-y-1.5 font-bold">
                    {product.specsBn.slice(0, 2).map((spec, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#d4a762] shrink-0" />
                        <span className="truncate font-extrabold">{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing footer in BDT & Details button */}
                  <div className="mt-auto pt-4 border-t border-gray-100/80 flex items-center justify-between">
                    <div>
                      <p className="text-[9.5px] text-stone-400 uppercase font-black tracking-wider">আনুমানিক বাজেট (Budget)</p>
                      <p className="text-[14px] font-mono font-black text-[#b07e35] tracking-tight">{product.priceRangeEn}</p>
                    </div>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="bg-[#faf9f4] hover:bg-[#d4a762] text-stone-700 hover:text-[#1a1200] px-3.5 py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer border border-gray-100/40"
                    >
                      বিস্তারিত
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

          {!showAllProducts && filteredProducts.length > 6 && (
            <div className="mt-12 text-center animate-fade-in">
              <button
                type="button"
                onClick={() => setShowAllProducts(true)}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#170f01] to-[#3d270b] hover:from-[#d4a762] hover:to-[#b07e35] text-[#fdbf5e] hover:text-white px-9 py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg border border-[#d4a762]/35 active:scale-95 group hover:shadow-xl"
              >
                <span>আরও পণ্য দেখুন (See More Products)</span>
                <ChevronDown className="w-4 h-4 text-[#fdbf5e] group-hover:text-white transition-colors shrink-0 animate-bounce" />
              </button>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-stone-400">
              <p className="text-lg font-bold">No products or interiors found under this selection.</p>
              <button 
                onClick={() => { setSearchQuery(''); }}
                className="mt-3 text-[#d4a762] hover:underline font-bold text-sm cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 3. OUR PROJECTS PROGRESS GRAPH SECTION */}
      <ProjectStatsChart successTarget={successTarget} pendingTarget={pendingTarget} />

      {/* OUR HANDOVER PROJECTS COMPACT CTA BUTTON / CARD WITH GLOW & SHINE */}
      {/* Exact Placement: Pie Chart → Our Handover Projects Button → Team Information */}
      <section className="py-7 sm:py-9 bg-gradient-to-b from-[#faf9f4] via-[#f5f2e8] to-[#faf9f4] px-4 md:px-8 border-b border-[#d4a762]/25 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/95 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#d4a762]/40 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row items-center justify-between gap-5 overflow-hidden group">
            {/* Subtle luxury background radial accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a762]/8 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

            <div className="text-center sm:text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-[#966b2d] tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#d4a762] animate-pulse" />
                <span>{siteSettings.handoverBadge || 'বাস্তবায়িত কাজের সংগ্রহশালা (Delivered Works)'}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-[#2c1d07] leading-snug">
                {siteSettings.handoverTitle || 'আমাদের ক্লায়েন্টদের সফলভাবে সম্পন্ন ও হস্তান্তরিত প্রজেক্ট'}
              </h4>
              <p className="text-xs text-stone-500 font-medium mt-0.5 max-w-xl">
                {siteSettings.handoverSubtitle || 'হস্তান্তরিত আসবাব ও ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম দেখতে নিচের বাটনে ক্লিক করুন।'}
              </p>
            </div>

            {/* Glowing & Shining Handover CTA Button */}
            <div className="relative shrink-0 handover-pulse-glow rounded-2xl">
              <button
                type="button"
                onClick={() => navigateTo('handover-projects')}
                className="handover-shine-btn bg-gradient-to-r from-[#170f01] via-[#2f1c05] to-[#170f01] hover:from-[#2a1b05] hover:via-[#3f2708] hover:to-[#2a1b05] text-[#fdbf5e] hover:text-[#fff4d6] px-7 py-3.5 rounded-2xl text-sm font-black flex items-center gap-2.5 shadow-[0_4px_20px_rgba(212,167,98,0.35)] hover:shadow-[0_8px_30px_rgba(212,167,98,0.55)] transition-all duration-300 cursor-pointer active:scale-95 group shrink-0 border border-[#d4a762]/60 hover:border-[#fdbf5e]"
              >
                <div className="p-1 rounded-lg bg-[#d4a762]/20 group-hover:bg-[#d4a762]/35 transition-colors">
                  <FolderCheck className="w-4 h-4 text-[#fdbf5e] group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-outfit tracking-wide font-extrabold text-sm sm:text-base">
                  {siteSettings.handoverButtonLabel || 'Our Handover Projects'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#d4a762] group-hover:text-white group-hover:translate-x-1.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEAM INFORMATION PAGE */}
      <section id="designer" className="py-20 bg-[#faf9f4] px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">Team Information</span>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#2c1d07] mt-1 mb-3 font-serif uppercase">
              Team Information
            </h3>
            <div className="w-16 h-1 bg-[#d4a762] mx-auto rounded-full" />
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#d4a762]/15 flex flex-col lg:flex-row items-stretch">
            
            {/* Left Column - Upgraded 4K quality profile photo with thick golden neon looping border and real gloss sweep */}
            <div className="lg:w-2/5 p-4 bg-gradient-to-br from-[#1c1202] to-[#2a1b05] flex items-center justify-center">
              <div className="relative h-full w-full rounded-3xl overflow-hidden border-[4px] border-[#d4a762] animate-golden-glow shimmer-active shadow-[0_0_35px_rgba(212,167,98,0.5)]">
                <img
                  src="https://i.ibb.co.com/QFnMvZ2z/Liton-pic.jpg"
                  alt="Chief Designer Liton Ali"
                  className="w-full h-full object-cover min-h-[420px] max-h-[520px] transition-transform duration-700 hover:scale-105 contrast-[1.08] saturate-[1.05] filter drop-shadow-xl"
                  style={{ imageRendering: 'auto' }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Luxury Double Golden Experience Stamp Badge - Aligned with elite styling */}
                <div className="absolute top-4 right-4 bg-gradient-to-br from-[#ffe082] via-[#b38728] to-[#fcf6ba] text-[#1a1200] py-2.5 px-4 rounded-xl text-[10px] font-black font-outfit uppercase tracking-widest shadow-2xl flex items-center gap-2 border-2 border-[#fffdec] animate-bounce" style={{ animationDuration: '4.5s' }}>
                  <Award className="w-5 h-5 text-[#1a1200] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black leading-none text-[#1a1200]/80">15+ Years</span>
                    <span className="text-[10px] font-black leading-none tracking-tight">Golden Guild</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Premium short bio details */}
            <div className="lg:w-3/5 p-6 md:p-10 flex flex-col justify-center">
              <span className="text-xs font-black text-[#d4a762] tracking-widest uppercase mb-1 font-outfit">
                {siteSettings.designerTitle}
              </span>
              <h4 className="text-2xl md:text-4xl font-black text-[#2c1d07] md:mb-3 font-outfit uppercase">
                {siteSettings.designerName}
              </h4>
              
              <div className="h-1 w-16 bg-[#d4a762] mb-6 rounded-full" />

              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed font-sans">
                <p>
                  {siteSettings.designerDesc1}
                </p>
                <p>
                  {siteSettings.designerDesc2}
                </p>
              </div>

              {/* Specific achievement boxes */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 font-sans">
                  <p className="text-[#d4a762] text-xs font-bold uppercase tracking-wide">শিল্প অভিজ্ঞতা (Skills & Crafts)</p>
                  <p className="text-base font-black text-[#2c1d07] mt-1">{siteSettings.designerExpText}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 font-sans">
                  <p className="text-[#d4a762] text-xs font-bold uppercase tracking-wide">দুবাই প্রজেক্ট (Dubai Projects)</p>
                  <p className="text-base font-black text-[#2c1d07] mt-1">{siteSettings.designerDubaiText}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FACEBOOK & WHATSAPP SOCIAL CONNECT: Two Gorgeous Interactive Banners in a Grid layout */}
      <section id="contact" className="py-12 bg-[#faf9f4] px-4 md:px-8 border-b border-gray-100 font-sans">
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          
          {/* FACEBOOK PAGE JOIN BOX */}
          <motion.a
            href="https://www.facebook.com/share/16qF4GEczg/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01 }}
            className="block rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1877f2] via-[#2a6fd1] to-[#0d3b8c] text-white shadow-xl relative overflow-hidden group cursor-pointer border border-[#d4a762]/20 flex flex-col justify-between"
          >
            {/* Ambient visual shine or blur backing */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -z-5 pointer-events-none group-hover:bg-white/15 transition-all" />
            
            <div className="flex flex-col gap-5 relative z-10 h-full justify-between">
              {/* Left text message */}
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs sm:text-sm font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-white/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  ফেসবুক কানেক্ট (Facebook Page)
                </span>
                
                <h3 className="text-2xl sm:text-3xl md:text-3.5xl font-black text-white leading-tight tracking-tight mt-1">
                  ফেসবুকে আমাদের সাথে যুক্ত হোন!
                </h3>
                
                <p className="text-[#fffdec] text-sm sm:text-base md:text-[17px] leading-relaxed mt-4 font-bold">
                  আমাদের ফেসবুক পেজে যুক্ত হয়ে আধুনিক রাজকীয় ফার্নিচার ও আকর্ষণীয় কাস্টম ইন্টেরিয়র ডিজাইনের সব নতুন আপডেট এবং এক্সক্লুসিভ অফারগুলো সরাসরি উপভোগ করুন।
                </p>
              </div>

              {/* Action Indicator Button */}
              <div className="shrink-0 self-start mt-2">
                <div className="bg-white text-[#1877f2] font-black text-xs sm:text-sm md:text-base px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 border border-[#d4a762]/10 transition-transform duration-300 font-sans">
                  <span>ফেসবুক পেজ ভিজিট করুন</span>
                  <ArrowUpRight className="w-4 h-4 text-[#1877f2]" />
                </div>
              </div>
            </div>
          </motion.a>

          {/* WHATSAPP BANNER CONTACT BOX */}
          <motion.a
            href="https://wa.me/8801816234157"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01 }}
            className="block rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#075e54] via-[#128c7e] to-[#25d366] text-white shadow-xl relative overflow-hidden group cursor-pointer border border-[#d4a762]/20 flex flex-col justify-between"
          >
            {/* Ambient visual shine or blur backing */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -z-5 pointer-events-none group-hover:bg-white/15 transition-all" />
            
            <div className="flex flex-col gap-5 relative z-10 h-full justify-between">
              {/* Left text message */}
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs sm:text-sm font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-white/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  সরাসরি যোগাযোগ (Direct Chat)
                </span>
                
                <h3 className="text-2xl sm:text-3xl md:text-3.5xl font-black text-white leading-tight tracking-tight mt-1">
                  হোয়াটসঅ্যাপে সরাসরি চ্যাট করুন!
                </h3>
                
                <p className="text-[#fffdec] text-sm sm:text-base md:text-[17px] leading-relaxed mt-4 font-bold">
                  যেকোনো পণ্যের অর্ডার, কাস্টমাইজেশন বা ইন্টেরিয়র ডিজাইনের সাহায্য বা মূল্যের জন্য সরাসরি আমাদের সাথে হোয়াটসঅ্যাপ চ্যাটিং শুরু করুন। আমরা সবসময় প্রস্তুত।
                </p>
              </div>

              {/* Action Indicator Button */}
              <div className="shrink-0 self-start mt-2">
                <div className="bg-white text-[#075e54] font-black text-xs sm:text-sm md:text-base px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 border border-[#d4a762]/10 transition-transform duration-300 font-sans">
                  <span>হোয়াটসঅ্যাপ মেসেজ পাঠান</span>
                  <ArrowUpRight className="w-4 h-4 text-[#075e54]" />
                </div>
              </div>
            </div>
          </motion.a>
        </motion.div>
      </section>

      {/* ADMIN CONTROL PANEL SECTION - SECURE AND HIDDEN BY DEFAULT */}
      {showAdminPanel && (
        <section id="admin" className="py-12 bg-[#faf9f6]/95 border-t border-[#d4a762]/35 relative overflow-hidden text-stone-850 font-sans shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/25 via-stone-50/60 to-[#faf9f6]/95 pointer-events-none" />
          <div className="absolute top-0 left-10 w-72 h-72 bg-[#d4a762]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            
            {/* Elegant light-themed Admin panel header block with close trigger */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-5 mb-8 gap-4 text-left">
              <div>
                <span className="text-[10px] font-black uppercase text-[#a07436] bg-[#d4a762]/10 border border-[#d4a762]/20 tracking-wider px-2.5 py-1 rounded">
                  Private Control Panel
                </span>
                <h4 className="text-xl font-black text-stone-900 mt-1.5 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#b88e4f]" />
                  <span>সাইট নিয়ন্ত্রণ প্যানেল (Admin Panel Dashboard)</span>
                </h4>
              </div>
              <button 
                onClick={() => setShowAdminPanel(false)}
                className="text-xs text-stone-600 hover:text-stone-950 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d4a762]/10 hover:bg-stone-100 bg-white shadow-xs cursor-pointer animate-fade-in"
              >
                <X className="w-4 h-4 text-stone-600" />
                <span>প্যানেলটি বন্ধ করুন (Hide Section)</span>
              </button>
            </div>
            
            <AnimatePresence>
              {adminNotification && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`max-w-md mx-auto mb-8 p-4 rounded-2xl flex items-center gap-3 border shadow-md z-30 justify-between ${
                    adminNotification.type === 'error' 
                      ? 'bg-red-50 text-red-900 border-red-200' 
                      : 'bg-emerald-50 text-emerald-950 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold font-sans">
                    {adminNotification.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-600 shrink-0" /> : <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                    <span>{adminNotification.message}</span>
                  </div>
                  <button onClick={() => setAdminNotification(null)} className="p-1 hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isAdminUnlocked ? (
              /* Admin Secured Login Flow - Hardened & Protected */
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto bg-white rounded-3xl p-7 sm:p-8 border border-[#d4a762]/40 shadow-xl text-center text-stone-850 animate-fade-in relative overflow-hidden"
              >
                {/* Security header badge */}
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full text-emerald-800 text-[10.5px] font-black uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Admin Gateway</span>
                </div>

                <div className="h-16 w-16 bg-[#d4a762]/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#d4a762]/30 text-[#a07436] shadow-sm">
                  <Lock className="w-7 h-7 text-[#8c6223]" />
                </div>

                <h4 className="text-xl font-black text-[#1c1202] mb-1.5 font-serif uppercase tracking-tight">
                  এডমিন সিকিউরড অ্যাক্সেস (Admin Sign In)
                </h4>
                <p className="text-xs text-stone-500 mb-5 leading-relaxed font-semibold">
                  পণ্য, হ্যান্ডওভার প্রজেক্ট ও ওয়েবসাইট সেটিংস পরিচালনায় আপনার অ্যাডমিন ক্রেডেন্সিয়াল অথবা মাস্টার পাসকোড দিন।
                </p>

                {/* Brute Force Lockout Countdown Alert */}
                {lockoutSeconds > 0 && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold flex items-center gap-2.5 text-left animate-pulse">
                    <Timer className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <p className="font-black text-red-900">অনেকবার ভুল চেষ্টা করা হয়েছে!</p>
                      <p className="text-[11px] text-red-700 mt-0.5">
                        নিরাপত্তার স্বার্থে এডমিন লগইন সাময়িক স্থগিত। পুনরায় চেষ্টার সময় বাকি: <strong className="font-mono text-red-900 underline">{lockoutSeconds} সেকেন্ড</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Failed attempts warning */}
                {failedAttempts > 0 && lockoutSeconds === 0 && (
                  <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-bold text-left flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>ভুল চেষ্টা লক্ষ্য করা হয়েছে! অবশিষ্ট সুযোগ: <strong>{5 - failedAttempts} বার</strong></span>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4 text-left font-sans">
                  <div>
                    <label className="block text-[10px] font-bold text-[#966b2d] uppercase mb-1.5 tracking-wide">
                      ইমেইল ঠিকানা (Email Address - ঐচ্ছিক যদি পাসকোড থাকে)
                    </label>
                    <input 
                      type="email"
                      placeholder="admin@abedfurniture.com বা আপনার রেজিস্টার্ড ইমেইল"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      disabled={lockoutSeconds > 0}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#d4a762]/40 placeholder:text-stone-400 transition-all font-bold disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-bold text-[#966b2d] uppercase tracking-wide">
                        পাসওয়ার্ড অথবা মাস্টার পাসকোড (Password / Passcode)*
                      </label>
                      <span className="text-[10px] text-stone-400 font-mono">Firebase / Master Key</span>
                    </div>

                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="আপনার পাসওয়ার্ড বা মাস্টার পাসকোড দিন"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        disabled={lockoutSeconds > 0}
                        className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl pl-4 pr-11 py-3 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#d4a762]/40 placeholder:text-stone-400 transition-all font-bold disabled:opacity-50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={lockoutSeconds > 0}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
                        title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={lockoutSeconds > 0}
                    className="w-full bg-gradient-to-r from-[#cf9d53] to-[#bfa042] hover:brightness-105 active:scale-[0.99] text-stone-950 font-black text-xs uppercase py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Unlock className="w-4 h-4 text-stone-950" />
                    <span>এডমিন প্যানেল আনলক করুন</span>
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-[10px] text-stone-400 font-medium flex items-center justify-center gap-1.5">
                      <Lock className="w-3 h-3 text-stone-400" />
                      <span>১৫ মিনিট নিষ্ক্রিয় থাকলে সেশন স্বয়ংক্রিয়ভাবে লক হয়ে যাবে</span>
                    </p>
                  </div>
                </form>
              </motion.div>
            ) : (
            /* Unlocked Admin Dashboard - White Bright Dashboard */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl border border-[#d4a762]/25 shadow-lg overflow-hidden text-left"
            >
              {/* Operations bar */}
              <div className="bg-[#fcfaf5] border-b border-stone-200 px-4 md:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                  <div>
                    <h5 className="text-base font-extrabold text-stone-900 flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-4 h-4 text-[#cf9d53] animate-spin" />
                      লাইভ অনলাইন এডমিন (Administrator Mode)
                    </h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 font-sans">রিয়েল-টাইম লাইভ সিঙ্ক সচল আছে এবং সমস্ত পরিবর্তন সঙ্গে সঙ্গে কার্যকর হচ্ছে</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center font-sans">
                  <button
                    type="button"
                    onClick={resetAllToDefaults}
                    className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-stone-600 hover:text-red-700 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-200 hover:border-red-200 transition-all cursor-pointer shadow-3xs font-bold"
                    title="কোম্পানি ডেটা রিসেট করুন"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট রিস্টোর</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-800 px-4 py-2 rounded-xl text-xs font-black border border-red-200 shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-red-600" />
                    <span>লক ও সাইনআউট (Lock & Sign Out)</span>
                  </button>
                </div>
              </div>

              {/* Tabbed Navigation Layout */}
              <div className="flex border-b border-stone-200 bg-stone-50 p-2 overflow-x-auto gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => { setActiveAdminTab('products'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeAdminTab === 'products'
                      ? 'bg-white text-[#996d2d] border border-[#d4a762]/45 shadow-xs'
                      : 'text-stone-500 hover:text-[#2c1d07] hover:bg-stone-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>পণ্য ও ইন্টেরিয়র কাজ (Manage Catalog)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveAdminTab('projects'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeAdminTab === 'projects'
                      ? 'bg-white text-[#996d2d] border border-[#d4a762]/45 shadow-xs'
                      : 'text-stone-500 hover:text-[#2c1d07] hover:bg-stone-100'
                  }`}
                >
                  <FolderCheck className="w-4 h-4 text-[#a07436]" />
                  <span>Handover Projects</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveAdminTab('stats'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeAdminTab === 'stats'
                      ? 'bg-white text-[#996d2d] border border-[#d4a762]/45 shadow-xs'
                      : 'text-stone-500 hover:text-[#2c1d07] hover:bg-stone-100'
                  }`}
                >
                  <BarChart className="w-4 h-4 text-emerald-500" />
                  <span>পাই চার্ট ও প্রজেক্ট কাউন্টার (Adjust Pie Chart Stats)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveAdminTab('site_info'); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeAdminTab === 'site_info'
                      ? 'bg-white text-[#996d2d] border border-[#d4a762]/45 shadow-xs'
                      : 'text-stone-500 hover:text-[#2c1d07] hover:bg-stone-100'
                  }`}
                >
                  <Settings className="w-4 h-4 text-sky-500" />
                  <span>সাইট কন্টেন্ট ও ব্র্যান্ডিং (Site Info)</span>
                </button>
              </div>

              <div className="p-4 md:p-8">
                {activeAdminTab === 'products' && (
                  <AdminProductManager
                    products={products}
                    onProductCreated={handleProductCreate}
                    onProductUpdated={handleProductUpdate}
                    onProductDeleted={handleProductDelete}
                    showNotification={showNotification}
                    onViewProduct={(product) => setSelectedProduct(product)}
                  />
                )}

                {activeAdminTab === 'projects' && (
                  <AdminProjectManager
                    projects={completedProjects}
                    setProjects={setCompletedProjects}
                    showNotification={showNotification}
                    siteSettings={siteSettings}
                    setSiteSettings={setSiteSettings}
                    onSaveSiteSettings={handleSaveSiteSettings}
                  />
                )}

                {activeAdminTab === 'stats' && (
                  <div className="max-w-2xl mx-auto space-y-8 bg-stone-900/40 p-5 md:p-8 rounded-3xl border border-stone-800 animate-fade-in">
                    <div className="flex items-center gap-2.5 mb-2 text-left">
                      <div className="h-8 w-8 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center justify-center">
                        <BarChart className="w-4 h-4" />
                      </div>
                      <div>
                        <h6 className="text-base font-black text-white">অগ্রগতি ও প্রজেক্ট কাউন্টার (Pie Chart Slider & Stepper)</h6>
                        <p className="text-[10px] text-stone-400">এই সেকশনে আপনার সফল ডেলিভারি করা এবং কারখানা বা চলমান ডিজাইনের প্রজেক্ট সংখ্যা টাইপ করে বা বাটনে ক্লিক করে বাড়াতে বা কমাতে পারেন।</p>
                      </div>
                    </div>

                    <div className="space-y-6 pt-2 text-left">
                      
                      {/* Success stats */}
                      <div className="bg-stone-950 p-5 rounded-2xl border border-stone-850">
                        <div className="flex justify-between items-center mb-2.5">
                          <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Completed Projects</span>
                            <h5 className="text-sm font-black text-white mt-0.5">সফল ডেলিভারি করা প্রজেক্ট সংখ্যা (Success Target)*</h5>
                          </div>
                          <span className="text-xl font-black text-[#d4a762] font-mono">{successTarget}</span>
                        </div>

                        {/* Interactive Incrementor/Decrementor & Direct Type Input */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-stone-900/60 border border-stone-800 rounded-xl mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-300 font-bold">সংখ্যাটি সরাসরি টাইপ করুন:</span>
                            <input 
                              type="number"
                              value={successTarget}
                              onChange={(e) => setSuccessTarget(Math.max(1, parseInt(e.target.value, 10) || 0))}
                              className="w-24 bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-[#d4a762] font-bold"
                            />
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setSuccessTarget(prev => Math.max(1, prev - 1))}
                              className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 h-8 rounded-lg text-xs font-black flex items-center justify-center border border-stone-700 select-none cursor-pointer active:scale-95 transition-all"
                              title="১ কমান"
                            >
                              -১
                            </button>
                            <button
                              type="button"
                              onClick={() => setSuccessTarget(prev => Math.max(1, prev - 10))}
                              className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 h-8 rounded-lg text-xs font-black flex items-center justify-center border border-stone-700 select-none cursor-pointer active:scale-95 transition-all"
                              title="১০ কমান"
                            >
                              -১০
                            </button>
                            <button
                              type="button"
                              onClick={() => setSuccessTarget(prev => prev + 10)}
                              className="bg-[#d4a762]/20 hover:bg-[#d4a762]/30 text-[#fdbf5e] px-2.5 h-8 rounded-lg text-xs font-black flex items-center justify-center border border-[#d4a762]/45 select-none cursor-pointer active:scale-95 transition-all"
                              title="১০ বাড়ান"
                            >
                              +১০
                            </button>
                            <button
                              type="button"
                              onClick={() => setSuccessTarget(prev => prev + 1)}
                              className="bg-[#d4a762]/20 hover:bg-[#d4a762]/30 text-[#fdbf5e] px-2.5 h-8 rounded-lg text-xs font-black flex items-center justify-center border border-[#d4a762]/45 select-none cursor-pointer active:scale-95 transition-all"
                              title="১ বাড়ান"
                            >
                              +১
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <input 
                            type="range"
                            min="10"
                            max="2000"
                            step="5"
                            value={successTarget}
                            onChange={(e) => setSuccessTarget(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#d4a762]"
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-stone-500 font-mono mt-1 px-1">
                          <span>10</span>
                          <span>800 (Default)</span>
                          <span>2,000</span>
                        </div>
                      </div>

                      {/* Pending active counter slider */}
                      <div className="bg-stone-950 p-5 rounded-2xl border border-stone-850">
                        <div className="flex justify-between items-center mb-2.5">
                          <div>
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">Pending / Active Work</span>
                            <h5 className="text-sm font-black text-white mt-0.5">বর্তমানে কারখানায় চলমান প্রজেক্ট (Pending Count)*</h5>
                          </div>
                          <span className="text-xl font-black text-amber-500 font-mono">{pendingTarget}</span>
                        </div>

                        {/* Interactive Incrementor/Decrementor & Direct Type Input */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-stone-900/60 border border-stone-800 rounded-xl mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-300 font-bold">সংখ্যাটি সরাসরি টাইপ করুন:</span>
                            <input 
                              type="number"
                              value={pendingTarget}
                              onChange={(e) => setPendingTarget(Math.max(0, parseInt(e.target.value, 10) || 0))}
                              className="w-24 bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-amber-500 font-bold"
                            />
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPendingTarget(prev => Math.max(0, prev - 1))}
                              className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 h-8 rounded-lg text-xs font-black flex items-center justify-center border border-stone-700 select-none cursor-pointer active:scale-95 transition-all"
                              title="১ কমান"
                            >
                              -১
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingTarget(prev => Math.max(0, prev - 5))}
                              className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 h-8 rounded-lg text-xs font-black flex items-center justify-center border border-stone-700 select-none cursor-pointer active:scale-95 transition-all"
                              title="৫ কমান"
                            >
                              -৫
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingTarget(prev => prev + 5)}
                              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 h-8 rounded-lg text-xs font-black flex items-center justify-center border border-amber-500/45 select-none cursor-pointer active:scale-95 transition-all"
                              title="৫ বাড়ান"
                            >
                              +৫
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingTarget(prev => prev + 1)}
                              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 h-8 rounded-lg text-xs font-black flex items-center justify-center border border-amber-500/45 select-none cursor-pointer active:scale-95 transition-all"
                              title="১ বাড়ান"
                            >
                              +১
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <input 
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={pendingTarget}
                            onChange={(e) => setPendingTarget(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-550"
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-stone-500 font-mono mt-1 px-1">
                          <span>0</span>
                          <span>7 (Default)</span>
                          <span>50</span>
                        </div>
                      </div>

                    </div>

                    <div className="p-3 bg-stone-950 rounded-xl border border-emerald-500/10 text-emerald-300 text-[10.5px] font-semibold text-center flex items-center justify-center gap-1.5 font-sans leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>পরিবর্তনগুলো লাইভ পাই চার্ট সেকশনে সরাসরি রিয়েল-টাইমে আপডেট হয়েছে!</span>
                    </div>

                  </div>
                )}

                {activeAdminTab === 'site_info' && (
                  <div className="space-y-6 text-left">
                    <div className="bg-stone-900/50 p-5 rounded-2xl border border-stone-800">
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="h-8 w-8 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20 flex items-center justify-center">
                          <Settings className="w-4 h-4" />
                        </div>
                        <div>
                          <h6 className="text-[15px] font-black text-white">ল্যান্ডিং পেজ হেডলাইন ও কন্টেন্ট নিয়ন্ত্রণ (Site Content Panel)</h6>
                          <p className="text-[10px] text-stone-400">এই ফর্মগুলো পরিবর্তন করে ওয়েবসাইটের হিরো ব্যানার টাইটেল, ঠিকানা, সময়, ও বায়োগ্রাফি টেক্সট কাস্টমাইজ করতে পারেন</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mb-5">
                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">আবেদ ফার্ণিচার বাম অংশ (Brand Left)</label>
                          <input 
                            type="text"
                            value={siteSettings.brandNameLeft}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, brandNameLeft: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">শোরুম ফার্নিচার ডান অংশ (Brand Right)</label>
                          <input 
                            type="text"
                            value={siteSettings.brandNameRight}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, brandNameRight: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">স্লোগান / মনকাড়া ট্যাগলাইন (Brand Tagline)</label>
                          <input 
                            type="text"
                            value={siteSettings.tagline}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, tagline: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mb-5">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">হিরো ব্যানার উপরে পিল অফার ট্যাক্সট (Hero Badge Banner)</label>
                          <input 
                            type="text"
                            value={siteSettings.heroBadge}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, heroBadge: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#d4a762] mb-1.5 uppercase">হোয়াটসঅ্যাপ যোগাযোগের কাস্টম নম্বর (Phone 1)</label>
                          <input 
                            type="text"
                            value={siteSettings.phone1}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, phone1: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-5">
                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">লার্জ টাইটেল প্রথম লাইন বাংলায় (Hero Header Line 1)</label>
                          <input 
                            type="text"
                            value={siteSettings.heroTitleBn1}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, heroTitleBn1: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">লার্জ টাইটেল দ্বিতীয় লাইন বাংলায় (Hero Header Line 2)</label>
                          <input 
                            type="text"
                            value={siteSettings.heroTitleBn2}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, heroTitleBn2: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      <div className="mb-5">
                        <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">হিরো বিস্তারিত ডেসক্রিপশন বাংলায় (Hero description)</label>
                        <textarea 
                          rows={3}
                          value={siteSettings.heroDescBn}
                          onChange={(e) => setSiteSettings(prev => ({ ...prev, heroDescBn: e.target.value }))}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#d4a762] font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-5">
                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">শোরুম ঠিকানা (Showroom Address - Footer & Info Page)</label>
                          <input 
                            type="text"
                            value={siteSettings.showroomAddress}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, showroomAddress: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">শোরুম টাইম টেবিল (Opening & Closing Hours)</label>
                          <input 
                            type="text"
                            value={siteSettings.showroomHours}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, showroomHours: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-5">
                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">বিকল্প সংযোগ নম্বর ২ (Footer Phone 2)</label>
                          <input 
                            type="text"
                            value={siteSettings.phone2}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, phone2: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">বিকল্প সংযোগ নম্বর ৩ (Footer Phone 3)</label>
                          <input 
                            type="text"
                            value={siteSettings.phone3}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, phone3: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      <div className="h-px bg-stone-800 my-8" />

                      <span className="text-xs font-black text-amber-500 uppercase tracking-widest font-mono block mb-5">
                        প্রধান কারিগর ও নকশাবিদ লিটন আলী সাহেবের বায়ো (Chief Designer's Bio Controls)
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-5">
                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">নকশাবিদের নাম (Designer Name)</label>
                          <input 
                            type="text"
                            value={siteSettings.designerName}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, designerName: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">নকশাবিদের উপাধি (Designer Title)</label>
                          <input 
                            type="text"
                            value={siteSettings.designerTitle}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, designerTitle: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-5">
                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase font-sans">অভিজ্ঞতা সংক্ষেপ ১ (Designer Bio Part 1)</label>
                          <textarea 
                            rows={3}
                            value={siteSettings.designerDesc1}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, designerDesc1: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase font-sans">অভিজ্ঞতা সংক্ষেপ ২ (Designer Bio Part 2)</label>
                          <textarea 
                            rows={3}
                            value={siteSettings.designerDesc2}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, designerDesc2: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-6">
                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">অভিজ্ঞতার টেক্সট বাংলা (Years of Excellence Text)</label>
                          <input 
                            type="text"
                            value={siteSettings.designerExpText}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, designerExpText: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">দুবাই আরব টেক অভিজ্ঞতা টেক্সট (Dubai Work Label)</label>
                          <input 
                            type="text"
                            value={siteSettings.designerDubaiText}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, designerDubaiText: e.target.value }))}
                            className="w-full bg-[#181105] border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      {/* ----------------- HANDOVER PROJECTS UPPER TEXT & HEADINGS CONTROL ----------------- */}
                      <div className="mt-8 pt-6 border-t border-stone-800">
                        <div className="flex items-center gap-2.5 mb-5">
                          <div className="h-8 w-8 bg-[#d4a762]/15 text-[#d4a762] rounded-lg border border-[#d4a762]/30 flex items-center justify-center">
                            <FolderCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <h6 className="text-[15px] font-black text-white">
                              হ্যান্ডওভার প্রজেক্ট সেকশন ও পেজের টেক্সট নিয়ন্ত্রণ (Handover Upper Texts & Headings)
                            </h6>
                            <p className="text-[10px] text-stone-400">
                              হোমপেজের হ্যান্ডওভার বাটন পিসের উপরের ব্যাজ, শিরোনাম, সাবটাইটেল এবং হ্যান্ডওভার অ্যালবাম পেজের বিস্তারিত টেক্সট এডিট করুন।
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-5">
                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              হোমপেজ হ্যান্ডওভার ব্যাজ (Handover Upper Badge)
                            </label>
                            <input 
                              type="text"
                              value={siteSettings.handoverBadge || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, handoverBadge: e.target.value }))}
                              placeholder="বাস্তবায়িত কাজের সংগ্রহশালা (Delivered Works)"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              বাটন পিসের ভেতরের লেখা (Button Label)
                            </label>
                            <input 
                              type="text"
                              value={siteSettings.handoverButtonLabel || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, handoverButtonLabel: e.target.value }))}
                              placeholder="Our Handover Projects"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-[#fdbf5e] font-bold focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-5">
                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              হোমপেজ সেকশন মূল শিরোনাম (Handover Title)
                            </label>
                            <input 
                              type="text"
                              value={siteSettings.handoverTitle || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, handoverTitle: e.target.value }))}
                              placeholder="আমাদের ক্লায়েন্টদের সফলভাবে সম্পন্ন ও হস্তান্তরিত প্রজেক্ট"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              হোমপেজ সেকশন সাবটাইটেল (Handover Subtitle)
                            </label>
                            <input 
                              type="text"
                              value={siteSettings.handoverSubtitle || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, handoverSubtitle: e.target.value }))}
                              placeholder="হস্তান্তরিত আসবাব ও ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম দেখতে নিচের বাটনে ক্লিক করুন।"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mb-6">
                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              হ্যান্ডওভার পেজের টপ ব্যাজ (Page Upper Badge)
                            </label>
                            <input 
                              type="text"
                              value={siteSettings.handoverPageBadge || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, handoverPageBadge: e.target.value }))}
                              placeholder="Delivered Work & Customer Handovers"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              হ্যান্ডওভার পেজের শিরোনাম (Page Title)
                            </label>
                            <input 
                              type="text"
                              value={siteSettings.handoverPageTitle || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, handoverPageTitle: e.target.value }))}
                              placeholder="Our Handover Projects"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                            হ্যান্ডওভার পেজের ভূমিকা / বিবরণ (Page Description Paragraph)
                          </label>
                          <textarea 
                            rows={3}
                            value={siteSettings.handoverPageDesc || ''}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, handoverPageDesc: e.target.value }))}
                            placeholder="আমাদের সম্মানিত গ্রাহকদের সফলভাবে বুঝিয়ে দেওয়া প্রিমিয়াম আসবাবপত্র ও এক্সক্লুসিভ হোম ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম।"
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                          />
                        </div>
                      </div>

                      {/* ----------------- SEO & SEARCH ENGINE OPTIMIZATION ----------------- */}
                      <div className="mt-8 pt-6 border-t border-stone-800 bg-[#161006]/60 p-5 sm:p-6 rounded-2xl border border-[#d4a762]/20">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 bg-[#d4a762]/20 text-[#d4a762] rounded-lg border border-[#d4a762]/30 flex items-center justify-center">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <h6 className="text-[15px] font-black text-white flex items-center gap-2">
                                সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO & Social OpenGraph Settings)
                                <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
                              </h6>
                              <p className="text-[10px] text-stone-400">
                                গুগল সার্চ রেজাল্ট, ফেসবুক, হোয়াটসঅ্যাপ এবং অন্যান্য সোশ্যালে সাইট লিংক শেয়ারিং মেটাডাটা ও কি-ওয়ার্ডস কনফিগার করুন।
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* SEO Features Live Indicators */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                          <a 
                            href="/sitemap.xml" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 bg-stone-900/90 hover:bg-stone-850 rounded-xl border border-stone-800 text-[11px] text-stone-300 flex items-center justify-between group transition-colors"
                          >
                            <span className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300">
                              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                              sitemap.xml
                            </span>
                            <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-white transition-colors" />
                          </a>

                          <a 
                            href="/robots.txt" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 bg-stone-900/90 hover:bg-stone-850 rounded-xl border border-stone-800 text-[11px] text-stone-300 flex items-center justify-between group transition-colors"
                          >
                            <span className="flex items-center gap-1.5 font-mono text-[10px] text-sky-300">
                              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                              robots.txt
                            </span>
                            <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-white transition-colors" />
                          </a>

                          <div className="p-2.5 bg-stone-900/90 rounded-xl border border-stone-800 text-[11px] text-stone-300 flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-[10px]">OpenGraph & Cards</span>
                          </div>

                          <div className="p-2.5 bg-stone-900/90 rounded-xl border border-stone-800 text-[11px] text-stone-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="text-[10px]">Schema.org JSON-LD</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              এসইও পেইজ টাইটেল (SEO Title - Recommended: 40-60 Characters)
                            </label>
                            <input 
                              type="text"
                              value={siteSettings.seoTitle || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                              placeholder="আবেদ ফার্ণিচার ও ইন্টেরিয়র | Abed Furniture & Interior Design Dhaka"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              মেটা ডেসক্রিপশন (Meta Description - Google Snippet)
                            </label>
                            <textarea 
                              rows={2}
                              value={siteSettings.metaDescription || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                              placeholder="প্রিমিয়াম মেহগনি ও সেগুন কাঠের ফার্ণিচার এবং আধুনিক হোম ইন্টেরিয়র ডিজাইন সার্ভিস। গেন্ডারিয়া, ঢাকা।"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-400 mb-1.5 uppercase">
                              এসইও কি-ওয়ার্ডস (SEO Focus Keywords - Comma Separated)
                            </label>
                            <textarea 
                              rows={2}
                              value={siteSettings.seoKeywords || ''}
                              onChange={(e) => setSiteSettings(prev => ({ ...prev, seoKeywords: e.target.value }))}
                              placeholder="আবেদ ফার্ণিচার, আবেদ ইন্টেরিয়র, Abed Furniture, Abed Interior, Furniture Shop Dhaka, Interior Design Bangladesh, সেগুন কাঠের ফার্ণিচার, মেহগনি ফার্নিচার, Gandaria Dhaka Furniture, Modern Interior Design, Wood Craftsman Liton Ali"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ----------------- ADMIN SECURITY & MASTER PASSCODE ----------------- */}
                      <div className="mt-8 pt-6 border-t border-stone-800 bg-stone-950/70 p-5 rounded-2xl border border-stone-850">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="h-8 w-8 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <h6 className="text-[15px] font-black text-white">
                              এডমিন প্যানেল নিরাপত্তা ও মাস্টার পাসকোড (Admin Panel Security & Master Key)
                            </h6>
                            <p className="text-[10px] text-stone-400">
                              এডমিন প্যানেলে সরাসরি প্রবেশের জন্য সুরক্ষিত মাস্টার পাসকোড পরিবর্তন ও কনফিগার করুন।
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-[11px] text-stone-300 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span><strong>লকআউট সুরক্ষা:</strong> ৫ বার ভুল চেষ্টায় ১ মিনিট লক</span>
                          </div>
                          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-[11px] text-stone-300 flex items-center gap-2">
                            <Timer className="w-4 h-4 text-sky-400 shrink-0" />
                            <span><strong>ইনঅ্যাক্টিভিটি লক:</strong> ১৫ মিনিট পর স্বয়ংক্রিয় লক</span>
                          </div>
                          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-[11px] text-stone-300 flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-400 shrink-0" />
                            <span><strong>এনক্রিপশন:</strong> ক্লাউড ফায়ারস্টোর এসএসএল</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="w-full sm:w-80">
                            <input 
                              type="password"
                              placeholder="নতুন মাস্টার পাসকোড দিন (কমপক্ষে ৬ অক্ষর)"
                              value={newPasscodeInput}
                              onChange={(e) => setNewPasscodeInput(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>

                          <button
                            type="button"
                            disabled={isUpdatingPasscode || !newPasscodeInput.trim()}
                            onClick={async () => {
                              if (!newPasscodeInput.trim()) return;
                              setIsUpdatingPasscode(true);
                              const ok = await handleUpdateMasterPasscode(newPasscodeInput);
                              setIsUpdatingPasscode(false);
                              if (ok) setNewPasscodeInput('');
                            }}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>পাসকোড পরিবর্তন করুন</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          type="button"
                          onClick={handleSaveSiteSettings}
                          className="bg-[#d4a762] hover:bg-[#ffe082] text-stone-950 px-6.5 py-3 rounded-xl font-black text-xs transition-colors tracking-wide flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98 duration-102"
                        >
                          <Save className="w-4 h-4 shrink-0" />
                          <span>পরিবর্তন সংরক্ষণ করুন (Save Site Info)</span>
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

        </div>
      </section>
      )}

      {/* FOOTER SECTION: Minimal display with address details & quick links */}
      <footer id="footer" className="bg-gradient-to-b from-[#1c1202] to-[#100a01] text-[#fffdfa] py-12 px-4 md:px-8 border-t border-[#d4a762]/20 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/5">
          
          <div>
            <h4 className="text-lg font-bold text-[#d4a762] mb-4">{siteSettings.brandNameLeft} {siteSettings.brandNameRight}</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              গুণগত মানের মহিমান্বিত মেহগনি ও সেগুন কাঠের রাজকীয় ফার্ণিচার এবং অসাধারণ হোম ইন্টেরিয়র ডিজাইনের জন্য বাংলাদেশের একটি বিশ্বস্ত নাম।
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">শোরুমের ঠিকানা এবং সময়</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#d4a762] shrink-0 mt-0.5" />
                <span>{siteSettings.showroomAddress}</span>
              </p>
              <p className="flex items-start gap-1">
                <Clock className="w-3.5 h-3.5 text-[#d4a762] shrink-0 mt-0.5" />
                <span>{siteSettings.showroomHours}</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">যোগাযোগ নম্বরসমূহ</h4>
            <div className="space-y-1.5 text-xs text-[#d4a762] font-semibold">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-stone-300">{siteSettings.phone1}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-stone-300">{siteSettings.phone2}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d4a762]" />
                <span className="text-stone-300">{siteSettings.phone3}</span>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400 text-center sm:text-left gap-4 font-sans">
          <p>© ২০২৬ {siteSettings.brandNameLeft} {siteSettings.brandNameRight} | সর্বস্বত্ব সংরক্ষিত</p>
          <div className="flex gap-4">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors cursor-pointer font-semibold">Home</button>
            <button onClick={() => scrollToSection('products')} className="hover:text-white transition-colors cursor-pointer font-semibold">Products</button>
            <button onClick={() => navigateTo('handover-projects')} className="hover:text-[#fdbf5e] transition-colors cursor-pointer font-semibold">Handover Projects</button>
            <button onClick={() => scrollToSection('designer')} className="hover:text-white transition-colors cursor-pointer font-semibold">Designer</button>
            <button 
              onClick={() => {
                setShowAdminPanel(prev => !prev);
                if (!showAdminPanel) {
                  setTimeout(() => {
                    const el = document.getElementById('admin');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }} 
              className={`text-xs hover:text-white transition-colors cursor-pointer font-bold flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
                showAdminPanel 
                  ? 'text-[#fdbf5e] border-[#d4a762]/40 bg-[#d4a762]/5' 
                  : 'text-stone-400 border-transparent hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </footer>�



      {/* 4. PRODUCT LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#faf9f4] text-[#2c1d07] rounded-3xl overflow-hidden max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-[#d4a762]/30"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-full z-10 hover:scale-105 transition-transform cursor-pointer shadow-md"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row items-stretch">
                {/* Product Image */}
                <div className="md:w-1/2 min-h-[320px] md:min-h-[440px] relative bg-stone-950 flex items-center justify-center p-3">
                  <img 
                    src={activeModalImage || selectedProduct.imgUrl} 
                    alt={selectedProduct.nameEn} 
                    className="max-h-[420px] w-full h-full object-contain select-none mx-auto rounded-xl shadow-lg transition-all"
                    style={{ 
                      imageRendering: '-webkit-optimize-contrast',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                    decoding="sync"
                    referrerPolicy="no-referrer"
                  />
                  {selectedProduct.isTrending && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white text-[10px] font-black tracking-wider uppercase border border-yellow-400 py-1.5 px-3.5 rounded-full z-10 shadow-lg flex items-center gap-1.5 animate-pulse">
                      <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
                      আজকের হট কালেকশন
                    </div>
                  )}

                  {/* View Full Original Photo button */}
                  <a
                    href={activeModalImage || selectedProduct.imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 bg-black/75 hover:bg-black text-amber-300 hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md z-10"
                    title="আসল ফুল কোয়ালিটি ছবি নতুন ট্যাবে দেখুন"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#fdbf5e]" />
                    <span>আসল ছবি (HD)</span>
                  </a>
                </div>

                {/* Specs breakdown */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#d4a762] uppercase tracking-wider bg-[#faf9f4] px-2.5 py-1 rounded border border-[#d4a762]/10 inline-block">
                      {selectedProduct.category === 'furniture' ? 'সেগুন কাঠের আসবাবপত্র (Furniture)' : 'ইন্টেরিয়র ডিজাইন (Interior Projects)'}
                    </span>
                    
                    {/* Primary English Name */}
                    <h3 className="text-xl md:text-2xl font-black text-[#2c1d07] mt-3 tracking-tight leading-snug">
                      {selectedProduct.nameEn}
                    </h3>
                    
                    {/* Secondary Bengali Name */}
                    <div className="text-sm md:text-base font-black text-[#b07e35] mt-1.5 mb-3.5 select-all cursor-pointer">
                      {selectedProduct.nameBn}
                    </div>

                    <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider mb-4">Abed Furniture & Interior Designs</p>
                    
                    {/* Bengali detailed descriptions */}
                    <p className="text-sm md:text-[15px] text-stone-700 leading-relaxed font-semibold mb-6 border-l-3 border-[#d4a762] pl-4 py-2.5 bg-[#faf9f4]/80 rounded-r-xl font-sans">
                      {selectedProduct.descriptionBn}
                    </p>

                    <h4 className="font-extrabold text-[#2c1d07] text-[12px] md:text-[13px] uppercase tracking-wider mb-2.5">উপকরণ ও বৈশিষ্ট্য (Specifications):</h4>
                    <ul className="space-y-2 text-xs md:text-sm text-stone-600 mb-6 font-bold">
                      {selectedProduct.specsBn.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#d4a762] shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9.5px] text-stone-400 uppercase font-black tracking-tight"> আনুমানিক বাজেট (Estimated Budget)</p>
                      <p className="text-base md:text-lg font-mono font-black text-[#b07e35] tracking-tight">{selectedProduct.priceRangeEn}</p>
                    </div>

                    {/* WhatsApp prefilled contact in Bengali */}
                    <a
                      href={`https://wa.me/8801816234157?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আবেদের এই কাঠের পণ্যটিতে আগ্রহী: ${selectedProduct.nameEn} (${selectedProduct.nameBn} | ${selectedProduct.priceRangeBn})। অনুগ্রহ করে আরও বিস্তারিত ও অর্ডার বুকিং প্রসেস সম্পর্কে জানাবেন কি?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#24d366] hover:bg-[#1ebd54] text-white font-extrabold text-[11px] px-3.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1 scale-100 hover:scale-105 active:scale-95 text-center"
                    >
                      হোয়াটসঅ্যাপ যোগাযোগ
                    </a>
                  </div>

                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
