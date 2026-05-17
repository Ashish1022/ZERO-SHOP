"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";

export type ReturnColumn = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: "cancelled" | "refunded";
  paymentStatus: string;
  paymentMethod: string | null;
  adminNotes: string | null;
  razorpayPaymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const ActionCell = ({ row }: { row: ReturnColumn }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const approve = useMutation(
    trpc.returns.approveRefund.mutationOptions({
      onSuccess: () => {
        toast.success("Refund processed");
        queryClient.invalidateQueries({
          queryKey: trpc.returns.getMany.infiniteQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.returns.getStats.queryKey(),
        });
      },
      onError: (err) => toast.error(err.message),
    })
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {row.status === "cancelled" && (
          <DropdownMenuItem onClick={() => approve.mutate({ orderId: row.id })}>
            <CheckCircle2 className="mr-2 h-4 w-4 text-chart-2" />
            Process Refund
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(row.orderNumber);
            toast.success("Order number copied");
          }}
        >
          Copy Order #
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ReturnColumn>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
    cell: ({ row }) => (
      <span className="font-medium text-primary">{row.original.orderNumber}</span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-sm">{row.original.customerName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.customerEmail}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold text-destructive">
        ₹{row.original.total.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "refunded" ? "destructive" : "secondary"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ordered",
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.original.updatedAt), "MMM dd, yyyy")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row.original} />,
  },
];
