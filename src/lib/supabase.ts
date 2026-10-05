import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, CompletedProject, Category, ProjectCategory } from '../types';
import { uploadImageToCloudinary, uploadVideoToCloudinary, validateImageFile, validateVideoFile } from './cloudinary';

// 1. Supabase Environment Configuration (Safe public credentials only)
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  rawSupabaseUrl && 
  rawSupabaseAnonKey && 
  rawSupabaseUrl.startsWith('http')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(rawSupabaseUrl, rawSupabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const SUPABASE_UPLOADS_BUCKET = 'uploads';

// ==========================================================
// 2. Storage Helpers: Upload Images and Videos to Supabase
// ==========================================================

/**
 * Uploads an image or video file to Supabase Storage "uploads" bucket.
 * If Supabase is not yet configured, gracefully falls back to Cloudinary
 * so uploading never fails during transition.
 */
export async function uploadToStorage(
  file: File,
  folder: 'products' | 'projects' | 'videos' = 'products',
  onProgress?: (percent: number) => void
): Promise<string> {
  const isVideo = file.type.startsWith('video/') || ['mp4', 'mov', 'webm'].includes(file.name.split('.').pop()?.toLowerCase() || '');

  // 1. Validate file format and size
  if (isVideo) {
    const val = validateVideoFile(file);
    if (!val.valid) throw new Error(val.error || 'ভিডিও ফাইলটি সঠিক ফরম্যাটের নয় (MP4 বা সর্বোচ্চ 100MB)');
  } else {
    const val = validateImageFile(file);
    if (!val.valid) throw new Error(val.error || 'শুধুমাত্র JPG, JPEG, PNG ও WEBP ছবি অনুমোদিত (সর্বোচ্চ 25MB)');
  }

  // 2. If Supabase is configured, upload to Supabase Storage 'uploads' bucket
  if (supabase && isSupabaseConfigured) {
    try {
      if (onProgress) onProgress(15);

      const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
      const cleanFileName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .substring(0, 30);
      const filePath = `${folder}/${Date.now()}_${cleanFileName}.${ext}`;

      if (onProgress) onProgress(40);

      const { data, error } = await supabase.storage
        .from(SUPABASE_UPLOADS_BUCKET)
        .upload(filePath, file, {
          cacheControl: '31536000',
          upsert: true,
          contentType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg')
        });

      if (error) {
        console.warn('Supabase storage upload note:', error.message);
        throw error;
      }

      if (onProgress) onProgress(85);

      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_UPLOADS_BUCKET)
        .getPublicUrl(data.path);

      if (onProgress) onProgress(100);

      if (publicUrlData && publicUrlData.publicUrl) {
        return publicUrlData.publicUrl;
      }
    } catch (supabaseError: any) {
      console.warn('Supabase Storage error, attempting Cloudinary fallback:', supabaseError);
      // Fall through to Cloudinary fallback if Supabase bucket has RLS/CORS issue
    }
  }

  // 3. Fallback to Cloudinary if Supabase is unconfigured or transiently unavailable
  if (isVideo) {
    return await uploadVideoToCloudinary(file, onProgress);
  } else {
    return await uploadImageToCloudinary(file, onProgress);
  }
}

export async function uploadProductImage(
  file: File,
  _productId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return await uploadToStorage(file, 'products', onProgress);
}

export async function uploadProjectImage(
  file: File,
  _projectId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return await uploadToStorage(file, 'projects', onProgress);
}

export async function uploadProjectVideo(
  file: File,
  _projectId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return await uploadToStorage(file, 'videos', onProgress);
}

// ==========================================================
// 3. Data Mappers (Support both snake_case and camelCase tables)
// ==========================================================

