
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, TrendingUp, Target, Lightbulb, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GeneratedContent } from "@/types/generator";

interface ResultsDisplayProps {
  content: GeneratedContent;
}

const ResultsDisplay = ({ content }: ResultsDisplayProps) => {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(`${type}-${item}`));
      
      toast({
        title: "Copied!",
        description: `${text} copied to clipboard`,
        duration: 2000,
      });

      setTimeout(() => {
        setCopiedItems(prev => {
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

  return (
    <div className="space-y-8">
      {/* Campaign Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl text-purple-800">Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Campaign Type</p>
              <Badge variant="secondary" className="capitalize">
                {content.formData.campaignType.replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Offer</p>
              <p className="font-medium text-gray-800">{content.formData.discount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Product/Category</p>
              <p className="font-medium text-gray-800">{content.formData.product}</p>
            </div>
            {content.formData.brandTone && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Brand Tone</p>
                <Badge variant="outline" className="capitalize">
                  {content.formData.brandTone}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            AI Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Expected Performance
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Open Rate:</span>
                  <span className="font-medium text-blue-800">{content.insights.expectedPerformance.openRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Click Rate:</span>
                  <span className="font-medium text-blue-800">{content.insights.expectedPerformance.clickThroughRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Est. Orders:</span>
                  <span className="font-medium text-blue-800">{content.insights.expectedPerformance.estimatedOrders}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Best Practices
              </h4>
              <ul className="space-y-1 text-sm text-blue-700">
                {content.insights.bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Campaign Names */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <span>Campaign Name Suggestions</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {content.campaignNames.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {content.campaignNames.map((name, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
                >
                  <span className="font-medium text-purple-900 flex-1">{name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(name, 'campaign', index.toString())}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-200"
                  >
                    {copiedItems.has(`campaign-${index}`) ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-purple-600" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Promo Codes */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <span>Promo Code Suggestions</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {content.promoCodes.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {content.promoCodes.map((code, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-100 hover:bg-pink-100 transition-colors"
                >
                  <span className="font-mono font-bold text-pink-900 text-lg flex-1">{code}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(code, 'promo', index.toString())}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-200"
                  >
                    {copiedItems.has(`promo-${index}`) ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-pink-600" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Trends */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Seasonal Trends & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-orange-700 space-y-2">
          {content.insights.seasonalTrends.map((trend, index) => (
            <p key={index}>• {trend}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
