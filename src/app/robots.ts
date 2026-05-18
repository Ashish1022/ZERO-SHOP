import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin",
                    "/admin/*",
                    "/api/*",
                    "/checkout",
                    "/checkout/*",
                    "/*?*sort=",
                    "/*?*page=",
                ],
            },
            {
                userAgent: "GPTBot",
                disallow: "/",
            },
            {
                userAgent: "CCBot",
                disallow: "/",
            },
        ],
        sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
        host: SITE_CONFIG.url,
    };
}
