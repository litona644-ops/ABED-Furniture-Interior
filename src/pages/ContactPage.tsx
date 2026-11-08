import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Mail, 
  Home, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  Navigation,
  Compass,
  Building,
  Check
} from 'lucide-react';
import { RouteKey } from '../components/SiteHeader';

interface ContactPageProps {
  phone1?: string;
  phone2?: string;
  showroomAddress?: string;
  showroomHours?: string;
  showroomEmail?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  heroBadge?: string;
  onNavigate: (route: RouteKey) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  phone1 = '+8801816234157',
  phone2 = '+8801912345678',
  showroomAddress = 'ধূপখোলা মাঠ সংলগ্ন, গেন্ডারিয়া, ঢাকা-১২০৪',
  showroomHours = 'প্রতিদিন সকাল ৯:০০ - রাত ১০:০০ (শুক্রবার জুমার পর)',
  showroomEmail = 'litona644@gmail.com',
  pageTitle = 'শোরুম পরিদর্শন ও সরাসরি যোগাযোগ',
  pageSubtitle = 'আবেদ ফার্ণিচার ও ইন্টেরিয়র শোরুমে আপনাকে স্বাগতম। সরাসরি এসে মেহগনি ও সেগুন কাঠের গুণগত মান পরখ করুন অথবা যেকোনো তথ্যে যোগাযোগ করুন।',
  heroBadge = 'Showroom Location & Direct Enquiries',
  onNavigate
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('নতুন ফার্নিচার ক্রয় (Buy Furniture)');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `আসসালামু আলাইকুম,
নাম: ${name}
ফোন: ${phone}
বিষয়: ${topic}
বার্তা: ${message || 'শোরুমের অবস্থান ও তথ্য জানতে চাই'}`;

