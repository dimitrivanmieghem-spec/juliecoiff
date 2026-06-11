import { MetadataRoute } from "next";

const baseUrl = "https://www.juliecoiff.be";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: `${baseUrl}/`,                 priority: 1.0, changeFrequency: "weekly"  },
    { url: `${baseUrl}/services`,         priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/contact`,          priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/blog`,             priority: 0.8, changeFrequency: "weekly"  },
    { url: `${baseUrl}/mentions-legales`, priority: 0.5, changeFrequency: "yearly"  },
    { url: `${baseUrl}/cgv`,              priority: 0.5, changeFrequency: "yearly"  },
  ];
}
