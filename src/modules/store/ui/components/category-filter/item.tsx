"use client";

import clsx from "clsx";
import { createUrl } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ListItem, PathFilterItem } from ".";
import { SortFilterItem } from "@/constants";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

function PathFilterItems({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;
  const [showSubcategories, setShowSubcategories] = useState(false);
  const hasSubcategories = item.subcategories && item.subcategories.length > 0;

  newParams.delete("q");

  return (
    <li className="group">
      <div className="flex items-center justify-between">
        <DynamicTag
          href={createUrl(item.path, newParams)}
          className={clsx(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            {
              "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900":
                active,
              "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800":
                !active,
            }
          )}
        >
          {item.label}
        </DynamicTag>

        {hasSubcategories && (
          <button
            onClick={() => setShowSubcategories(!showSubcategories)}
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronRight
              className={clsx("h-4 w-4 transition-transform", {
                "rotate-90": showSubcategories,
              })}
            />
          </button>
        )}
      </div>

      {hasSubcategories && showSubcategories && (
        <ul className="mt-1 ml-3 pl-3 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-1">
          {item.subcategories!.map((subItem, idx) => (
            <li key={idx}>
              <Link
                href={createUrl(subItem.path, newParams)}
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
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SortFilterItems({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    })
  );
  const DynamicTag = active ? "p" : Link;

  return (
    <li>
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={clsx(
          "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
          {
            "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900":
              active,
            "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800":
              !active,
          }
        )}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? (
    <PathFilterItems item={item} />
  ) : (
    <SortFilterItems item={item} />
  );
}
