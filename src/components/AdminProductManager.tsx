import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Upload, 
  X, 
  Check, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Search, 
  Image as ImageIcon, 
  Flame, 
  Eye, 
  Sparkles, 
  Camera,
  Layers,
  ArrowUpDown,
  Tag,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../types';
import { uploadProductImage } from '../lib/firebase';

interface AdminProductManagerProps {
  products: Product[];
  onProductCreated: (newProduct: Product) => Promise<void>;
  onProductUpdated: (updatedProduct: Product) => Promise<void>;
  onProductDeleted: (id: string, nameBn: string) => Promise<void>;
  showNotification: (msg: string, type?: 'success' | 'error') => void;
  onViewProduct?: (product: Product) => void;
}

const PRESET_IMAGES = [
  { name: 'রাজকীয় সোফা (Royal Sofa)', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { name: 'কাঠের ডাইনিং টেবিল (Dining Table)', url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80' },
  { name: 'সেগুন কাঠের আলমারি (Solid Wardrobe)', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80' },
  { name: 'মহারাজা খাট (Master Bedframe)', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
  { name: 'প্রিমিয়াম হোম ক্যাবিনেট (Cabinet)', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80' },
  { name: 'আধুনিক লাক্সারি কিচেন (Luxury Kitchen)', url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80' },
];

export default function AdminProductManager({
  products,
  onProductCreated,
  onProductUpdated,
  onProductDeleted,
  showNotification,
  onViewProduct,
}: AdminProductManagerProps) {
  // Form State
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [category, setCategory] = useState<Category>('furniture');
  const [primaryImgUrl, setPrimaryImgUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [priceRangeEn, setPriceRangeEn] = useState('');
  const [priceRangeBn, setPriceRangeBn] = useState('');
  const [minPrice, setMinPrice] = useState('15000');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [specsBn, setSpecsBn] = useState('');
  const [specsEn, setSpecsEn] = useState('');
  const [isTrending, setIsTrending] = useState(false);

  // UI helpers
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Filtering & searching in Admin catalog
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'furniture' | 'interior'>('all');
  const [adminSearch, setAdminSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');

  // Accidental deletion prevention modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  // Filtered & sorted products list
  const visibleProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter);
    }

    // Filter by Search
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase().trim();
      list = list.filter((p) =>
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.descriptionBn.toLowerCase().includes(q) ||
        p.descriptionEn.toLowerCase().includes(q) ||
        p.priceRangeBn.toLowerCase().includes(q) ||
        p.priceRangeEn.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.minPrice - a.minPrice);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    } else {
      // Default newest first
      list.sort((a, b) => {
        const timeA = a.createdAt || (a.id.startsWith('custom-prod-') ? parseInt(a.id.replace('custom-prod-', ''), 10) : 0);
        const timeB = b.createdAt || (b.id.startsWith('custom-prod-') ? parseInt(b.id.replace('custom-prod-', ''), 10) : 0);
        return timeB - timeA;
      });
    }

    return list;
  }, [products, categoryFilter, adminSearch, sortBy]);

  // Handle single / primary image upload from phone or computer
  const handlePrimaryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('অনুগ্রহ করে একটি সঠিক ইমেজ ফাইল (JPG, PNG, WebP) নির্বাচন করুন।', 'error');
      return;
    }

    // Max 15MB file size check
    if (file.size > 15 * 1024 * 1024) {
      showNotification('ছবির আকার ১৫ মেগাবাইট এর বেশি হতে পারবে না।', 'error');
      return;
    }

    setIsUploading(true);
    // Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setPrimaryImgUrl(previewUrl);

    try {
      const uploadedUrl = await uploadProductImage(file, editingProdId || undefined);
      setPrimaryImgUrl(uploadedUrl);
      
      // Update in gallery if not already there
      setGalleryImages((prev) => {
        if (!prev.includes(uploadedUrl)) {
          return [uploadedUrl, ...prev.filter((img) => img !== previewUrl)];
        }
        return prev;
      });

      showNotification('ছবিটি সফলভাবে Firebase Storage এ আপলোড হয়েছে!');
    } catch (err: any) {
      console.error('Image upload error:', err);
      showNotification(err?.message || 'ছবি আপলোডে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsUploading(false);
      // Reset input value so re-selecting same file triggers change
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle adding additional gallery images (multiple images support)
  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileList = Array.from(files) as File[];
      const uploadPromises = fileList.map((file: File) => uploadProductImage(file, editingProdId || undefined));
      const urls = await Promise.all(uploadPromises);

      setGalleryImages((prev) => {
        const combined = [...prev, ...urls];
        return Array.from(new Set(combined));
      });

      // If no primary image set, set the first uploaded one as primary
      if (!primaryImgUrl && urls.length > 0) {
        setPrimaryImgUrl(urls[0]);
      }

      showNotification(`${urls.length} টি অতিরিক্ত ছবি সফলভাবে Firebase Storage এ আপলোড করা হয়েছে!`);
    } catch (err: any) {
      console.error('Gallery upload error:', err);
      showNotification(err?.message || 'অতিরিক্ত ছবি আপলোডে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsUploading(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  // Set any gallery image as primary cover image
  const handleSetPrimary = (url: string) => {
    setPrimaryImgUrl(url);
    // Move to front of gallery
    setGalleryImages((prev) => [url, ...prev.filter((img) => img !== url)]);
    showNotification('ছবিটিকে মূল কভার ছবি হিসেবে নির্ধারণ করা হয়েছে!');
  };

  // Remove an image from gallery
  const handleRemoveGalleryImage = (urlToRemove: string) => {
    setGalleryImages((prev) => {
      const filtered = prev.filter((u) => u !== urlToRemove);
      if (primaryImgUrl === urlToRemove) {
        setPrimaryImgUrl(filtered[0] || '');
      }
      return filtered;
    });
  };

  // Populate form for editing
  const handleStartEdit = (prod: Product) => {
    setEditingProdId(prod.id);
    setNameEn(prod.nameEn || '');
    setNameBn(prod.nameBn || '');
    setCategory(prod.category || 'furniture');
    setPrimaryImgUrl(prod.imgUrl || '');
    setGalleryImages(prod.images && prod.images.length > 0 ? prod.images : prod.imgUrl ? [prod.imgUrl] : []);
    setPriceRangeEn(prod.priceRangeEn || '');
    setPriceRangeBn(prod.priceRangeBn || '');
    setMinPrice(prod.minPrice ? prod.minPrice.toString() : '15000');
    setDescriptionBn(prod.descriptionBn || '');
    setDescriptionEn(prod.descriptionEn || '');
    setSpecsBn(Array.isArray(prod.specsBn) ? prod.specsBn.join(', ') : '');
    setSpecsEn(Array.isArray(prod.specsEn) ? prod.specsEn.join(', ') : '');
    setIsTrending(!!prod.isTrending);

    // Scroll smoothly to form
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    resetForm();
    showNotification('পণ্য সংশোধন বাতিল করা হয়েছে।');
  };

  // Reset form to blank
  const resetForm = () => {
    setEditingProdId(null);
    setNameEn('');
    setNameBn('');
    setCategory('furniture');
    setPrimaryImgUrl('');
    setGalleryImages([]);
    setPriceRangeEn('');
    setPriceRangeBn('');
    setMinPrice('15000');
    setDescriptionBn('');
    setDescriptionEn('');
    setSpecsBn('');
    setSpecsEn('');
    setIsTrending(false);
    setShowUrlInput(false);
    setCustomUrl('');
  };

  // Submit product (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameBn.trim()) {
      showNotification('অনুগ্রহ করে পণ্যের নাম বাংলায় প্রদান করুন।', 'error');
      return;
    }
    if (!nameEn.trim()) {
      showNotification('Please enter the product name in English.', 'error');
      return;
    }

    const minPriceNum = parseInt(minPrice, 10) || 0;
    const finalImg = primaryImgUrl.trim() || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

    // Parse specifications
    const parsedSpecsBn = specsBn.trim()
      ? specsBn.split(',').map((s) => s.trim()).filter(Boolean)
      : ['১০০% খাঁটি কাঠ', 'উন্নত ও স্থায়ী ফিনিশিং'];

    const parsedSpecsEn = specsEn.trim()
      ? specsEn.split(',').map((s) => s.trim()).filter(Boolean)
      : ['100% Solid Timber', 'High Gloss Polish'];

    // Auto smart pricing if not typed
    const finalPriceBn = priceRangeBn.trim() || `${minPriceNum.toLocaleString()} টাকা থেকে শুরু`;
    const finalPriceEn = priceRangeEn.trim() || `৳${minPriceNum.toLocaleString()}+`;

    const allImages = galleryImages.length > 0 
      ? (galleryImages.includes(finalImg) ? galleryImages : [finalImg, ...galleryImages])
      : [finalImg];

    setIsSaving(true);
    try {
      if (editingProdId) {
        // Update existing product
        const updated: Product = {
          id: editingProdId,
          nameEn: nameEn.trim(),
          nameBn: nameBn.trim(),
          category,
          imgUrl: finalImg,
          images: allImages,
          priceRangeEn: finalPriceEn,
          priceRangeBn: finalPriceBn,
          minPrice: minPriceNum,
          descriptionBn: descriptionBn.trim() || 'আকর্ষণীয় ও রাজকীয় ডিজাইনের কাঠের আসবাবপত্র।',
          descriptionEn: descriptionEn.trim() || 'Elegant luxury wooden furniture masterpiece.',
          specsBn: parsedSpecsBn,
          specsEn: parsedSpecsEn,
          isTrending,
        };

        await onProductUpdated(updated);
        showNotification(`"${nameBn}" পণ্যটির তথ্য সফলভাবে ফায়ারবেসে আপডেট করা হয়েছে!`);
        resetForm();
      } else {
        // Create new product
        const newId = `custom-prod-${Date.now()}`;
        const newProd: Product = {
          id: newId,
          nameEn: nameEn.trim(),
          nameBn: nameBn.trim(),
          category,
          imgUrl: finalImg,
          images: allImages,
          priceRangeEn: finalPriceEn,
          priceRangeBn: finalPriceBn,
          minPrice: minPriceNum,
          descriptionBn: descriptionBn.trim() || 'আকর্ষণীয় ও রাজকীয় ডিজাইনের কাঠের আসবাবপত্র।',
          descriptionEn: descriptionEn.trim() || 'Elegant luxury wooden furniture masterpiece.',
          specsBn: parsedSpecsBn,
          specsEn: parsedSpecsEn,
          isTrending,
          createdAt: Date.now(),
        };

        await onProductCreated(newProd);
        showNotification(`"${nameBn}" নতুন পণ্যটি সফলভাবে ফায়ারবেস সংগ্রহশালায় যুক্ত করা হয়েছে!`);
        resetForm();
      }
    } catch (err) {
      console.error('Error saving product:', err);
      showNotification('পণ্য সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Execute safe product deletion after user confirmation
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onProductDeleted(productToDelete.id, productToDelete.nameBn);
      showNotification(`"${productToDelete.nameBn}" পণ্যটি সফলভাবে মুছে ফেলা হয়েছে!`);
      if (editingProdId === productToDelete.id) {
        resetForm();
      }
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification('পণ্য ডিলিট করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10 font-sans">
      
      {/* Top Anchor & Mode Indicator Banner */}
      <div ref={formTopRef} id="admin-product-form-top">
        {editingProdId ? (
          <div className="bg-amber-50 border-2 border-[#d4a762] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#d4a762] text-stone-900 flex items-center justify-center shrink-0 font-black">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#916727] bg-[#d4a762]/20 px-2 py-0.5 rounded">
                  Edit Mode সচল আছে
                </span>
                <h5 className="text-base md:text-lg font-black text-stone-900 mt-0.5">
                  সংশোধন করা হচ্ছে: <span className="text-[#a0712b]">{nameBn || nameEn}</span>
                </h5>
                <p className="text-xs text-stone-600">পরিবর্তন সম্পন্ন করার পর নিচের "আপডেট সংরক্ষণ করুন" বাটনে ক্লিক করুন।</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-white hover:bg-stone-100 text-stone-700 px-4 py-2 rounded-xl text-xs font-bold border border-stone-300 transition-colors shrink-0 cursor-pointer"
            >
              সংশোধন বাতিল (Cancel)
            </button>
          </div>
        ) : null}
      </div>

      {/* 1. ADD / EDIT PRODUCT FORM CARD */}
      <div className="bg-[#fcfaf5] p-4 sm:p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#d4a762]/20 text-[#966b2a] flex items-center justify-center border border-[#d4a762]/30">
              {editingProdId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h5 className="text-lg md:text-xl font-black text-stone-900">
                {editingProdId ? 'পণ্য সংশোধন ও আপডেট ফরম' : 'নতুন পণ্য / ফার্নিচার যুক্ত করুন'}
              </h5>
              <p className="text-xs text-stone-500">
                ছবি আপলোড করুন এবং পণ্যের বিবরণ বাংলায় ও ইংরেজিতে সহজে ইনপুট করুন
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-[11px] font-mono text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200">
              মোট পণ্য: {products.length}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* IMAGE UPLOAD SECTION - ULTRA USER FRIENDLY */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-stone-200 shadow-3xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-black text-stone-900 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                  <Camera className="w-4 h-4 text-[#b88c47]" />
                  <span>পণ্যের ছবি আপলোড (Product Image Upload) *</span>
                </label>
                <p className="text-[11px] text-stone-500">
                  মোবাইল ফোন বা কম্পিউটার থেকে সরাসরি ছবি সিলেক্ট করুন। কোনো লিংক কপি করার প্রয়োজন নেই।
                </p>
              </div>

              {primaryImgUrl && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1 w-max">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ছবি সংযুক্ত আছে
                </span>
              )}
            </div>

            {/* Main Upload Drop / Select Zone */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Primary Image Preview Box */}
              <div className="md:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-stone-300 bg-stone-50 h-52 sm:h-56 flex flex-col items-center justify-center group hover:border-[#d4a762] transition-colors">
                  {primaryImgUrl ? (
                    <>
                      <img 
                        src={primaryImgUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white hover:bg-stone-100 text-stone-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>ছবি বদলান</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrimaryImgUrl('')}
                          className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-xl text-xs shadow-md cursor-pointer"
                          title="ছবি সরান"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        মূল কভার ছবি
                      </span>
                    </>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer text-center p-4 flex flex-col items-center justify-center w-full h-full"
                    >
                      <div className="h-12 w-12 rounded-full bg-[#d4a762]/10 text-[#a07434] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-stone-700">ছবি সিলেক্ট করতে এখানে ট্যাপ করুন</p>
                      <p className="text-[10px] text-stone-400 mt-1">ক্যামেরা বা গ্যালারি থেকে সরাসরি ছবি নির্বাচন করুন</p>
                    </div>
                  )}

                  {/* Uploading progress spinner */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                      <Loader2 className="w-8 h-8 text-[#d4a762] animate-spin mb-2" />
                      <span className="text-xs font-bold">ছবি ক্লাউডে আপলোড হচ্ছে...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls & Actions */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex flex-wrap gap-2.5">
                  {/* Primary File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePrimaryFileSelect}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="min-h-[44px] bg-gradient-to-r from-[#cf9d53] to-[#bfa042] hover:brightness-105 active:scale-98 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{primaryImgUrl ? 'ছবি পরিবর্তন করুন (Replace Image)' : 'ফোন / কম্পিউটার থেকে ছবি বাছুন'}</span>
                  </button>

                  {/* Additional Multiple Images Input */}
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFileSelect}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="min-h-[44px] bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-4 py-3 rounded-xl border border-stone-300 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-stone-600" />
                    <span>অতিরিক্ত ছবি যোগ করুন (Add More Photos)</span>
                  </button>
                </div>

                <div className="text-[11px] text-stone-500 space-y-1">
                  <p>• সাপোর্ট করে: JPG, PNG, WebP (অটোমেটিক কম্প্রেসড ও সুরক্ষিত)</p>
                  <p>• ক্যামেরা দিয়ে সরাসরি ছবি তুলে সাথে সাথে আপলোড করা যায়</p>
                </div>

                {/* Optional Web Link toggle for advanced usage */}
                <div className="pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#966b2a] hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{showUrlInput ? 'ইন্টারনেট ছবির লিংক লুকান' : 'বা সরাসরি ছবির ইন্টারনেট ওয়েব লিংক দিন'}</span>
                  </button>

                  {showUrlInput && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customUrl.trim()) {
                            setPrimaryImgUrl(customUrl.trim());
                            setGalleryImages((prev) => [customUrl.trim(), ...prev.filter((x) => x !== customUrl.trim())]);
                            setCustomUrl('');
                            showNotification('ছবির লিংক সফলভাবে সংযুক্ত হয়েছে!');
                          }
                        }}
                        className="bg-stone-800 text-white text-xs px-3 py-2 rounded-xl font-bold cursor-pointer hover:bg-stone-700"
                      >
                        প্রয়োগ
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Gallery Thumbnails List (Multiple images support) */}
            {galleryImages.length > 1 && (
              <div className="pt-3 border-t border-stone-200">
                <span className="text-[11px] font-bold text-stone-700 block mb-2">
                  পণ্যের সংযুক্ত সকল ছবিসমূহ ({galleryImages.length} টি ছবি):
                </span>
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => {
                    const isPrimary = img === primaryImgUrl;
                    return (
                      <div key={idx} className="relative group shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 bg-white">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        
                        {/* Primary Badge */}
                        {isPrimary ? (
                          <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-black px-1 rounded shadow-xs">
                            কভার
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(img)}
                            className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold flex items-center justify-center p-1 text-center cursor-pointer"
                          >
                            কভার বানান
                          </button>
                        )}

                        {/* Remove thumb button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(img)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Demo Preset Images */}
            <div className="pt-3 border-t border-stone-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9d7237] block mb-2">
                বা এক ক্লিকে রেডিমেড ডেমো ছবি সিলেক্ট করুন:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrimaryImgUrl(preset.url);
                      setGalleryImages((prev) => [preset.url, ...prev.filter((x) => x !== preset.url)]);
                      showNotification(`"${preset.name}" ডেমো ছবিটি সিলেক্ট করা হয়েছে!`);
                    }}
                    className={`p-1.5 rounded-xl border text-[9.5px] font-bold text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                      primaryImgUrl === preset.url
                        ? 'border-[#d4a762] bg-[#d4a762]/10 text-[#966b2a] ring-1 ring-[#d4a762]'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-7 h-7 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                    <span className="truncate block font-sans">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* BASIC INFORMATION: NAME & CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                পণ্যের বিভাগ (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-bold focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30"
              >
                <option value="furniture">🛋️ Furniture (ফার্নিচার ও মেহগনি/সেগুন আসবাব)</option>
                <option value="interior">📐 Interior (লাক্সারি হোম ও অফিস ইন্টেরিয়র)</option>
              </select>
            </div>

            {/* Bengali Name */}
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                পণ্যের নাম বাংলায় (Bengali Name) *
              </label>
              <input
                type="text"
                placeholder="যেমন: ভিক্টোরিয়ান রাজকীয় সেগুন সোফা"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-bold focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30 placeholder:text-stone-400 placeholder:font-normal"
                required
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                পণ্যের নাম ইংরেজিতে (English Name) *
              </label>
              <input
                type="text"
                placeholder="e.g. Victorian Royal Teak Sofa"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-bold focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30 placeholder:text-stone-400 placeholder:font-normal font-sans"
                required
              />
            </div>

          </div>

          {/* PRICE & BUDGET CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                মূল্য ফিল্টার অংক (Min Price BDT) *
              </label>
              <input
                type="number"
                placeholder="15000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-bold font-mono focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30"
                required
              />
              <span className="text-[10px] text-stone-400 mt-1 block">ফিল্টারিং এবং সাজানোর জন্য ব্যবহৃত হয়</span>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                মূল্য ও বাজেট বাংলায় (Price Range BN)
              </label>
              <input
                type="text"
                placeholder="যেমন: ১৫,০০০ টাকা থেকে শুরু"
                value={priceRangeBn}
                onChange={(e) => setPriceRangeBn(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-bold focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30 placeholder:text-stone-400 placeholder:font-normal"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">খালি রাখলে স্বয়ংক্রিয়ভাবে তৈরি হবে</span>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                মূল্য ইংরেজিতে (Price Range EN)
              </label>
              <input
                type="text"
                placeholder="e.g. ৳15,000+"
                value={priceRangeEn}
                onChange={(e) => setPriceRangeEn(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-bold focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30 placeholder:text-stone-400 placeholder:font-normal font-sans"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">যেমন: ৳15,000+ বা ৳15,000 - ৳25,000</span>
            </div>

          </div>

          {/* DESCRIPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                পণ্যের বিস্তারিত বিবরণ বাংলায় (Description Bengali) *
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: ১০০% সলিড চিটাগাং সেগুন কাঠের তৈরি রাজকীয় খোদাই করা সোফা। দুবাই আরব টেক অভিজ্ঞ প্রধান নকশাবিদের বিশেষ তত্ত্বাবধানে প্রস্তুত।"
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                পণ্যের বিবরণ ইংরেজিতে (Description English)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 100% Solid Chittagong Teak Wood crafted with exquisite carvings under the supervision of UAE experienced designer."
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* SPECIFICATIONS & FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                উপকরণ ও বৈশিষ্ট্য বাংলায় (Specs BN: কমা দিয়ে লিখুন)
              </label>
              <input
                type="text"
                placeholder="১০০% চিটাগাং সেগুন কাঠ, লাইফটাইম ঘুনের গ্যারান্টি, হ্যান্ড ক্রাফটেড পলিশ"
                value={specsBn}
                onChange={(e) => setSpecsBn(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5 uppercase tracking-wide font-sans">
                উপকরণ ও বৈশিষ্ট্য ইংরেজিতে (Specs EN: Comma separated)
              </label>
              <input
                type="text"
                placeholder="100% Teak Wood, Lifetime Termite Warranty, Handcrafted Polish"
                value={specsEn}
                onChange={(e) => setSpecsEn(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-[#d4a762] focus:ring-1 focus:ring-[#d4a762]/30 font-sans"
              />
            </div>
          </div>

          {/* TRENDING BADGE & ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-200">
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="h-5 w-5 rounded text-[#d4a762] focus:ring-opacity-50 accent-[#d4a762] cursor-pointer"
              />
              <span className="text-xs font-black text-orange-600 flex items-center gap-1">
                <Flame className="w-4 h-4 text-red-500 fill-current animate-bounce" />
                <span>আজকের হট ট্রেন্ডিং পণ্য ট্যাগ দিন (Trending Badge)</span>
              </span>
            </label>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {editingProdId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="min-h-[44px] bg-stone-200 hover:bg-stone-300 text-stone-800 px-5 py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
              )}

              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="min-h-[44px] bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-105 active:scale-98 text-white font-black text-xs px-7 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : editingProdId ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>আপডেট সংরক্ষণ করুন (Update Product)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>সংগ্রহশালায় যুক্ত করুন (Save Product)</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* 2. CATALOG BROWSE & MANAGEMENT TABLE / CARDS */}
      <div className="space-y-4">
        
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h5 className="text-lg md:text-xl font-black text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#b88c47]" />
              <span>আবেদ ফার্ণিচার ডাটাবেজ পণ্য তালিকা (Manage All Products)</span>
            </h5>
            <p className="text-xs text-stone-500">
              যেকোনো পণ্য এডিট বা মুছে ফেলতে নিচের কার্ডগুলোর অপশন ব্যবহার করুন
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-white px-3.5 py-1.5 rounded-full border border-stone-200 text-stone-700 shadow-3xs w-max">
            মোট {products.length} টি পণ্য প্রদর্শিত হচ্ছে
          </span>
        </div>

        {/* Search & Category Filter Tool Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-3xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Category Tabs */}
          <div className="flex gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-white text-[#966b2a] shadow-3xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              সব পণ্য ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('furniture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === 'furniture'
                  ? 'bg-white text-[#966b2a] shadow-3xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🛋️ ফার্নিচার ({products.filter((p) => p.category === 'furniture').length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('interior')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === 'interior'
                  ? 'bg-white text-[#966b2a] shadow-3xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📐 ইন্টেরিয়র ({products.filter((p) => p.category === 'interior').length})
            </button>
          </div>

          {/* Search Input & Sort */}
          <div className="flex items-center gap-2 flex-1 sm:max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="পণ্য খুঁজুন (Search by name or desc)..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-8 py-2 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-[#d4a762]"
              />
              {adminSearch && (
                <button
                  type="button"
                  onClick={() => setAdminSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-700 font-bold focus:outline-none focus:border-[#d4a762]"
            >
              <option value="newest">নতুন আগে</option>
              <option value="price-low">মূল্য: কম থেকে বেশি</option>
              <option value="price-high">মূল্য: বেশি থেকে কম</option>
              <option value="name">নাম (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Products Grid / Cards */}
        {visibleProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
            <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-bold">কোনো পণ্য খুঁজে পাওয়া যায়নি।</p>
            {adminSearch && (
              <button
                type="button"
                onClick={() => setAdminSearch('')}
                className="text-xs text-[#b88c47] hover:underline font-bold mt-2 cursor-pointer"
              >
                সার্চ ফিল্টার রিসেট করুন
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProducts.map((prod) => (
              <div
                key={prod.id}
                className={`bg-white rounded-2xl border p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                  editingProdId === prod.id
                    ? 'border-[#d4a762] ring-2 ring-[#d4a762]/30 bg-amber-50/20'
                    : 'border-stone-200 hover:border-[#d4a762]/40'
                }`}
              >
                <div>
                  {/* Image & Quick Info */}
                  <div className="flex gap-3.5 items-start">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <img
                        src={prod.imgUrl}
                        alt={prod.nameEn}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {prod.isTrending && (
                        <span className="absolute top-1 left-1 bg-red-600 text-white p-0.5 rounded-full" title="Trending">
                          <Flame className="w-3 h-3 fill-current text-yellow-300" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                            prod.category === 'interior'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {prod.category === 'interior' ? 'ইন্টেরিয়র' : 'ফার্নিচার'}
                        </span>
                        {prod.isTrending && (
                          <span className="text-[9px] font-black bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                            🔥 Trending
                          </span>
                        )}
                      </div>

                      <h6 className="text-sm font-black text-stone-900 truncate" title={prod.nameBn}>
                        {prod.nameBn}
                      </h6>
                      <p className="text-[11px] font-mono text-stone-500 truncate mt-0.5" title={prod.nameEn}>
                        {prod.nameEn}
                      </p>
                      <p className="text-xs font-mono font-black text-[#966b2a] mt-1.5">
                        {prod.priceRangeBn || prod.priceRangeEn || `৳${prod.minPrice.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed font-sans">
                    {prod.descriptionBn}
                  </p>
                </div>

                {/* Card Action Buttons with Large Touch Targets */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-100">
                  {onViewProduct && (
                    <button
                      type="button"
                      onClick={() => onViewProduct(prod)}
                      className="min-h-[40px] px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-xl text-xs font-bold border border-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="ওয়েবসাইটে প্রিভিউ দেখুন"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>প্রিভিউ</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(prod)}
                      className="min-h-[40px] px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#966b2a] rounded-xl text-xs font-black border border-[#d4a762]/35 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="পণ্য এডিট করুন"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>এডিট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProductToDelete(prod)}
                      className="min-h-[40px] px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-black border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="পণ্য ডিলিট করুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ডিলিট</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* 3. ACCIDENTAL DELETION CONFIRMATION MODAL */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-left relative"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">
                    সতর্কতা: পণ্য ডিলিট নিশ্চিতকরণ
                  </span>
                  <h5 className="text-base font-black text-stone-900 mt-1">
                    আপনি কি নিশ্চিত যে পণ্যটি ডিলিট করতে চান?
                  </h5>
                </div>
              </div>

              {/* Product mini preview card */}
              <div className="mt-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
                <img
                  src={productToDelete.imgUrl}
                  alt={productToDelete.nameEn}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <h6 className="text-xs font-black text-stone-900 truncate">
                    {productToDelete.nameBn}
                  </h6>
                  <p className="text-[10px] font-mono text-stone-500 truncate mt-0.5">
                    {productToDelete.nameEn}
                  </p>
                  <p className="text-[11px] font-mono font-bold text-[#966b2a] mt-1">
                    {productToDelete.priceRangeBn || productToDelete.priceRangeEn}
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-3.5 leading-relaxed font-sans">
                পণ্যটি মুছে ফেললে এটি ফায়ারবেস ক্লাউড ডাটাবেজ এবং ওয়েবসাইট থেকে স্থায়ীভাবে অপসারিত হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  disabled={isDeleting}
                  className="min-h-[44px] flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-black transition-colors cursor-pointer"
                >
                  না, বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="min-h-[44px] flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>মুছে ফেলা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>হ্যাঁ, ডিলিট করুন</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
