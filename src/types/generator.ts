
export interface GeneratedContent {
  campaignNames: string[];
  promoCodes: string[];
  formData: {
    campaignType: string;
    discount: string;
    product: string;
    brandTone: string;
  };
}

export interface FormData {
  campaignType: string;
  discount: string;
  product: string;
  brandTone?: string;
}
