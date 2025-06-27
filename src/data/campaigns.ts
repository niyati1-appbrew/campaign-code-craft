
import { Campaign } from "@/types/campaign";

export const campaigns: Campaign[] = [
  {
    campaignName: "Purple Days Sale 2024",
    startDate: "2024-07-27",
    endDate: "2024-08-04",
    description: "Flagship summer sale featuring exclusive ethnic wear collections set against iconic landmarks.",
    offers: ["Up to 70% Off + Extra 15% Off", "Buy 4 at ₹2,199"],
    creativeAssets: {
      video: "https://libas-assets.com/videos/purple_days_cgi.mp4",
      bannerImage: "https://libas-assets.com/images/purple_days_banner.jpg"
    },
    channels: {
      push: {
        title: "🟣 Purple Days Are Here!",
        body: "Up to 70% Off + Extra 15% Off. Ethnic stunners await you!",
        sent: "2024-07-27T10:00:00Z"
      },
      email: {
        subject: "The Ethnic Mega Sale You Can't Miss!",
        preheader: "Get ready to glow with up to 70% off",
        bodySnippet: "Extra 15% off on bundles",
        sent: "2024-07-26T18:30:00Z"
      }
    },
    performance: {
      openRate: "41%",
      clickThroughRate: "7.2%",
      orders: 4782,
      revenue: 18620000
    }
  },
  {
    campaignName: "Monsoon Magic 2024",
    startDate: "2024-06-10",
    endDate: "2024-06-18",
    description: "Monsoon-themed discounts on lightweight kurtas and dresses.",
    offers: ["Up to 50% Off", "Free umbrella with ₹2,000+"],
    creativeAssets: {
      bannerImage: "https://libas-assets.com/images/monsoon_magic.jpg"
    },
    channels: {
      push: {
        title: "🌧️ Monsoon Magic Starts Now!",
        body: "Up to 50% off + free umbrella on ₹2k+",
        sent: "2024-06-10T09:00:00Z"
      },
      email: {
        subject: "Rainy Days, Sunny Deals!",
        preheader: "Umbrella free on ₹2k+ order",
        bodySnippet: "Top picks for monsoon comfort",
        sent: "2024-06-09T20:00:00Z"
      }
    },
    performance: {
      openRate: "36%",
      clickThroughRate: "5.8%",
      orders: 3120,
      revenue: 9800000
    }
  },
  {
    campaignName: "Festive Flair Diwali 2023",
    startDate: "2023-10-15",
    endDate: "2023-10-30",
    description: "Diwali festive collection launch with ethnic ensembles.",
    offers: ["Flat 40% Off", "Buy 2 Get 1 Free"],
    creativeAssets: {
      video: "https://libas-assets.com/videos/diwali_flair.mp4",
      bannerImage: "https://libas-assets.com/images/diwali_flair_banner.jpg"
    },
    channels: {
      push: {
        title: "🎆 Diwali Festivity Begins!",
        body: "Flat 40% off + extra free piece",
        sent: "2023-10-15T11:00:00Z"
      },
      email: {
        subject: "Light Up Your Diwali in Style!",
        preheader: "Festive 40% + BOGO offer",
        bodySnippet: "Discover your festive look",
        sent: "2023-10-14T19:00:00Z"
      }
    },
    performance: {
      openRate: "48%",
      clickThroughRate: "9.0%",
      orders: 6100,
      revenue: 24050000
    }
  },
  {
    campaignName: "Flash Fridays 2023",
    startDate: "2023-11-03",
    endDate: "2023-11-03",
    description: "24‑hour flash sale every Friday on select items.",
    offers: ["Up to 80% Off"],
    creativeAssets: {
      bannerImage: "https://libas-assets.com/images/flash_fridays.jpg"
    },
    channels: {
      push: {
        title: "⚡ Flash Friday: 80% Off!",
        body: "One-day only—don't miss out!",
        sent: "2023-11-03T00:00:00Z"
      },
      email: {
        subject: "Flash Friday Savings are Here!",
        preheader: "80% off for today only",
        bodySnippet: "Huge markdowns underway",
        sent: "2023-11-02T20:00:00Z"
      }
    },
    performance: {
      openRate: "50%",
      clickThroughRate: "12%",
      orders: 7200,
      revenue: 31500000
    }
  },
  {
    campaignName: "New Year Bash 2024",
    startDate: "2023-12-29",
    endDate: "2024-01-02",
    description: "Celebrate the new year with glitzy styles.",
    offers: ["70% Off Site‑wide", "Extra 10% with NYBASH"],
    creativeAssets: {
      bannerImage: "https://libas-assets.com/images/new_year_bash.jpg"
    },
    channels: {
      push: {
        title: "🎉 NY Bash: 70% Off + Extra 10%",
        body: "Use code NYBASH for extra savings!",
        sent: "2023-12-29T12:00:00Z"
      },
      email: {
        subject: "Ring in the New Year with Style!",
        preheader: "70% off + extra 10%",
        bodySnippet: "Dress your best for 2024",
        sent: "2023-12-28T20:00:00Z"
      }
    },
    performance: {
      openRate: "44%",
      clickThroughRate: "8.5%",
      orders: 5300,
      revenue: 21000000
    }
  }
];
