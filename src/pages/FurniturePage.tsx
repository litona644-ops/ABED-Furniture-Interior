import React, { useState, useMemo } from 'react';
import { 
  Sofa, 
  Bed, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Award, 
  Search, 
  Check, 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  Home, 
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  Hammer
} from 'lucide-react';
import { Product } from '../types';
import { RouteKey } from '../components/SiteHeader';
import { getProductMainImage, handleProductImageError } from '../lib/productImage';

interface FurniturePageProps {
  products: Product[];
  phone1?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  heroBadge?: string;
  onNavigate: (route: RouteKey) => void;
  onSelectProduct?: (product: Product) => void;
}

export const FurniturePage: React.FC<FurniturePageProps> = ({
  products,
  phone1 = '+8801816234157',
  pageTitle = 'চিটাগাং সেগুন ও মেহগনি কাঠের আসবাবপত্র সম্ভার',
  pageSubtitle = 'দক্ষ কারিগরের হাতে খোদাই করা রাজকীয় খাট, সোফা সেট, ডাইনিং টেবিল, আলমারি ও ড্রেসিং টেবিল। ১০০% সিজনড খাঁটি কাঠ, মসৃণ ডলফিন গ্লসি ল্যাকার ফিনিশ এবং আজীবন ঘুণের গ্যারান্টি।',
  heroBadge = '100% Solid Seasoned Timber Collection',
  onNavigate,
  onSelectProduct
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'low-high' | 'high-low'>('default');

  // Filter only furniture products or all timber collections
  const furnitureProducts = useMemo(() => {
    return products.filter(p => p.category === 'furniture');
  }, [products]);

  // Subcategory classification
  const filteredProducts = useMemo(() => {
    return furnitureProducts
      .filter((p) => {
        if (activeCategory === 'all') return true;
        if (activeCategory === 'bed') return p.id.includes('bed');
        if (activeCategory === 'sofa') return p.id.includes('sofa');
        if (activeCategory === 'dining') return p.id.includes('dining');
        if (activeCategory === 'wardrobe') return p.id.includes('almirah') || p.id.includes('wardrobe');
        if (activeCategory === 'dressing') return p.id.includes('dressing');
        if (activeCategory === 'table') return p.id.includes('table') || p.id.includes('chair');
        return true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.nameBn.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.descriptionBn.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return (a.minPrice || 0) - (b.minPrice || 0);
        if (sortBy === 'high-low') return (b.minPrice || 0) - (a.minPrice || 0);
        return 0;
      });
  }, [furnitureProducts, activeCategory, searchQuery, sortBy]);

  return (
    <div className="bg-[#faf9f4] text-stone-800 min-h-screen">
      
      {/* 1. Hero Showcase with H1 Heading */}
      <section className="bg-gradient-to-b from-[#180e01] via-[#2a1b05] to-[#180e01] text-white py-14 sm:py-20 px-4 md:px-8 relative overflow-hidden border-b border-[#d4a762]/25">
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#d4a762]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 text-xs text-[#d4a762] mb-4 font-mono">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }} 
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </a>
            <span>/</span>
            <span className="text-stone-300 font-semibold font-sans">ফার্নিচার ক্যাটালগ</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-[#d4a762]/20 border border-[#d4a762]/45 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#ffe699]" />
            <span className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit">
              {heroBadge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black font-serif tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-[#fff2d6] to-[#f4d193] bg-clip-text text-transparent">
              {pageTitle}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mt-4 font-medium leading-relaxed font-sans">
            {pageSubtitle}
          </p>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-8 text-left">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#fdbf5e] shrink-0" />
              <span className="text-xs font-bold text-stone-200">আজীবন ঘুণের গ্যারান্টি</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2.5">
              <Award className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-stone-200">১০০% খাঁটি সিজনড কাঠ</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2.5">
              <Hammer className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs font-bold text-stone-200">সম্পূর্ণ হাতে খোদাই কারুকাজ</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-sky-400 shrink-0" />
              <span className="text-xs font-bold text-stone-200">সারা দেশে ডেলিভারি সেবা</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Main Catalog: Filters & Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14">
        
        {/* Controls: Search, Category Chips, Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Subcategory Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'সকল আসবাব' },
              { id: 'bed', label: 'খাট (Beds)' },
              { id: 'sofa', label: 'সোফা সেট' },
              { id: 'dining', label: 'ডাইনিং টেবিল' },
              { id: 'wardrobe', label: 'আলমারি' },
              { id: 'dressing', label: 'ড্রেসিং টেবিল' },
              { id: 'table', label: 'চেয়ার ও টেবিল' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-105'
                    : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="আসবাব অনুসন্ধান করুন..."
                className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#d4a762]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="default">ডিফল্ট ক্রমানুসারে</option>
              <option value="low-high">মূল্য: কম থেকে বেশি</option>
              <option value="high-low">মূল্য: বেশি থেকে কম</option>
            </select>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto">
            <p className="text-sm font-bold text-stone-600">কোনো ফার্নিচার পাওয়া যায়নি।</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs text-[#d4a762] hover:underline font-bold"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectProduct && onSelectProduct(item)}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-[#d4a762]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Image Container with overlay - Beautifully adjusted */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={getProductMainImage(item)}
                      alt={item.nameBn}
                      loading="lazy"
                      onError={(e) => handleProductImageError(e)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#fdbf5e] px-2.5 py-1 rounded-full border border-[#d4a762]/30">
                        {item.nameEn.split(' ')[0]}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors" title="বিস্তারিত তথ্য দেখুন">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#2c1d07] font-serif group-hover:text-[#b07e35] transition-colors">
                        {item.nameBn}
                      </h2>
                      <p className="text-xs text-stone-500 font-medium font-sans">
                        {item.nameEn}
                      </p>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {item.descriptionBn}
                    </p>

                    {/* Specifications List */}
                    <ul className="space-y-1.5 pt-1 text-[11px] text-stone-600 font-medium">
                      {item.specsBn.slice(0, 3).map((spec, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer: Price & CTA */}
                <div className="p-5 sm:p-6 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">
                      আনুমানিক মূল্য
                    </span>
                    <span className="text-sm font-black font-mono text-[#b07e35]">
                      {item.priceRangeBn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProduct) onSelectProduct(item);
                      }}
                      className="text-xs font-bold text-[#b07e35] hover:text-[#8f6424] px-2.5 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      বিস্তারিত তথ্য →
                    </button>
                    <a
                      href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি এই আসবাবটিতে আগ্রহী: ${item.nameBn} (${item.priceRangeBn})। অনুগ্রহ করে বিস্তারিত জানাবেন।`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 3. Cross Navigation: Custom Order Callout */}
        <section className="mt-16 bg-gradient-to-r from-[#2c1d07] via-[#3d2708] to-[#2c1d07] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4a762]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit">
              Bespoke Custom Furniture Service
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mt-2 font-serif">
              পছন্দসই মাপে কাস্টমাইজড ফার্নিচার বানাতে চান?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              আপনার ঘরের মাপ অনুযায়ী নিজস্ব পছন্দের সেগুন কাঠের ড্রয়িংয়ে নিখুঁত ফার্নিচার তৈরি করে থাকি। সরাসরি আমাদের অভিজ্ঞ কারিগরের সাথে কথা বলুন।
            </p>

            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <a
                href="/custom-furniture"
                onClick={(e) => { e.preventDefault(); onNavigate('custom-furniture'); }}
                className="bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>কাস্টম ফার্নিচার অপশন দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/contact"
                onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                শোরুমের ঠিকানা ও যোগাযোগ
              </a>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};
