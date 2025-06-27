
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
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

      {/* Usage Tips */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">💡 Usage Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-orange-700 space-y-2">
          <p>• Test different campaign names with your audience to see which resonates best</p>
          <p>• Keep promo codes short and memorable for easy sharing</p>
          <p>• Consider A/B testing different combinations for optimal performance</p>
          <p>• Match the tone of your campaign with your brand voice across all channels</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
