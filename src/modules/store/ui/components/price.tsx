import clsx from "clsx";
import { Badge } from "@/components/ui/badge";

interface PriceProps extends React.ComponentProps<"p"> {
  amount: string;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
  showCurrencyCode?: boolean;
  locale?: string;
  compareAtAmount?: string; 
  discount?: number; 
  size?: "sm" | "md" | "lg" | "xl";
}

export const Price = ({
  amount,
  className,
  currencyCode = "INR",
  currencyCodeClassName,
  showCurrencyCode = false,
  locale = "en-IN",
  compareAtAmount,
  discount,
  size = "md",
  ...props
}: PriceProps) => {
  const formatPrice = (value: string) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  };

  const isOnSale =
    compareAtAmount && parseFloat(compareAtAmount) > parseFloat(amount);

  return (
    <div className={clsx("flex items-center gap-2", className)} {...props}>
      <div className="flex items-baseline gap-2">
        <p
          suppressHydrationWarning={true}
          className={clsx("font-semibold", sizeClasses[size], {
            "text-destructive": isOnSale,
          })}
        >
          {formatPrice(amount)}
          {showCurrencyCode && (
            <span
              className={clsx(
                "ml-1 text-xs font-normal",
                currencyCodeClassName
              )}
            >
              {currencyCode}
            </span>
          )}
        </p>

        {isOnSale && (
          <p
            suppressHydrationWarning={true}
            className={clsx(
              "text-sm font-medium text-muted-foreground line-through",
              size === "sm" && "text-xs",
              size === "lg" && "text-base",
              size === "xl" && "text-lg"
            )}
          >
            {formatPrice(compareAtAmount)}
          </p>
        )}
      </div>

      {discount && discount > 0 && (
        <Badge variant="destructive" className="text-xs font-bold">
          -{discount}%
        </Badge>
      )}
    </div>
  );
};

export function CompactPrice({
  amount,
  currencyCode = "INR",
  compareAtAmount,
  className,
}: {
  amount: string;
  currencyCode?: string;
  compareAtAmount?: string;
  className?: string;
}) {
  const formatPrice = (value: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const isOnSale =
    compareAtAmount && parseFloat(compareAtAmount) > parseFloat(amount);
  const discount = isOnSale
    ? Math.round(
        ((parseFloat(compareAtAmount) - parseFloat(amount)) /
          parseFloat(compareAtAmount)) *
          100
      )
    : 0;

  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <span className={clsx("font-bold", isOnSale && "text-destructive")}>
        {formatPrice(amount)}
      </span>
      {isOnSale && (
        <>
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(compareAtAmount)}
          </span>
          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
            -{discount}%
          </Badge>
        </>
      )}
    </div>
  );
}

export function LargePrice({
  amount,
  currencyCode = "INR",
  compareAtAmount,
  className,
}: {
  amount: string;
  currencyCode?: string;
  compareAtAmount?: string;
  className?: string;
}) {
  const formatPrice = (value: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(value));
  };

  const isOnSale =
    compareAtAmount && parseFloat(compareAtAmount) > parseFloat(amount);
  const discount = isOnSale
    ? Math.round(
        ((parseFloat(compareAtAmount) - parseFloat(amount)) /
          parseFloat(compareAtAmount)) *
          100
      )
    : 0;

  const savings = isOnSale
    ? parseFloat(compareAtAmount) - parseFloat(amount)
    : 0;

  return (
    <div className={clsx("space-y-2", className)}>
      <div className="flex items-baseline gap-3">
        <span
          className={clsx("text-4xl font-bold", isOnSale && "text-destructive")}
        >
          {formatPrice(amount)}
        </span>
        {isOnSale && (
          <span className="text-xl text-muted-foreground line-through">
            {formatPrice(compareAtAmount)}
          </span>
        )}
      </div>

      {isOnSale && (
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-sm font-bold">
            Save {discount}%
          </Badge>
          <span className="text-sm text-muted-foreground">
            You save {formatPrice(savings.toString())}
          </span>
        </div>
      )}
    </div>
  );
}

export function PriceRange({
  minAmount,
  maxAmount,
  currencyCode = "INR",
  className,
}: {
  minAmount: string;
  maxAmount: string;
  currencyCode?: string;
  className?: string;
}) {
  const formatPrice = (value: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const isSamePrice = minAmount === maxAmount;

  if (isSamePrice) {
    return (
      <span className={clsx("font-semibold", className)}>
        {formatPrice(minAmount)}
      </span>
    );
  }

  return (
    <span className={clsx("font-semibold", className)}>
      {formatPrice(minAmount)} - {formatPrice(maxAmount)}
    </span>
  );
}
