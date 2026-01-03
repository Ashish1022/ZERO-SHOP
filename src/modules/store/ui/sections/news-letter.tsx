"use client"

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(
        "Welcome to the club! You'll be the first to know about new drops."
      );
      setEmail("");
    }
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Stay Updated
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2 mb-4">
            Join the Sticker Club
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get exclusive access to new designs, special offers, and 10% off
            your first order.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              required
            />
            <Button type="submit" size="lg" className="group">
              Subscribe
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
};
