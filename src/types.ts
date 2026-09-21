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
}
