"use client";

import { Search, X, Loader2 } from "lucide-react";
import Form from "next/form";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition, useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(searchParams?.get("q") || "");

  useEffect(() => {
    setValue(searchParams?.get("q") || "");
  }, [searchParams]);

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
    startTransition(() => {
      router.push("/search");
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!value.trim()) {
      e.preventDefault();
    }
  };

  return (
    <Form
      action="/search"
      className="relative w-full max-w-[550px] lg:w-80 xl:w-full"
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          ref={inputRef}
          key={searchParams?.get("q")}
          type="text"
          name="q"
          placeholder="Search for products..."
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-10 w-full rounded-lg border border-neutral-800 bg-transparent pl-9 pr-20 text-sm text-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-700"
        />

        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="submit"
            size="icon"
            className="h-7 w-7"
            disabled={isPending || !value.trim()}
            aria-label="Search"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <div className="relative w-full max-w-[550px] lg:w-80 xl:w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search for products..."
        disabled
        className="h-10 w-full rounded-lg border border-neutral-800 bg-transparent pl-9 pr-12 text-sm text-white placeholder:text-neutral-400"
      />
    </div>
  );
}

export function AdvancedSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(searchParams?.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        if (value) {
          handleClear();
        } else {
          inputRef.current?.blur();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value]);

  useEffect(() => {
    setValue(searchParams?.get("q") || "");
  }, [searchParams]);

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
    startTransition(() => {
      router.push("/search");
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!value.trim()) {
      e.preventDefault();
    }
  };

  return (
    <Form
      action="/search"
      className="relative w-full max-w-[550px] lg:w-80 xl:w-full"
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          ref={inputRef}
          type="text"
          name="q"
          placeholder="Search for products..."
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="h-10 w-full rounded-lg border border-neutral-800 bg-transparent pl-9 pr-32 text-sm text-white placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-700"
        />

        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {!isFocused && !value && (
            <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="submit"
            size="icon"
            className="h-7 w-7"
            disabled={isPending || !value.trim()}
            aria-label="Search"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
