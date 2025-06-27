
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bookmark, Dart, Bulb } from "lucide-react";
import GeneratorForm from "@/components/GeneratorForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import { GeneratedContent } from "@/types/generator";

const Index = () => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock content based on inputs
    const campaignNames = generateCampaignNames(formData);
    const promoCodes = generatePromoCodes(formData);
    
    setGeneratedContent({
      campaignNames,
      promoCodes,
      formData
    });
    
    setIsGenerating(false);
  };

  const generateCampaignNames = (data: any) => {
    const templates = {
      sale: [
        `${data.product} Blowout Sale`,
        `Ultimate ${data.product} Savings`,
        `${data.product} Flash Event`,
        `Mega ${data.product} Markdown`
      ],
      newLaunch: [
        `Fresh ${data.product} Drop`,
        `New ${data.product} Arrival`,
        `${data.product} Launch Party`,
        `Debut ${data.product} Collection`
      ],
      festive: [
        `Holiday ${data.product} Magic`,
        `Festive ${data.product} Rush`,
        `Celebration ${data.product} Sale`,
        `Season's Best ${data.product}`
      ],
      clearance: [
        `${data.product} Clearance Blast`,
        `Final ${data.product} Call`,
        `Last Chance ${data.product}`,
        `${data.product} Warehouse Clear`
      ],
      loyalty: [
        `VIP ${data.product} Access`,
        `Exclusive ${data.product} Rewards`,
        `Member's ${data.product} Special`,
        `Loyal Customer ${data.product} Treat`
      ]
    };
    
    return templates[data.campaignType as keyof typeof templates] || templates.sale;
  };

  const generatePromoCodes = (data: any) => {
    const baseWords = data.product.toUpperCase().slice(0, 4);
    const discountNum = data.discount.match(/\d+/)?.[0] || '20';
    
    const codes = [
      `${baseWords}${discountNum}`,
      `SAVE${discountNum}${baseWords.slice(0, 2)}`,
      `${baseWords}DEAL`,
      `GET${discountNum}OFF`,
      `${baseWords}LOVE`,
      `FLASH${discountNum}`
    ];
    
    return codes.slice(0, 4);
  };

  const resetGeneration = () => {
    setGeneratedContent(null);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Bookmark className="w-8 h-8 text-white" />
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full">
              <Dart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Promocode + Offer Name Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Create compelling campaign names and memorable promo codes that drive conversions and build brand loyalty.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 bg-purple-100 text-purple-800 border-purple-200">
              <Bookmark className="w-4 h-4 mr-2" />
              Creative Offer Names
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-pink-100 text-pink-800 border-pink-200">
              <Dart className="w-4 h-4 mr-2" />
              Memorable Promo Codes
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 bg-orange-100 text-orange-800 border-orange-200">
              <Bulb className="w-4 h-4 mr-2" />
              AI-Powered Generation
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
                  Fill in the details below to generate creative campaign names and promo codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Your Generated Content</h2>
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
            Built with AI to help marketers create compelling campaigns faster
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
