import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Home, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Ruler, 
  Layers, 
  Lightbulb, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { RouteKey } from '../components/SiteHeader';
import { getProductMainImage, handleProductImageError } from '../lib/productImage';

interface InteriorDesignPageProps {
  products: Product[];
  phone1?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  heroBadge?: string;
  onNavigate: (route: RouteKey) => void;
  onSelectProduct?: (product: Product) => void;
}

export const InteriorDesignPage: React.FC<InteriorDesignPageProps> = ({
  products,
  phone1 = '+8801816234157',
  pageTitle = 'প্রিমিয়াম রেসিডেন্সিয়াল ও কমার্শিয়াল ইন্টেরিয়র সল্যুশন',
  pageSubtitle = 'দুবাইয়ের ৮ বছরের মেগা-প্রজেক্ট অভিজ্ঞতাসম্পন্ন প্রধান নকশাবিদ লিটন আলী সাহেবের সার্বিক তত্ত্বাবধানে আপনার ফ্ল্যাট, ডুপ্লেক্স বা অফিসের বিশ্বমানের ইন্টেরিয়র রূপান্তর।',
  heroBadge = 'Elite Interior Architecture & Woodworking',
  onNavigate,
  onSelectProduct
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'living' | 'kitchen' | 'bedroom'>('all');

  const interiorItems = products.filter(p => p.category === 'interior');

  const services = [
    {
      id: 'living',
      titleBn: 'ডুপ্লেক্স ও ড্রয়িংরুম উডেন প্যানেলিং',
      titleEn: 'Duplex & Living Room 3D Wood Wall Cladding',
      descBn: 'সেগুন কাঠের দৃষ্টিনন্দন থ্রিডি ওয়াল মোটিফ, ব্যাকবোর্ড এবং ইনডাইরেক্ট প্রোফাইল এলইডি লাইটিং যা আপনার ড্রয়িংরুমকে দেবে আধুনিক রাজপ্রাসাদের রূপ।',
      features: ['খাঁটি চিটাগাং সেগুন কাঠের ফ্রেম', 'অ্যাকোস্টিক সাউন্ডপ্রুফ সিলিং সাপোর্ট', 'কনসিলড ওয়ারিং ও স্মার্ট লাইটিং']
    },
    {
      id: 'kitchen',
      titleBn: 'মডুলার কিচেন ক্যাবিনেট সিস্টেম',
      titleEn: 'Modern Teak Modular Kitchen Cabinets',
      descBn: 'আর্দ্রতা ও বাষ্প নিরোধক হাই-কোয়ালিটি বোর্ড এবং সেগুন ভিনিয়ার ফিনিশ। হাইড্রোলিক সাইলেন্ট ট্র্যাক এবং সম্পূর্ণ স্টেইনলেস স্টিল ইউটিলিটি ফিটিংস।',
      features: ['১০০% পানি ও বাষ্প নিরোধক কোটিং', 'অটো-সাইলেন্ট হাইড্রোলিক স্লাইডার', 'চিমনি ও ওভেন স্পেস ইন্টিগ্রেশন']
    },
    {
      id: 'bedroom',
      titleBn: 'মাস্টার বেডরুম লাক্সারি অ্যাকসেন্ট ওয়াল',
      titleEn: 'Master Bedroom Sovereign Wall Art',
      descBn: 'বেডের পেছনের দেয়ালে রাজকীয় কাঠের খোদাই বর্ডার, ওয়ার্ম লাইট প্যানেল এবং টেক্সচার্ড মোটিফ যা তৈরি করে আরামদায়ক ফাইভ-স্টার রিসোর্টের পরিবেশ।',
      features: ['কাস্টম খোদাই কাঠের মুকুট মোটিফ', 'ওয়ার্ম অ্যাম্বিয়েন্ট ব্যাকলাইটিং', 'হিডেন ড্রয়ার ও সাইড টেবিল কনসোল']
    },
    {
      id: 'ceiling',
      titleBn: 'ফলস সিলিং ও আর্কিটেকচারাল লাইটিং',
      titleEn: 'Architectural False Ceilings & Lighting',
      descBn: 'জিপসাম ও কাঠের নিখুঁত সমন্বয়ে তৈরি ফলস সিলিং ডিজাইন যা রুমের সার্বিক তাপমাত্রা নিয়ন্ত্রণে সাহায্য করে এবং আলো সুন্দরভাবে ছড়িয়ে দেয়।',
      features: ['আধুনিক জ্যামিতিক উড স্ল্যাট ডিজাইন', 'ডিমার কন্ট্রোল প্রোফাইল লাইট', 'দীর্ঘস্থায়ী অ্যান্টি-ক্র্যাক ফর্মুলা']
    }
  ];

  const steps = [
    {
      num: '০১',
      title: 'ফ্রি সাইট ভিজিট ও মেজারমেন্ট',
      desc: 'আমাদের টিম আপনার বাসা বা ফ্ল্যাটে সরাসরি গিয়ে নিখুঁত পরিমাপ গ্রহণ করবে।'
    },
    {
      num: '০২',
      title: '২ডি / ৩ডি ডিজাইন পরিকল্পনা',
      desc: 'আপনার পছন্দ ও বাজেটের আলোকে বাস্তবসম্মত থ্রিডি মডেলিং পরামর্শ দেওয়া হয়।'
    },
    {
      num: '০৩',
      title: 'কাঠ ও উপাদান নির্বাচন',
      desc: '১০০% সিজনড সেগুন বা মেহগনি কাঠ ও প্রিমিয়াম ফিটিংস নিশ্চিত করা হয়।'
    },
    {
      num: '০৪',
      title: 'কারখানায় নিখুঁত নির্মাণ',
      desc: 'আমাদের গেন্ডারিয়া কারখানায় অভিজ্ঞ কারিগরদের তত্ত্বাবধানে নিখুঁতভাবে তৈরি হয়।'
    },
    {
      num: '০৫',
      title: 'অন-সাইট ইনস্টলেশন ও হ্যান্ডওভার',
      desc: 'নির্দিষ্ট সময়ে দক্ষ টেকনিশিয়ান দ্বারা কোনো ঝামেলা ছাড়াই সেটআপ সম্পন্ন করা হয়।'
    }
  ];

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
            <span className="text-stone-300 font-semibold font-sans">ইন্টেরিয়র ডিজাইন</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-[#d4a762]/20 border border-[#d4a762]/45 px-4 py-1.5 rounded-full mb-4">
            <Palette className="w-4 h-4 text-[#ffe699]" />
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

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <a
              href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আমার বাসা/ফ্ল্যাটের ইন্টেরিয়র ডিজাইনের ফ্রি সাইট ভিজিট ও পরামর্শ বুক করতে চাই।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm px-7 py-3.5 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ফ্রি সাইট ভিজিট ও কনসালটেশন বুক করুন</span>
            </a>

            <a
              href="/handover-projects"
              onClick={(e) => { e.preventDefault(); onNavigate('handover-projects'); }}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-colors cursor-pointer"
            >
              সম্পন্ন কাজের ভিডিও দেখুন
            </a>
          </div>

        </div>
      </section>

      {/* 2. Services Breakdown */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Core Services Grid */}
        <section>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
              Specialized Design Areas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2c1d07] mt-1 font-serif">
              আমাদের প্রধান ইন্টেরিয়র সেবাসমূহ
            </h2>
            <div className="w-16 h-1 bg-[#d4a762] mx-auto rounded-full mt-2.5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((svc) => (
              <div 
                key={svc.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-[#d4a762]/50 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#2c1d07] font-serif">
                      {svc.titleBn}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans mt-0.5">
                      {svc.titleEn}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#d4a762]/15 text-[#8f6424] flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 mt-4 leading-relaxed font-sans">
                  {svc.descBn}
                </p>

                <ul className="space-y-2 mt-5 text-xs text-stone-700 font-medium">
                  {svc.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Real Interior Projects from Data */}
        <section className="bg-stone-100/70 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-12 sm:py-16 rounded-3xl border border-stone-200/80">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
                Featured Interior Works
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2c1d07] mt-1 font-serif">
                বাস্তবায়িত ইন্টেরিয়র প্রজেক্ট প্যাকেজ
              </h2>
              <div className="w-16 h-1 bg-[#d4a762] mx-auto rounded-full mt-2.5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {interiorItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl hover:border-[#d4a762]/60 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      <img
                        src={getProductMainImage(item)}
                        alt={item.nameBn}
                        loading="lazy"
                        onError={(e) => handleProductImageError(e)}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-black/60 text-[#fdbf5e] px-2.5 py-1 rounded-full border border-[#d4a762]/30 backdrop-blur-md">
                        {item.nameEn.split(' ')[0]}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 space-y-2">
                      <h3 className="text-base font-bold text-[#2c1d07] font-serif group-hover:text-[#b07e35] transition-colors">
                        {item.nameBn}
                      </h3>
                      <p className="text-xs text-stone-500 font-sans">
                        {item.nameEn}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed pt-1">
                        {item.descriptionBn}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold block">বাজেট কাঠামো</span>
                      <span className="text-xs font-black font-mono text-[#b07e35]">{item.priceRangeBn}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectProduct) onSelectProduct(item);
                        }}
                        className="text-xs font-bold text-[#b07e35] hover:text-[#8f6424] px-2 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        বিস্তারিত →
                      </button>
                      <a
                        href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি এই ইন্টেরিয়র প্রজেক্টটি সম্পর্কে জানতে আগ্রহী: ${item.nameBn}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 px-3.5 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
                      >
                        ইনকোয়ারি
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5-Step Process */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
              Seamless Working Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2c1d07] mt-1 font-serif">
              আমাদের ৫-ধাপের কাজের প্রক্রিয়া
            </h2>
            <div className="w-16 h-1 bg-[#d4a762] mx-auto rounded-full mt-2.5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative text-left"
              >
                <span className="text-2xl font-black font-mono text-[#d4a762]/30 block mb-2">
                  {step.num}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#2c1d07] font-serif leading-snug">
                  {step.title}
                </h4>
                <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross Navigation Callout */}
        <section className="bg-gradient-to-r from-[#2c1d07] via-[#3d2708] to-[#2c1d07] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-black font-serif">
              অন্যান্য পেজ ও ক্যাটালগ দেখুন
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              ইন্টেরিয়রের সাথে মানানসই সেগুন কাঠের ডাইনিং, সোফা ও বেডরুম ফার্নিচার অথবা আমাদের সম্পন্ন হওয়া প্রজেক্টের ভিডিও অ্যালবাম দেখুন।
            </p>

            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <a
                href="/furniture"
                onClick={(e) => { e.preventDefault(); onNavigate('furniture'); }}
                className="bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <span>ফার্নিচার সম্ভার</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/handover-projects"
                onClick={(e) => { e.preventDefault(); onNavigate('handover-projects'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                হ্যান্ডওভার প্রজেক্ট ভিডিও
              </a>

              <a
                href="/contact"
                onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                যোগাযোগ ও শোরুম
              </a>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};
