
export interface Campaign {
  campaignName: string;
  startDate: string;
  endDate: string;
  description: string;
  offers: string[];
  creativeAssets: {
    video?: string;
    bannerImage: string;
  };
  channels: {
    push: {
      title: string;
      body: string;
      sent: string;
    };
    email: {
      subject: string;
      preheader: string;
      bodySnippet: string;
      sent: string;
    };
  };
  performance: {
    openRate: string;
    clickThroughRate: string;
    orders: number;
    revenue: number;
  };
}
