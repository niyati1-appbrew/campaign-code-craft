import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  TrendingUp,
  Target,
  Lightbulb,
  Calendar,
  Bell,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GeneratedContent, AICampaignVariant } from "@/types/generator";

interface ResultsDisplayProps {
  content: GeneratedContent;
}

const ResultsDisplay = ({ content }: ResultsDisplayProps) => {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems((prev) => new Set(prev).add(`${type}-${item}`));

      toast({
        title: "Copied!",
        description: `${text} copied to clipboard`,
        duration: 2000,
      });

      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(`${type}-${item}`);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const renderAICampaignVariant = (
    variant: AICampaignVariant,
    index: number
  ) => (
    <Card key={index} className="bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
              Variant {index + 1}: {variant.campaignName}
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800"
            >
              {variant.promoCode}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  variant.campaignName,
                  "campaign",
                  `variant-${index}`
                )
              }
            >
              {copiedItems.has(`campaign-variant-${index}`) ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notification */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Bell className="w-4 h-4" />
            Push Notification
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="font-semibold text-gray-800 mb-1">
              {variant.pushNotification.title}
            </div>
            <div className="text-gray-600 text-sm">
              {variant.pushNotification.body}
            </div>
          </div>
        </div>

        {/* Offer Copy */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Sparkles className="w-4 h-4" />
            Offer Copy
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <p className="text-gray-800">{variant.offerCopy}</p>
          </div>
        </div>

        {/* Launch Window */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            Recommended Launch Window
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-medium">Start:</span>{" "}
              {new Date(variant.launchWindow.startDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">End:</span>{" "}
              {new Date(variant.launchWindow.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Predicted Engagement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BarChart3 className="w-4 h-4" />
            Predicted Engagement
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-800">
                {variant.predictedEngagement.openRate}
              </div>
              <div className="text-xs text-green-600">Open Rate</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800">
                {variant.predictedEngagement.clickThroughRate}
              </div>
              <div className="text-xs text-blue-600">CTR</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800">
                {variant.predictedEngagement.estimatedOrders}
              </div>
              <div className="text-xs text-purple-600">Est. Orders</div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Lightbulb className="w-4 h-4" />
            AI Insight
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-gray-800 text-sm">{variant.aiInsight}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Campaign Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl text-purple-800">
            Campaign Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold capitalize">
                {content.formData.campaignType}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Product</p>
              <p className="font-semibold">{content.formData.product}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Discount</p>
              <p className="font-semibold">{content.formData.discount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Brand Tone</p>
              <p className="font-semibold capitalize">
                {content.formData.brandTone}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="ai-campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-campaigns" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Campaign Variants
          </TabsTrigger>
          <TabsTrigger value="legacy" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Quick Suggestions
          </TabsTrigger>
        </TabsList>

        {/* AI Campaign Variants Tab */}
        <TabsContent value="ai-campaigns" className="space-y-6">
          {content.aiCampaigns && content.aiCampaigns.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  AI-Generated Campaign Variants
                </h3>
                <p className="text-gray-600">
                  Based on historical data and AI insights
                </p>
              </div>
              {content.aiCampaigns.map((variant, index) =>
                renderAICampaignVariant(variant, index)
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                AI campaign variants not available. Try the Quick Suggestions
                tab.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Legacy/Quick Suggestions Tab */}
        <TabsContent value="legacy" className="space-y-6">
          {/* Campaign Names */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-purple-600" />
                Campaign Names
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {content.campaignNames.map((name, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(name, "name", index.toString())
                      }
                    >
                      {copiedItems.has(`name-${index}`) ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Promo Codes */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Badge className="w-5 h-5 bg-pink-600" />
                Promo Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {content.promoCodes.map((code, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100"
                  >
                    <span className="font-mono font-bold text-pink-800">
                      {code}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(code, "code", index.toString())
                      }
                    >
                      {copiedItems.has(`code-${index}`) ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Expected Performance */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Expected Performance
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {content.insights.expectedPerformance.openRate}
                    </div>
                    <div className="text-sm text-green-600">Open Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">
                      {content.insights.expectedPerformance.clickThroughRate}
                    </div>
                    <div className="text-sm text-blue-600">Click Rate</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">
                      {content.insights.expectedPerformance.estimatedOrders}
                    </div>
                    <div className="text-sm text-purple-600">Est. Orders</div>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Best Practices
                </h4>
                <div className="space-y-2">
                  {content.insights.bestPractices.map((practice, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg"
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <p className="text-gray-800 text-sm">{practice}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasonal Trends */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Seasonal Trends
                </h4>
                <div className="space-y-2">
                  {content.insights.seasonalTrends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p className="text-gray-800 text-sm">{trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsDisplay;
