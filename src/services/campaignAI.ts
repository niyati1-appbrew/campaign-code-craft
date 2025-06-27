import { campaigns } from "@/data/campaigns";
import {
  AICampaignRequest,
  AICampaignResponse,
  AICampaignVariant,
} from "@/types/generator";

// Mock Gemini API service for demonstration
// In production, this would call the actual Gemini API
export class CampaignAIService {
  private findSimilarCampaigns(request: AICampaignRequest): typeof campaigns {
    return campaigns
      .filter((campaign) => {
        const typeMatch = campaign.campaignName
          .toLowerCase()
          .includes(request.campaignType.toLowerCase());
        const productMatch = campaign.description
          .toLowerCase()
          .includes(request.product.toLowerCase());
        const offerMatch = campaign.offers.some((offer) =>
          offer
            .toLowerCase()
            .includes(request.discount.toLowerCase().split(" ")[0])
        );

        return typeMatch || productMatch || offerMatch;
      })
      .slice(0, 3);
  }

  private generateCampaignName(
    request: AICampaignRequest,
    index: number
  ): string {
    const { product, campaignType, brandTone } = request;

    const nameTemplates = {
      sale: {
        elegant: [
          `Premium ${product} Collection`,
          `Exclusive ${product} Sale`,
          `Luxury ${product} Event`,
        ],
        bold: [
          `Mega ${product} Blowout`,
          `Ultimate ${product} Sale`,
          `Power ${product} Festival`,
        ],
        quirky: [
          `${product} Bonanza Bash`,
          `Wild ${product} Fiesta`,
          `Crazy ${product} Carnival`,
        ],
        fun: [
          `Happy ${product} Days`,
          `${product} Party Time`,
          `Joyful ${product} Fest`,
        ],
      },
      newLaunch: {
        elegant: [
          `Introducing ${product}`,
          `New ${product} Arrival`,
          `Fresh ${product} Collection`,
        ],
        bold: [
          `${product} Launch Revolution`,
          `New ${product} Power`,
          `${product} Debut Storm`,
        ],
        quirky: [
          `${product} Drop Alert`,
          `Fresh ${product} Vibes`,
          `New ${product} Magic`,
        ],
        fun: [
          `${product} Launch Party`,
          `Hello ${product}`,
          `${product} Reveal Fest`,
        ],
      },
      festive: {
        elegant: [
          `Festive ${product} Elegance`,
          `Celebration ${product}`,
          `Festival ${product} Grace`,
        ],
        bold: [
          `Festive ${product} Power`,
          `Bold Festival ${product}`,
          `Epic ${product} Celebration`,
        ],
        quirky: [
          `Festival ${product} Fun`,
          `Quirky ${product} Fest`,
          `Festive ${product} Madness`,
        ],
        fun: [
          `Happy Festival ${product}`,
          `Festive ${product} Joy`,
          `Celebration ${product} Time`,
        ],
      },
    };

    const templates =
      nameTemplates[campaignType as keyof typeof nameTemplates]?.[
        brandTone as keyof typeof nameTemplates.sale
      ] || nameTemplates.sale.fun;

    return templates[index % templates.length];
  }

  private generatePromoCode(request: AICampaignRequest, index: number): string {
    const { product, discount } = request;
    const productCode = product.toUpperCase().slice(0, 4);
    const discountNum = discount.match(/\d+/)?.[0] || "20";

    const codeTemplates = [
      `${productCode}${discountNum}`,
      `SAVE${discountNum}${productCode.slice(0, 2)}`,
      `GET${discountNum}OFF`,
      `${productCode}FEST${index + 1}`,
      `MEGA${discountNum}${productCode.slice(0, 2)}`,
      `${productCode}JOY${index + 1}`,
    ];

    return codeTemplates[index % codeTemplates.length];
  }

