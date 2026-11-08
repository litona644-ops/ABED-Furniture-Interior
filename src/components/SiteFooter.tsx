import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Mail, 
  ShieldCheck, 
  Award, 
  Truck, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Heart
} from 'lucide-react';
import { NAV_LINKS, RouteKey } from './SiteHeader';

interface SiteFooterProps {
  brandNameLeft?: string;
  brandNameRight?: string;
  phone1?: string;
  phone2?: string;
  showroomAddress?: string;
  showroomHours?: string;
  onNavigate: (route: RouteKey) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  brandNameLeft = 'আবেদ',
  brandNameRight = 'ফার্নিচার',
  phone1 = '+8801816234157',
  phone2 = '+8801977755313',
  showroomAddress = 'ধূপখোলা মাঠ সংলগ্ন, গেন্ডারিয়া, ঢাকা-১২০৪',
  showroomHours = 'প্রতিদিন সকাল ৯:০০ - রাত ১০:০০ (শুক্রবার জুমার পর)',
  onNavigate
}) => {
  const handleLinkClick = (e: React.MouseEvent, route: RouteKey) => {
    e.preventDefault();
    onNavigate(route);
  };

  return (
    <footer className="bg-[#120a01] text-stone-300 font-sans border-t border-[#d4a762]/20 relative overflow-hidden">
      
      {/* Decorative ambient gold glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4a762]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-700/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand Info & Craftsmanship (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <a 
              href="/" 
              onClick={(e) => handleLinkClick(e, 'home')}
              className="inline-flex items-center gap-3 cursor-pointer group"
            >
              <div className="h-12 w-auto bg-white rounded-xl p-1 shadow-md border-2 border-[#d4a762] group-hover:scale-105 transition-transform duration-300 shrink-0">
                <img 
                  src="https://i.ibb.co.com/S4ZB9S14/ABED-FURNITURE-LOGO.jpg" 
                  alt="Abed Furniture & Interior" 
                  className="h-full w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-outfit font-black text-xl tracking-tight text-[#fdbf5e]">{brandNameLeft}</span>
                <span className="font-outfit font-black text-xl tracking-tight text-white ml-1.5">{brandNameRight}</span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              আবেদ ফার্ণিচার ও ইন্টেরিয়র ২০১০ সাল থেকে ঢাকায় খাঁটি চিটাগাং সেগুন ও যশোর মেহগনি কাঠের তৈরি প্রিমিয়াম আসবাবপত্র ও এক্সক্লুসিভ হোম ইন্টেরিয়র ডিজাইনের বিশ্বস্ত প্রতিষ্ঠান। আমাদের প্রধান কারিগর লিটন আলীর ১৫+ বছরের বাস্তব অভিজ্ঞতা।
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-[#d4a762]/15 text-[#fdbf5e] border border-[#d4a762]/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>১০০% সিজনড কাঠ ও লাইফটাইম ঘুণের গ্যারান্টি</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit border-b border-white/[0.08] pb-2">
              ওয়েবসাইট পেজ ও ন্যাভিগেশন
            </h4>
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.route}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.route)}
                  className="text-xs sm:text-sm text-stone-300 hover:text-[#fdbf5e] flex items-center justify-between group transition-colors cursor-pointer py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4a762]/50 group-hover:bg-[#fdbf5e] transition-colors" />
                    <span>{link.labelBn}</span>
                    <span className="text-[11px] text-stone-500">({link.labelEn})</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 group-hover:text-[#fdbf5e] transition-all" />
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Services & Woodcraft (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit border-b border-white/[0.08] pb-2">
              আমাদের বিশেষত্ব
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-start gap-1.5">
                <span className="text-[#d4a762] font-bold mt-0.5">•</span>
                <span>চিটাগাং সেগুন কাঠের খাট</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#d4a762] font-bold mt-0.5">•</span>
                <span>রাজকীয় কুশন সোফা সেট</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#d4a762] font-bold mt-0.5">•</span>
                <span>টেম্পারড গ্লাস ডাইনিং টেবিল</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#d4a762] font-bold mt-0.5">•</span>
                <span>বার্মিজ সেগুন আলমারি</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#d4a762] font-bold mt-0.5">•</span>
                <span>ডুপ্লেক্স হোম ইন্টেরিয়র</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#d4a762] font-bold mt-0.5">•</span>
                <span>মডুলার কিচেন ক্যাবিনেট</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#d4a762] font-bold mt-0.5">•</span>
                <span>কাস্টম উডওয়ার্কিং ও ড্রয়িং</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Showroom & Direct Contact (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit border-b border-white/[0.08] pb-2">
              শোরুম ও যোগাযোগ
            </h4>
            
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4a762] shrink-0 mt-0.5" />
                <address className="not-italic text-stone-300 leading-snug">
                  {showroomAddress}
                </address>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#d4a762] shrink-0" />
                <span>{showroomHours}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4a762] shrink-0" />
                <a href={`tel:${phone1.replace(/[^0-9+]/g, '')}`} className="hover:text-[#fdbf5e] font-mono">
                  {phone1}
                </a>
                <span>/</span>
                <a href={`tel:${phone2.replace(/[^0-9+]/g, '')}`} className="hover:text-[#fdbf5e] font-mono">
                  {phone2}
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি সরাসরি শোরুমে আসতে চাই / ফার্নিচার সম্পর্কে জানতে চাই।')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp এ সরাসরি ইনকোয়ারি</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Semantic Badges */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} <strong>{brandNameLeft} {brandNameRight}</strong>. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a 
              href="/about" 
              onClick={(e) => handleLinkClick(e, 'about')}
              className="hover:text-stone-300 cursor-pointer"
            >
              পরিচিতি
            </a>
            <span>•</span>
            <a 
              href="/furniture" 
              onClick={(e) => handleLinkClick(e, 'furniture')}
              className="hover:text-stone-300 cursor-pointer"
            >
              আসবাবপত্র ক্যাটালগ
            </a>
            <span>•</span>
            <a 
              href="/contact" 
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="hover:text-stone-300 cursor-pointer"
            >
              শোরুম অবস্থান
            </a>
            <span>•</span>
            <a 
              href="/admin" 
              onClick={(e) => handleLinkClick(e, 'admin')}
              className="hover:text-[#fdbf5e] cursor-pointer font-medium"
            >
              Admin Console
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
