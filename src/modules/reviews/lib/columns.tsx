"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ReviewColumn = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  name: string;
  email: string | null;
  rating: number;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
};

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < Math.round(rating)
            ? "fill-chart-4 text-chart-4"
            : "text-muted-foreground/40"
        }`}
      />
    ))}
    <span className="ml-1 text-xs font-medium">{rating.toFixed(1)}</span>
  </div>
);

const ActionCell = ({ review }: { review: ReviewColumn }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateStatus = useMutation(
    trpc.reviews.updateStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Review status updated");
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.getAll.infiniteQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.getAdminStats.queryKey(),
        });
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const deleteReview = useMutation(
    trpc.reviews.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Review removed");
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.getAll.infiniteQueryKey(),
        });
      },
      onError: (err) => toast.error(err.message),
    })
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/store/products/${review.productSlug}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            View Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {review.status !== "approved" && (
          <DropdownMenuItem
            onClick={() => updateStatus.mutate({ id: review.id, status: "approved" })}
          >
            <CheckCircle2 className="mr-2 h-4 w-4 text-chart-2" />
            Approve
          </DropdownMenuItem>
        )}
        {review.status !== "rejected" && (
          <DropdownMenuItem
            onClick={() => updateStatus.mutate({ id: review.id, status: "rejected" })}
          >
            <XCircle className="mr-2 h-4 w-4 text-destructive" />
            Reject
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => deleteReview.mutate({ reviewId: review.id })}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getStatusVariant = (
  status: ReviewColumn["status"]
): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

export const columns: ColumnDef<ReviewColumn>[] = [
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <div className="font-medium truncate">{row.original.productName}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {row.original.isVerifiedPurchase && (
            <Badge variant="outline" className="gap-1 text-[10px] px-1 py-0">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Author",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-sm">{row.original.name}</div>
        {row.original.email && (
          <div className="text-xs text-muted-foreground">{row.original.email}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <RatingStars rating={row.original.rating} />,
  },
  {
    accessorKey: "title",
    header: "Review",
    cell: ({ row }) => (
      <div className="max-w-md">
        <div className="font-medium text-sm">{row.original.title}</div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell review={row.original} />,
  },
];
