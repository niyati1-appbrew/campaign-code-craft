import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bookmark, Target, Lightbulb, BarChart3, History } from "lucide-react";
import { Link } from "react-router-dom";
import GeneratorForm from "@/components/GeneratorForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import {
  GeneratedContent,
  FormData,
  AICampaignResponse,
} from "@/types/generator";
import { campaigns } from "@/data/campaigns";
import { geminiCampaignAIService } from "@/services/geminiCampaignAI";

const Index = () => {
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (formData: FormData) => {
    setIsGenerating(true);

    try {
      // Generate AI campaigns using Gemini
      const aiResponse = await geminiCampaignAIService.generateCampaigns({
        campaignType: formData.campaignType,
        campaignSuggestion: formData.campaignSuggestion,
        discount: formData.discount,
        product: formData.product,
        brandTone: formData.brandTone || "fun",
      });

      // Also generate legacy suggestions for fallback
      const campaignNames = generateCampaignNames(formData);
      const promoCodes = generatePromoCodes(formData);
      const insights = generateInsights(formData);

      setGeneratedContent({
        campaignNames,
        promoCodes,
        insights,
        formData: {
          campaignType: formData.campaignType,
          discount: formData.discount,
          product: formData.product,
          brandTone: formData.brandTone || "fun",
        },
        // New AI-powered fields
        aiCampaigns: aiResponse.variants,
        pushNotifications: aiResponse.variants.map((v) => v.pushNotification),
      });
    } catch (error) {
      console.error("Error generating campaigns:", error);

      // Fallback to legacy generation
      const campaignNames = generateCampaignNames(formData);
      const promoCodes = generatePromoCodes(formData);
      const insights = generateInsights(formData);

      setGeneratedContent({
        campaignNames,
        promoCodes,
        insights,
        formData: {
          campaignType: formData.campaignType,
          discount: formData.discount,
          product: formData.product,
          brandTone: formData.brandTone || "fun",
        },
      });
    }

    setIsGenerating(false);
  };

  const generateCampaignNames = (data: FormData) => {
    // Analyze historical data for similar campaigns
    const similarCampaigns = campaigns.filter(
      (campaign) =>
        campaign.campaignName
          .toLowerCase()
          .includes(data.campaignType.toLowerCase()) ||
        campaign.offers.some((offer) =>
          offer.toLowerCase().includes(data.discount.toLowerCase())
        )
    );

    const templates = {
      sale: [
        `${data.product} Mega Sale 2024`,
        `Ultimate ${data.product} Savings`,
        `${data.product} Flash Festival`,
        `Grand ${data.product} Carnival`,
        `${data.product} Super Saver Event`,
      ],
      newLaunch: [
        `Fresh ${data.product} Drop`,
        `New ${data.product} Arrival`,
        `${data.product} Launch Fest`,
        `Debut ${data.product} Collection`,
        `${data.product} Grand Reveal`,
      ],
      festive: [
        `${data.product} Festive Magic`,
        `Celebration ${data.product} Sale`,
        `Festival ${data.product} Special`,
        `${data.product} Festive Fiesta`,
        `Holiday ${data.product} Extravaganza`,
      ],
      clearance: [
        `${data.product} Clearance Bonanza`,
        `Final ${data.product} Call`,
        `Last Chance ${data.product}`,
        `${data.product} Warehouse Clear`,
        `End Season ${data.product} Sale`,
      ],
      loyalty: [
        `VIP ${data.product} Access`,
        `Exclusive ${data.product} Rewards`,
        `Member's ${data.product} Special`,
        `Loyal Customer ${data.product} Treat`,
        `Premium ${data.product} Experience`,
      ],
    };

    return (
      templates[data.campaignType as keyof typeof templates] || templates.sale
    );
  };

  const generatePromoCodes = (data: FormData) => {
    const baseWords = data.product.toUpperCase().slice(0, 4);
    const discountNum = data.discount.match(/\d+/)?.[0] || "20";

    // Generate codes based on historical successful patterns
    const codes = [
      `${baseWords}${discountNum}`,
      `SAVE${discountNum}${baseWords.slice(0, 2)}`,
      `${baseWords}FEST`,
      `GET${discountNum}OFF`,
      `${baseWords}JOY`,
      `MEGA${discountNum}`,
      `${baseWords}MAGIC`,
      `FLASH${discountNum}`,
    ];

    return codes.slice(0, 6);
  };

  const generateInsights = (data: FormData) => {
    // Analyze historical performance data
    const avgOpenRate =
      campaigns.reduce(
        (sum, c) => sum + parseFloat(c.performance.openRate),
        0
      ) / campaigns.length;
    const avgCTR =
      campaigns.reduce(
        (sum, c) => sum + parseFloat(c.performance.clickThroughRate),
        0
      ) / campaigns.length;
    const topPerformers = campaigns
      .sort((a, b) => b.performance.orders - a.performance.orders)
      .slice(0, 3);

    return {
      recommendedChannels: ["email", "push", "social"],
      expectedPerformance: {
        openRate: `${Math.round(avgOpenRate)}%`,
        clickThroughRate: `${avgCTR.toFixed(1)}%`,
        estimatedOrders: Math.round(avgOpenRate * avgCTR * 100),
      },
      bestPractices: [
        `Based on historical data, ${
          data.campaignType
        } campaigns perform best with ${Math.round(avgOpenRate)}% open rates`,
        `Top performing campaigns use "${topPerformers[0].campaignName}" style naming`,
        `Consider adding urgency words like "Flash", "Limited", or "Last Chance"`,
      ],
      seasonalTrends: [
        "Festive campaigns (Diwali, New Year) show 40%+ higher engagement",
        "Flash sales have the highest conversion rates at 12%",
        "Weekend launches perform 25% better than weekday launches",
      ],
    };
  };

  const resetGeneration = () => {
    setGeneratedContent(null);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Campaign Generator
            </h1>
          </div>
          <div className="flex gap-2">
            <Link to="/campaigns">
              <Button variant="outline" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                View Campaigns
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Bookmark className="w-8 h-8 text-white" />
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            AI-Powered Campaign Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Create compelling campaign names and memorable promo codes using AI
            insights from {campaigns.length}+ historical campaigns.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge
              variant="secondary"
              className="px-4 py-2 bg-purple-100 text-purple-800 border-purple-200"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Data-Driven Names
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 bg-pink-100 text-pink-800 border-pink-200"
            >
              <Target className="w-4 h-4 mr-2" />
              Smart Promo Codes
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 bg-orange-100 text-orange-800 border-orange-200"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Performance Insights
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!generatedContent ? (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Generate Your Marketing Campaign
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Fill in the details below to generate AI-powered campaign
                  names and promo codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeneratorForm
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Generated Content
                </h2>
                <Button
                  onClick={resetGeneration}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Generate New
                </Button>
              </div>

              <ResultsDisplay content={generatedContent} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Powered by AI insights from {campaigns.length} historical campaigns
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
