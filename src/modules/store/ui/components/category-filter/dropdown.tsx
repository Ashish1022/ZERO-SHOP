"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ListItem, PathFilterItem } from ".";
import { ChevronDown, ChevronRight } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { createUrl } from "@/lib/utils";

export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("All");
  const [openSelect, setOpenSelect] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ("path" in listItem && pathname === listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") === listItem.slug)
      ) {
        setActive(listItem.title || listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  const toggleCategory = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const renderItem = (item: ListItem) => {
    if ("path" in item) {
      const pathItem = item as PathFilterItem;
      const hasSubcategories =
        pathItem.subcategories && pathItem.subcategories.length > 0;
      const isExpanded = expandedCategories.has(pathItem.label || "");
      const isActive = pathname === pathItem.path;
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("q");

      return (
        <div key={pathItem.path}>
          <div className="flex items-center justify-between">
            <Link
              href={createUrl(pathItem.path, newParams)}
              onClick={() => setOpenSelect(false)}
              className={clsx(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                {
                  "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900":
                    isActive,
                  "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800":
                    !isActive,
                }
              )}
            >
              {pathItem.label}
            </Link>

            {hasSubcategories && (
              <button
                onClick={(e) => toggleCategory(pathItem.label || "", e)}
                className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <ChevronRight
                  className={clsx("h-4 w-4 transition-transform", {
                    "rotate-90": isExpanded,
                  })}
                />
              </button>
            )}
          </div>

          {hasSubcategories && isExpanded && (
            <div className="mt-1 ml-3 pl-3 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-1">
              {pathItem.subcategories!.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={createUrl(subItem.path, newParams)}
                  onClick={() => setOpenSelect(false)}
                  className={clsx(
                    "block rounded-md px-3 py-1.5 text-sm transition-colors",
                    {
                      "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium":
                        pathname === subItem.path,
                      "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200":
                        pathname !== subItem.path,
                    }
                  )}
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      const isActive = searchParams.get("sort") === item.slug;
      const q = searchParams.get("q");
      const href = createUrl(
        pathname,
        new URLSearchParams({
          ...(q && { q }),
          ...(item.slug && item.slug.length && { sort: item.slug }),
        })
      );

      return (
        <Link
          key={item.slug}
          href={href}
          onClick={() => setOpenSelect(false)}
          className={clsx(
            "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
            {
              "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900":
                isActive,
              "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800":
                !isActive,
            }
          )}
        >
          {item.title}
        </Link>
      );
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpenSelect(!openSelect)}
        className="flex w-full items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      >
        <span>{active}</span>
        <ChevronDown
          className={clsx("h-4 w-4 transition-transform text-neutral-500", {
            "rotate-180": openSelect,
          })}
        />
      </button>

      {openSelect && (
        <div className="absolute z-9999 mt-2 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden">
          <div className="max-h-96 overflow-y-auto p-2">
            <div className="space-y-1">
              {list.map((item: ListItem, i) => renderItem(item))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
