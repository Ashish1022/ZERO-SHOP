import { Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductFilters } from "@/modules/products/hooks/use-product-filters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();
  const [searchInput, setSearchInput] = useState(filters.search);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const trpc = useTRPC();
  const { data, isLoading } = useSuspenseInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions(
      { limit: 50 },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    )
  );

  const categories = data.pages.flatMap((page) => page.data);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const handleCategoryToggle = (categorySlug: string, checked: boolean) => {
    setFilters((prev) => {
      const currentCategories = prev.category || [];
      const newCategories = checked
        ? [...currentCategories, categorySlug]
        : currentCategories.filter((slug) => slug !== categorySlug);

      return {
        ...prev,
        category: newCategories,
      };
    });
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      category: [],
      sort: filters.sort,
    });
  };

  const hasActiveFilters =
    filters.search || (filters.category && filters.category.length > 0);

  const selectedCount = filters.category?.length || 0;

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-semibold">
          Search Products
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Search by name, description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchInput && searchInput !== filters.search && (
          <p className="text-xs text-muted-foreground">Searching...</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold flex items-center gap-2">
            Categories
            {selectedCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedCount}
              </Badge>
            )}
          </Label>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, category: [] }))}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-1 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => {
              const isChecked =
                filters.category?.includes(category.slug) || false;
              const subcategoryCount = category.subcategories?.length || 0;
              const hasSelectedSubcategories = category.subcategories?.some(
                (sub) => filters.category?.includes(sub.slug)
              );
              const isExpanded = expandedCategories.has(category.id) || hasSelectedSubcategories;

              return (
                <div key={category.id} className="space-y-1">
                  <div className="flex items-center gap-1 group py-1 px-2 -mx-2 rounded-md hover:bg-accent/50 transition-colors">
                    {subcategoryCount > 0 && (
                      <button
                        onClick={() => toggleCategoryExpansion(category.id)}
                        className="p-0.5 hover:bg-accent rounded transition-colors"
                        aria-label={
                          isExpanded ? "Collapse category" : "Expand category"
                        }
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    )}
                    {subcategoryCount === 0 && <div className="w-5" />}
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCategoryToggle(category.slug, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="flex-1 text-sm font-medium leading-none cursor-pointer select-none"
                    >
                      {category.name}
                    </label>
                    {category.productCount > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {category.productCount}
                      </span>
                    )}
                  </div>

                  {subcategoryCount > 0 && isExpanded && (
                    <div className="ml-5 space-y-1 border-l-2 border-border pl-3 mt-1">
                      {category.subcategories.map((subcategory) => {
                        const isSubChecked =
                          filters.category?.includes(subcategory.slug) || false;

                        return (
                          <div
                            key={subcategory.id}
                            className="flex items-center gap-2 group py-1 px-2 -mx-2 rounded-md hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              id={`category-${subcategory.id}`}
                              checked={isSubChecked}
                              onCheckedChange={(checked) =>
                                handleCategoryToggle(
                                  subcategory.slug,
                                  checked as boolean
                                )
                              }
                            />
                            <label
                              htmlFor={`category-${subcategory.id}`}
                              className="flex-1 text-sm leading-none cursor-pointer select-none"
                            >
                              {subcategory.name}
                            </label>
                            {subcategory.productCount > 0 && (
                              <span className="text-xs text-muted-foreground tabular-nums">
                                {subcategory.productCount}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No categories available
              </p>
            </div>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
};