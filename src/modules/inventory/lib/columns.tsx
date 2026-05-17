"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, CheckCircle2, XCircle, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export type InventoryColumn = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  costPrice: number | null;
  quantity: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorders: boolean;
  salesCount: number;
  status: string;
  categoryName: string | null;
  imageUrl: string | null;
  stockValue: number;
};

const getStockStatus = (quantity: number, threshold: number) => {
  if (quantity === 0) {
    return {
      label: "Out of stock",
      variant: "destructive" as const,
      icon: XCircle,
    };
  }
  if (quantity <= threshold) {
    return {
      label: "Low stock",
      variant: "secondary" as const,
      icon: AlertTriangle,
    };
  }
  return {
    label: "In stock",
    variant: "default" as const,
    icon: CheckCircle2,
  };
};

export const columns: ColumnDef<InventoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.imageUrl ? (
          <Image
            src={row.original.imageUrl}
            alt={row.original.name}
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border border-border">
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.categoryName || "—"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.sku || "—"}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Stock",
    cell: ({ row }) => {
      const max = Math.max(row.original.lowStockThreshold * 3, 10);
      const value = Math.min((row.original.quantity / max) * 100, 100);
      return (
        <div className="w-32 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">{row.original.quantity}</span>
            <span className="text-muted-foreground">
              ≥{row.original.lowStockThreshold}
            </span>
          </div>
          <Progress value={value} className="h-1.5" />
        </div>
      );
    },
  },
  {
    id: "stockStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = getStockStatus(
        row.original.quantity,
        row.original.lowStockThreshold
      );
      const Icon = status.icon;
      return (
        <Badge variant={status.variant} className="gap-1">
          <Icon className="h-3 w-3" />
          {status.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "stockValue",
    header: "Stock Value",
    cell: ({ row }) => (
      <span className="font-semibold text-primary">
        ₹
        {row.original.stockValue.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    accessorKey: "salesCount",
    header: "Sold",
    cell: ({ row }) => (
      <span className="font-medium text-muted-foreground">
        {row.original.salesCount.toLocaleString()}
      </span>
    ),
  },
];
