import React, { useState } from 'react';
import { 
  Hammer, 
  Sparkles, 
  Home, 
  Ruler, 
  TreePine, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  FileCheck,
  Check,
  Upload,
  Layers,
  Send
} from 'lucide-react';
import { RouteKey } from '../components/SiteHeader';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface CustomFurniturePageProps {
  phone1?: string;
  onNavigate: (route: RouteKey) => void;
}

export const CustomFurniturePage: React.FC<CustomFurniturePageProps> = ({
  phone1 = '+8801816234157',
  onNavigate
}) => {
  const [furnitureType, setFurnitureType] = useState('খাট (Bed)');
  const [timberType, setTimberType] = useState('চিটাগাং সেগুন কাঠ (Chittagong Teak)');
  const [customDimensions, setCustomDimensions] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = Date.now();
    const requestId = `req_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const payload = {
      id: requestId,
      furnitureType,
      timberType,
      customDimensions: customDimensions.trim() || 'শোরুমের সাথে কথা বলে ঠিক করব',
      clientPhone: clientPhone.trim(),
      customNotes: customNotes.trim() || 'নাই',
      createdAt: new Date(now).toISOString(),
      timestamp: now,
      status: 'pending'
    };

    // 1. Persist to Firestore custom_furniture_requests (secure ABAC zero-trust rule)
    try {
      if (db) {
        await setDoc(doc(db, 'custom_furniture_requests', requestId), payload);
      }
    } catch (fbErr) {
      console.warn('Firestore custom request record note:', fbErr);
    }

    // 2. Submit to backend API / WhatsApp Cloud API proxy
    try {
      await fetch('/api/custom-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (apiErr) {
      console.warn('Backend custom request forward note:', apiErr);
    }

    // 3. Open WhatsApp Direct Chat with pre-filled details
    const textMsg = `আসসালামু আলাইকুম, আমি কাস্টম ফার্নিচারের অর্ডার সংক্রান্ত তথ্য দিতে চাচ্ছি:
আসবাবের ধরন: ${furnitureType}
কাঠের পছন্দ: ${timberType}
নির্দিষ্ট মাপ: ${customDimensions || 'শোরুমের সাথে কথা বলে ঠিক করব'}
ফোন নম্বর: ${clientPhone}
অতিরিক্ত নোট: ${customNotes || 'নাই'}`;

    window.open(`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(textMsg)}`, '_blank');
    setFormSubmitted(true);
    setIsSubmitting(false);
  };

  const timbers = [
    {
      nameBn: 'চিটাগাং সেগুন কাঠ',
      nameEn: 'Chittagong Teak Timber',
      rating: '★★★★★ (সর্বোচ্চ রেটিং)',
      badge: 'সবচেয়ে জনপ্রিয়',
      descBn: 'আবেদ ফার্নিচারের এক নম্বর পছন্দের কাঠ। এর প্রাকৃতিক তেল উপাদান কাঠকে আজীবন ঘুণের হাত থেকে সুরক্ষিত রাখে এবং বয়সের সাথে সাথে সোনালী আভা বৃদ্ধি পায়।',
      features: ['অসাধারণ প্রাকৃতিক আঁশ ও সোনালী টেক্সচার', 'পানি ও আবহাওয়া প্রতিরোধী হাই ডেনসিটি', 'আজীবন ঘুনে না ধরার নিশ্চয়তা']
    },
    {
      nameBn: 'বার্মিজ সেগুন কাঠ',
      nameEn: 'Burmese Teak Hardwood',
      rating: '★★★★★ (হেরিটেজ কোয়ালিটি)',
      badge: 'রাজকীয় ঘনত্ব',
      descBn: 'অত্যন্ত ঘন ও ভারী কাঠ যা অ্যান্টিক এবং জটিল খোদাই নকশার জন্য সেরা। এর গভীর লালচে বাদামী রঙ এবং দীর্ঘস্থায়ী দৃঢ়তা এটিকে করেছে অনন্য।',
      features: ['অ্যান্টিক ও রাজকীয় ভারী আসবাবের জন্য সেরা', 'শত বছরেও কোনো বাঁকা বা ফাঁক না হওয়ার স্থায়িত্ব', 'উচ্চমানের ডলফিন গ্লসি ল্যাকার শোষণক্ষমতা']
    },
    {
      nameBn: 'যশোর মেহগনি কাঠ',
      nameEn: 'Jessore Seasoned Mahogany',
      rating: '★★★★☆ (বাজেট ফ্রেন্ডলি)',
      badge: 'বাজেট ও টেকসই',
      descBn: 'সঠিকভাবে সিজনড ও কেমিক্যাল ট্রিটমেন্ট করা মেহগনি কাঠ যা সাশ্রয়ী বাজেটে আভিজাত্যপূর্ণ ফার্নিচার তৈরির জন্য সেরা পছন্দ।',
      features: ['স্মুথ ও সমান ফিনিশিং এর নিশ্চয়তা', 'সাশ্রয়ী মূল্যে প্রিমিয়াম লুক ও মজবুতি', '১০ বছরের রিপ্লেসমেন্ট গ্যারান্টি']
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
            <span className="text-stone-300 font-semibold font-sans">কাস্টম ফার্নিচার</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-[#d4a762]/20 border border-[#d4a762]/45 px-4 py-1.5 rounded-full mb-4">
            <Hammer className="w-4 h-4 text-[#ffe699]" />
            <span className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit">
              Bespoke Made-to-Order Woodcraft
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black font-serif tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-[#fff2d6] to-[#f4d193] bg-clip-text text-transparent">
              কাস্টমাইজড ফার্নিচার ও কাঠের কারুশিল্প
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mt-4 font-medium leading-relaxed font-sans">
            আপনার ঘরের নির্দিষ্ট রুম ডাইমেনশন, নিজস্ব পছন্দের কাঠের শেড ও কারুকাজে তৈরি করুন শতভাগ কাস্টম ফার্নিচার। রেডিমেড সাইজের সীমাবদ্ধতা ভুলে সম্পূর্ণ নিজের মতো করে ঘর সাজান।
          </p>

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <a
              href="#custom-form"
              className="bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm px-7 py-3.5 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>কাস্টম অর্ডারের তথ্য পাঠান</span>
            </a>

            <a
              href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আমার নিজের ড্রয়িং বা মাপের ফার্নিচার তৈরি করতে চাই।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp এ ড্রয়িং পাঠান</span>
            </a>
          </div>

        </div>
      </section>

      {/* 2. Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Why Custom Woodcraft */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#d4a762]/15 text-[#8f6424] flex items-center justify-center mb-4">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#2c1d07] font-serif">
              ঘরের ইঞ্চি মেপে নিখুঁত ফিটিং
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              রেডিমেড ফার্নিচার অনেক সময় ঘরে বড় বা ছোট হয়ে যায়। আমাদের কাস্টম মেজারমেন্টে রুমের প্রতি ইঞ্চি জায়গার সর্বোত্তম ব্যবহার নিশ্চিত হয়।
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center mb-4">
              <TreePine className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#2c1d07] font-serif">
              কাঠ ও সিজনিং নিজে দেখার সুযোগ
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              অর্ডারের পর আমাদের গেন্ডারিয়া কারখানায় এসে কাঁচা কাঠ ও সিজনিং সরাসরি পর্যবেক্ষণ করতে পারবেন। কোনো ভেজাল বা ফাঁকি দেওয়া কাঠের সুযোগ নেই।
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#2c1d07] font-serif">
              পছন্দের খোদাই ও পলিশ শেড
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              ফুল, লতাপাতা বা আধুনিক মিনিমালিস্ট জ্যামিতিক নকশা—যেকোনো প্যাটার্ন আমাদের দক্ষ কারিগরের হাতে নিখুঁতভাবে ফুটিয়ে তোলা সম্ভব।
            </p>
          </div>
        </section>

        {/* Timber Guide Comparison */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
              Timber Selection Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2c1d07] mt-1 font-serif">
              আমাদের কাঠের ধরন ও বৈশিষ্ট্য
            </h2>
            <div className="w-16 h-1 bg-[#d4a762] mx-auto rounded-full mt-2.5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {timbers.map((timber, i) => (
              <div 
                key={i}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 hover:border-[#d4a762]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#2c1d07] font-serif">
                        {timber.nameBn}
                      </h3>
                      <p className="text-xs text-stone-500 font-sans mt-0.5">
                        {timber.nameEn}
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#d4a762]/15 text-[#8f6424] px-2.5 py-1 rounded-full border border-[#d4a762]/30">
                      {timber.badge}
                    </span>
                  </div>

                  <p className="text-xs text-amber-700 font-mono font-bold mt-3">
                    {timber.rating}
                  </p>

                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                    {timber.descBn}
                  </p>

                  <ul className="space-y-2 mt-4 text-xs text-stone-700 font-medium">
                    {timber.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t border-stone-100">
                  <span className="text-[11px] text-stone-400 block font-medium">সিজনিং প্রক্রিয়া:</span>
                  <span className="text-xs font-bold text-[#2c1d07]">১০০% ড্রাইড ও অ্যান্টি-টারমাইট ট্রিটেড</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Order Request Form */}
        <section id="custom-form" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#d4a762]/30 shadow-xl max-w-3xl mx-auto">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
              Direct Custom Order Request
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2c1d07] mt-1 font-serif">
              কাস্টম ফার্নিচারের তথ্য বা ড্রয়িং পাঠান
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              ফর্মটি পূরণ করে পাঠালে আমরা সরাসরি আপনার সাথে ফোনে ও হোয়াটসঅ্যাপে যোগাযোগ করে নিখুঁত প্রজেক্ট প্ল্যান চূড়ান্ত করব।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  আসবাবের ধরন নির্বাচন করুন*
                </label>
                <select
                  value={furnitureType}
                  onChange={(e) => setFurnitureType(e.target.value)}
                  className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#d4a762]"
                >
                  <option value="খাট (Bed)">খাট (Bed)</option>
                  <option value="সোফা সেট (Sofa Set)">সোফা সেট (Sofa Set)</option>
                  <option value="ডাইনিং টেবিল (Dining Table)">ডাইনিং টেবিল (Dining Table)</option>
                  <option value="আলমারি / ওয়ারড্রোব (Wardrobe)">আলমারি / ওয়ারড্রোব (Wardrobe)</option>
                  <option value="ড্রেসিং টেবিল (Dressing Table)">ড্রেসিং টেবিল (Dressing Table)</option>
                  <option value="শোকেস / টিভি কেবিনেট (Showcase/TV Cabinet)">শোকেস / টিভি কেবিনেট</option>
                  <option value="অন্যান্য কাস্টম কাঠ কাজ (Other Custom Woodcraft)">অন্যান্য কাস্টম কাঠ কাজ</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  পছন্দের কাঠ নির্বাচন করুন*
                </label>
                <select
                  value={timberType}
                  onChange={(e) => setTimberType(e.target.value)}
                  className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#d4a762]"
                >
                  <option value="চিটাগাং সেগুন কাঠ (Chittagong Teak)">চিটাগাং সেগুন কাঠ (Chittagong Teak)</option>
                  <option value="বার্মিজ সেগুন কাঠ (Burmese Teak)">বার্মিজ সেগুন কাঠ (Burmese Teak)</option>
                  <option value="যশোর মেহগনি কাঠ (Jessore Mahogany)">যশোর মেহগনি কাঠ (Jessore Mahogany)</option>
                  <option value="পরামর্শ অনুযায়ী ঠিক করব (Decide with Consultant)">পরামর্শ অনুযায়ী ঠিক করব</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  ঘরের নির্দিষ্ট মাপ বা সাইজ (যদি জানা থাকে)
                </label>
                <input
                  type="text"
                  value={customDimensions}
                  onChange={(e) => setCustomDimensions(e.target.value)}
                  placeholder="যেমনঃ ৬ ফুট x ৭ ফুট (কিং সাইজ)"
                  className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#d4a762]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  আপনার মোবাইল নম্বর*
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="০১XXXXXXXXX"
                  className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-mono focus:outline-none focus:border-[#d4a762]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                অতিরিক্ত বিবরণ বা বিশেষ নকশার অনুরোধ
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="আপনার যদি কোনো নিজস্ব ছবি বা খোদাইয়ের পছন্দ থাকে এখানে সংক্ষেপে লিখুন..."
                className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#d4a762]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'প্রক্রিয়াধীন...' : 'কাস্টম অর্ডারের তথ্য পাঠান (WhatsApp Direct)'}</span>
            </button>

            {formSubmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center font-medium">
                ✓ আপনার অনুরোধটি সুরক্ষিতভাবে সংরক্ষিত হয়েছে এবং হোয়াটসঅ্যাপে পাঠানো হয়েছে।
              </div>
            )}
          </form>
        </section>

        {/* Cross Navigation Callout */}
        <section className="bg-gradient-to-r from-[#2c1d07] via-[#3d2708] to-[#2c1d07] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-black font-serif">
              আমাদের নিয়মিত পণ্য সম্ভার ও সম্পন্ন কাজের অ্যালবাম দেখুন
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              শোরুমে সরাসরি প্রস্তুত থাকা চিটাগাং সেগুন কাঠের খাট, সোফা ও ডাইনিং কালেকশন অথবা ক্লায়েন্টদের সফল ডেলিভারির ছবি দেখুন।
            </p>

            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <a
                href="/furniture"
                onClick={(e) => { e.preventDefault(); onNavigate('furniture'); }}
                className="bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <span>ফার্নিচার ক্যাটালগ</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/handover-projects"
                onClick={(e) => { e.preventDefault(); onNavigate('handover-projects'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                হস্তান্তরিত কাজের অ্যালবাম
              </a>

              <a
                href="/about"
                onClick={(e) => { e.preventDefault(); onNavigate('about'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                আমাদের পরিচিতি
              </a>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};
