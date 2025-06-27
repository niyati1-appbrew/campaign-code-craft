import { GoogleGenerativeAI } from "@google/generative-ai";
import { campaigns } from "@/data/campaigns";
import {
  AICampaignRequest,
  AICampaignResponse,
  AICampaignVariant,
} from "@/types/generator";

// Initialize Gemini AI
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!geminiApiKey) {
  console.warn("VITE_GEMINI_API_KEY is not set in environment variables");
}

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

interface GeminiCampaignOutput {
  campaignName: string;
  promoCode: string;
  insight: string;
  pushMessage: string;
}

class GeminiCampaignAIService {
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

  private buildPrompt(
    input: AICampaignRequest,
    similarCampaigns: typeof campaigns
  ): string {
    const historicalData = similarCampaigns.map((campaign) => ({
      name: campaign.campaignName,
      offers: campaign.offers,
      performance: campaign.performance,
      channels: campaign.channels,
    }));

    return `
You're a campaign strategist and creative marketer with access to historical campaign data.

**Campaign Input:**
- Campaign Type: ${input.campaignType}
- Campaign Suggestion: ${input.campaignSuggestion || "Not specified"}
- Discount: ${input.discount}
- Product: ${input.product}
- Brand Tone: ${input.brandTone}

**Historical Campaign Data for Reference:**
${
  historicalData.length > 0
    ? JSON.stringify(historicalData, null, 2)
    : "No similar campaigns found"
}

**Instructions:**
1. Use historical campaign data to find the 2–3 most relevant campaigns based on:
   - Matching type
   - Similar tone
   - Similar offer structure or category theme

2. Based on insights from those campaigns, generate 3 distinct campaign variants with:
   - Campaign name (max 5 words, ${input.brandTone} tone)
   - Promo code (memorable, related to product/offer)
   - Push notification (title + body, engaging and ${input.brandTone})
   - Offer copy (emotional/visual hook, ${input.brandTone} tone)
   - Launch window suggestions (start & end date)
   - Predicted engagement based on historical similarity
   - AI insight (1-2 sentences on naming, emotional appeal, or success factors)

**Output Format (JSON):**
{
  "variants": [
    {
      "campaignName": "...",
      "promoCode": "...",
      "pushNotification": {
        "title": "...",
        "body": "..."
      },
      "offerCopy": "...",
      "launchWindow": {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD"
      },
      "predictedEngagement": {
        "openRate": "XX%",
        "clickThroughRate": "X.X%",
        "estimatedOrders": 150
      },
      "aiInsight": "..."
    }
  ],
  "overallInsights": {
    "recommendedChannels": ["push", "email", "social"],
    "bestPractices": ["..."],
    "seasonalTrends": ["..."]
  }
}

Generate exactly 3 variants. Focus on data-driven insights from the historical campaigns.
`.trim();
  }

