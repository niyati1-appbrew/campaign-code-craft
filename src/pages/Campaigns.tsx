
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, TrendingUp, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { campaigns } from "@/data/campaigns";

const Campaigns = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPerformanceColor = (orders: number) => {
    if (orders > 6000) return "bg-green-100 text-green-800 border-green-200";
    if (orders > 3000) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
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
            Campaign History
          </h1>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-800">{campaigns.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.round(campaigns.reduce((sum, c) => sum + parseFloat(c.performance.openRate), 0) / campaigns.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {campaigns.reduce((sum, c) => sum + c.performance.orders, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(campaigns.reduce((sum, c) => sum + c.performance.revenue, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="space-y-6">
          {campaigns.map((campaign, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-800 mb-2">
                      {campaign.campaignName}
                    </CardTitle>
                    <p className="text-gray-600 mb-3">{campaign.description}</p>
                    <div className="flex gap-2 mb-3">
                      {campaign.offers.map((offer, offerIndex) => (
                        <Badge key={offerIndex} variant="secondary" className="bg-purple-100 text-purple-800">
                          {offer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className={getPerformanceColor(campaign.performance.orders)}>
                    {campaign.performance.orders > 6000 ? 'High' : 
                     campaign.performance.orders > 3000 ? 'Medium' : 'Low'} Performance
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Campaign Period</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Performance</p>
                    <div className="space-y-1">
                      <p className="text-sm">Open Rate: <span className="font-medium">{campaign.performance.openRate}</span></p>
                      <p className="text-sm">CTR: <span className="font-medium">{campaign.performance.clickThroughRate}</span></p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Orders</p>
                    <p className="font-bold text-lg text-gray-800">{campaign.performance.orders.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                    <p className="font-bold text-lg text-green-600">{formatCurrency(campaign.performance.revenue)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Channel Performance</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-sm text-gray-600">Subject: {campaign.channels.email.subject}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-800">Push Notification</p>
                      <p className="text-sm text-gray-600">{campaign.channels.push.title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
