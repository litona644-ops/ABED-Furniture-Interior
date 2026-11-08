import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  X,
  Share2
} from 'lucide-react';
import { Product } from '../types';
import { RouteKey } from '../components/SiteHeader';
import { 
  getProductMainImage, 
  getProductGalleryImages, 
  handleProductImageError 
} from '../lib/productImage';

interface ProductDetailsPageProps {
  product: Product;
  phone1?: string;
  phone2?: string;
  onNavigate: (route: RouteKey) => void;
  onExit: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  phone1 = '+8801816234157',
  phone2 = '+8801912345678',
  onNavigate,
  onExit,
}) => {
  const imageList = getProductGalleryImages(product);
  const [activeImage, setActiveImage] = useState<string>(() => getProductMainImage(product));
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setActiveImage(getProductMainImage(product));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [product]);

  // Convert Bengali numerals to standard digits and format for WhatsApp (wa.me requires international format without +)
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const convertedPhone = (phone1 || '01816234157')
    .split('')
    .map(ch => bnToEnMap[ch] || ch)
    .join('')
    .replace(/[^0-9]/g, '');

  // International WhatsApp number for Bangladesh (e.g. 8801816234157)
  const whatsappNumber = convertedPhone.startsWith('880')
    ? convertedPhone
    : convertedPhone.startsWith('0')
      ? `88${convertedPhone}`
      : convertedPhone.length === 10
        ? `880${convertedPhone}`
        : '8801816234157';

  const dialNumber = convertedPhone.startsWith('88') ? `+${convertedPhone}` : (convertedPhone.startsWith('0') ? `+88${convertedPhone}` : '+8801816234157');
  const displayPhone = phone1 || '০১৮১৬-২৩৪১৫৭';

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি আবেদের এই কাঠের পণ্যটিতে আগ্রহী:\n` +
    `পণ্য: ${product.nameBn} (${product.nameEn})\n` +
    `কোড: #${product.id.toUpperCase()}\n` +
    `মূল্য: ${product.priceRangeBn}\n` +
    `অনুগ্রহ করে বিস্তারিত সাইজ ও অর্ডার বুকিং প্রসেস সম্পর্কে জানাবেন কি?`
  );

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: `${product.nameBn} | Abed Furniture`,
          text: product.descriptionBn,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f4] text-[#2c1d07] py-4 sm:py-8 lg:py-12 px-3 sm:px-6 lg:px-8 font-sans selection:bg-[#d4a762] selection:text-[#1a1200]">
      {/* Responsive Container: Mobile-first compact on phone, comfortable multi-column on PC/laptop */}
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden flex flex-col">
        
        {/* Navigation Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-black transition-all cursor-pointer shadow-2xs"
            title="আগের পেজে ফিরুন"
          >
            <ArrowLeft className="w-4 h-4 text-stone-900" />
            <span>বের হন</span>
            <span className="hidden sm:inline text-[11px] font-medium text-stone-500">(আগের পেজে ফিরুন)</span>
          </button>

          <div className="text-center px-2 flex-1 mx-2">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#b07e35] block leading-tight">
              {product.category === 'interior' ? 'ইন্টেরিয়র ডিজাইন' : 'ফার্নিচার কালেকশন'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 truncate block max-w-[200px] sm:max-w-md mx-auto">
              {product.nameBn}
            </span>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 cursor-pointer shadow-2xs"
            title="অন্যান্য প্রোডাক্ট দেখতে বের হন"
          >
            <span className="hidden xs:inline">অন্যান্য পণ্য</span>
            <X className="w-4 h-4 text-stone-600" />
          </button>
        </header>

        {/* Content Body: 1-col on Mobile, 2-col Grid on PC / Laptop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 p-4 sm:p-6 lg:p-8">
          
          {/* Left Column: Photo Showcase + Thumbnails + Custom notes (Span 6 on md, 5 on lg) */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4">
            
            {/* Main Photo Showcase - Beautifully adjusted to card */}
            <div className="relative aspect-[4/3] md:aspect-[4/3] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/70 shadow-sm group">
              <img
                src={activeImage}
                alt={product.nameBn}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                onError={(e) => handleProductImageError(e)}
                referrerPolicy="no-referrer"
                style={{ 
                  imageRendering: '-webkit-optimize-contrast',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              />

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-stone-950/85 text-[#fdbf5e] px-3 py-1 rounded-full backdrop-blur-md border border-[#d4a762]/35 shadow-sm">
                  {product.category === 'furniture' ? 'খাঁটি সেগুন কাঠ' : 'ইন্টেরিয়র প্যাকেজ'}
                </span>
                {product.isTrending && (
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-500 text-stone-950 px-2.5 py-1 rounded-full shadow-sm">
                    হট
                  </span>
                )}
              </div>

              {/* Share & Copy button */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 sm:p-2.5 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="শেয়ার করুন"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-800" />
                </button>
              </div>

              {copiedLink && (
                <div className="absolute bottom-3 right-3 text-xs font-bold bg-black/90 text-white px-3 py-1.5 rounded-full shadow-lg">
                  লিংক কপি হয়েছে!
                </div>
              )}
            </div>

            {/* Gallery Thumbnails (if multiple images) */}
            {imageList.length > 1 && (
              <div className="flex items-center gap-2.5 p-2 bg-stone-50 rounded-2xl border border-stone-200/60 overflow-x-auto">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-14 sm:w-18 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImage === img ? 'border-[#b07e35] scale-105 shadow-sm' : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Preview ${idx + 1}`} 
                      onError={(e) => handleProductImageError(e)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Custom Size / Order Note (Shown on left side on desktop) */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans space-y-1">
              <p className="font-bold text-[#2c1d07] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#b07e35]" />
                <span>কাস্টম সুবিধা:</span>
              </p>
              <p className="text-stone-600 font-medium">
                আপনার ঘরের সঠিক মাপ, আর্কিটেকচারাল লেআউট ও কাঠের পছন্দ অনুযায়ী যেকোনো সাইজে তৈরি করে দেওয়া যাবে।
              </p>
            </div>

            {/* Quality assurance guarantee pill */}
            <div className="hidden md:flex items-center gap-2 text-[11px] text-stone-500 font-medium px-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>১০০% সলিড কাঠ ও ল্যাকার ফিনিশ • চিফ ডিজাইনার লিটন আলীর তত্ত্বাবধান</span>
            </div>

          </div>

          {/* Right Column: Information, Specs & Actions (Span 6 on md, 7 on lg) */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              {/* Product Code & Category */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2">
                <span className="text-xs font-mono font-bold text-[#b07e35] uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  কোড: #{product.id.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-stone-400 uppercase">
                  {product.category === 'furniture' ? 'খাঁটি কাঠের আসবাব' : 'ইন্টেরিয়র ডিজাইন'}
                </span>
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2c1d07] font-serif leading-tight">
                  {product.nameBn}
                </h1>
                <p className="text-sm sm:text-base text-stone-500 font-sans mt-1 font-medium">
                  {product.nameEn}
                </p>
              </div>

              {/* Price / Estimated Budget */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    আনুমানিক বাজেট / মূল্য
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#b07e35]">
                    {product.priceRangeBn}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-3 py-1.5 rounded-full shrink-0">
                  কাস্টম অর্ডারে তৈরি
                </span>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  পণ্য পরিচিতি ও বিবরণ
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed font-sans bg-stone-50/80 p-4 rounded-2xl border border-stone-200/60 font-medium">
                  {product.descriptionBn}
                </p>
              </div>

              {/* Specifications */}
              {product.specsBn && product.specsBn.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                    উপকরণ ও কারিগরি বিবরণ
                  </h2>
                  <div className="space-y-2.5 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/60">
                    {product.specsBn.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Action Buttons: Accessible and beautifully aligned */}
            <div className="pt-4 border-t border-stone-200/80 space-y-2.5">
              {/* WhatsApp Order Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-black py-3.5 px-5 rounded-2xl shadow-md transition-all text-xs sm:text-sm cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-white shrink-0" />
                <span>WhatsApp এ সরাসরি অর্ডার ও মূল্য জানুন</span>
              </a>

              {/* Hotline Call Button */}
              <a
                href={`tel:${dialNumber}`}
                className="w-full flex items-center justify-center gap-2 bg-[#2c1d07] hover:bg-[#3d2708] active:scale-98 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#d4a762] shrink-0" />
                <span>সরাসরি কল করুন: {displayPhone}</span>
              </a>

              {/* Exit to browse other products button */}
              <button
                type="button"
                onClick={onExit}
                className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer border border-stone-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-stone-600" />
                <span>অন্যান্য পণ্য দেখতে বের হন</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

