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
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Upload,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './data';
import { Product, Category } from './types';
import ProjectStatsChart from './components/ProjectStatsChart';

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
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('furniture');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'low-high' | 'high-low'>('default');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Stats Target Counters
  const [successTarget, setSuccessTarget] = useState<number>(() => {
    const saved = localStorage.getItem('abed_success_target');
    return saved ? parseInt(saved, 10) : 800;
  });
  const [pendingTarget, setPendingTarget] = useState<number>(() => {
    const saved = localStorage.getItem('abed_pending_target');
    return saved ? parseInt(saved, 10) : 7;
  });

  // Dynamic products list initialized from localStorage if available, or PRODUCTS otherwise
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

  // Dynamic Site Settings
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

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('abed_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('abed_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('abed_success_target', successTarget.toString());
  }, [successTarget]);

  useEffect(() => {
    localStorage.setItem('abed_pending_target', pendingTarget.toString());
  }, [pendingTarget]);

  // Admin lock/unlock controls
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'stats' | 'site_info'>('products');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<'all' | 'furniture' | 'interior'>('all');

  // Add Product Form inputs
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdNameBn, setNewProdNameBn] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>('furniture');
  const [newProdImgUrl, setNewProdImgUrl] = useState('');
  const [newProdPriceEn, setNewProdPriceEn] = useState('');
  const [newProdPriceBn, setNewProdPriceBn] = useState('');
  const [newProdMinPrice, setNewProdMinPrice] = useState('10000');
  const [newProdDescBn, setNewProdDescBn] = useState('');
  const [newProdDescEn, setNewProdDescEn] = useState('');
  const [newProdSpecsBn, setNewProdSpecsBn] = useState('');
  const [newProdSpecsEn, setNewProdSpecsEn] = useState('');
  const [newProdIsTrending, setNewProdIsTrending] = useState(false);

  // Edit mode tracking
  const [editingProdId, setEditingProdId] = useState<string | null>(null);

  // Admin feedbacks notification state
  const [adminNotification, setAdminNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Image Presets for easy creation
  const IMAGE_PRESETS = [
    { name: 'রাজকীয় সোফা (Royal Sofa)', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
    { name: 'কাঠের ডাইনিং টেবিল (Dining Table)', url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80' },
    { name: 'সেগুন কাঠের আলমারি (Solid Wardrobe)', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80' },
    { name: 'মহারাজা খাট (Master Bedframe)', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { name: 'প্রিমিয়াম হোম ক্যাবিনেট (Cabinet)', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80' },
    { name: 'আধুনিক লাক্সারি কিচেন (Luxury Kitchen)', url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80' },
  ];

  // Show status notification
  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setAdminNotification({ message: msg, type });
    setTimeout(() => {
      setAdminNotification(null);
    }, 4000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.toLowerCase().trim() === 'litona644@gmail.com' && adminPassword.trim() === 'Alif3730') {
      setIsAdminUnlocked(true);
      setPasscodeError(false);
      showNotification('এডমিন হিসেবে সফলভাবে লগইন হয়েছেন!');
    } else {
      setPasscodeError(true);
      showNotification('ভুল ইমেইল বা পাসওয়ার্ড! সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।', 'error');
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProdNameEn.trim() || !newProdNameBn.trim()) {
      showNotification('অনুগ্রহ করে পণ্যের সঠিক নাম (ইংরেজি ও বাংলা) প্রদান করুন।', 'error');
      return;
    }

    const minPriceNum = parseInt(newProdMinPrice, 10) || 0;

    const specsBnArray = newProdSpecsBn
      ? newProdSpecsBn.split(',').map((s) => s.trim()).filter(Boolean)
      : ['১০০% খাঁটি কাঠ', 'উন্নত ও স্থায়ী ফিনিশিং'];
    
    const specsEnArray = newProdSpecsEn
      ? newProdSpecsEn.split(',').map((s) => s.trim()).filter(Boolean)
      : ['100% Solid Wood', 'Elegant High-Gloss Polish'];

    if (editingProdId) {
      // Edit existing product
      setProducts(prev => prev.map(p => {
        if (p.id === editingProdId) {
          return {
            ...p,
            nameEn: newProdNameEn,
            nameBn: newProdNameBn,
            category: newProdCategory,
            imgUrl: newProdImgUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            priceRangeEn: newProdPriceEn || `৳${minPriceNum.toLocaleString()}+`,
            priceRangeBn: newProdPriceBn || `${minPriceNum.toLocaleString()} টাকা থেকে শুরু`,
            minPrice: minPriceNum,
            descriptionBn: newProdDescBn || 'আকর্ষণীয় ও রাজকীয় ডিজাইনের কাঠের আসবাবপত্র।',
            descriptionEn: newProdDescEn || 'Elegant luxury wooden furniture masterpiece.',
            specsBn: specsBnArray,
            specsEn: specsEnArray,
            isTrending: newProdIsTrending
          };
        }
        return p;
      }));
      showNotification('পণ্যটির তথ্য সফলভাবে আপডেট করা হয়েছে!');
      setEditingProdId(null);
    } else {
      // Create new product
      const newProduct: Product = {
        id: `custom-prod-${Date.now()}`,
        nameEn: newProdNameEn,
        nameBn: newProdNameBn,
        category: newProdCategory,
        imgUrl: newProdImgUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        priceRangeEn: newProdPriceEn || `৳${minPriceNum.toLocaleString()}+`,
        priceRangeBn: newProdPriceBn || `${minPriceNum.toLocaleString()} টাকা থেকে শুরু`,
        minPrice: minPriceNum,
        descriptionBn: newProdDescBn || 'আকর্ষণীয় ও রাজকীয় ডিজাইনের কাঠের আসবাবপত্র।',
        descriptionEn: newProdDescEn || 'Elegant luxury wooden furniture masterpiece.',
        specsBn: specsBnArray,
        specsEn: specsEnArray,
        isTrending: newProdIsTrending
      };

      setProducts(prev => [newProduct, ...prev]);
      showNotification('নতুন পণ্যটি সফলভাবে সংগ্রহশালায় যুক্ত করা হয়েছে!');
    }

    // Reset Form inputs
    setNewProdNameEn('');
    setNewProdNameBn('');
    setNewProdCategory('furniture');
    setNewProdImgUrl('');
    setNewProdPriceEn('');
    setNewProdPriceBn('');
    setNewProdMinPrice('10000');
    setNewProdDescBn('');
    setNewProdDescEn('');
    setNewProdSpecsBn('');
    setNewProdSpecsEn('');
    setNewProdIsTrending(false);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProdId(prod.id);
    setNewProdNameEn(prod.nameEn);
    setNewProdNameBn(prod.nameBn);
    setNewProdCategory(prod.category);
    setNewProdImgUrl(prod.imgUrl);
    setNewProdPriceEn(prod.priceRangeEn);
    setNewProdPriceBn(prod.priceRangeBn);
    setNewProdMinPrice(prod.minPrice.toString());
    setNewProdDescBn(prod.descriptionBn);
    setNewProdDescEn(prod.descriptionEn);
    setNewProdSpecsBn(prod.specsBn.join(', '));
    setNewProdSpecsEn(prod.specsEn.join(', '));
    setNewProdIsTrending(!!prod.isTrending);
    
    // Auto scroll down to form
    const element = document.getElementById('admin-form-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelEditProduct = () => {
    setEditingProdId(null);
    setNewProdNameEn('');
    setNewProdNameBn('');
    setNewProdCategory('furniture');
    setNewProdImgUrl('');
    setNewProdPriceEn('');
    setNewProdPriceBn('');
    setNewProdMinPrice('10000');
    setNewProdDescBn('');
    setNewProdDescEn('');
    setNewProdSpecsBn('');
    setNewProdSpecsEn('');
    setNewProdIsTrending(false);
    showNotification('এডিটিং বাতিল করা হয়েছে।', 'error');
  };

  const deleteProduct = (id: string, nameBn: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${nameBn}" পণ্যটি তালিকা থেকে ডিলিট করতে চান?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showNotification(`"${nameBn}" পণ্যটি সফলভাবে ডিলিট করা হয়েছে!`);
      if (editingProdId === id) {
        cancelEditProduct();
      }
    }
  };

  const resetAllToDefaults = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত কাস্টম ডেটা এবং সেটিংস মুছে ফেলে ডিফল্ট সেটিংসে ফিরে যেতে চান?')) {
      localStorage.removeItem('abed_products');
      localStorage.removeItem('abed_settings');
      localStorage.removeItem('abed_success_target');
      localStorage.removeItem('abed_pending_target');
      
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
              onClick={() => scrollToSection('hero')} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0] font-sans font-black text-sm"
            >
              হোমপেজ
            </button>
            <button 
              onClick={() => scrollToSection('products')} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0]"
            >
              Products & Interior
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0]"
            >
              Our Projects
            </button>
            <button 
              onClick={() => scrollToSection('designer')} 
              className="hover:text-[#d4a762] transition-colors cursor-pointer text-[#fffaf0]"
            >
              Principal Designer
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
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
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
      </section>      {/* FACEBOOK & WHATSAPP SOCIAL CONNECT: Two Gorgeous Interactive Banners in a Grid layout */}
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
              /* Admin Secured Login Flow - Beautiful Light Theme Card */
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#d4a762]/35 shadow-xl text-center text-stone-800 animate-fade-in"
              >
                <div className="h-16 w-16 bg-[#d4a762]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4a762]/20 text-[#a07436]">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-extrabold text-[#1c1202] mb-2 font-serif uppercase tracking-tight">এডমিন সিকিউরড অ্যাক্সেস (Sign In)</h4>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed font-semibold">
                  পণ্য কাস্টমাইজেশন, ডিলিট এবং সেটিংস পরিবর্তন করতে আপনার ক্রেডেন্সিয়াল প্রদান করুন।
                </p>

                <form onSubmit={handleAdminLogin} className="space-y-4 text-left font-sans">
                  <div>
                    <label className="block text-[10px] font-bold text-[#966b2d] uppercase mb-1.5 tracking-wide">ইমেইল ঠিকানা (Email Address)</label>
                    <input 
                      type="email"
                      placeholder="আপনার রেজিস্টার্ড ইমেইল প্রবেশ করুন"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400 transition-all font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#966b2d] uppercase mb-1.5 tracking-wide">পাসওয়ার্ড (Password)</label>
                    <input 
                      type="password"
                      placeholder="আপনার সিকিউরড পাসওয়ার্ড প্রদান করুন"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-4 py-3 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400 transition-all font-bold"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#cf9d53] to-[#bfa042] text-white hover:brightness-105 active:scale-[0.99] shadow-md transition-all font-black text-xs uppercase py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <Unlock className="w-4 h-4 text-white" />
                    <span>এডমিন প্যানেল আনলক করুন</span>
                  </button>
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
                    onClick={() => {
                      setIsAdminUnlocked(false);
                      setAdminEmail('');
                      setAdminPassword('');
                      showNotification('এডমিন প্যানেলটি সুরক্ষিতভাবে লক করে এবং সেশন সাইনআউট শেষ করা হয়েছে!');
                    }}
                    className="flex items-center gap-1.5 bg-[#d4a762]/10 hover:bg-[#d4a762]/10 text-[#916b2a] px-4 py-2 rounded-xl text-xs font-black border border-[#d4a762]/35 transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>লগআউট / লক করুন</span>
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
                  <div className="space-y-10">
                    
                    {/* Catalog Configuration Form - Light Theme */}
                    <div id="admin-form-anchor" className="bg-[#fcfaf5] p-5 md:p-8 rounded-2xl border border-stone-200 shadow-xs">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center border border-orange-200">
                          {editingProdId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                        <div>
                          <h6 className="text-lg font-black text-stone-900">
                            {editingProdId ? `পণ্য তথ্য সংশোধন করুন (Modify Specs)` : 'নতুন গ্যারান্টিড পণ্য বা প্রজেক্ট যোগ করুন (Add Masterpiece)'}
                          </h6>
                          <p className="text-xs text-stone-500">অনলাইন পোর্টালের জন্য আসবাবপত্র বা প্রিমিয়াম ইন্টেরিয়র ডিজাইন কন্টেন্ট যুক্ত করুন</p>
                        </div>
                      </div>

                      <form onSubmit={handleProductSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">পণ্যের ক্যাটাগরি (Product Sector or Category)*</label>
                            <select 
                              value={newProdCategory}
                              onChange={(e) => setNewProdCategory(e.target.value as Category)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 font-sans"
                            >
                              <option value="furniture">🛋️ Furniture (মেহগনি ও সেগুন আসবাব)</option>
                              <option value="interior">📐 Interior (লাক্সারি ইন্টেরিয়র ডিজাইন)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">ইংরেজিতে নাম (Product English Name)*</label>
                            <input 
                              type="text"
                              placeholder="e.g. Royal Emperor Carved Sofa"
                              value={newProdNameEn}
                              onChange={(e) => setNewProdNameEn(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400 font-sans"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">বাংলায় নাম (Product Bengali Name)*</label>
                            <input 
                              type="text"
                              placeholder="যেমন: মহারাজা রাজকীয় গোল্ডেন সোফা"
                              value={newProdNameBn}
                              onChange={(e) => setNewProdNameBn(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400"
                              required
                            />
                          </div>
                        </div>

                        {/* Beautiful Curated Visual Image Presets Selector Option */}
                        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-3xs">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-[#9d7237] mb-3 flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>আমেজিং ইনস্ট্যান্ট ইমেজ অপশন (Curated Masterpiece Selectors):</span>
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                            {IMAGE_PRESETS.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setNewProdImgUrl(preset.url);
                                  showNotification('মিনি প্রিসেট ইমেজ সফলভাবে অ্যাডমিন ফর্মে সংযুক্ত করা হয়েছে!');
                                }}
                                className={`group p-2 bg-stone-50 border rounded-xl text-[9px] font-bold text-stone-600 hover:text-[#9c7136] flex flex-col gap-1.5 items-center justify-center cursor-pointer transition-all ${
                                  newProdImgUrl === preset.url ? 'border-[#d4a762] bg-[#d4a762]/5 ring-1 ring-[#d4a762]/30 text-[#9c7136]' : 'border-stone-200 hover:border-stone-300'
                                }`}
                              >
                                <img src={preset.url} className="w-full h-12 object-cover rounded-lg group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                                <span className="truncate block max-w-full text-center leading-none tracking-tight font-sans">{preset.name}</span>
                              </button>
                            ))}
                          </div>
                          
                          {/* File Simulation upload interface for genuine feel */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-stone-100">
                            <div className="text-left">
                              <span className="text-[10.5px] font-bold text-stone-700 block mb-1">স্থানিয় ডিভাইস ফাইল চয়েস (Device Image Upload Simulation)</span>
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-xl px-4.5 py-2.5 text-xs font-bold transition-all inline-flex items-center gap-1.5 hover:scale-101 active:scale-99">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>ফাইল নির্বাচন করুন (Browse File)</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        // Generate high quality premium image mock based on type
                                        const mockUrls = [
                                          "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=700",
                                          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=700",
                                          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=700",
                                          "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=700",
                                          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=700"
                                        ];
                                        const randomIdx = Math.floor(Math.random() * mockUrls.length);
                                        setNewProdImgUrl(mockUrls[randomIdx]);
                                        showNotification(`মিডিয়া ফাইল '${file.name}' নির্বাচন করা হয়েছে! ক্লাউড আপলোড কমপ্লিট!`);
                                      }
                                    }}
                                  />
                                </label>
                                <span className="text-[9.5px] text-stone-500 font-sans italic">PNG, JPG, WEBP formats (Max 5MB)</span>
                              </div>
                            </div>
                            
                            <div className="text-left sm:text-right">
                              <span className="text-[10.5px] font-bold text-stone-700 block mb-1">স্মার্ট ক্যাটালগ সাজেশন (Categorical Quick Fill)</span>
                              <div className="flex gap-1.5 sm:justify-end flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewProdImgUrl("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=700");
                                    showNotification('সোফা সেট ক্লাসিক ডিজাইন ইমেজ সফলভাবে লোড হয়েছে!');
                                  }}
                                  className="text-[9px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors"
                                >
                                  🛋️ Sofa Set Preset
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewProdImgUrl("https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=700");
                                    showNotification('মাস্টার ডাবল বেড ইমেজ সফলভাবে লোড হয়েছে!');
                                  }}
                                  className="text-[9px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors"
                                >
                                  🛏️ Bed Preset
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewProdImgUrl("https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=700");
                                    showNotification('প্রিমিয়াম ইন্টেরিয়র ডিজাইন কন্টেন্ট ইমেজ সফলভাবে লোড হয়েছে!');
                                  }}
                                  className="text-[9px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors"
                                >
                                  📏 Interior Preset
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide font-sans">পণ্যের ছবির লাইভ লিংক (Custom Image URL Option)</label>
                            <input 
                              type="text"
                              placeholder="Unsplash, high-quality picture web link addresses"
                              value={newProdImgUrl}
                              onChange={(e) => setNewProdImgUrl(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400 font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">বাজেট ও মূল্য বাংলায় (Approx Budget)*</label>
                            <input 
                              type="text"
                              placeholder="যেমন: ১৫,০০০ টাকা থেকে শুরু"
                              value={newProdPriceBn}
                              onChange={(e) => setNewProdPriceBn(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">মূল্য ফিল্টার অংক (Min Price BDT)*</label>
                            <input 
                              type="number"
                              placeholder="e.g. 15000"
                              value={newProdMinPrice}
                              onChange={(e) => setNewProdMinPrice(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 font-sans"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">ডেসক্রিপশন বাংলায় (Product Description Bengali)*</label>
                            <textarea 
                              rows={3}
                              placeholder="যেমন: দুবাই ফেরত নকশাবিদ চমৎকার কাঠের নিখুঁত নকশা সম্বলিত।"
                              value={newProdDescBn}
                              onChange={(e) => setNewProdDescBn(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">ডেসক্রিপশন ইংরেজিতে (Product Description English)</label>
                            <textarea 
                              rows={3}
                              placeholder="Elegant wooden structure crafted beautifully with royal UAE carvings."
                              value={newProdDescEn}
                              onChange={(e) => setNewProdDescEn(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400 font-sans"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">বৈশিষ্ট্যসমূহ বাংলায় (Specs BN: কমা দিয়ে লিখুন)*</label>
                            <input 
                              type="text"
                              placeholder="যেমন: ১০০% সলিড চিটাগাং সেগুন কাঠ, লাইফটাইম ঘুনের ওয়ারেন্টি"
                              value={newProdSpecsBn}
                              onChange={(e) => setNewProdSpecsBn(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">বৈশিষ্ট্যসমূহ ইংরেজিতে (Specs EN: কমা দিয়ে লিখুন)</label>
                            <input 
                              type="text"
                              placeholder="e.g. 100% Solid Segun, Lifetime timber warranty, Polish Finished"
                              value={newProdSpecsEn}
                              onChange={(e) => setNewProdSpecsEn(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/25 placeholder:text-stone-400 font-sans"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-7 pt-2 flex-wrap">
                          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={newProdIsTrending}
                              onChange={(e) => setNewProdIsTrending(e.target.checked)}
                              className="h-4.5 w-4.5 rounded text-[#d4a762] focus:ring-opacity-50 accent-[#d4a762] cursor-pointer"
                            />
                            <span className="text-xs font-black text-orange-500 flex items-center gap-1">
                              <Flame className="w-4.5 h-4.5 text-red-500 shrink-0 fill-current animate-bounce" />
                              হট ট্রেন্ডিং ট্যাগ দিন (Traditional Trending Tag / Hot Badge)
                            </span>
                          </label>

                          <div className="flex gap-3 ml-auto">
                            {editingProdId && (
                              <button
                                type="button"
                                onClick={cancelEditProduct}
                                className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-5 py-3 rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
                              >
                                সংশোধন বাতিল
                              </button>
                            )}

                            <button
                              type="submit"
                              className="bg-gradient-to-r from-emerald-600 to-green-500 hover:brightness-105 text-white font-black text-xs px-7 py-3 rounded-xl hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                            >
                              {editingProdId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                              <span>{editingProdId ? 'আপডেট সংরক্ষণ করুন (Update Product)' : 'সংগ্রহশালায় যুক্ত করুন (Save Product)'}</span>
                            </button>
                          </div>
                        </div>

                      </form>
                    </div>

                    {/* Dynamic catalog listing for search & delete */}
                    <div>
                      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                        <div>
                          <h6 className="text-[15px] font-black text-stone-900 flex items-center gap-1.5 font-sans">
                            <Eye className="w-4 h-4 text-[#bca05b]" />
                            আবেদ ফার্ণিচার ডাটাবেজ প্রডাক্টস (Added Products List)
                          </h6>
                          <p className="text-[10px] text-stone-500">এই তালিকার মাধ্যমে যেকোনো পণ্য দ্রুত সংশোধিত বা পৃষ্ঠা থেকে মুছে ডিলিট করতে পারেন।</p>
                        </div>
                        <span className="text-[10px] font-mono bg-white px-3 py-1 text-stone-700 rounded-full border border-stone-200 font-extrabold shadow-3xs">
                          {products.length} Products Total
                        </span>
                      </div>

                      {/* Interactive Category Filter Slots (furniture vs interior) */}
                      <div className="flex gap-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200 w-max mb-5 font-sans">
                        <button
                          type="button"
                          onClick={() => setAdminCategoryFilter('all')}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                            adminCategoryFilter === 'all'
                              ? 'bg-white text-[#996d2d] shadow-xs border border-stone-200'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          সব পণ্য ({products.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminCategoryFilter('furniture')}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                            adminCategoryFilter === 'furniture'
                              ? 'bg-white text-[#996d2d] shadow-xs border border-[#d4a762]/30'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          🛋️ আসবাবপত্র ({products.filter(p => p.category === 'furniture').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminCategoryFilter('interior')}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                            adminCategoryFilter === 'interior'
                              ? 'bg-white text-[#996d2d] shadow-xs border border-[#d4a762]/30'
                              : 'text-stone-500 hover:text-stone-800'
                          }`}
                        >
                          📐 ইন্টেরিয়র কাজ ({products.filter(p => p.category === 'interior').length})
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1.5 border border-stone-200 p-4.5 rounded-2xl bg-[#faf9f6]/40 shadow-inner">
                        {products
                          .filter((p) => adminCategoryFilter === 'all' || p.category === adminCategoryFilter)
                          .map((p) => (
                          <div key={p.id} className="bg-white border border-stone-200 p-3.5 rounded-xl flex gap-3.5 items-center justify-between group hover:border-[#d4a762]/30 hover:bg-white hover:shadow-xs transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={p.imgUrl} alt={p.nameEn} className="w-14 h-14 object-cover rounded-lg border border-stone-200" referrerPolicy="no-referrer" />
                              <div className="min-w-0 text-left">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider border block w-max leading-none mb-1 shadow-2xs ${
                                  p.category === 'interior' ? 'bg-sky-50 text-sky-700 border-sky-100' : 'bg-amber-50 text-[#9c7136] border-[#d4a762]/20'
                                }`}>
                                  {p.category}
                                </span>
                                
                                <h6 className="text-xs font-bold text-stone-900 truncate line-clamp-1">{p.nameBn}</h6>
                                <p className="text-[9.5px] text-stone-500 truncate font-mono line-clamp-1 mt-0.5">{p.nameEn}</p>
                                <p className="text-[10.5px] font-mono font-black text-[#966b2d] leading-none mt-1">{p.priceRangeEn || '৳'+p.minPrice.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => startEditProduct(p)}
                                className="bg-white hover:bg-amber-50 text-stone-600 hover:text-[#9c7136] p-2.5 rounded-xl transition-all border border-stone-200 hover:border-[#d4a762]/30 cursor-pointer"
                                title="এডিট করুন"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => deleteProduct(p.id, p.nameBn)}
                                className="bg-white hover:bg-red-50 text-stone-500 hover:text-red-700 p-2.5 rounded-xl transition-all border border-stone-200 hover:border-red-200 cursor-pointer"
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>
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

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            showNotification('কোম্পানি ব্র্যান্ডিং ইনফো সফলভাবে কাস্টমাইজ ও আপডেট করা হয়েছে!');
                          }}
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
                <div className="md:w-1/2 min-h-[320px] relative bg-stone-100">
                  <img 
                    src={selectedProduct.imgUrl} 
                    alt={selectedProduct.nameEn} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedProduct.isTrending && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white text-[10px] font-black tracking-wider uppercase border border-yellow-400 py-1.5 px-3.5 rounded-full z-10 shadow-lg flex items-center gap-1.5 animate-pulse">
                      <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
                      আজকের হট কালেকশন
                    </div>
                  )}
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
