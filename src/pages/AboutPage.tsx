import React from 'react';
import { 
  Info, 
  Sparkles, 
  Home, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  HeartHandshake, 
  User, 
  Check,
  Building,
  Target
} from 'lucide-react';
import { RouteKey } from '../components/SiteHeader';

interface AboutPageProps {
  phone1?: string;
  showroomAddress?: string;
  onNavigate: (route: RouteKey) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  phone1 = '+8801816234157',
  showroomAddress = 'ধূপখোলা মাঠ সংলগ্ন, গেন্ডারিয়া, ঢাকা-১২০৪',
  onNavigate
}) => {
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
            <span className="text-stone-300 font-semibold font-sans">আমাদের পরিচিতি</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-[#d4a762]/20 border border-[#d4a762]/45 px-4 py-1.5 rounded-full mb-4">
            <Info className="w-4 h-4 text-[#ffe699]" />
            <span className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit">
              15+ Years Of Woodcraft Mastery & Trust
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black font-serif tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-[#fff2d6] to-[#f4d193] bg-clip-text text-transparent">
              আবেদ ফার্ণিচার ও ইন্টেরিয়র এর ইতিহাস ও পরিচিতি
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mt-4 font-medium leading-relaxed font-sans">
            ২০১০ সাল থেকে ঢাকার গেন্ডারিয়ায় খাঁটি চিটাগাং সেগুন ও যশোর মেহগনি কাঠের তৈরি আসবাবপত্র এবং নান্দনিক হোম ইন্টেরিয়রের বিশ্বস্ত পথিকৃৎ।
          </p>

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <a
              href="/furniture"
              onClick={(e) => { e.preventDefault(); onNavigate('furniture'); }}
              className="bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm px-7 py-3.5 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>আমাদের ফার্নিচার কালেকশন দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-colors cursor-pointer"
            >
              শোরুম ভিজিটের ঠিকানা
            </a>
          </div>

        </div>
      </section>

      {/* 2. Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Story Section: Liton Ali */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm">
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border-2 border-[#d4a762]/30 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                alt="লিটন আলী - প্রধান ডিজাইনার ও কারুশিল্পী"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#fdbf5e] block font-outfit">
                  Lead Designer & Crafts Lead
                </span>
                <h3 className="text-xl font-bold font-serif">লিটন আলী (Liton Ali)</h3>
                <p className="text-xs text-stone-300 mt-0.5">৮ বছর আরব টেক (UAE) এর বাস্তব আন্তর্জাতিক অভিজ্ঞতা</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
              Craftsman Profile & Legacy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2c1d07] font-serif">
              কাঠের প্রতিটি আঁচড়ে নিখুঁত আভিজাত্যের নিশ্চয়তা
            </h2>
            <div className="w-16 h-1 bg-[#d4a762] rounded-full" />

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans pt-2">
              আবেদ ফার্ণিচার ও ইন্টেরিয়রের প্রতিষ্ঠাতা ও প্রধান ডিজাইনার <strong>লিটন আলী</strong> কাঠের কাজে পারদর্শী এক অনন্য কারুশিল্পী। সংযুক্ত আরব আমিরাতের বিখ্যাত নির্মাণ ও ইন্টেরিয়র প্রতিষ্ঠান <strong>আরব টেক (Arab Tech)</strong>-এ দীর্ঘ ৮ বছর কাজ করে তিনি আধুনিক আন্তর্জাতিক আর্কিটেকচারাল ফিনিশিং ও লাক্সারি কাঠের সংযোগে গভীর দক্ষতা অর্জন করেন।
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              ২০১০ সালে ঢাকায় ফিরে তিনি আবেদ ফার্ণিচার প্রতিষ্ঠা করেন। তার উদ্দেশ্য ছিল অত্যন্ত স্পষ্ট: বাজারচলতি ভেজাল ও কৃত্রিম বোর্ডের ভিড়ে দেশের সম্মানিত ক্রেতাদের শতভাগ খাঁটি কাঠের মজবুত ও বংশপরম্পরায় টিকে থাকার মতো ফার্নিচার উপহার দেওয়া।
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-[#faf9f4] border border-stone-200">
                <span className="text-xl sm:text-2xl font-black font-mono text-[#b07e35] block">১৫+ বছর</span>
                <span className="text-xs text-stone-600 font-bold">কারিগরি অভিজ্ঞতা</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#faf9f4] border border-stone-200">
                <span className="text-xl sm:text-2xl font-black font-mono text-[#b07e35] block">৮০০+</span>
                <span className="text-xs text-stone-600 font-bold">সফল প্রজেক্ট ডেলিভারি</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2c1d07] mt-1 font-serif">
              আমাদের ৪টি মৌলিক অঙ্গীকার
            </h2>
            <div className="w-16 h-1 bg-[#d4a762] mx-auto rounded-full mt-2.5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-[#d4a762]/15 text-[#8f6424] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#2c1d07] font-serif">শতভাগ সিজনড কাঠ</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                কোনো কাঁচা কাঠ ব্যবহার করা হয় না। প্রতিটি কাঠ ভ্যাকুয়াম চেম্বারে শুকিয়ে কেমিক্যাল ট্রিটমেন্ট নিশ্চিত করা হয়।
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#2c1d07] font-serif">হাতে খোদাই ঐতিহ্য</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                মেশিনের যান্ত্রিক অনুভূতির বাইরে দক্ষ শিল্পীদের হাতুড়ি-বাটালির সুক্ষ্ম স্পর্শে তৈরি ঐতিহ্যবাহী কারুকাজ।
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#2c1d07] font-serif">নির্দিষ্ট সময়ে ডেলিভারি</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                প্রতিটি অর্ডারের ক্ষেত্রে নির্ধারিত ডেলিভারি ডেট অক্ষরে অক্ষরে মেনে চলা আমাদের অন্যতম প্রধান নীতি।
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/15 text-sky-800 flex items-center justify-center mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#2c1d07] font-serif">আজীবন ঘুণের গ্যারান্টি</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                খাঁটি চিটাগাং সেগুনে ঘুণের কোনো ভয় নেই। আমরা প্রতিটি আসবাবে দীর্ঘস্থায়ী আত্মবিশ্বাস ও গ্যারান্টি দিয়ে থাকি।
              </p>
            </div>
          </div>
        </section>

        {/* Factory Visit Invitation */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
              Open Workshop Policy
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#2c1d07] font-serif">
              আমাদের কারখানা সরাসরি ভিজিট করার আমন্ত্রণ
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              গেন্ডারিয়া ধূপখোলা মাঠের পাশেই আমাদের শোরুম ও ফার্নিচার তৈরির মূল কারখানা। কাঠ ও পালিশের মান নিজের চোখে সরাসরি যাচাই করতে আপনি যেকোনো দিন স্বশরীরে আমন্ত্রিত।
            </p>
            <p className="text-xs text-stone-500 pt-1 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#d4a762]" />
              <span>{showroomAddress}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href={`tel:${phone1.replace(/[^0-9+]/g, '')}`}
              className="bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-full flex items-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>সরাসরি কল দিন</span>
            </a>

            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-colors cursor-pointer border border-stone-300"
            >
              শোরুমের রুট ম্যাপ
            </a>
          </div>
        </section>

        {/* Cross Navigation Callout */}
        <section className="bg-gradient-to-r from-[#2c1d07] via-[#3d2708] to-[#2c1d07] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-black font-serif">
              আমাদের পণ্য ও বাস্তবায়িত কাজের অ্যালবাম দেখুন
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              সেগুন কাঠের খাট, সোফা, ডাইনিং এবং আমাদের গ্রাহকদের সফলভাবে বুঝিয়ে দেওয়া প্রজেক্টের ভিডিও দেখুন।
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
                href="/interior-design"
                onClick={(e) => { e.preventDefault(); onNavigate('interior-design'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                ইন্টেরিয়র সার্ভিস
              </a>

              <a
                href="/handover-projects"
                onClick={(e) => { e.preventDefault(); onNavigate('handover-projects'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                হ্যান্ডওভার প্রজেক্ট ভিডিও
              </a>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};