    window.open(`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(query)}`, '_blank');
    setIsSent(true);
  };

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
            <span className="text-stone-300 font-semibold font-sans">যোগাযোগ ও শোরুম</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-[#d4a762]/20 border border-[#d4a762]/45 px-4 py-1.5 rounded-full mb-4">
            <MapPin className="w-4 h-4 text-[#ffe699]" />
            <span className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit">
              Visit Showroom & Workshop In Dhaka
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black font-serif tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-[#fff2d6] to-[#f4d193] bg-clip-text text-transparent">
              আমাদের সাথে সরাসরি যোগাযোগ ও শোরুমের ঠিকানা
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mt-4 font-medium leading-relaxed font-sans">
            আবেদ ফার্ণিচার ও ইন্টেরিয়র শোরুম ও কারখানায় আপনাকে স্বাগতম। সরাসরি এসে কাঠ ও কারুকাজ যাচাই করুন অথবা ফোন ও হোয়াটসঅ্যাপে কথা বলুন।
          </p>

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <a
              href={`tel:${phone1.replace(/[^0-9+]/g, '')}`}
              className="bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm px-7 py-3.5 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>সরাসরি কল করুন: {phone1}</span>
            </a>

            <a
              href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আপনাদের শোরুমে আসতে চাই। বিস্তারিত লোকেশন জানতে পারি কি?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp চ্যাট</span>
            </a>
          </div>

        </div>
      </section>

      {/* 2. Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 space-y-12">
        
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Showroom Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#d4a762]/15 text-[#8f6424] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2c1d07] font-serif">
                শোরুম ও কারখানার ঠিকানা
              </h3>
              <address className="not-italic text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed font-sans">
                {showroomAddress}
              </address>
              <p className="text-[11px] text-stone-500 mt-2 font-medium">
                (ধূপখোলা আন্তর্জাতিক মাঠের পশ্চিম সংলগ্ন গলি, গেন্ডারিয়া)
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                সরাসরি ভিজিট উন্মুক্ত
              </span>
            </div>
          </div>

          {/* Card 2: Phone Numbers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2c1d07] font-serif">
                হটলাইন ও ফোন নম্বর
              </h3>
              <p className="text-xs text-stone-500 mt-1">যেকোনো প্রশ্ন বা অর্ডারের জন্য কল করুন:</p>
              
              <ul className="space-y-2 mt-3 font-mono text-xs sm:text-sm font-bold text-stone-800">
                <li className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200">
                  <span>হটলাইন ১ (WhatsApp):</span>
                  <a href={`tel:${phone1.replace(/[^0-9+]/g, '')}`} className="text-[#b07e35] hover:underline">
                    {phone1}
                  </a>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200">
                  <span>হটলাইন ২ (সরাসরি কল):</span>
                  <a href={`tel:${phone2.replace(/[^0-9+]/g, '')}`} className="text-[#b07e35] hover:underline">
                    {phone2}
                  </a>
                </li>
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100">
              <span className="text-[10px] font-bold text-stone-500">
                ইমেইল: {showroomEmail}
              </span>
            </div>
          </div>

          {/* Card 3: Opening Hours & Directions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2c1d07] font-serif">
                শোরুমের সময়সূচী
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 mt-2 font-medium">
                {showroomHours}
              </p>
              
              <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                <p className="font-bold text-stone-800">কীভাবে আসবেন?</p>
                <p className="text-[11px] leading-relaxed">
                  সদরঘাট বা যাত্রাবাড়ী থেকে সরাসরি গেন্ডারিয়া ধূপখোলা মাঠে যেকোনো বাস বা রিকশায় সহজেই পৌঁছানো যায়।
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100">
              <span className="text-[10px] font-bold text-[#b07e35]">
                শুক্রবার: দুপুর ২:৩০ হতে খোলা
              </span>
            </div>
          </div>

        </div>

        {/* Inquiry Form & Location Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#d4a762] uppercase tracking-wider font-outfit">
                Online Inquiry Form
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2c1d07] font-serif mt-1">
                সরাসরি মেসেজ বা ইনকোয়ারি পাঠান
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                নিচের তথ্যগুলো লিখে পাঠালে আমরা খুব দ্রুত আপনার সাথে যোগাযোগ করব।
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">আপনার নাম*</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম"
                    className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#d4a762]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">মোবাইল নম্বর*</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১XXXXXXXXX"
                    className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-mono focus:outline-none focus:border-[#d4a762]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">কোন বিষয়ে জানতে চান?*</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#d4a762]"
                >
                  <option value="নতুন ফার্নিচার ক্রয় (Buy Furniture)">নতুন ফার্নিচার ক্রয় (Buy Furniture)</option>
                  <option value="ইন্টেরিয়র ডিজাইন সার্ভিস (Interior Design)">ইন্টেরিয়র ডিজাইন সার্ভিস (Interior Design)</option>
                  <option value="কাস্টমাইজড অর্ডার ও মাপ (Custom Furniture)">কাস্টমাইজড অর্ডার ও মাপ (Custom Furniture)</option>
                  <option value="শোরুম লোকেশন ও ভিজিট (Showroom Visit)">শোরুম লোকেশন ও ভিজিট (Showroom Visit)</option>
                  <option value="অন্যান্য জিজ্ঞাসা (Other Inquiry)">অন্যান্য জিজ্ঞাসা</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">আপনার বার্তা বা প্রশ্ন</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার কাঙ্ক্ষিত পণ্য বা যেকোনো প্রশ্ন এখানে লিখুন..."
                  className="w-full bg-[#faf9f4] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#d4a762]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#d4a762] hover:bg-[#fdbf5e] text-stone-950 font-black text-xs sm:text-sm py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান (WhatsApp Direct Chat)</span>
              </button>
            </form>
          </div>

          {/* Social & Direct Callout (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Facebook Connect Box */}
            <a
              href="https://www.facebook.com/share/16qF4GEczg/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-[#1877f2] via-[#2a6fd1] to-[#0d3b8c] text-white p-6 sm:p-7 rounded-3xl shadow-lg hover:shadow-xl transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full border border-white/20">
                Official Facebook Page
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-3">
                ফেসবুকে আমাদের সাথে যুক্ত থাকুন
              </h3>
              <p className="text-xs text-[#fffdec] mt-2 leading-relaxed">
                নতুন ডিজাইনার ফার্নিচার এবং এক্সক্লুসিভ অফারের আপডেট সরাসরি পেতে আমাদের অফিসিয়াল ফেসবুক পেজ ভিজিট করুন।
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-white text-[#1877f2] font-black text-xs px-4 py-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <span>ফেসবুক পেজ দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            {/* Quality Promise */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-[#2c1d07] font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4a762]" />
                <span>আমাদের অঙ্গীকার</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>কোনো লুকানো খরচ বা অতিরিক্ত চার্জ নেই</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>সরাসরি কারখানার মূল্যে ক্রয় করার সুবিধা</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>সারাদেশে যেকোনো স্থানে নিরাপদ পরিবহন ব্যবস্থা</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Cross Navigation Callout */}
        <section className="bg-gradient-to-r from-[#2c1d07] via-[#3d2708] to-[#2c1d07] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-black font-serif">
              অন্যান্য পেজ ও ক্যাটালগ দেখুন
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              সেগুন কাঠের সম্পূর্ণ ক্যাটালগ, ইন্টেরিয়র সল্যুশন ও হস্তান্তরিত কাজের অ্যালবাম দেখতে পারেন।
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
                href="/interior-design"
                onClick={(e) => { e.preventDefault(); onNavigate('interior-design'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                ইন্টেরিয়র সার্ভিস
              </a>

              <a
                href="/custom-furniture"
                onClick={(e) => { e.preventDefault(); onNavigate('custom-furniture'); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-colors cursor-pointer"
              >
                কাস্টম ফার্নিচার
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
