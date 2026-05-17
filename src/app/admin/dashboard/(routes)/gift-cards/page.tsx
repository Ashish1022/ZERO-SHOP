import { Gift, Sparkles, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GiftCardsPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Gift Cards
        </h2>
        <p className="text-sm text-muted-foreground">
          Issue and manage digital gift cards
        </p>
      </div>

      <Card className="shadow-md border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Coming Soon
            </Badge>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Gift Cards Module
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Create branded gift cards, set custom denominations, track balances,
            and let customers send prepaid value to friends and family.
          </p>
          <Button variant="elevated" disabled>
            <Clock className="h-4 w-4" />
            In Development
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="h-4 w-4 text-chart-1" />
              Custom Denominations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Offer fixed or customer-defined gift amounts up to your maximum.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-chart-2" />
              Branded Designs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Upload custom designs or pick from theme templates for occasions.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-chart-4" />
              Expiry Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Set validity windows or issue cards that never expire.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GiftCardsPage;
