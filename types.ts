
export interface ExtractedProductInfo {
  manufacturer: string;
  productName: string;
  strain: string;
  potency: string;
  otherDetails: string[];
  enhancedReview: string;
}

export interface PokedexEntry extends ExtractedProductInfo {
  id: string;
  image: string; // base64 encoded image
  originalReview: string;
  createdAt: string;
}
