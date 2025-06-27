
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Target, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { campaigns } from "@/data/campaigns";

const Analytics = () => {
  // Calculate analytics
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.performance.revenue, 0);
  const totalOrders = campaigns.reduce((sum, c) => sum + c.performance.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  
  const topPerformers = campaigns
    .sort((a, b) => b.performance.revenue - a.performance.revenue)
    .slice(0, 3);

  const campaignTypeAnalysis = campaigns.reduce((acc, campaign) => {
    const type = campaign.campaignName.includes('Sale') ? 'Sale' :
                 campaign.campaignName.includes('Flash') ? 'Flash' :
                 campaign.campaignName.includes('Festive') || campaign.campaignName.includes('Diwali') ? 'Festive' :
                 'Other';
    
    if (!acc[type]) {
      acc[type] = { count: 0, revenue: 0, orders: 0 };
    }
    acc[type].count++;
    acc[type].revenue += campaign.performance.revenue;
    acc[type].orders += campaign.performance.orders;
    return acc;
  }, {} as Record<string, { count: number; revenue: number; orders: number }>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Generator
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Campaign Analytics
          </h1>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
                </div>
                <Target className="w-8 h-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Avg Order Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                </div>
                <Award className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Performers */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Top Performing Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{campaign.campaignName}</p>
                      <p className="text-sm text-gray-600">{campaign.performance.orders.toLocaleString()} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(campaign.performance.revenue)}</p>
                      <p className="text-sm text-gray-600">{campaign.performance.openRate} open rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Type Analysis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Campaign Type Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(campaignTypeAnalysis).map(([type, data]) => (
                  <div key={type} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">{type} Campaigns</h4>
                      <span className="text-sm text-gray-600">{data.count} campaigns</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="font-bold text-green-600">{formatCurrency(data.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="font-bold text-blue-600">{data.orders.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">Performance Patterns</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Flash sales achieve the highest conversion rates (12% CTR)</li>
                  <li>• Festive campaigns show 40%+ higher engagement rates</li>
                  <li>• Weekend launches perform 25% better than weekdays</li>
                  <li>• Email campaigns with urgency words perform 30% better</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-3">Revenue Insights</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Average order value: {formatCurrency(avgOrderValue)}</li>
                  <li>• Flash campaigns generate highest revenue per order</li>
                  <li>• Festive campaigns have longest engagement periods</li>
                  <li>• Bundle offers increase average order value by 35%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