export function mapRowToProduct(row: any): Product {
  const primaryImg = 
    row.img_url || 
    row.imgUrl || 
    row.cover_image || 
    row.coverImage || 
    row.image || 
    row.imageUrl || 
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

  const allImages = Array.isArray(row.images) && row.images.length > 0
    ? row.images.filter(Boolean)
    : Array.isArray(row.gallery) && row.gallery.length > 0
      ? row.gallery.filter(Boolean)
      : primaryImg ? [primaryImg] : [];

  return {
    id: String(row.id),
    nameBn: row.name_bn || row.nameBn || '',
    nameEn: row.name_en || row.nameEn || '',
    category: (row.category as Category) || 'furniture',
    imgUrl: primaryImg,
    images: allImages,
    priceRangeBn: row.price_range_bn || row.priceRangeBn || '',
    priceRangeEn: row.price_range_en || row.priceRangeEn || '',
    minPrice: typeof row.min_price === 'number' 
      ? row.min_price 
      : (typeof row.minPrice === 'number' ? row.minPrice : 10000),
    descriptionBn: row.description_bn || row.descriptionBn || '',
    descriptionEn: row.description_en || row.descriptionEn || '',
    specsBn: Array.isArray(row.specs_bn) ? row.specs_bn : (Array.isArray(row.specsBn) ? row.specsBn : []),
    specsEn: Array.isArray(row.specs_en) ? row.specs_en : (Array.isArray(row.specsEn) ? row.specsEn : []),
    isTrending: Boolean(row.is_trending ?? row.isTrending),
    createdAt: typeof row.created_at === 'number' 
      ? row.created_at 
      : (row.created_at ? new Date(row.created_at).getTime() : Date.now())
  };
}

export function mapProductToRow(prod: Product): Record<string, any> {
  const primaryImg = prod.imgUrl || (prod.images && prod.images[0]) || '';
  const imagesList = prod.images && prod.images.length > 0 ? prod.images : (primaryImg ? [primaryImg] : []);

  return {
    id: prod.id,
    name_bn: prod.nameBn,
    name_en: prod.nameEn,
    category: prod.category,
    img_url: primaryImg,
    images: imagesList,
    price_range_bn: prod.priceRangeBn || '',
    price_range_en: prod.priceRangeEn || '',
    min_price: prod.minPrice || 0,
    description_bn: prod.descriptionBn || '',
    description_en: prod.descriptionEn || '',
    specs_bn: prod.specsBn || [],
    specs_en: prod.specsEn || [],
    is_trending: Boolean(prod.isTrending),
    updated_at: new Date().toISOString()
  };
}

export function mapRowToProject(row: any): CompletedProject {
  const cover = 
    row.cover_image || 
    row.coverImage || 
    row.image || 
    row.img_url || 
    row.imageUrl || 
    (Array.isArray(row.photos) && row.photos.find(Boolean)) || 
    (Array.isArray(row.gallery) && row.gallery.find(Boolean)) || 
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80';

  const photosList = Array.isArray(row.photos) && row.photos.length > 0
    ? row.photos.filter(Boolean)
    : Array.isArray(row.gallery) && row.gallery.length > 0
      ? row.gallery.filter(Boolean)
      : cover ? [cover] : [];

  const videosList = Array.isArray(row.videos)
    ? row.videos.filter(Boolean)
    : typeof row.video === 'string' && row.video.trim()
      ? [row.video.trim()]
      : [];

  const isPub = row.is_published !== undefined 
    ? Boolean(row.is_published) 
    : (row.isPublished !== undefined ? Boolean(row.isPublished) : true);

  return {
    id: String(row.id),
    title: row.title || '',
    titleEn: row.title_en || row.titleEn || '',
    category: (row.category as ProjectCategory) || 'furniture',
    clientLocation: row.client_location || row.clientLocation || 'ঢাকা, বাংলাদেশ',
    completionDate: row.completion_date || row.completionDate || 'সম্পন্ন',
    clientName: row.client_name || row.clientName || '',
    description: row.description || '',
    descriptionEn: row.description_en || row.descriptionEn || '',
    coverImage: cover,
    photos: photosList,
    videos: videosList,
    isPublished: isPub,
    isPublic: isPub,
    status: isPub ? 'published' : 'draft',
    createdAt: typeof row.created_at === 'number' 
      ? row.created_at 
      : (row.created_at ? new Date(row.created_at).getTime() : Date.now()),
    updatedAt: typeof row.updated_at === 'number' 
      ? row.updated_at 
      : (row.updated_at ? new Date(row.updated_at).getTime() : Date.now()),
  };
}

