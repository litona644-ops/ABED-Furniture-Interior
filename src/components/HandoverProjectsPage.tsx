import React, { useState } from 'react';
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
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft,
  Home,
  Phone,
  MessageCircle,
  Maximize2,
  Settings
} from 'lucide-react';
import { CompletedProject, ProjectCategory } from '../types';

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
  onOpenAdmin,
  pageBadge = 'Delivered Work & Customer Handovers',
  pageTitle = 'Our Handover Projects',
  pageDesc = 'আমাদের সম্মানিত গ্রাহকদের সফলভাবে বুঝিয়ে দেওয়া প্রিমিয়াম আসবাবপত্র ও এক্সক্লুসিভ হোম ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম।'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');
  const [activeProject, setActiveProject] = useState<CompletedProject | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [activeMediaType, setActiveMediaType] = useState<'photo' | 'video'>('photo');

  const filteredProjects = projects.filter((project) => {
    // Only display published projects to public website visitors (drafts remain admin-only)
    if (project.isPublished === false) return false;
    if (selectedCategory === 'all') return true;
    return project.category === selectedCategory;
  });

  const getCategoryBadge = (category: ProjectCategory) => {
    switch (category) {
      case 'interior':
        return { label: 'ইন্টেরিয়র ডিজাইন', en: 'Interior Project', color: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/25' };
      case 'furniture':
        return { label: 'সেগুন আসবাবপত্র', en: 'Teak Furniture', color: 'bg-amber-500/10 text-amber-900 border-amber-500/25' };
      case 'full_project':
      default:
        return { label: 'সম্পূর্ণ প্রজেক্ট', en: 'Full Handover', color: 'bg-[#d4a762]/15 text-[#8f6424] border-[#d4a762]/30' };
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
    <div className="min-h-screen bg-[#faf9f4] text-stone-800 font-sans flex flex-col">
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#170f01]/95 backdrop-blur-md border-b border-[#d4a762]/30 text-white px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#fdbf5e] hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-[#d4a762]/30 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>হোমপেজে ফিরে যান (Back to Home)</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs text-stone-400 font-medium">
              সরাসরি যোগাযোগ: <strong className="text-[#fdbf5e]">{phone1}</strong>
            </span>
            <a
              href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আপনাদের হ্যান্ডওভার প্রজেক্ট দেখে যোগাযোগ করছি।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Page Header & Hero */}
      <section className="bg-gradient-to-b from-[#1c1202] via-[#281903] to-[#170f01] text-white py-12 sm:py-16 px-4 md:px-8 relative overflow-hidden border-b border-[#d4a762]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a762]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          
          {/* Breadcrumb Navigation */}
          <div className="inline-flex items-center gap-2 text-xs text-[#d4a762] mb-4">
            <button onClick={onBackToHome} className="hover:underline flex items-center gap-1 cursor-pointer">
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </button>
            <span>/</span>
            <span className="text-white font-semibold">Our Handover Projects</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#d4a762]/20 border border-[#d4a762]/40 px-4 py-1.5 rounded-full mb-3 shadow-xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#fdbf5e] animate-pulse" />
            <span className="text-[11px] font-black uppercase text-[#fdbf5e] tracking-widest font-outfit">
              {pageBadge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight mt-1">
            {pageTitle}
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mt-3 font-medium leading-relaxed">
            {pageDesc}
          </p>

          <div className="w-20 h-1 bg-[#d4a762] mx-auto rounded-full mt-6" />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10">
        {/* Category Filters */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex bg-stone-200/70 p-1.5 rounded-2xl border border-stone-300/80 gap-1.5 shadow-inner">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              সকল প্রজেক্ট ({projects.length})
            </button>

            <button
              onClick={() => setSelectedCategory('full_project')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'full_project'
                  ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              সম্পূর্ণ হোম প্রজেক্ট
            </button>

            <button
              onClick={() => setSelectedCategory('interior')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'interior'
                  ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              ইন্টেরিয়র ডিজাইন
            </button>

            <button
              onClick={() => setSelectedCategory('furniture')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'furniture'
                  ? 'bg-[#2c1d07] text-[#fdbf5e] shadow-md scale-[1.02]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60'
              }`}
            >
              সেগুন কাঠের আসবাব
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const badge = getCategoryBadge(project.category);
              const photoCount = project.photos ? project.photos.length : 0;
              const videoCount = project.videos ? project.videos.length : 0;
              const coverImg = 
                project.coverImage || 
                (project as any).image || 
                (project as any).imgUrl || 
                (project.photos && project.photos.find((p: string) => !!p)) || 
                ((project as any).gallery && (project as any).gallery.find((g: string) => !!g)) || 
                '';

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  {/* Card Media Preview */}
                  <div 
                    onClick={() => handleOpenModal(project)}
                    className="relative h-64 sm:h-72 w-full bg-stone-900 overflow-hidden cursor-pointer"
                  >
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt={project.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
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
                        <span className="text-xs font-semibold">কোনো ছবি আপলোড করা হয়নি</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Top Category & Counts Bar */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className={`text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${badge.color} bg-white/90`}>
                        {badge.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {photoCount > 0 && (
                          <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
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

                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/95 text-[#2c1d07] px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                        <Maximize2 className="w-3.5 h-3.5 text-[#a07436]" />
                        <span>গ্যালারি ও ভিডিও দেখুন</span>
                      </span>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white pointer-events-none">
                      <div className="flex items-center gap-1 text-[11px] text-[#fdbf5e] font-semibold truncate drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
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

                    {/* Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="flex-1 bg-stone-100 hover:bg-[#2c1d07] text-stone-800 hover:text-[#fdbf5e] py-2.5 rounded-xl text-xs font-black transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>ফটো অ্যালবাম ও ভিডিও</span>
                      </button>

                      <a
                        href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আপনাদের সম্পন্ন প্রজেক্ট "${project.title}" (${project.clientLocation}) সম্পর্কে জানতে চাই।`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
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
          /* Clean Empty State when no projects are uploaded from Admin */
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[#d4a762]/10 text-[#966b2d] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#d4a762]/30">
              <FolderCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#2c1d07]">
              বর্তমানে কোনো হ্যান্ডওভার প্রজেক্ট প্রদর্শিত নেই
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
              এডমিন প্যানেল থেকে হ্যান্ডওভার প্রজেক্টের আসল ছবি, ভিডিও এবং তথ্য যুক্ত করলেই তা এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
            </p>
            <button
              onClick={onBackToHome}
              className="mt-6 inline-flex items-center gap-2 bg-[#2c1d07] text-[#fdbf5e] hover:bg-[#1a1200] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোমপেজে ফিরে যান</span>
            </button>
          </div>
        )}

        {/* Back to Home CTA at bottom */}
        <div className="mt-16 text-center">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#a07436]" />
            <span>হোমপেজে ফিরে যান (Back to Homepage)</span>
          </button>
        </div>
      </main>

      {/* FULL-SCREEN DETAIL & MEDIA LIGHTBOX MODAL WITH LUXURY SPRING POP-UP */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 35 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { type: 'spring', stiffness: 350, damping: 26 } 
              }}
              exit={{ 
                scale: 0.9, 
                opacity: 0, 
                y: 20, 
                transition: { duration: 0.2 } 
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-stone-900 text-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#d4a762]/40 overflow-hidden my-auto relative"
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
                        className="max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-lg"
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
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>এই প্রজেক্ট নিয়ে হোয়াটসঅ্যাপে জানুন</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Footer */}
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
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-stone-400 hover:text-[#fdbf5e] transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
