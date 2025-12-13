"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  status: string;
  badge: string | null;
  viewCount: number;
  salesCount: number;
  rating: number;
  primaryImageUrl?: string | null;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const imageUrl = row.original.primaryImageUrl;
      return (
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.original.name}
              className="rounded-md object-cover"
              width={40}
              height={40}
            />
          ) : (
            <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center border">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
          <span className="font-medium">{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.price}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, "default" | "secondary" | "destructive"> =
        {
          active: "default",
          draft: "secondary",
          archived: "destructive",
        };
      return (
        <Badge variant={variants[status] || "secondary"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "badge",
    header: "Badge",
    cell: ({ row }) => {
      const badge = row.original.badge;
      return badge ? (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300"
        >
          {badge}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
  {
    accessorKey: "viewCount",
    header: "Views",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.viewCount.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "salesCount",
    header: "Sales",
    cell: ({ row }) => {
      return (
        <span className="font-medium text-green-600 dark:text-green-400">
          {row.original.salesCount.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating;
      return rating > 0 ? (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">No reviews</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
