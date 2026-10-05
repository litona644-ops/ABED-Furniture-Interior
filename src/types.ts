export type Category = 'furniture' | 'interior';

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  category: Category;
  imgUrl: string;
  images?: string[];
  priceRangeBn: string;
  priceRangeEn: string;
  minPrice: number; // For sorting
  descriptionBn: string;
  descriptionEn: string;
  specsBn: string[];
  specsEn: string[];
  isTrending?: boolean;
  createdAt?: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ConsultationResponse {
  vibe: string;
  preferredStyle: string;
  recommendedProducts: string[];
}

export type ProjectCategory = 'furniture' | 'interior' | 'full_project';

export interface CompletedProject {
  id: string;
  title: string;
  titleEn?: string;
  category: ProjectCategory;
  clientLocation: string;
  completionDate: string;
  description: string;
  descriptionEn?: string;
  coverImage?: string;
  photos: string[];
  videos: string[];
  clientName?: string;
  createdAt?: number;
  updatedAt?: number;
  isPublished?: boolean;
  isPublic?: boolean;
  status?: 'published' | 'draft';
}

export interface VisitorRecord {
  id: string;
  ip: string;
  country: string;
  city?: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  visitedPage: string;
  referrer: string;
  userAgent?: string;
  timestamp: number;
  createdAt: string;
}

export interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  onlineVisitors: number;
  uniqueVisitors: number;
  totalPageViews: number;
}

