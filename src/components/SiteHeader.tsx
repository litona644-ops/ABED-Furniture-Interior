import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  Home, 
  Sofa, 
  Palette, 
  Hammer, 
  FolderCheck, 
  Info, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

export type RouteKey = 'home' | 'furniture' | 'interior-design' | 'custom-furniture' | 'handover-projects' | 'about' | 'contact' | 'admin' | 'product';

interface SiteHeaderProps {
  currentRoute: RouteKey;
  brandNameLeft?: string;
  brandNameRight?: string;
  tagline?: string;
  phone1?: string;
  onNavigate: (route: RouteKey) => void;
}

export const NAV_LINKS = [
  { path: '/', route: 'home' as RouteKey, labelBn: 'হোম', labelEn: 'Home', icon: Home },
  { path: '/furniture', route: 'furniture' as RouteKey, labelBn: 'ফার্নিচার', labelEn: 'Furniture', icon: Sofa },
  { path: '/interior-design', route: 'interior-design' as RouteKey, labelBn: 'ইন্টেরিয়র', labelEn: 'Interior Design', icon: Palette },
  { path: '/custom-furniture', route: 'custom-furniture' as RouteKey, labelBn: 'কাস্টম ফার্নিচার', labelEn: 'Custom Woodcraft', icon: Hammer },
  { path: '/handover-projects', route: 'handover-projects' as RouteKey, labelBn: 'হ্যান্ডওভার প্রজেক্ট', labelEn: 'Handover Projects', icon: FolderCheck, hasBadge: 'TAG' },
  { path: '/about', route: 'about' as RouteKey, labelBn: 'পরিচিতি', labelEn: 'About Us', icon: Info },
  { path: '/contact', route: 'contact' as RouteKey, labelBn: 'যোগাযোগ', labelEn: 'Contact', icon: MapPin },
];

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentRoute,
  brandNameLeft = 'আবেদ',
  brandNameRight = 'ফার্নিচার',
  tagline = 'প্রিমিয়াম সেগুন কাঠের আসবাব ও ইন্টেরিয়র',
  phone1 = '+8801816234157',
  onNavigate
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, route: RouteKey) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#170f01]/95 backdrop-blur-md border-b border-[#d4a762]/30 text-white shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline - Clean, steady and without shining animation */}
        <a 
          href="/" 
          onClick={(e) => handleLinkClick(e, 'home')}
          className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer"
        >
          <div className="h-11 sm:h-13 md:h-14 w-auto bg-white rounded-xl p-1 shadow-md border-2 border-[#d4a762] group-hover:scale-105 transition-transform duration-300 shrink-0">
            <img 
              src="https://i.ibb.co.com/S4ZB9S14/ABED-FURNITURE-LOGO.jpg" 
              alt="Abed Furniture & Interior" 
              className="h-full w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="font-serif font-extrabold text-base sm:text-lg md:text-xl tracking-tight leading-none flex items-center gap-1.5">
              <span className="text-[#fdbf5e] font-outfit font-black">{brandNameLeft}</span>
              <span className="text-white font-outfit font-bold">{brandNameRight}</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#fdbf5e] mt-1 font-bold tracking-wide font-sans line-clamp-1">
              {tagline}
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = currentRoute === link.route;
            const Icon = link.icon;
            return (
              <a
                key={link.route}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.route)}
                className={`relative px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#fdbf5e] bg-white/[0.08] shadow-inner font-extrabold'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#fdbf5e]' : 'text-stone-400'}`} />
                <span>{link.labelBn}</span>
                {link.hasBadge && (
                  <span className="text-[9px] bg-[#d4a762] text-black font-black px-1.5 py-0.2 rounded-full font-mono uppercase tracking-tighter">
                    {link.hasBadge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#d4a762] via-[#ffdca8] to-[#d4a762] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <a
            href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আবেদ ফার্নিচার ও ইন্টেরিয়র সম্পর্কে বিস্তারিত জানতে আগ্রহী।')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${phone1.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#d4a762] to-[#b07e35] hover:opacity-95 text-stone-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="font-mono">{phone1}</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-stone-200 hover:text-white transition-colors cursor-pointer"
          aria-label={isMobileMenuOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-[#fdbf5e]" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#180e01] border-b border-[#d4a762]/30 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = currentRoute === link.route;
              const Icon = link.icon;
              return (
                <a
                  key={link.route}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.route)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#d4a762]/20 text-[#fdbf5e] font-extrabold border border-[#d4a762]/30'
                      : 'text-stone-300 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#d4a762]" />
                    <span>{link.labelBn}</span>
                    <span className="text-[11px] text-stone-500 font-sans">({link.labelEn})</span>
                  </div>
                  {link.hasBadge && (
                    <span className="text-[9px] bg-[#d4a762] text-black font-black px-1.5 py-0.2 rounded-full font-mono uppercase">
                      {link.hasBadge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
            <a
              href={`tel:${phone1.replace(/[^0-9+]/g, '')}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.05] border border-white/[0.1] text-xs font-bold text-stone-200 py-2.5 rounded-xl"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4a762]" />
              <span>কল করুন</span>
            </a>
            <a
              href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 text-xs font-bold text-white py-2.5 rounded-xl shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
