export type Category = 'furniture' | 'interior';

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  category: Category;
  imgUrl: string;
  priceRangeBn: string;
  priceRangeEn: string;
  minPrice: number; // For sorting
  descriptionBn: string;
  descriptionEn: string;
  specsBn: string[];
  specsEn: string[];
  isTrending?: boolean;
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