export function mapProjectToRow(project: CompletedProject): Record<string, any> {
  const isPub = project.isPublished !== false;
  return {
    id: project.id,
    title: project.title,
    title_en: project.titleEn || '',
    category: project.category || 'furniture',
    client_location: project.clientLocation || 'ঢাকা, বাংলাদেশ',
    completion_date: project.completionDate || 'সম্পন্ন',
    client_name: project.clientName || '',
    description: project.description || '',
    description_en: project.descriptionEn || '',
    cover_image: project.coverImage || (project.photos && project.photos[0]) || '',
    photos: project.photos || [],
    videos: project.videos || [],
    is_published: isPub,
    status: isPub ? 'published' : 'draft',
    updated_at: new Date().toISOString()
  };
}

export function mapRowToSiteSettings(row: any): Record<string, any> {
  if (!row) return {};
  return {
    brandNameLeft: row.brand_name_left ?? row.brandNameLeft,
    brandNameRight: row.brand_name_right ?? row.brandNameRight,
    tagline: row.tagline,
    heroBadge: row.hero_badge ?? row.heroBadge,
    heroTitleBn1: row.hero_title_bn1 ?? row.heroTitleBn1,
    heroTitleBn2: row.hero_title_bn2 ?? row.heroTitleBn2,
    heroDescBn: row.hero_desc_bn ?? row.heroDescBn,
    showroomAddress: row.showroom_address ?? row.showroomAddress,
    showroomHours: row.showroom_hours ?? row.showroomHours,
    phone1: row.phone1,
    phone2: row.phone2,
    phone3: row.phone3,
    designerName: row.designer_name ?? row.designerName,
    designerTitle: row.designer_title ?? row.designerTitle,
    designerDesc1: row.designer_desc1 ?? row.designerDesc1,
    designerDesc2: row.designer_desc2 ?? row.designerDesc2,
    designerExpText: row.designer_exp_text ?? row.designerExpText,
    designerDubaiText: row.designer_dubai_text ?? row.designerDubaiText,
    handoverBadge: row.handover_badge ?? row.handoverBadge,
    handoverTitle: row.handover_title ?? row.handoverTitle,
    handoverSubtitle: row.handover_subtitle ?? row.handoverSubtitle,
    handoverButtonLabel: row.handover_button_label ?? row.handoverButtonLabel,
    handoverPageBadge: row.handover_page_badge ?? row.handoverPageBadge,
    handoverPageTitle: row.handover_page_title ?? row.handoverPageTitle,
    handoverPageDesc: row.handover_page_desc ?? row.handoverPageDesc,
    seoTitle: row.seo_title ?? row.seoTitle,
    metaDescription: row.meta_description ?? row.metaDescription,
    seoKeywords: row.seo_keywords ?? row.seoKeywords,
    isMaintenanceMode: Boolean(row.is_maintenance_mode ?? row.isMaintenanceMode),
  };
}

export function mapSiteSettingsToRow(s: Record<string, any>): Record<string, any> {
  return {
    id: 'current',
    brand_name_left: s.brandNameLeft,
    brand_name_right: s.brandNameRight,
    tagline: s.tagline,
    hero_badge: s.heroBadge,
    hero_title_bn1: s.heroTitleBn1,
    hero_title_bn2: s.heroTitleBn2,
    hero_desc_bn: s.heroDescBn,
    showroom_address: s.showroomAddress,
    showroom_hours: s.showroomHours,
    phone1: s.phone1,
    phone2: s.phone2,
    phone3: s.phone3,
    designer_name: s.designerName,
    designer_title: s.designerTitle,
    designer_desc1: s.designerDesc1,
    designer_desc2: s.designerDesc2,
    designer_exp_text: s.designerExpText,
    designer_dubai_text: s.designerDubaiText,
    handover_badge: s.handoverBadge,
    handover_title: s.handoverTitle,
    handover_subtitle: s.handoverSubtitle,
    handover_button_label: s.handoverButtonLabel,
    handover_page_badge: s.handoverPageBadge,
    handover_page_title: s.handoverPageTitle,
    handover_page_desc: s.handoverPageDesc,
    seo_title: s.seoTitle,
    meta_description: s.metaDescription,
    seo_keywords: s.seoKeywords,
    is_maintenance_mode: Boolean(s.isMaintenanceMode),
    updated_at: new Date().toISOString()
  };
}

