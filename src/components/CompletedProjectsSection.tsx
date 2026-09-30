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
  Maximize2
} from 'lucide-react';
import { CompletedProject, ProjectCategory } from '../types';

interface CompletedProjectsSectionProps {
  projects: CompletedProject[];
  brandName?: string;
  phone1?: string;
}

export const CompletedProjectsSection: React.FC<CompletedProjectsSectionProps> = ({
  projects,
  brandName = 'আবেদ ফার্নিচার ও ইন্টেরিয়র',
  phone1 = '+8801816234157'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');
  const [activeProject, setActiveProject] = useState<CompletedProject | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [activeMediaType, setActiveMediaType] = useState<'photo' | 'video'>('photo');

  const filteredProjects = projects.filter((project) => {
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
    // If project has photos, default to photo; else video
    if (project.photos && project.photos.length > 0) {
      setActiveMediaType('photo');
    } else if (project.videos && project.videos.length > 0) {
      setActiveMediaType('video');
    } else {
      setActiveMediaType('photo');
    }
  };

  return (
    <section id="completed-projects" className="py-20 bg-gradient-to-b from-white via-[#faf9f4] to-white px-4 md:px-8 border-b border-stone-200/70 font-sans relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-[#d4a762]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#d4a762]/10 border border-[#d4a762]/25 px-4 py-1.5 rounded-full mb-3">
            <FolderCheck className="w-4 h-4 text-[#a07436]" />
            <span className="text-[11px] font-black uppercase text-[#966b2d] tracking-widest font-outfit">
              Delivered Work & Real Milestones
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2c1d07] font-serif tracking-tight">
            সম্পন্ন ও সফল হ্যান্ডওভার প্রজেক্টসমূহ
          </h2>
          <p className="text-xs md:text-sm font-bold text-stone-500 mt-1 uppercase font-outfit tracking-wider">
            Completed & Handover Projects Showcase
          </p>
          
          <div className="w-20 h-1 bg-[#d4a762] mx-auto rounded-full mt-4 mb-3" />
          
          <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed mt-3">
            আমাদের দক্ষ কারিগর ও ডিজাইনার টিমের বাস্তবায়িত কিছু উল্লেখযোগ্য হোম ইন্টেরিয়র এবং খাঁটি সেগুন কাঠের আসবাবপত্র প্রজেক্ট—যা আমরা সাফল্যের সাথে সম্মানিত ক্লায়েন্টদের নিকট হস্তান্তর করেছি।
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200/80 gap-1.5 shadow-inner">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#966b2d] shadow-sm border border-[#d4a762]/35'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              সকল প্রজেক্ট ({projects.length})
            </button>
            <button
              onClick={() => setSelectedCategory('full_project')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'full_project'
                  ? 'bg-white text-[#966b2d] shadow-sm border border-[#d4a762]/35'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              সম্পূর্ণ হোম প্রজেক্ট
            </button>
            <button
              onClick={() => setSelectedCategory('interior')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'interior'
                  ? 'bg-white text-[#966b2d] shadow-sm border border-[#d4a762]/35'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              ইন্টেরিয়র ডিজাইন
            </button>
            <button
              onClick={() => setSelectedCategory('furniture')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'furniture'
                  ? 'bg-white text-[#966b2d] shadow-sm border border-[#d4a762]/35'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              সেগুন কাঠের আসবাব
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project, idx) => {
            const badge = getCategoryBadge(project.category);
            const coverImg = 
              project.coverImage || 
              (project as any).image || 
              (project as any).imgUrl || 
              (project.photos && project.photos.find((p: string) => !!p)) || 
              ((project as any).gallery && (project as any).gallery.find((g: string) => !!g)) || 
              'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80';
            const totalPhotos = project.photos ? project.photos.length : 0;
            const totalVideos = project.videos ? project.videos.length : 0;

            return (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-[#d4a762]/45"
              >
                {/* Media Preview Box */}
                <div 
                  onClick={() => handleOpenModal(project)}
                  className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900 cursor-pointer"
                >
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${badge.color} bg-white/90`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Media counts indicator pill */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                    {totalPhotos > 0 && (
                      <span className="bg-black/65 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/15">
                        <ImageIcon className="w-3 h-3 text-[#fdbf5e]" />
                        <span>{totalPhotos}</span>
                      </span>
                    )}
                    {totalVideos > 0 && (
                      <span className="bg-red-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-red-400/40">
                        <VideoIcon className="w-3 h-3 text-white" />
                        <span>{totalVideos}</span>
                      </span>
                    )}
                  </div>

                  {/* Overlay Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/70 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-[#fdbf5e]" />
                      <span>গ্যালারি ও ভিডিও দেখুন</span>
                    </span>
                  </div>

                  {/* Bottom ribbon inside image: Location and Completion Date */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="flex items-center gap-1 truncate text-stone-200 drop-shadow-md text-[11.5px]">
                      <MapPin className="w-3.5 h-3.5 text-[#fdbf5e] shrink-0" />
                      <span className="truncate">{project.clientLocation || 'ঢাকা, বাংলাদেশ'}</span>
                    </span>
                    {project.completionDate && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-200 font-mono shrink-0 drop-shadow-md bg-black/40 px-2 py-0.5 rounded-md">
                        <Calendar className="w-3 h-3" />
                        <span>{project.completionDate}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Details Content */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 
                    onClick={() => handleOpenModal(project)}
                    className="text-lg font-black text-[#2c1d07] group-hover:text-[#b07e35] transition-colors line-clamp-2 cursor-pointer leading-snug"
                  >
                    {project.title}
                  </h3>

                  {project.titleEn && (
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide mt-1 font-outfit line-clamp-1">
                      {project.titleEn}
                    </p>
                  )}

                  <p className="text-xs md:text-sm text-stone-600 leading-relaxed line-clamp-3 mt-3 font-medium flex-1">
                    {project.description}
                  </p>

                  {/* Client name / handover note */}
                  {project.clientName && (
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">হস্তান্তরঃ {project.clientName}</span>
                    </div>
                  )}

                  {/* Card Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="text-xs font-black text-[#966b2d] hover:text-[#2c1d07] transition-colors flex items-center gap-1 cursor-pointer py-1.5"
                    >
                      <span>বিস্তারিত দেখুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আপনাদের এই সম্পন্ন প্রজেক্টটি দেখেছি: ${project.title} (${project.clientLocation})। আমার বাড়িতেও এমন কাজ করানোর বিষয়ে বিস্তারিত আলোচনা করতে চাই।`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#24d366] hover:bg-[#1ebd54] text-white text-[11px] font-black px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                      হোয়াটসঅ্যাপ ইনকোয়ারি
                    </a>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-md mx-auto">
            <FolderCheck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-base font-bold text-stone-700">এই ক্যাটাগরিতে এখনো কোনো প্রজেক্ট যুক্ত করা হয়নি।</p>
            <p className="text-xs text-stone-400 mt-1">এডমিন প্যানেল থেকে নতুন সম্পন্ন প্রজেক্ট সহজেই যুক্ত করতে পারেন।</p>
          </div>
        )}

      </div>

      {/* LIGHTBOX / PROJECT DETAILS SHOWCASE MODAL */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#faf9f4] text-stone-900 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#d4a762]/35 relative"
            >
              {/* Modal Top Header */}
              <div className="px-5 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="h-8 w-8 rounded-lg bg-[#d4a762]/15 text-[#a07436] flex items-center justify-center shrink-0">
                    <FolderCheck className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm sm:text-base font-extrabold text-stone-900 truncate">
                      {activeProject.title}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-bold flex items-center gap-2">
                      <span>{activeProject.clientLocation}</span>
                      {activeProject.completionDate && <span>• {activeProject.completionDate}</span>}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveProject(null)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 p-2 rounded-full transition-colors cursor-pointer shrink-0 ml-2"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Scroll Area */}
              <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
                
                {/* Media Viewer Box */}
                <div className="space-y-3">
                  {/* Tab Selector if both photos and videos are available */}
                  {activeProject.videos && activeProject.videos.length > 0 && activeProject.photos && activeProject.photos.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setActiveMediaType('photo'); setActiveMediaIndex(0); }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          activeMediaType === 'photo'
                            ? 'bg-[#1c1202] text-[#fdbf5e] shadow-sm'
                            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>প্রজেক্ট ফটো ({activeProject.photos.length})</span>
                      </button>

                      <button
                        onClick={() => { setActiveMediaType('video'); setActiveMediaIndex(0); }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          activeMediaType === 'video'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        <VideoIcon className="w-3.5 h-3.5" />
                        <span>প্রজেক্ট ভিডিও ({activeProject.videos.length})</span>
                      </button>
                    </div>
                  )}

                  {/* Main Media Player / Photo Screen */}
                  <div className="relative bg-black rounded-2xl overflow-hidden min-h-[350px] sm:min-h-[480px] md:min-h-[560px] max-h-[75vh] flex items-center justify-center border border-stone-800 p-2 sm:p-4">
                    {activeMediaType === 'photo' && activeProject.photos && activeProject.photos.length > 0 ? (
                      <>
                        <img
                          src={activeProject.photos[activeMediaIndex] || activeProject.coverImage}
                          alt={`${activeProject.title} photo ${activeMediaIndex + 1}`}
                          className="max-h-[70vh] w-full h-full object-contain mx-auto select-none rounded-lg shadow-2xl transition-all duration-300"
                          style={{ 
                            imageRendering: '-webkit-optimize-contrast',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'translateZ(0)'
                          }}
                          decoding="sync"
                          referrerPolicy="no-referrer"
                        />
                        {/* Navigation Arrows if multiple photos */}
                        {activeProject.photos.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveMediaIndex(prev => (prev > 0 ? prev - 1 : activeProject.photos.length - 1))}
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition-all cursor-pointer"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setActiveMediaIndex(prev => (prev < activeProject.photos.length - 1 ? prev + 1 : 0))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition-all cursor-pointer"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-sm">
                              {activeMediaIndex + 1} / {activeProject.photos.length}
                            </div>
                          </>
                        )}
                        {/* Full Size Original View button */}
                        <a
                          href={activeProject.photos[activeMediaIndex] || activeProject.coverImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 bg-black/70 hover:bg-black text-amber-300 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md"
                          title="আসল ফুল কোয়ালিটি ছবি নতুন ট্যাবে দেখুন"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-[#fdbf5e]" />
                          <span>আসল ছবি (HD)</span>
                        </a>
                      </>
                    ) : activeMediaType === 'video' && activeProject.videos && activeProject.videos.length > 0 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <video
                          key={activeProject.videos[activeMediaIndex]}
                          src={activeProject.videos[activeMediaIndex]}
                          controls
                          playsInline
                          className="max-h-[70vh] max-w-full w-auto h-auto bg-black rounded-lg"
                        >
                          আপনার ব্রাউজার ভিডিওটি প্লে করতে পারছে না।
                        </video>
                      </div>
                    ) : (
                      <div className="p-8 text-stone-400 text-center">
                        <ImageIcon className="w-10 h-10 mx-auto mb-2 text-stone-600" />
                        <p className="text-xs">কোনো ফটো বা ভিডিও সংযুক্ত করা নেই</p>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails Row for Photos */}
                  {activeMediaType === 'photo' && activeProject.photos && activeProject.photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {activeProject.photos.map((photo, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveMediaIndex(i)}
                          className={`relative h-16 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            activeMediaIndex === i ? 'border-[#d4a762] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={photo}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Thumbnails Row for Videos */}
                  {activeMediaType === 'video' && activeProject.videos && activeProject.videos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {activeProject.videos.map((vid, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveMediaIndex(i)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold shrink-0 border-2 transition-all cursor-pointer ${
                            activeMediaIndex === i ? 'border-red-500 shadow-md' : 'border-transparent opacity-70'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 text-red-400" />
                          <span>ভিডিও #{i + 1}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Description & Highlights */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#a07436] tracking-wider mb-1">
                      প্রজেক্টের বিবরণ ও স্পেসিফিকেশন
                    </h4>
                    <p className="text-sm md:text-base text-stone-700 leading-relaxed whitespace-pre-line font-medium">
                      {activeProject.description}
                    </p>
                  </div>

                  {activeProject.descriptionEn && (
                    <div className="pt-3 border-t border-stone-100">
                      <p className="text-xs text-stone-500 font-sans leading-relaxed italic">
                        {activeProject.descriptionEn}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100">
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-stone-400">লোকেশন (Location)</span>
                      <p className="text-xs font-extrabold text-stone-800 mt-0.5">{activeProject.clientLocation}</p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-stone-400">সম্পন্নের তারিখ (Completion)</span>
                      <p className="text-xs font-extrabold text-stone-800 mt-0.5">{activeProject.completionDate || 'সম্পন্ন'}</p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-stone-400">ক্যাটাগরি (Type)</span>
                      <p className="text-xs font-extrabold text-[#966b2d] mt-0.5">
                        {getCategoryBadge(activeProject.category).label}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Bottom Footer Actions */}
              <div className="px-5 py-4 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <p className="text-xs text-stone-500 text-center sm:text-left">
                  আপনিও কি আপনার বাড়ির জন্য এই ধরণের কাস্টম কাজ করাতে চান?
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${phone1.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আবেদের এই সম্পন্ন প্রজেক্টটি দেখেছি: ${activeProject.title} (${activeProject.clientLocation})। আমার বাড়িতেও এমন কাজ করানোর বিষয়ে বিস্তারিত আলোচনা করতে চাই।`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#24d366] hover:bg-[#1ebd54] text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto active:scale-95 cursor-pointer"
                  >
                    <span>হোয়াটসঅ্যাপে এই কাজের বাজেট জানুন</span>
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
