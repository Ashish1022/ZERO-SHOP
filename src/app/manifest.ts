import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/constants/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_CONFIG.name,
        short_name: SITE_CONFIG.shortName,
        description: SITE_CONFIG.description,
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#0a0a0a",
        lang: SITE_CONFIG.language,
        categories: ["shopping", "lifestyle"],
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
