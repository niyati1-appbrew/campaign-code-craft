export interface AICampaignRequest {
  campaignType: string;
  campaignSuggestion?: string;
  discount: string;
  product: string;
  brandTone: string;
}

export interface AICampaignVariant {
  campaignName: string;
  promoCode: string;
  pushNotification: {
    title: string;
    body: string;
  };
  offerCopy: string;
  launchWindow: {
    startDate: string;
    endDate: string;
  };
  predictedEngagement: {
    openRate: string;
    clickThroughRate: string;
    estimatedOrders: number;
  };
  aiInsight: string;
}

export interface AICampaignResponse {
  variants: AICampaignVariant[];
  overallInsights: {
    recommendedChannels: string[];
    bestPractices: string[];
    seasonalTrends: string[];
  };
  formData: AICampaignRequest;
}

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
  // New AI-powered fields
  aiCampaigns?: AICampaignVariant[];
  pushNotifications?: Array<{
    title: string;
    body: string;
  }>;
}

export interface FormData {
  campaignType: string;
  discount: string;
  product: string;
  brandTone?: string;
  campaignSuggestion?: string;
}
