import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderCheck, 
  MapPin, 
  Calendar, 
  Play, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft,
  Home,
  Phone,
  MessageCircle,
  Maximize2,
  Search,
  Award,
  ShieldCheck,
  Truck,
  HeartHandshake
} from 'lucide-react';
import { CompletedProject, ProjectCategory } from '../types';
import { getProjectVideoThumbnail, getCloudinaryVideoThumbnail } from '../lib/videoThumbnail';

interface HandoverProjectsPageProps {
  projects: CompletedProject[];
  brandName?: string;
  phone1?: string;
  onBackToHome: () => void;
  onOpenAdmin?: () => void;
  pageBadge?: string;
  pageTitle?: string;
  pageDesc?: string;
}

export const HandoverProjectsPage: React.FC<HandoverProjectsPageProps> = ({
  projects,
  brandName = 'আবেদ ফার্নিচার ও ইন্টেরিয়র',
  phone1 = '+8801816234157',
  onBackToHome,
  pageBadge = 'Delivered Works & Verified Customer Handovers',
  pageTitle = 'Our Handover Projects',
  pageDesc = 'আমাদের সম্মানিত গ্রাহকদের সফলভাবে বুঝিয়ে দেওয়া প্রিমিয়াম আসবাবপত্র ও এক্সক্লুসিভ হোম ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম।'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState<CompletedProject | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [activeMediaType, setActiveMediaType] = useState<'photo' | 'video'>('photo');

  // Filter published projects by category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Only display published projects to public website visitors (drafts remain admin-only)
      if (project.isPublished === false) return false;

      // Category filter
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }

      // Search query (title, location, description, client name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q) || (project.titleEn || '').toLowerCase().includes(q);
        const matchesLoc = (project.clientLocation || '').toLowerCase().includes(q);
        const matchesDesc = (project.description || '').toLowerCase().includes(q);
        const matchesClient = (project.clientName || '').toLowerCase().includes(q);
        return matchesTitle || matchesLoc || matchesDesc || matchesClient;
      }

      return true;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const published = projects.filter(p => p.isPublished !== false);
    return {
      all: published.length,
      full_project: published.filter(p => p.category === 'full_project').length,
      interior: published.filter(p => p.category === 'interior').length,
      furniture: published.filter(p => p.category === 'furniture').length
    };
  }, [projects]);

  const getCategoryBadge = (category: ProjectCategory) => {
    switch (category) {
      case 'interior':
        return { label: 'ইন্টেরিয়র ডিজাইন', en: 'Interior Project', color: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30' };
      case 'furniture':
        return { label: 'সেগুন আসবাবপত্র', en: 'Teak Furniture', color: 'bg-amber-500/15 text-amber-900 border-amber-500/30' };
      case 'full_project':
      default:
        return { label: 'সম্পূর্ণ প্রজেক্ট', en: 'Full Handover', color: 'bg-[#d4a762]/20 text-[#8f6424] border-[#d4a762]/40' };
    }
  };

  const handleOpenModal = (project: CompletedProject) => {
    setActiveProject(project);
    setActiveMediaIndex(0);
    if (project.photos && project.photos.length > 0) {
      setActiveMediaType('photo');
    } else if (project.videos && project.videos.length > 0) {
      setActiveMediaType('video');
    } else {
      setActiveMediaType('photo');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f4] text-stone-800 font-sans flex flex-col selection:bg-[#d4a762]/30 selection:text-stone-900">
      
      {/* ========================================================
          1. TOP STICKY NAVIGATION BAR
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#170f01]/95 backdrop-blur-md border-b border-[#d4a762]/30 text-white px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#fdbf5e] hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-[#d4a762]/30 transition-all cursor-pointer group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>হোমপেজে ফিরে যান</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs text-stone-300 font-medium">
              সরাসরি যোগাযোগ: <strong className="text-[#fdbf5e] font-mono">{phone1}</strong>
            </span>
            <a
              href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আপনাদের হ্যান্ডওভার প্রজেক্ট দেখে যোগাযোগ করছি।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. EYE-CATCHING HERO SHOWCASE HEADER
          ======================================================== */}
      <section className="bg-gradient-to-b from-[#180e01] via-[#2a1b05] to-[#180e01] text-white py-14 sm:py-20 px-4 md:px-8 relative overflow-hidden border-b border-[#d4a762]/25">
        {/* Ambient golden lighting blur circles */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#d4a762]/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          
          {/* Breadcrumb Navigation */}
          <div className="inline-flex items-center gap-2 text-xs text-[#d4a762] mb-4 font-mono">
            <button onClick={onBackToHome} className="hover:underline flex items-center gap-1 cursor-pointer">
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </button>
            <span>/</span>
            <span className="text-stone-300 font-semibold font-sans">Our Handover Projects</span>
          </div>

          {/* Animated Sparkling Badge */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4a762]/25 via-[#e2b76f]/25 to-[#d4a762]/25 border border-[#d4a762]/50 px-4.5 py-1.5 rounded-full mb-4 shadow-[0_2px_15px_rgba(212,167,98,0.3)] backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#ffe699] animate-sparkle-twinkle" />
              <span className="text-xs font-black uppercase text-[#fdbf5e] tracking-widest font-outfit">
                {pageBadge}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-serif tracking-tight mt-1 leading-tight">
            <span className="bg-gradient-to-r from-white via-[#fff2d6] to-[#f4d193] bg-clip-text text-transparent">
              {pageTitle}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mt-4 font-medium leading-relaxed">
            {pageDesc}
          </p>

          {/* 4 Trust & Milestone Counter Cards (Eye-Catching) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-10">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-left flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#d4a762]/15 text-[#fdbf5e] shrink-0 border border-[#d4a762]/30">
                <FolderCheck className="w-5 h-5 text-[#fdbf5e]" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-300 block">১০০% সম্পন্ন</span>
                <span className="text-[11px] text-stone-400 block">সফল ডেলিভারি</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-left flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300 shrink-0 border border-amber-500/30">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-300 block">১০০% সলিড কাঠ</span>
                <span className="text-[11px] text-stone-400 block">সিজনড মেহগনি/সেগুন</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-left flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 shrink-0 border border-emerald-500/30">
                <Award className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-300 block">গ্রাহক সন্তুষ্টি</span>
                <span className="text-[11px] text-stone-400 block">প্রমাণিত কোয়ালিটি</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-left flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-300 shrink-0 border border-sky-500/30">
                <Truck className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-300 block">ডেলিভারি ও ফিটিং</span>
                <span className="text-[11px] text-stone-400 block">সারা দেশে সুরক্ষিত</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. MAIN CONTENT: FILTERS, SEARCH & PROJECT GRID
          ======================================================== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-14">
        
        {/* Controls Bar: Category Tabs + Location Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Segmented Category Buttons */}
          <div className="inline-flex bg-stone-200/80 p-1.5 rounded-2xl border border-stone-300/80 gap-1 overflow-x-auto max-w-full shadow-inner">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              <span>সকল প্রজেক্ট</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-white/20">
                {categoryCounts.all}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('full_project')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'full_project'
                  ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              <span>সম্পূর্ণ হোম প্রজেক্ট</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-white/20">
                {categoryCounts.full_project}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('interior')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'interior'
                  ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              <span>ইন্টেরিয়র ডিজাইন</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-white/20">
                {categoryCounts.interior}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('furniture')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'furniture'
                  ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              <span>সেগুন আসবাব</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-white/20">
                {categoryCounts.furniture}
              </span>
            </button>
          </div>

          {/* Quick Location & Project Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="লোকেশন বা নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#d4a762] shadow-xs font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Projects Showcase Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
            {filteredProjects.map((project, index) => {
              const badge = getCategoryBadge(project.category);
              const photoCount = project.photos ? project.photos.length : 0;
              const videoCount = project.videos ? project.videos.length : 0;
              const primaryVideo = videoCount > 0 ? project.videos[0] : '';
              
              // Intelligent Real Video Thumbnail Determination
              const explicitVideoThumb = (project as any).videoThumbnail;
              let realCoverImg = project.coverImage || (project as any).image || (project as any).imgUrl || '';
              const isPlaceholder = !realCoverImg || realCoverImg.includes('unsplash.com');

              if (primaryVideo && ((project as any).preferVideoThumbnail || isPlaceholder || (project.photos && project.photos.includes(realCoverImg)))) {
                const cloudThumb = getCloudinaryVideoThumbnail(primaryVideo);
                realCoverImg = explicitVideoThumb || cloudThumb || (primaryVideo.includes('#t=') ? primaryVideo : `${primaryVideo}#t=0.5`);
              } else if (!realCoverImg) {
                realCoverImg = (project.photos && project.photos.find((p: string) => !!p)) ||
                  (primaryVideo ? (explicitVideoThumb || `${primaryVideo}#t=0.5`) : '');
              }

              const isDirectVideoSource = realCoverImg.endsWith('.mp4') || realCoverImg.includes('#t=') || realCoverImg.endsWith('.webm');

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(212,167,98,0.22)] transition-all duration-400 flex flex-col justify-between group hover:-translate-y-1.5 relative"
                >
                  {/* Card Media Preview Container */}
                  <div 
                    onClick={() => handleOpenModal(project)}
                    className="relative h-64 sm:h-72 w-full bg-stone-900 overflow-hidden cursor-pointer"
                  >
                    {isDirectVideoSource ? (
                      <video
                        src={realCoverImg}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 group-hover:scale-108"
                      />
                    ) : realCoverImg ? (
                      <img
                        src={realCoverImg}
                        alt={project.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                        style={{ 
                          imageRendering: '-webkit-optimize-contrast',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'translateZ(0)'
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 gap-2">
                        <ImageIcon className="w-12 h-12 text-stone-600" />
                        <span className="text-xs font-semibold">ভিডিও/ছবি সংরক্ষিত আছে</span>
                      </div>
                    )}

                    {/* Centered Glowing Play Button if project has a video */}
                    {videoCount > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.7)] border-2 border-white/80 group-hover:scale-115 transition-transform duration-300">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />

                    {/* Top Category Badge & Media Counters */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className={`text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${badge.color} bg-white/95 shadow-xs`}>
                        {badge.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {photoCount > 0 && (
                          <span className="bg-black/75 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                            <ImageIcon className="w-3.5 h-3.5 text-[#fdbf5e]" />
                            <span>{photoCount}</span>
                          </span>
                        )}
                        {videoCount > 0 && (
                          <span className="bg-red-600/90 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                            <VideoIcon className="w-3.5 h-3.5" />
                            <span>{videoCount} Video</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Center Hover Action Pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-gradient-to-r from-[#170f01] to-[#2c1d07] text-[#fdbf5e] border border-[#d4a762]/50 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                        <Maximize2 className="w-3.5 h-3.5 text-[#ffe699]" />
                        <span>গ্যালারি ও ভিডিও প্লে করুন</span>
                      </span>
                    </div>

                    {/* Bottom Location Overlay */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white pointer-events-none">
                      <div className="flex items-center gap-1.5 text-xs text-[#fdbf5e] font-bold drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#fdbf5e]" />
                        <span className="truncate">{project.clientLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Details Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {project.completionDate && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-stone-500 uppercase mb-2">
                          <Calendar className="w-3.5 h-3.5 text-[#a07436]" />
                          <span>হস্তান্তর: {project.completionDate}</span>
                        </div>
                      )}

                      <h3 className="text-lg font-black text-[#2c1d07] font-serif leading-snug group-hover:text-[#966b2d] transition-colors line-clamp-2">
                        {project.title}
                      </h3>

                      {project.titleEn && (
                        <p className="text-xs text-stone-500 font-medium mt-1 font-outfit line-clamp-1">
                          {project.titleEn}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed mt-3 line-clamp-3">
                        {project.description}
                      </p>

                      {project.clientName && (
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="text-stone-400 font-bold text-[11px]">ক্লায়েন্ট:</span>
                          <span className="font-black text-[#2c1d07]">{project.clientName}</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="flex-1 bg-stone-100 hover:bg-[#2c1d07] text-stone-800 hover:text-[#fdbf5e] py-2.5 rounded-xl text-xs font-black transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 border border-stone-200 hover:border-[#d4a762]"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>ফটো অ্যালবাম ও ভিডিও</span>
                      </button>

                      <a
                        href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আপনাদের সম্পন্ন প্রজেক্ট "${project.title}" (${project.clientLocation}) সম্পর্কে জানতে চাই।`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                        title="এই প্রজেক্ট নিয়ে হোয়াটসঅ্যাপে কথা বলুন"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[#d4a762]/10 text-[#966b2d] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#d4a762]/30">
              <FolderCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#2c1d07]">
              কোনো ফলাফল পাওয়া যায়নি
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
              অনুগ্রহ করে অন্য কোনো ক্যাটাগরি বা কিওয়ার্ড দিয়ে অনুসন্ধান করুন।
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-5 inline-flex items-center gap-2 bg-[#2c1d07] text-[#fdbf5e] px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <span>সকল প্রজেক্ট দেখুন</span>
            </button>
          </div>
        )}

        {/* ========================================================
            4. QUALITY PROMISE & FACTORY VISIT SHOWCASE CARD
            ======================================================== */}
        <div className="mt-16 bg-gradient-to-br from-[#1c1202] via-[#2c1d07] to-[#1c1202] rounded-3xl p-7 sm:p-10 border-2 border-[#d4a762]/40 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fdbf5e] mb-2 font-mono">
              <HeartHandshake className="w-4 h-4 text-[#fdbf5e]" />
              <span>কারখানা পরিদর্শন ও কাস্টমাইজেশন সুবিধা</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white">
              আপনার স্বপ্নের বাড়ির জন্য আসবাব বা ইন্টেরিয়র করাতে চান?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed font-medium">
              আমাদের দক্ষ কারিগরদের কাঠ সিজনিং, পলিশিং ও নিখুঁত ফিনিশিং নিজ চোখে পরখ করতে শোরুম ও কারখানায় আপনাকে স্বাগতম।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${phone1}`}
              className="w-full sm:w-auto bg-gradient-to-r from-[#d4a762] to-[#fdbf5e] hover:brightness-110 text-black font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>সরাসরি কল করুন</span>
            </a>

            <a
              href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি ফার্নিচার/ইন্টেরিয়র ডিজাইন নিয়ে সরাসরি আলোচনা করতে চাই।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp-এ বার্তা দিন</span>
            </a>
          </div>
        </div>

      </main>

      {/* ========================================================
          5. FULLSCREEN DETAIL & MEDIA LIGHTBOX MODAL
          ======================================================== */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { type: 'spring', stiffness: 350, damping: 26 } 
              }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-stone-900 text-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-[#d4a762]/45 overflow-hidden my-auto relative"
            >
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-950 via-[#1c1202] to-stone-950 border-b border-stone-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#d4a762]/20 text-[#fdbf5e] flex items-center justify-center border border-[#d4a762]/35 shadow-xs">
                    <FolderCheck className="w-5 h-5 text-[#fdbf5e]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white font-serif line-clamp-1">
                      {activeProject.title}
                    </h3>
                    <p className="text-xs text-stone-400 font-medium flex items-center gap-2">
                      <span>{activeProject.clientLocation}</span>
                      {activeProject.completionDate && (
                        <>
                          <span>•</span>
                          <span>{activeProject.completionDate}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveProject(null)}
                  className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer active:scale-95"
                  title="Close (বন্ধ করুন)"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Media Showcase Screen */}
              <div className="relative bg-black flex items-center justify-center min-h-[350px] sm:min-h-[500px] md:min-h-[580px] max-h-[78vh] overflow-hidden p-2 sm:p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeMediaType}-${activeMediaIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {activeMediaType === 'video' && activeProject.videos && activeProject.videos[activeMediaIndex] ? (
                      <video
                        src={activeProject.videos[activeMediaIndex]}
                        controls
                        autoPlay
                        playsInline
                        className="max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
                      />
                    ) : activeProject.photos && activeProject.photos[activeMediaIndex] ? (
                      <img
                        src={activeProject.photos[activeMediaIndex]}
                        alt={`${activeProject.title} ${activeMediaIndex + 1}`}
                        className="max-h-[72vh] w-full h-full object-contain select-none mx-auto rounded-lg shadow-2xl transition-all"
                        style={{ 
                          imageRendering: '-webkit-optimize-contrast',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'translateZ(0)'
                        }}
                        decoding="sync"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center p-8 text-stone-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 text-stone-600" />
                        <p className="text-sm">কোনো ছবি বা ভিডিও লোড করা যায়নি</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* View Full Original Photo (HD) Link */}
                {activeMediaType === 'photo' && activeProject.photos && activeProject.photos[activeMediaIndex] && (
                  <a
                    href={activeProject.photos[activeMediaIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-black/75 hover:bg-black text-amber-300 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md z-20 cursor-pointer"
                    title="আসল ফুল কোয়ালিটি ছবি নতুন ট্যাবে দেখুন"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#fdbf5e]" />
                    <span>আসল ছবি (HD)</span>
                  </a>
                )}

                {/* Left / Right Nav Arrows for Photos */}
                {activeMediaType === 'photo' && activeProject.photos && activeProject.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : activeProject.photos.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white transition-all cursor-pointer border border-[#d4a762]/30 active:scale-95 shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveMediaIndex((prev) => (prev < activeProject.photos.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white transition-all cursor-pointer border border-[#d4a762]/30 active:scale-95 shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Media Thumbnails & Switcher Bar */}
              <div className="p-3 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between gap-3 overflow-x-auto">
                <div className="flex items-center gap-2">
                  {/* Photo Thumbnails */}
                  {activeProject.photos && activeProject.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveMediaType('photo');
                        setActiveMediaIndex(idx);
                      }}
                      className={`h-12 w-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeMediaType === 'photo' && activeMediaIndex === idx
                          ? 'border-[#d4a762] scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}

                  {/* Video Selector Buttons */}
                  {activeProject.videos && activeProject.videos.map((vid, idx) => (
                    <button
                      key={`vid-${idx}`}
                      onClick={() => {
                        setActiveMediaType('video');
                        setActiveMediaIndex(idx);
                      }}
                      className={`h-12 px-3 rounded-lg flex items-center gap-1.5 border-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        activeMediaType === 'video' && activeMediaIndex === idx
                          ? 'bg-red-600 border-white text-white'
                          : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Video {idx + 1}</span>
                    </button>
                  ))}
                </div>

                <span className="text-[11px] font-mono text-stone-400 shrink-0">
                  {activeMediaType === 'photo' && activeProject.photos
                    ? `${activeMediaIndex + 1} / ${activeProject.photos.length}`
                    : 'ভিডিও'}
                </span>
              </div>

              {/* Bottom Information & Action Bar */}
              <div className="p-5 sm:p-6 bg-stone-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-y-auto">
                <div>
                  <h4 className="text-base font-black text-white">{activeProject.title}</h4>
                  <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                    {activeProject.description}
                  </p>
                  {activeProject.clientName && (
                    <p className="text-xs text-[#fdbf5e] font-semibold mt-1">
                      হ্যান্ডওভার গ্রহণকারী: {activeProject.clientName}
                    </p>
                  )}
                </div>

                <a
                  href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আপনাদের "${activeProject.title}" (${activeProject.clientLocation}) প্রজেক্টটির মতো ফার্নিচার/ইন্টেরিয়র সম্পর্কে আলোচনা করতে চাই।`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>এই প্রজেক্ট নিয়ে হোয়াটসঅ্যাপে জানুন</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          6. PAGE FOOTER
          ======================================================== */}
      <footer className="bg-[#170f01] text-stone-400 py-8 px-4 text-center text-xs border-t border-stone-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© ২০২৬ {brandName} | সর্বস্বত্ব সংরক্ষিত</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="text-stone-300 hover:text-white transition-colors cursor-pointer font-bold"
            >
              হোমপেজ (Home)
            </button>
            <button
              onClick={onBackToHome}
              className="text-stone-400 hover:text-[#fdbf5e] transition-colors cursor-pointer"
            >
              যোগাযোগ
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HandoverProjectsPage;
