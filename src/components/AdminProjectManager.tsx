import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  UploadCloud, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Play, 
  Film, 
  Loader2, 
  Calendar, 
  MapPin, 
  User, 
  Star, 
  Eye,
  EyeOff,
  Globe,
  FolderCheck,
  AlertTriangle,
  Save,
  Settings,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CompletedProject, ProjectCategory } from '../types';
import { uploadProjectImage, uploadProjectVideo, ensureAuthSession } from '../lib/firebase';
import { 
  saveProjectToSupabase, 
  deleteProjectFromSupabase, 
  toggleProjectPublishInSupabase 
} from '../lib/supabase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  captureVideoFrame, 
  getCloudinaryVideoThumbnail, 
  getProjectVideoThumbnail 
} from '../lib/videoThumbnail';

interface AdminProjectManagerProps {
  projects: CompletedProject[];
  setProjects: React.Dispatch<React.SetStateAction<CompletedProject[]>>;
  showNotification: (message: string, type?: 'success' | 'error') => void;
  siteSettings?: any;
  setSiteSettings?: React.Dispatch<React.SetStateAction<any>>;
  onSaveSiteSettings?: () => void;
}

export const AdminProjectManager: React.FC<AdminProjectManagerProps> = ({
  projects,
  setProjects,
  showNotification,
  siteSettings,
  setSiteSettings,
  onSaveSiteSettings
}) => {
  // Collapsible state for Handover Upper Text Editor
  const [isTextEditorOpen, setIsTextEditorOpen] = useState(true);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('full_project');
  const [clientLocation, setClientLocation] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Upload & Operation States
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [uploadProgressPercent, setUploadProgressPercent] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [publishingProjectId, setPublishingProjectId] = useState<string | null>(null);

  // Optional manual video URL input
  const [manualVideoUrl, setManualVideoUrl] = useState('');
  const [showManualVideoInput, setShowManualVideoInput] = useState(false);

  // Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: 'delete_project' | 'delete_photo' | 'delete_video';
    targetId?: string;
    targetIndex?: number;
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionType: 'delete_project'
  });

  // File Input Refs for 1-Click Upload
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Reset form
  const resetForm = () => {
    setTitle('');
    setTitleEn('');
    setCategory('full_project');
    setClientLocation('');
    setCompletionDate('');
    setClientName('');
    setDescription('');
    setDescriptionEn('');
    setCoverImage('');
    setPhotos([]);
    setVideos([]);
    setIsPublished(true);
    setEditingProjectId(null);
    setManualVideoUrl('');
    setShowManualVideoInput(false);
  };

  // Open Add New Project Form
  const handleOpenAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Open Edit Existing Project Form
  const handleOpenEditForm = (project: CompletedProject) => {
    setEditingProjectId(project.id);
    setTitle(project.title || '');
    setTitleEn(project.titleEn || '');
    setCategory(project.category || 'full_project');
    setClientLocation(project.clientLocation || '');
    setCompletionDate(project.completionDate || '');
    setClientName(project.clientName || '');
    setDescription(project.description || '');
    setDescriptionEn(project.descriptionEn || '');
    setCoverImage(project.coverImage || '');
    setPhotos(project.photos ? [...project.photos] : []);
    setVideos(project.videos ? [...project.videos] : []);
    setIsPublished(project.isPublished !== false);
    setIsFormOpen(true);
  };

  // Dedicated Toggle Handler for Instant Project Publish / Public Status
  const handleTogglePublish = async (project: CompletedProject) => {
    if (publishingProjectId) return; // Prevent duplicate clicks
    const currentIsPublic = project.isPublished !== false;
    const nextStatus = !currentIsPublic;
    setPublishingProjectId(project.id);

    try {
      // 1. Update in Supabase Database
      try {
        await toggleProjectPublishInSupabase(project.id, nextStatus);
      } catch (sbErr) {
        console.warn('Supabase toggle note:', sbErr);
      }

      // 2. Also keep Firebase in sync if available
      try {
        await ensureAuthSession();
        const statusPayload = {
          isPublished: nextStatus,
          isPublic: nextStatus,
          status: nextStatus ? 'published' : 'draft',
          updatedAt: Date.now()
        };
        await setDoc(doc(db, 'completed_projects', project.id), statusPayload, { merge: true });
      } catch (fbErr) {
        console.warn('Firebase sync note:', fbErr);
      }

      const statusPayload = {
        isPublished: nextStatus,
        isPublic: nextStatus,
        status: (nextStatus ? 'published' : 'draft') as 'published' | 'draft',
        updatedAt: Date.now()
      };

      // Immediately update local state so UI updates without waiting
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, ...statusPayload } : p));

      if (nextStatus) {
        showNotification('Project published successfully. (প্রজেক্ট সফলভাবে পাবলিক করা হয়েছে)', 'success');
      } else {
        showNotification('Project moved to draft. (প্রজেক্ট ড্রাফট করা হয়েছে)', 'success');
      }
    } catch (err: any) {
      console.error('Failed to update project publish status:', err);
      showNotification('Failed to publish project. Please try again. (পাবলিশ ব্যর্থ হয়েছে)', 'error');
    } finally {
      setPublishingProjectId(null);
    }
  };

  // PHOTO UPLOAD: Select JPG, JPEG, PNG, WEBP directly from phone/PC and upload to Cloudinary
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Admin authorization check
    try {
      await ensureAuthSession();
    } catch {
      showNotification('শুধুমাত্র অনুমোদিত এডমিন আপলোড করতে পারবেন।', 'error');
      return;
    }

    setIsUploadingPhoto(true);
    setUploadProgressPercent(0);
    const newUploadedUrls: string[] = [];

    try {
      const fileList: File[] = Array.from(files);
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadProgressText(`ছবি Cloudinary-তে আপলোড হচ্ছে (${i + 1}/${fileList.length})...`);
        const url = await uploadProjectImage(
          file, 
          editingProjectId || 'project',
          (percent) => {
            setUploadProgressPercent(percent);
            setUploadProgressText(`ছবি Cloudinary-তে আপলোড হচ্ছে (${i + 1}/${fileList.length}) - ${percent}%`);
          }
        );
        if (url) {
          newUploadedUrls.push(url);
        }
      }

      setPhotos(prev => {
        const updated = [...prev, ...newUploadedUrls];
        if (!coverImage && updated.length > 0) {
          setCoverImage(updated[0]);
        }
        return updated;
      });

      showNotification(`${newUploadedUrls.length}টি ছবি সফলভাবে Cloudinary-তে আপলোড হয়েছে!`, 'success');
    } catch (err: any) {
      console.error('Photo upload error:', err);
      showNotification(err.message || 'ছবি আপলোডে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsUploadingPhoto(false);
      setUploadProgressText('');
      setUploadProgressPercent(0);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  // VIDEO UPLOAD: Select 1-2 min MP4 video from phone/PC and upload directly to Cloudinary
  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Admin authorization check
    try {
      await ensureAuthSession();
    } catch {
      showNotification('শুধুমাত্র অনুমোদিত এডমিন আপলোড করতে পারবেন।', 'error');
      return;
    }

    const file = files[0];

    // File format check
    const isMp4 = file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
    if (!isMp4) {
      showNotification('শুধুমাত্র MP4 ফরম্যাটের ভিডিও নির্বাচন করুন।', 'error');
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    // File size check: 100MB limit for 1-2 min HD MP4 video
    const maxSizeBytes = 100 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showNotification('ভিডিও সাইজ ১০০MB এর বেশি! ১–২ মিনিটের MP4 ভিডিও নির্বাচন করুন।', 'error');
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    // Immediately capture real video frame from the file itself for instant real thumbnail!
    try {
      captureVideoFrame(file, 0.5).then((frameDataUrl) => {
        if (frameDataUrl) {
          setCoverImage(frameDataUrl);
        }
      });
    } catch (e) {
      console.warn('Frame capture note:', e);
    }

    setIsUploadingVideo(true);
    setUploadProgressPercent(0);
    setUploadProgressText('ভিডিও Cloudinary-তে আপলোড হচ্ছে (0%)...');

    try {
      const videoUrl = await uploadProjectVideo(
        file, 
        editingProjectId || 'project',
        (percent) => {
          setUploadProgressPercent(percent);
          setUploadProgressText(`ভিডিও Cloudinary-তে আপলোড হচ্ছে (${percent}%)...`);
        }
      );
      if (videoUrl) {
        setVideos(prev => [...prev, videoUrl]);
        const realCloudThumb = getCloudinaryVideoThumbnail(videoUrl);
        if (realCloudThumb) {
          setCoverImage(realCloudThumb);
        }
        showNotification('প্রজেক্ট ভিডিও ও আসল ভিডিও থাম্বনেইল সফলভাবে সেট হয়েছে!', 'success');
      }
    } catch (err: any) {
      console.error('Video upload error:', err);
      showNotification(err.message || 'ভিডিও আপলোডে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsUploadingVideo(false);
      setUploadProgressText('');
      setUploadProgressPercent(0);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // Add Manual Video URL (e.g., direct mp4 or cloud storage link)
  const handleAddManualVideo = () => {
    if (!manualVideoUrl.trim()) return;
    const vUrl = manualVideoUrl.trim();
    setVideos(prev => [...prev, vUrl]);
    const realCloudThumb = getCloudinaryVideoThumbnail(vUrl);
    if (realCloudThumb) {
      setCoverImage(realCloudThumb);
    } else {
      captureVideoFrame(vUrl, 0.5).then(f => {
        if (f) setCoverImage(f);
      });
    }
    setManualVideoUrl('');
    setShowManualVideoInput(false);
    showNotification('ভিডিও লিংক ও থাম্বনেইল যুক্ত করা হয়েছে', 'success');
  };

  // Prompt Confirmation Modal
  const requestDeleteProject = (project: CompletedProject) => {
    setConfirmModal({
      isOpen: true,
      title: 'প্রজেক্ট ডিলিট নিশ্চিত করুন',
      message: `আপনি কি নিশ্চিতভাবে "${project.title}" প্রজেক্টটি ডিলিট করতে চান? এটি ওয়েবসাইট ও ফায়ারবেস থেকে স্থায়ীভাবে মুছে যাবে।`,
      actionType: 'delete_project',
      targetId: project.id
    });
  };

  const requestDeletePhoto = (index: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'ছবি মুছে ফেলা নিশ্চিত করুন',
      message: 'আপনি কি নিশ্চিতভাবে এই ছবিটি প্রজেক্ট থেকে বাদ দিতে চান?',
      actionType: 'delete_photo',
      targetIndex: index
    });
  };

  const requestDeleteVideo = (index: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'ভিডিও মুছে ফেলা নিশ্চিত করুন',
      message: 'আপনি কি নিশ্চিতভাবে এই ভিডিওটি প্রজেক্ট থেকে বাদ দিতে চান?',
      actionType: 'delete_video',
      targetIndex: index
    });
  };

  // Execute Confirmed Delete Action
  const handleConfirmDelete = async () => {
    if (confirmModal.actionType === 'delete_project' && confirmModal.targetId) {
      const pId = confirmModal.targetId;
      try {
        // 1. Delete from Supabase
        try {
          await deleteProjectFromSupabase(pId);
        } catch (sbErr) {
          console.warn('Supabase delete note:', sbErr);
        }

        // 2. Also delete from Firebase if available
        try {
          await ensureAuthSession();
          await deleteDoc(doc(db, 'completed_projects', pId));
        } catch (fbErr) {
          console.warn('Firebase delete note:', fbErr);
        }

        setProjects(prev => prev.filter(p => p.id !== pId));
        showNotification('প্রজেক্ট সফলভাবে ডিলিট হয়েছে', 'success');
      } catch (err: any) {
        console.error('Delete project error:', err);
        setProjects(prev => prev.filter(p => p.id !== pId));
        showNotification('প্রজেক্ট মুছে ফেলা হয়েছে (Local / Cache)', 'success');
      }
    } else if (confirmModal.actionType === 'delete_photo' && confirmModal.targetIndex !== undefined) {
      const idx = confirmModal.targetIndex;
      const targetPhotoUrl = photos[idx];
      setPhotos(prev => prev.filter((_, i) => i !== idx));
      if (coverImage === targetPhotoUrl) {
        const remaining = photos.filter((_, i) => i !== idx);
        setCoverImage(remaining[0] || '');
      }
      showNotification('ছবি প্রজেক্ট থেকে সরানো হয়েছে', 'success');
    } else if (confirmModal.actionType === 'delete_video' && confirmModal.targetIndex !== undefined) {
      const idx = confirmModal.targetIndex;
      setVideos(prev => prev.filter((_, i) => i !== idx));
      showNotification('ভিডিও প্রজেক্ট থেকে সরানো হয়েছে', 'success');
    }

    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Save or Update Project to Firebase Firestore
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showNotification('প্রজেক্টের নাম বা টাইটেল প্রদান করুন', 'error');
      return;
    }

    if (!description.trim()) {
      showNotification('প্রজেক্টের সংক্ষিপ্ত বিবরণ প্রদান করুন', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const projectId = editingProjectId || `project-${Date.now()}`;
      let finalCover = coverImage.trim();
      const primaryVideoUrl = videos.length > 0 ? videos[0] : '';
      const realVideoThumb = primaryVideoUrl ? getProjectVideoThumbnail(primaryVideoUrl) : '';

      // If project has videos and no custom cover, or placeholder, use the real video thumbnail
      if ((!finalCover || finalCover.includes('unsplash.com')) && primaryVideoUrl) {
        finalCover = realVideoThumb || primaryVideoUrl;
      }
      if (!finalCover) {
        finalCover = photos.length > 0 
          ? photos[0] 
          : (primaryVideoUrl ? (realVideoThumb || primaryVideoUrl) : '');
      }
      
      // Clean payload - NEVER contain undefined so Firestore never rejects
      const projectPayload: any = {
        id: projectId,
        title: title.trim(),
        titleEn: titleEn.trim() || '',
        category,
        clientLocation: clientLocation.trim() || 'ঢাকা, বাংলাদেশ',
        completionDate: completionDate.trim() || 'সম্পন্ন',
        clientName: clientName.trim() || '',
        description: description.trim(),
        descriptionEn: descriptionEn.trim() || '',
        coverImage: finalCover,
        image: finalCover,
        imgUrl: finalCover,
        imageUrl: finalCover,
        videoThumbnail: realVideoThumb || '',
        photos: photos.filter(Boolean),
        gallery: photos.filter(Boolean),
        videos: videos.filter(Boolean),
        isPublished: isPublished,
        isPublic: isPublished,
        status: isPublished ? 'published' : 'draft',
        createdAt: editingProjectId 
          ? (projects.find(p => p.id === editingProjectId)?.createdAt || Date.now())
          : Date.now(),
        updatedAt: Date.now()
      };

      console.log('[Firestore Write] Saving project document to Firestore:', projectId, {
        coverImage: finalCover,
        photosCount: photos.length,
        isPublished
      });

      // 1. Save to Supabase Database
      try {
        await saveProjectToSupabase(projectPayload);
      } catch (sbErr) {
        console.warn('Supabase save project note:', sbErr);
      }

      // 2. Also save to Firebase if available
      try {
        await ensureAuthSession();
        await setDoc(doc(db, 'completed_projects', projectId), projectPayload, { merge: true });
      } catch (fbErr) {
        console.warn('Firebase save project note:', fbErr);
      }

      // Update local state immediately
      setProjects(prev => {
        const existingIdx = prev.findIndex(p => p.id === projectId);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = projectPayload;
          return updated;
        } else {
          return [projectPayload, ...prev];
        }
      });

      showNotification(
        editingProjectId 
          ? 'প্রজেক্টের তথ্য সফলভাবে আপডেট হয়েছে! (Project updated successfully)' 
          : 'Project published successfully. (নতুন প্রজেক্ট সফলভাবে পাবলিশ করা হয়েছে)',
        'success'
      );

      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Save project error:', err);
      showNotification('Failed to publish project. Please try again. (' + (err.message || 'Error') + ')', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 font-sans">
      
      {/* Action Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#1c1202] via-[#2d1c06] to-[#1a1103] p-5 sm:p-6 rounded-3xl text-white shadow-lg border border-[#d4a762]/30 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#d4a762]/20 px-3 py-1 rounded-full text-[#fdbf5e] text-[11px] font-black uppercase tracking-wider mb-2">
            <FolderCheck className="w-3.5 h-3.5" />
            <span>Handover & Completed Works</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#fffdfa] font-serif">
            সম্পন্ন প্রজেক্ট ম্যানেজমেন্ট (Completed Projects)
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            গ্রাহকদের ডেলিভারি দেওয়া আসবাব ও ইন্টেরিয়র প্রজেক্টের ছবি, ভিডিও এবং তথ্য সরাসরি মোবাইল বা কম্পিউটার থেকে যুক্ত ও এডিট করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="bg-gradient-to-r from-[#d4a762] to-[#fdbf5e] hover:from-[#fdbf5e] hover:to-[#d4a762] text-[#1a1200] px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#1a1200]" />
          <span>নতুন প্রজেক্ট যুক্ত করুন (Add Project)</span>
        </button>
      </div>

      {/* Handover Upper Text & Headings Quick Editor */}
      {siteSettings && setSiteSettings && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-5 sm:p-6 mb-8 text-left transition-all">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-[#d4a762]/15 border border-[#d4a762]/30 flex items-center justify-center text-[#d4a762]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>হ্যান্ডওভার সেকশন ও পেজের টেক্সট এডিট (Edit Handover Upper Text)</span>
                  <span className="text-[10px] font-mono text-[#d4a762] bg-[#d4a762]/10 px-2 py-0.5 rounded-full">
                    Live Sync
                  </span>
                </h4>
                <p className="text-[11px] text-stone-400">
                  হোমপেজের হ্যান্ডওভার বাটন পিসের উপরের টেক্সট, সাবটাইটেল এবং হ্যান্ডওভার পেজের টাইটেল এখান থেকে পরিবর্তন করুন।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTextEditorOpen(!isTextEditorOpen)}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              title={isTextEditorOpen ? 'সংকুচিত করুন' : 'প্রসারিত করুন'}
            >
              {isTextEditorOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isTextEditorOpen && (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Homepage Section Upper Text */}
                <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-850 space-y-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4a762] uppercase tracking-wider">
                    <FolderCheck className="w-3.5 h-3.5" />
                    <span>হোমপেজের বাটন পিস টেক্সট (Homepage Section)</span>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-400 uppercase mb-1">
                      হোমপেজ সেকশন ব্যাজ (Handover Upper Badge)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.handoverBadge || ''}
                      onChange={(e) => setSiteSettings((prev: any) => ({ ...prev, handoverBadge: e.target.value }))}
                      placeholder="বাস্তবায়িত কাজের সংগ্রহশালা (Delivered Works)"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-400 uppercase mb-1">
                      হোমপেজ সেকশন শিরোনাম (Handover Title)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.handoverTitle || ''}
                      onChange={(e) => setSiteSettings((prev: any) => ({ ...prev, handoverTitle: e.target.value }))}
                      placeholder="আমাদের ক্লায়েন্টদের সফলভাবে সম্পন্ন ও হস্তান্তরিত প্রজেক্ট"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-400 uppercase mb-1">
                      হোমপেজ সেকশন সাবটাইটেল (Handover Subtitle)
                    </label>
                    <textarea
                      rows={2}
                      value={siteSettings.handoverSubtitle || ''}
                      onChange={(e) => setSiteSettings((prev: any) => ({ ...prev, handoverSubtitle: e.target.value }))}
                      placeholder="হস্তান্তরিত আসবাব ও ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম দেখতে নিচের বাটনে ক্লিক করুন।"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-400 uppercase mb-1">
                      বাটন পিসের ভেতরের লেখা (Button Label)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.handoverButtonLabel || ''}
                      onChange={(e) => setSiteSettings((prev: any) => ({ ...prev, handoverButtonLabel: e.target.value }))}
                      placeholder="Our Handover Projects"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-[#fdbf5e] font-bold focus:outline-none focus:border-[#d4a762]"
                    />
                  </div>
                </div>

                {/* Handover Page Upper Text */}
                <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-850 space-y-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>হ্যান্ডওভার পেজের টপ টেক্সট (Handover Page Hero)</span>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-400 uppercase mb-1">
                      পেজের টপ ব্যাজ (Page Upper Badge)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.handoverPageBadge || ''}
                      onChange={(e) => setSiteSettings((prev: any) => ({ ...prev, handoverPageBadge: e.target.value }))}
                      placeholder="Delivered Work & Customer Handovers"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-400 uppercase mb-1">
                      পেজের মূল টাইটেল (Page Main Title)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.handoverPageTitle || ''}
                      onChange={(e) => setSiteSettings((prev: any) => ({ ...prev, handoverPageTitle: e.target.value }))}
                      placeholder="Our Handover Projects"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-stone-400 uppercase mb-1">
                      পেজের বিবরণ ও ইন্ট্রো (Page Description Paragraph)
                    </label>
                    <textarea
                      rows={3}
                      value={siteSettings.handoverPageDesc || ''}
                      onChange={(e) => setSiteSettings((prev: any) => ({ ...prev, handoverPageDesc: e.target.value }))}
                      placeholder="আমাদের সম্মানিত গ্রাহকদের সফলভাবে বুঝিয়ে দেওয়া প্রিমিয়াম আসবাবপত্র ও এক্সক্লুসিভ হোম ইন্টেরিয়র ডিজাইনের বাস্তব ছবি ও ভিডিও অ্যালবাম।"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4a762]"
                    />
                  </div>
                </div>
              </div>

              {/* Save changes button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onSaveSiteSettings) {
                      onSaveSiteSettings();
                    } else {
                      showNotification('টেক্সট আপডেট সফলভাবে সংরক্ষিত হয়েছে!', 'success');
                    }
                  }}
                  className="bg-[#d4a762] hover:bg-[#ffe082] text-stone-950 px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-102 active:scale-98"
                >
                  <Save className="w-4 h-4 shrink-0" />
                  <span>হ্যান্ডওভার টেক্সট সংরক্ষণ করুন (Save Upper Text)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const cover = project.coverImage || (project.photos && project.photos[0]) || '';
          const photoCount = project.photos ? project.photos.length : 0;
          const videoCount = project.videos ? project.videos.length : 0;

          return (
            <div 
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Media Preview Box */}
              <div className="relative h-48 w-full bg-stone-900 overflow-hidden flex items-center justify-center">
                {cover ? (
                  <img 
                    src={cover} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-500 gap-1">
                    <ImageIcon className="w-8 h-8 text-stone-600" />
                    <span className="text-[11px] font-medium">কোনো ছবি নেই</span>
                  </div>
                )}
                
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="bg-black/75 backdrop-blur-md text-[#fdbf5e] text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-white/10">
                    {project.category === 'interior' ? 'ইন্টেরিয়র' : project.category === 'furniture' ? 'ফার্নিচার' : 'সম্পূর্ণ প্রজেক্ট'}
                  </span>
                  {project.isPublished !== false ? (
                    <span className="bg-emerald-600/95 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-emerald-400/40">
                      <CheckCircle className="w-3 h-3 text-emerald-200" />
                      <span>পাবলিক</span>
                    </span>
                  ) : (
                    <span className="bg-amber-600/95 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-amber-400/40">
                      <EyeOff className="w-3 h-3 text-amber-200" />
                      <span>ড্রাফট</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                  <span className="bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
                    <ImageIcon className="w-3 h-3 text-amber-300" />
                    <span>{photoCount}</span>
                  </span>
                  {videoCount > 0 && (
                    <span className="bg-red-600/90 text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                      <VideoIcon className="w-3 h-3" />
                      <span>{videoCount}</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 drop-shadow-md">
                  <span className="flex items-center gap-1 truncate font-semibold">
                    <MapPin className="w-3 h-3 text-[#fdbf5e]" />
                    <span className="truncate">{project.clientLocation}</span>
                  </span>
                  {project.completionDate && (
                    <span className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded">
                      {project.completionDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-extrabold text-stone-900 text-sm line-clamp-1">
                  {project.title}
                </h4>
                {project.titleEn && (
                  <p className="text-[11px] text-stone-400 uppercase font-semibold line-clamp-1 mt-0.5">
                    {project.titleEn}
                  </p>
                )}
                
                <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                  {project.description}
                </p>

                {project.clientName && (
                  <p className="text-[11px] font-bold text-stone-700 mt-2">
                    ক্লায়েন্টঃ {project.clientName}
                  </p>
                )}

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  {/* Dedicated Publish / Public Status Button */}
                  <button
                    type="button"
                    disabled={publishingProjectId === project.id}
                    onClick={() => handleTogglePublish(project)}
                    className={`font-black text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed ${
                      project.isPublished !== false
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                    title={project.isPublished !== false ? 'ক্লিক করে আনপাবলিশ বা ড্রাফট করুন' : 'ক্লিক করে ওয়েবসাইটে পাবলিক করুন'}
                  >
                    {publishingProjectId === project.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                        <span className="text-[11px]">আপডেট হচ্ছে...</span>
                      </>
                    ) : project.isPublished !== false ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Public (পাবলিক)</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5 text-amber-600" />
                        <span>Publish করুন</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEditForm(project)}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-[#966b2d] font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-amber-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>এডিট করুন</span>
                  </button>

                  <button
                    onClick={() => requestDeleteProject(project)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs p-2 rounded-xl transition-colors flex items-center justify-center cursor-pointer border border-red-200"
                    title="প্রজেক্ট ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
          <FolderCheck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-base font-bold text-stone-700">কোনো সম্পন্ন প্রজেক্ট এখনো যুক্ত করা হয়নি।</p>
          <button
            onClick={handleOpenAddForm}
            className="mt-4 bg-[#1c1202] text-[#fdbf5e] text-xs font-black px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>প্রথম প্রজেক্ট যুক্ত করুন</span>
          </button>
        </div>
      )}

      {/* ADD / EDIT PROJECT MODAL FORM */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in overflow-y-auto">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#d4a762]/20 text-[#966b2d] flex items-center justify-center">
                    {editingProjectId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900">
                      {editingProjectId ? 'প্রজেক্ট এডিট করুন (Edit Project)' : 'নতুন সম্পন্ন প্রজেক্ট যুক্ত করুন (New Project)'}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-medium">
                      ছবি, ভিডিও এবং কাজের বিবরণ আপলোড করে সেভ করুন।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content Scrollable Area */}
              <form onSubmit={handleSaveProject} className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
                
                {/* 1. Project Title & Category */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-stone-800 uppercase tracking-wide mb-1.5">
                        প্রজেক্টের নাম / টাইটেল (বাংলা)*
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="যেমনঃ গুলশান ২ লাক্সারি ডুপ্লেক্স হোম ইন্টেরিয়র"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 focus:border-[#d4a762] rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-stone-800 uppercase tracking-wide mb-1.5">
                        ক্যাটাগরি (Category)*
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                        className="w-full bg-stone-50 border border-stone-300 focus:border-[#d4a762] rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:bg-white font-medium cursor-pointer"
                      >
                        <option value="full_project">সম্পূর্ণ প্রজেক্ট (Full Duplex/Home)</option>
                        <option value="interior">ইন্টেরিয়র ডিজাইন (Interior)</option>
                        <option value="furniture">সেগুন ফার্নিচার (Teak Furniture)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">
                        English Title (Optional)
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Gulshan Luxury Duplex Interior"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">
                        লোকেশন (Client Location)*
                      </label>
                      <input 
                        type="text"
                        placeholder="যেমনঃ গুলশান ২, ঢাকা"
                        value={clientLocation}
                        onChange={(e) => setClientLocation(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">
                        সম্পন্নের তারিখ / মাস (Date)
                      </label>
                      <input 
                        type="text"
                        placeholder="যেমনঃ ফেব্রুয়ারি ২০২৬"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wide mb-1.5">
                      গ্রাহক / ক্লায়েন্টের নাম (Client Name - Optional)
                    </label>
                    <input 
                      type="text"
                      placeholder="যেমনঃ জনাব তারিকুল ইসলাম"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 focus:border-[#d4a762] rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* 2. Project Description */}
                <div>
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wide mb-1.5">
                    প্রজেক্টের সংক্ষিপ্ত বিবরণ (Description in Bengali)*
                  </label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="কাজের বিস্তারিত বিবরণ—যেমনঃ ফলস সিলিং, এম্বিয়েন্ট লাইটিং, সেগুন কাঠের খাট, ডাইনিং ইত্যাদি সম্পন্ন করে চাবি হস্তান্তর করা হয়েছে..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 focus:border-[#d4a762] rounded-xl p-4 text-xs sm:text-sm text-stone-900 focus:outline-none focus:bg-white leading-relaxed font-medium"
                  />
                </div>

                {/* 3. VERY EASY PHOTO UPLOAD SECTION */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#a07436]" />
                        <span>প্রজেক্টের ছবি আপলোড (Upload Project Photos)</span>
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        JPG, JPEG, PNG, WEBP ছবি সরাসরি সিলেক্ট করলেই Cloudinary-তে আপলোড হয়ে যাবে।
                      </p>
                    </div>

                    {/* Hidden input for photo selection */}
                    <input 
                      ref={photoInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp,image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      onClick={() => photoInputRef.current?.click()}
                      className="bg-stone-900 hover:bg-black text-[#fdbf5e] text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#fdbf5e]" />
                          <span>আপলোড হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload Photos</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isUploadingPhoto && (
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-600" />
                          <span>{uploadProgressText || 'ছবিগুলো Cloudinary-তে আপলোড করা হচ্ছে...'}</span>
                        </div>
                        <span className="font-mono text-amber-800 font-black">{uploadProgressPercent}%</span>
                      </div>
                      <div className="w-full bg-amber-200/70 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#d4a762] h-full rounded-full transition-all duration-200 ease-out"
                          style={{ width: `${uploadProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Uploaded Photos Preview List */}
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {photos.map((url, idx) => (
                        <div 
                          key={idx} 
                          className={`relative group rounded-xl overflow-hidden border-2 bg-white ${
                            coverImage === url ? 'border-[#d4a762] ring-2 ring-[#d4a762]/30' : 'border-stone-200'
                          }`}
                        >
                          <img 
                            src={url} 
                            alt={`Photo ${idx + 1}`} 
                            className="h-24 w-full object-cover"
                            style={{ imageRendering: '-webkit-optimize-contrast' }}
                            referrerPolicy="no-referrer"
                          />

                          {coverImage === url && (
                            <span className="absolute top-1 left-1 bg-[#d4a762] text-[#1c1202] text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                              কভার ছবি
                            </span>
                          )}

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                            {coverImage !== url && (
                              <button
                                type="button"
                                onClick={() => setCoverImage(url)}
                                title="কভার ছবি হিসেবে সেট করুন"
                                className="p-1.5 bg-white/80 hover:bg-white text-stone-900 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5 text-amber-500" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => requestDeletePhoto(idx)}
                              title="ছবিটি মুছুন"
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      onClick={() => photoInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-300 hover:border-[#d4a762] rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/60"
                    >
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                      <p className="text-xs font-bold text-stone-700">ক্লিক করে প্রজেক্টের ছবি সিলেক্ট করুন</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">একসাথে একাধিক ছবি সিলেক্ট করতে পারেন (JPG, PNG, WebP)</p>
                    </div>
                  )}
                </div>

                {/* 4. VERY EASY VIDEO UPLOAD SECTION */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-1.5">
                        <VideoIcon className="w-4 h-4 text-red-600" />
                        <span>প্রজেক্টের ভিডিও আপলোড (Upload Project Video)</span>
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        ১–২ মিনিটের MP4 ভিডিও সরাসরি Cloudinary-তে আপলোড করুন। (সর্বোচ্চ ১০০MB)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Hidden input for video file */}
                      <input 
                        ref={videoInputRef}
                        type="file"
                        accept=".mp4,video/mp4,video/*"
                        onChange={handleVideoSelect}
                        className="hidden"
                      />

                      <button
                        type="button"
                        disabled={isUploadingVideo}
                        onClick={() => videoInputRef.current?.click()}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {isUploadingVideo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>আপলোড হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Film className="w-4 h-4" />
                            <span>Upload Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {isUploadingVideo && (
                    <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-red-600" />
                          <span>{uploadProgressText || 'ভিডিও Firebase Storage এ আপলোড হচ্ছে...'}</span>
                        </div>
                        <span className="font-mono text-red-700 font-black">{uploadProgressPercent}%</span>
                      </div>
                      <div className="w-full bg-red-200/70 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-red-600 h-full rounded-full transition-all duration-200 ease-out"
                          style={{ width: `${uploadProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Uploaded Videos List / Player Preview */}
                  {videos.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      {videos.map((vidUrl, idx) => {
                        const isThisVideoCover = coverImage === vidUrl || 
                          (coverImage && coverImage.includes(vidUrl.replace(/\.(mp4|mov|webm)$/i, ''))) || 
                          (idx === 0 && (!coverImage || coverImage.includes('unsplash.com')));

                        return (
                          <div key={idx} className={`bg-white p-3.5 rounded-xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            isThisVideoCover ? 'border-[#d4a762] ring-2 ring-[#d4a762]/30 bg-amber-50/20' : 'border-stone-200'
                          }`}>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <div className="h-16 w-24 bg-black rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center border border-stone-300">
                                <video src={`${vidUrl}#t=0.5`} preload="metadata" muted playsInline className="h-full w-full object-cover pointer-events-none" />
                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                                  <Play className="w-4 h-4 fill-white text-white drop-shadow-md" />
                                </div>
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                                  <Film className="w-3.5 h-3.5 text-red-600" />
                                  <span>ভিডিও #{idx + 1}</span>
                                  {isThisVideoCover && (
                                    <span className="text-[10px] bg-[#d4a762] text-stone-950 font-black px-2 py-0.5 rounded-full">
                                      ✓ প্রজেক্টের রিয়েল থাম্বনেইল
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10.5px] text-stone-500 font-mono truncate max-w-xs mt-0.5">{vidUrl}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  const realThumb = getProjectVideoThumbnail(vidUrl);
                                  setCoverImage(realThumb);
                                  showNotification('এই ভিডিওটির আসল ফ্রেম প্রজেক্ট কভার/থাম্বনেইল হিসেবে সেট করা হয়েছে!', 'success');
                                }}
                                className={`text-xs px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                  isThisVideoCover 
                                    ? 'bg-[#d4a762] text-stone-950 border-[#d4a762] font-black shadow-xs' 
                                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
                                }`}
                              >
                                <Star className={`w-3.5 h-3.5 ${isThisVideoCover ? 'fill-stone-950' : 'text-amber-500'}`} />
                                <span>{isThisVideoCover ? 'রিয়েল থাম্বনেইল সক্রিয়' : 'এই ভিডিও থাম্বনেইল সেট করুন'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => requestDeleteVideo(idx)}
                                className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>মুছুন</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-stone-100/70 rounded-xl border border-dashed border-stone-200 text-center">
                      <p className="text-xs text-stone-500 font-medium">
                        কোনো ভিডিও এখনো যুক্ত করা হয়নি (ঐচ্ছিক)। সরাসরি "Upload Video" বাটনে চাপ দিয়ে ভিডিও ফাইল আপলোড করতে পারেন।
                      </p>
                    </div>
                  )}

                  {/* Optional: Add video by direct link if admin has external link */}
                  <div className="pt-2">
                    {!showManualVideoInput ? (
                      <button
                        type="button"
                        onClick={() => setShowManualVideoInput(true)}
                        className="text-[11px] text-[#966b2d] hover:underline font-bold cursor-pointer"
                      >
                        + ভিডিও লিংক বা ড্রাইভ URL দিয়ে যুক্ত করতে চান?
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="ভিডিও URL পেস্ট করুন (যেমনঃ https://...mp4)"
                          value={manualVideoUrl}
                          onChange={(e) => setManualVideoUrl(e.target.value)}
                          className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762]"
                        />
                        <button
                          type="button"
                          onClick={handleAddManualVideo}
                          className="bg-stone-900 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                        >
                          যুক্ত করুন
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowManualVideoInput(false)}
                          className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* 5. PUBLISH / VISIBILITY STATUS SELECTOR */}
                <div className="bg-stone-50 p-4.5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#a07436]" />
                      <span>পাবলিক ভিজিবিলিটি স্ট্যাটাস (Public Status)</span>
                    </h5>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                      পাবলিক থাকলে ওয়েবসাইট ভিজিটররা হ্যান্ডওভার প্রজেক্ট গ্যালারিতে সরাসরি এটি দেখতে পাবেন।
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPublished(true)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all border ${
                        isPublished
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Public (পাবলিক)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublished(false)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all border ${
                        !isPublished
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Draft (ড্রাফট)</span>
                    </button>
                  </div>
                </div>

              </form>

              {/* Modal Bottom Sticky Actions */}
              <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>

                <button
                  type="button"
                  disabled={isSaving || isUploadingPhoto || isUploadingVideo}
                  onClick={handleSaveProject}
                  className="bg-gradient-to-r from-[#1c1202] to-[#3a250a] hover:from-[#d4a762] hover:to-[#b07e35] text-[#fdbf5e] hover:text-white text-xs sm:text-sm font-black px-7 py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{editingProjectId ? 'আপডেট সেভ করুন (Update)' : 'প্রজেক্ট পাবলিশ করুন (Save)'}</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION MODAL FOR DELETIONS */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-center"
            >
              <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h4 className="text-lg font-black text-stone-900 mb-2">
                {confirmModal.title}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                {confirmModal.message}
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  না, বাতিল করুন
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  হ্যাঁ, ডিলিট করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