// ==========================================================
// 4. Supabase Database Operations (CRUD + Realtime)
// ==========================================================

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch products error:', error.message);
      return null;
    }
    return (data || []).map(mapRowToProduct);
  } catch (err) {
    console.warn('Supabase fetch products exception:', err);
    return null;
  }
}

export async function saveProductToSupabase(product: Product): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const payload = mapProductToRow(product);
    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert product error:', error.message);
      // Fallback try with camelCase if snake_case schema differed
      const camelPayload = { ...product, updatedAt: new Date().toISOString() };
      const { error: camelError } = await supabase.from('products').upsert(camelPayload);
      if (camelError) throw camelError;
    }
    return true;
  } catch (err) {
    console.error('Failed to save product in Supabase:', err);
    throw err;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete product from Supabase:', err);
    throw err;
  }
}

export async function fetchProjectsFromSupabase(): Promise<CompletedProject[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('completed_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch completed_projects error:', error.message);
      return null;
    }
    return (data || []).map(mapRowToProject);
  } catch (err) {
    console.warn('Supabase fetch completed_projects exception:', err);
    return null;
  }
}

export async function saveProjectToSupabase(project: CompletedProject): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const payload = mapProjectToRow(project);
    const { error } = await supabase
      .from('completed_projects')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert completed_projects error:', error.message);
      const camelPayload = { ...project, updatedAt: new Date().toISOString() };
      const { error: camelError } = await supabase.from('completed_projects').upsert(camelPayload);
      if (camelError) throw camelError;
    }
    return true;
  } catch (err) {
    console.error('Failed to save completed_project in Supabase:', err);
    throw err;
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('completed_projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete completed_project from Supabase:', err);
    throw err;
  }
}

export async function toggleProjectPublishInSupabase(id: string, isPublished: boolean): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const payload = {
      is_published: isPublished,
      status: isPublished ? 'published' : 'draft',
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase
      .from('completed_projects')
      .update(payload)
      .eq('id', id);

    if (error) {
      // Retry with camelCase if snake_case column didn't match
      await supabase.from('completed_projects').update({
        isPublished,
        status: isPublished ? 'published' : 'draft'
      }).eq('id', id);
    }
    return true;
  } catch (err) {
    console.error('Failed to update project publish status in Supabase:', err);
    throw err;
  }
}

export async function fetchSiteSettingsFromSupabase(): Promise<Record<string, any> | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return mapRowToSiteSettings(data);
  } catch (err) {
    console.warn('Supabase fetch site_settings exception:', err);
    return null;
  }
}

export async function saveSiteSettingsToSupabase(settings: Record<string, any>): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const payload = mapSiteSettingsToRow(settings);
    const { error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert site_settings error:', error.message);
      const camelPayload = { id: 'current', ...settings, updatedAt: new Date().toISOString() };
      const { error: camelError } = await supabase.from('site_settings').upsert(camelPayload);
      if (camelError) throw camelError;
    }
    return true;
  } catch (err) {
    console.error('Failed to save site_settings in Supabase:', err);
    throw err;
  }
}

export async function fetchProjectStatsFromSupabase(): Promise<{ successTarget: number; pendingTarget: number } | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('project_stats')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return {
      successTarget: typeof data.success_target === 'number' 
        ? data.success_target 
        : (typeof data.successTarget === 'number' ? data.successTarget : 800),
      pendingTarget: typeof data.pending_target === 'number' 
        ? data.pending_target 
        : (typeof data.pendingTarget === 'number' ? data.pendingTarget : 7),
    };
  } catch (err) {
    console.warn('Supabase fetch project_stats exception:', err);
    return null;
  }
}

export async function saveProjectStatsToSupabase(successTarget: number, pendingTarget: number): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const payload = {
      id: 'current',
      success_target: successTarget,
      pending_target: pendingTarget,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase
      .from('project_stats')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      await supabase.from('project_stats').upsert({
        id: 'current',
        successTarget,
        pendingTarget
      });
    }
    return true;
  } catch (err) {
    console.error('Failed to save project_stats in Supabase:', err);
    throw err;
  }
}