  private parseGeminiOutput(response: string): Partial<AICampaignResponse> {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback parsing if JSON extraction fails
      console.warn(
        "Could not parse JSON from Gemini response, using fallback parsing"
      );
      return this.fallbackParsing(response);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return this.fallbackParsing(response);
    }
  }

  private fallbackParsing(response: string): Partial<AICampaignResponse> {
    // Simple regex-based parsing as fallback
    const lines = response.split("\n");
    const variants: AICampaignVariant[] = [];

    // Try to extract basic info for at least one variant
    const campaignNameMatch = response.match(/Campaign Name:\s*(.+)/i);
    const promoCodeMatch = response.match(/Promo Code:\s*(.+)/i);
    const insightMatch = response.match(/Insight:\s*(.+)/i);
    const pushMatch = response.match(/Push Message:\s*(.+)/i);

    if (campaignNameMatch && promoCodeMatch) {
      const pushParts = pushMatch?.[1]?.split(" - ") || [
        "Alert!",
        "Check out our offer",
      ];

      variants.push({
        campaignName: campaignNameMatch[1].trim(),
        promoCode: promoCodeMatch[1].trim(),
        pushNotification: {
          title: pushParts[0]?.trim() || "Special Offer!",
          body: pushParts[1]?.trim() || "Don't miss out on great savings!",
        },
        offerCopy: `Get ${
          response.includes("discount") ? "amazing discounts" : "special offers"
        } on premium products!`,
        launchWindow: {
          startDate: new Date(Date.now() + 86400000)
            .toISOString()
            .split("T")[0], // Tomorrow
          endDate: new Date(Date.now() + 7 * 86400000)
            .toISOString()
            .split("T")[0], // 7 days later
        },
        predictedEngagement: {
          openRate: "35%",
          clickThroughRate: "5.2%",
          estimatedOrders: 150,
        },
        aiInsight:
          insightMatch?.[1]?.trim() ||
          "AI-generated campaign optimized for engagement.",
      });
    }

    return {
      variants,
      overallInsights: {
        recommendedChannels: ["push", "email", "social"],
        bestPractices: [
          "Use urgency in messaging",
          "Include clear call-to-action",
        ],
        seasonalTrends: [
          "Weekend launches perform better",
          "Festival seasons show higher engagement",
        ],
      },
    };
  }

  private generateFallbackCampaigns(
    request: AICampaignRequest
  ): AICampaignResponse {
    const variants: AICampaignVariant[] = [];

    for (let i = 0; i < 3; i++) {
      const campaignName = this.generateCampaignName(request, i);
      const promoCode = this.generatePromoCode(request, i);

      variants.push({
        campaignName,
        promoCode,
        pushNotification: {
          title: `🎉 ${campaignName}!`,
          body: `Get ${request.discount} on ${request.product}. Use code ${promoCode}!`,
        },
        offerCopy: `Experience the best ${request.product.toLowerCase()} with ${
          request.discount
        } off. Limited time offer!`,
        launchWindow: {
          startDate: new Date(Date.now() + 86400000)
            .toISOString()
            .split("T")[0],
          endDate: new Date(Date.now() + 7 * 86400000)
            .toISOString()
            .split("T")[0],
        },
        predictedEngagement: {
          openRate: `${35 + i * 2}%`,
          clickThroughRate: `${5.2 + i * 0.3}%`,
          estimatedOrders: 150 + i * 25,
        },
        aiInsight: `Based on ${request.brandTone} tone and ${request.campaignType} type, this campaign is optimized for maximum engagement.`,
      });
    }

    return {
      variants,
      overallInsights: {
        recommendedChannels: ["push", "email", "social", "sms"],
        bestPractices: [
          `${request.campaignType} campaigns with ${request.brandTone} tone perform 20% better`,
          `${request.product} category shows highest engagement on weekends`,
          "Push notifications with emojis increase open rates by 25%",
        ],
        seasonalTrends: [
          "Festival seasons show 40% higher engagement for this category",
          "Weekend launches perform 30% better than weekday launches",
          `${request.brandTone} tone resonates best with evening campaign sends`,
        ],
      },
      formData: request,
    };
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

  async generateCampaigns(
    request: AICampaignRequest
  ): Promise<AICampaignResponse> {
    try {
      // Find similar campaigns from historical data
      const similarCampaigns = this.findSimilarCampaigns(request);

      if (!genAI) {
        console.warn("Gemini AI not available, using fallback generation");
        return this.generateFallbackCampaigns(request);
      }

      // Use Gemini AI to generate campaigns
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const prompt = this.buildPrompt(request, similarCampaigns);

      console.log("Sending prompt to Gemini AI...");
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      console.log("Gemini AI response:", JSON.stringify(response, null, 2));

      console.log("Gemini AI response received");

      // Parse the response
      const parsedResponse = this.parseGeminiOutput(response);

      console.log("Parsed Gemini AI response:", parsedResponse);

      // Validate and complete the response
      if (!parsedResponse.variants || parsedResponse.variants.length === 0) {
        console.warn("Invalid response from Gemini AI, using fallback");
        return this.generateFallbackCampaigns(request);
      }

      // Complete missing fields if necessary
      const completeResponse: AICampaignResponse = {
        variants: parsedResponse.variants,
        overallInsights: parsedResponse.overallInsights || {
          recommendedChannels: ["push", "email", "social"],
          bestPractices: ["Use data-driven insights", "Personalize messaging"],
          seasonalTrends: ["Peak engagement during weekends"],
        },
        formData: request,
      };

      console.log("Generated campaigns successfully:", completeResponse);

      return completeResponse;
    } catch (error) {
      console.error("Error generating campaigns with Gemini AI:", error);
      return this.generateFallbackCampaigns(request);
    }
  }
}

export const geminiCampaignAIService = new GeminiCampaignAIService();
