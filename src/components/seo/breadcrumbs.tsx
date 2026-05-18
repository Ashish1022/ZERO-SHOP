import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { JsonLd } from "./json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
    name: string;
    path: string;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
    className?: string;
    includeHome?: boolean;
};

export const Breadcrumbs = ({
    items,
    className,
    includeHome = true,
}: BreadcrumbsProps) => {
    const trail: BreadcrumbItem[] = includeHome
        ? [{ name: "Home", path: "/" }, ...items]
        : items;

    return (
        <>
            <JsonLd id={`breadcrumbs-${trail.map((t) => t.path).join("|")}`} data={breadcrumbJsonLd(trail)} />
            <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
                <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
                    {trail.map((item, index) => {
                        const isLast = index === trail.length - 1;
                        return (
                            <li key={item.path} className="flex items-center gap-1.5">
                                {index === 0 && includeHome ? (
                                    <Link
                                        href={item.path}
                                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                                        aria-label="Home"
                                    >
                                        <Home className="h-3.5 w-3.5" />
                                        <span className="sr-only">Home</span>
                                    </Link>
                                ) : isLast ? (
                                    <span aria-current="page" className="text-foreground font-medium">
                                        {item.name}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.path}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                                {!isLast && (
                                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
};