  private generatePushNotification(
    request: AICampaignRequest,
    campaignName: string,
    promoCode: string
  ) {
    const { product, discount, brandTone } = request;

    const titleTemplates = {
      elegant: [
        `✨ ${campaignName}`,
        `🎯 Premium ${product} Alert`,
        `💎 Exclusive Offer`,
      ],
      bold: [
        `🔥 ${campaignName}!`,
        `⚡ MASSIVE ${product} SALE!`,
        `💥 ${discount} OFF NOW!`,
      ],
      quirky: [
        `🎉 ${campaignName}!`,
        `🎪 ${product} Party Started!`,
        `🎭 Fun Alert!`,
      ],
      fun: [`🌟 ${campaignName}!`, `🎈 ${product} Happiness!`, `🎊 Joy Alert!`],
    };

    const bodyTemplates = {
      elegant: [
        `Discover premium ${product.toLowerCase()} with ${discount}. Use ${promoCode}`,
        `Exclusive ${discount} on curated ${product.toLowerCase()}. Code: ${promoCode}`,
        `Premium ${product.toLowerCase()} awaits. Get ${discount} with ${promoCode}`,
      ],
      bold: [
        `GRAB ${discount} on ${product.toLowerCase()}! Code: ${promoCode}. Limited time!`,
        `MASSIVE ${discount} OFF! ${product} sale live. Use ${promoCode} now!`,
        `${discount} OFF ${product.toLowerCase()}! Code ${promoCode}. Don't wait!`,
      ],
      quirky: [
        `${discount} off ${product.toLowerCase()}? Yes please! Use ${promoCode} 🎉`,
        `Plot twist: ${discount} off ${product.toLowerCase()}! Code: ${promoCode}`,
        `${product} + ${discount} = Happy you! Code: ${promoCode}`,
      ],
      fun: [
        `Yay! ${discount} off ${product.toLowerCase()}! Use ${promoCode} 🎈`,
        `Happy news: ${discount} off ${product.toLowerCase()}! Code: ${promoCode}`,
        `Fun alert: ${discount} off ${product.toLowerCase()}! Use ${promoCode}`,
      ],
    };

    const titles =
      titleTemplates[brandTone as keyof typeof titleTemplates] ||
      titleTemplates.fun;
    const bodies =
      bodyTemplates[brandTone as keyof typeof bodyTemplates] ||
      bodyTemplates.fun;

    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      body: bodies[Math.floor(Math.random() * bodies.length)],
    };
  }

  private generateOfferCopy(
    request: AICampaignRequest,
    campaignName: string
  ): string {
    const { product, discount, brandTone } = request;

    const copyTemplates = {
      elegant: [
        `Indulge in the finest ${product.toLowerCase()} collection. Experience luxury with ${discount} off.`,
        `Curated ${product.toLowerCase()} for the discerning you. Enjoy ${discount} off premium selections.`,
        `Elevate your style with premium ${product.toLowerCase()}. Exclusive ${discount} off for limited time.`,
      ],
      bold: [
        `UNLEASH the power of ${product.toLowerCase()}! Get ${discount} off NOW!`,
        `DOMINATE with ${product.toLowerCase()}! Massive ${discount} off everything!`,
        `CONQUER your wishlist! ${discount} off ${product.toLowerCase()} TODAY!`,
      ],
      quirky: [
        `Plot twist: Your favorite ${product.toLowerCase()} just got ${discount} cheaper! 🎭`,
        `Breaking news: ${product.toLowerCase()} prices dropped by ${discount}! 📰`,
        `Magic happened: ${discount} off ${product.toLowerCase()}! ✨`,
      ],
      fun: [
        `Happiness is ${discount} off ${product.toLowerCase()}! 🌈`,
        `Spread joy with ${product.toLowerCase()} at ${discount} off! 🎉`,
        `Fun times ahead with ${discount} off ${product.toLowerCase()}! 🎈`,
      ],
    };

    const copies =
      copyTemplates[brandTone as keyof typeof copyTemplates] ||
      copyTemplates.fun;
    return copies[Math.floor(Math.random() * copies.length)];
  }

  private generateLaunchWindow(): { startDate: string; endDate: string } {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1); // Start tomorrow

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7); // 7-day campaign

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  }

  private predictEngagement(
    similarCampaigns: typeof campaigns,
    request: AICampaignRequest
  ) {
    if (similarCampaigns.length === 0) {
      return {
        openRate: "35%",
        clickThroughRate: "5.2%",
        estimatedOrders: 150,
      };
    }

    const avgOpenRate =
      similarCampaigns.reduce(
        (sum, c) => sum + parseFloat(c.performance.openRate),
        0
      ) / similarCampaigns.length;
    const avgCTR =
      similarCampaigns.reduce(
        (sum, c) => sum + parseFloat(c.performance.clickThroughRate),
        0
      ) / similarCampaigns.length;
    const avgOrders =
      similarCampaigns.reduce((sum, c) => sum + c.performance.orders, 0) /
      similarCampaigns.length;

    // Apply tone-based multipliers
    const toneMultipliers = {
      elegant: 1.1,
      bold: 1.2,
      quirky: 0.95,
      fun: 1.05,
    };

    const multiplier =
      toneMultipliers[request.brandTone as keyof typeof toneMultipliers] || 1;

    return {
      openRate: `${Math.round(avgOpenRate * multiplier)}%`,
      clickThroughRate: `${(avgCTR * multiplier).toFixed(1)}%`,
      estimatedOrders: Math.round(avgOrders * 0.3 * multiplier),
    };
  }

  private generateAIInsight(
    request: AICampaignRequest,
    similarCampaigns: typeof campaigns,
    index: number
  ): string {
    const insights = [
      `Based on similar ${request.campaignType} campaigns, using ${request.brandTone} tone increases engagement by 15%. The emotional appeal of "${request.product}" resonates well with your target audience.`,
      `Historical data shows ${request.campaignType} campaigns perform best with urgency-driven copy. Your ${request.brandTone} tone will create strong brand recall and drive conversions.`,
      `Similar campaigns in the ${request.product} category achieved 40%+ higher engagement when combining ${request.brandTone} messaging with clear value propositions like "${request.discount}".`,
    ];

    return insights[index % insights.length];
  }

  async generateCampaigns(
    request: AICampaignRequest
  ): Promise<AICampaignResponse> {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Find similar campaigns from historical data
    const similarCampaigns = this.findSimilarCampaigns(request);

    // Generate 3 campaign variants
    const variants: AICampaignVariant[] = [];

    for (let i = 0; i < 3; i++) {
      const campaignName = this.generateCampaignName(request, i);
      const promoCode = this.generatePromoCode(request, i);
      const pushNotification = this.generatePushNotification(
        request,
        campaignName,
        promoCode
      );
      const offerCopy = this.generateOfferCopy(request, campaignName);
      const launchWindow = this.generateLaunchWindow();
      const predictedEngagement = this.predictEngagement(
        similarCampaigns,
        request
      );
      const aiInsight = this.generateAIInsight(request, similarCampaigns, i);

      variants.push({
        campaignName,
        promoCode,
        pushNotification,
        offerCopy,
        launchWindow,
        predictedEngagement,
        aiInsight,
      });
    }

    // Generate overall insights
    const overallInsights = {
      recommendedChannels: ["push", "email", "social", "sms"],
      bestPractices: [
        `${request.campaignType} campaigns with ${request.brandTone} tone perform 20% better`,
        `${request.product} category shows highest engagement on weekends`,
        `Push notifications with emojis increase open rates by 25%`,
      ],
      seasonalTrends: [
        "Festival seasons show 40% higher engagement for this category",
        "Weekend launches perform 30% better than weekday launches",
        `${request.brandTone} tone resonates best with evening campaign sends`,
      ],
    };

    return {
      variants,
      overallInsights,
      formData: request,
    };
  }
}

export const campaignAIService = new CampaignAIService();
