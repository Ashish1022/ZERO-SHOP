"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2, Copy, Power } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CouponColumn = {
  id: string;
  code: string;
  description: string | null;
  type: "percentage" | "fixed";
  value: number;
  minPurchaseAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  status: "active" | "inactive" | "expired";
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
};

const getStatusVariant = (
  status: CouponColumn["status"],
  validUntil: Date
): "default" | "secondary" | "destructive" | "outline" => {
  if (new Date(validUntil) < new Date()) return "destructive";
  switch (status) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    case "expired":
      return "destructive";
    default:
      return "outline";
  }
};

const ActionCell = ({
  coupon,
  onEdit,
}: {
  coupon: CouponColumn;
  onEdit: (coupon: CouponColumn) => void;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteCoupon = useMutation(
    trpc.coupons.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Coupon deleted");
        queryClient.invalidateQueries({ queryKey: trpc.coupons.getMany.infiniteQueryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.coupons.getStats.queryKey() });
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const toggleStatus = useMutation(
    trpc.coupons.toggleStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Status updated");
        queryClient.invalidateQueries({ queryKey: trpc.coupons.getMany.infiniteQueryKey() });
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
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(coupon.code);
            toast.success("Code copied");
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Code
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(coupon)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            toggleStatus.mutate({
              id: coupon.id,
              status: coupon.status === "active" ? "inactive" : "active",
            })
          }
        >
          <Power className="mr-2 h-4 w-4" />
          {coupon.status === "active" ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => deleteCoupon.mutate({ id: coupon.id })}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = (
  onEdit: (coupon: CouponColumn) => void
): ColumnDef<CouponColumn>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono font-bold tracking-wider">
        {row.original.code}
      </Badge>
    ),
  },
  {
    accessorKey: "type",
    header: "Discount",
    cell: ({ row }) => (
      <div className="font-semibold text-primary">
        {row.original.type === "percentage"
          ? `${row.original.value}%`
          : `₹${row.original.value.toFixed(2)}`}
      </div>
    ),
  },
  {
    accessorKey: "minPurchaseAmount",
    header: "Min. Purchase",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.minPurchaseAmount
          ? `₹${row.original.minPurchaseAmount.toFixed(2)}`
          : "—"}
      </span>
    ),
  },
  {
    accessorKey: "usageCount",
    header: "Usage",
    cell: ({ row }) => {
      const used = row.original.usageCount;
      const limit = row.original.usageLimit;
      const percentage = limit ? (used / limit) * 100 : 0;
      return (
        <div className="w-28 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium">{used}</span>
            <span className="text-muted-foreground">
              {limit ? `/ ${limit}` : "∞"}
            </span>
          </div>
          {limit && <Progress value={percentage} className="h-1.5" />}
        </div>
      );
    },
  },
  {
    accessorKey: "validUntil",
    header: "Expires",
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{format(new Date(row.original.validUntil), "MMM dd, yyyy")}</div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(row.original.validUntil), "hh:mm a")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={getStatusVariant(row.original.status, row.original.validUntil)}
        className="capitalize"
      >
        {new Date(row.original.validUntil) < new Date()
          ? "Expired"
          : row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell coupon={row.original} onEdit={onEdit} />,
  },
];
