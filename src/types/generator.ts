
export interface GeneratedContent {
  campaignNames: string[];
  promoCodes: string[];
  insights: {
    recommendedChannels: string[];
    expectedPerformance: {
      openRate: string;
      clickThroughRate: string;
      estimatedOrders: number;
    };
    bestPractices: string[];
    seasonalTrends: string[];
  };
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
