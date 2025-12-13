"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

// This type is used to define the shape of our data.
export type CategoryColumn = {
  id: string;
  name: string;
  slug: string;
  status: string;
  featured: boolean;
  sortOrder: number;
  subcategoriesCount: number;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "active"
          ? "default"
          : status === "draft"
          ? "secondary"
          : "outline";

      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      return row.original.featured ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      );
    },
  },
  {
    accessorKey: "subcategoriesCount",
    header: "Subcategories",
    cell: ({ row }) => {
      return <span>{row.original.subcategoriesCount}</span>;
    },
  },
  {
    accessorKey: "sortOrder",
    header: "Sort Order",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
