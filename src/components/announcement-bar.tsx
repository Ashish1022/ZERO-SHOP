"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const announcements = [
  {
    id: 1,
    text: (
      <>
        <span className="font-semibold">Free shipping</span> on orders over ₹200
      </>
    ),
  },
  {
    id: 2,
    text: (
      <>
        <span className="font-semibold">New arrivals</span> just dropped
      </>
    ),
  },
  {
    id: 3,
    text: (
      <>
        <span className="font-semibold">Limited offer</span> - Get 20% off your
        first order
      </>
    ),
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + announcements.length) % announcements.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div
      className="relative border-b bg-primary text-primary-foreground border-neutral-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-6 w-6 shrink-0 text-primary-foreground hover:bg-primary-foreground/10 sm:flex"
            onClick={handlePrevious}
            aria-label="Previous announcement"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden text-center text-sm">
            <div
              key={currentAnnouncement.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <span className="inline-flex items-center gap-2">
                {currentAnnouncement.text}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-6 w-6 text-primary-foreground hover:bg-primary-foreground/10 sm:flex"
              onClick={handleNext}
              aria-label="Next announcement"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="hidden items-center gap-1 px-2 sm:flex">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-4 bg-primary-foreground"
                      : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
                  }`}
                  aria-label={`Go to announcement ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
