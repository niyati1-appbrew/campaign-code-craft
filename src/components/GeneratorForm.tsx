
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface GeneratorFormProps {
  onGenerate: (data: any) => void;
  isGenerating: boolean;
}

const GeneratorForm = ({ onGenerate, isGenerating }: GeneratorFormProps) => {
  const [formData, setFormData] = useState({
    campaignType: "",
    discount: "",
    product: "",
    brandTone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.campaignType && formData.discount && formData.product) {
      onGenerate(formData);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.campaignType && formData.discount && formData.product;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="campaignType" className="text-sm font-medium text-gray-700">
            Campaign Type *
          </Label>
          <Select value={formData.campaignType} onValueChange={(value) => updateFormData("campaignType", value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select campaign type" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="newLaunch">New Launch</SelectItem>
              <SelectItem value="festive">Festive</SelectItem>
              <SelectItem value="clearance">Clearance</SelectItem>
              <SelectItem value="loyalty">Loyalty Reward</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount" className="text-sm font-medium text-gray-700">
            Discount or Offer *
          </Label>
          <Input
            id="discount"
            placeholder="e.g., 25% off, Buy 1 Get 1, Free shipping"
            value={formData.discount}
            onChange={(e) => updateFormData("discount", e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product" className="text-sm font-medium text-gray-700">
            Product/Category *
          </Label>
          <Input
            id="product"
            placeholder="e.g., Skincare, T-shirts, Home Decor"
            value={formData.product}
            onChange={(e) => updateFormData("product", e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandTone" className="text-sm font-medium text-gray-700">
            Brand Tone (Optional)
          </Label>
          <Select value={formData.brandTone} onValueChange={(value) => updateFormData("brandTone", value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select brand tone" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              <SelectItem value="fun">Fun</SelectItem>
              <SelectItem value="elegant">Elegant</SelectItem>
              <SelectItem value="quirky">Quirky</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={!isFormValid || isGenerating}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Campaign Content"
          )}
        </Button>
      </div>

      {!isFormValid && (
        <p className="text-sm text-gray-500 mt-2">
          * Please fill in all required fields to generate content
        </p>
      )}
    </form>
  );
};

export default GeneratorForm;
