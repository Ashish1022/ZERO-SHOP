"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PaymentColumn = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";
  paymentMethod: "razorpay" | "cod" | "upi" | "card" | "wallet" | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: Date;
};

const getStatusVariant = (
  status: PaymentColumn["paymentStatus"]
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "failed":
    case "refunded":
      return "destructive";
    default:
      return "outline";
  }
};

const methodLabel: Record<string, string> = {
  razorpay: "Razorpay",
  cod: "COD",
  upi: "UPI",
  card: "Card",
  wallet: "Wallet",
};

export const columns: ColumnDef<PaymentColumn>[] = [
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
      <div className="font-semibold text-chart-2">
        ₹{row.original.total.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.original.paymentMethod
          ? methodLabel[row.original.paymentMethod]
          : "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "razorpayPaymentId",
    header: "Transaction ID",
    cell: ({ row }) => {
      const id = row.original.razorpayPaymentId;
      if (!id) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs truncate max-w-32">{id}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              navigator.clipboard.writeText(id);
              toast.success("Copied");
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.paymentStatus)} className="capitalize">
        {row.original.paymentStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
        <div className="text-xs text-muted-foreground">
          {format(new Date(row.original.createdAt), "hh:mm a")}
        </div>
      </div>
    ),
  },
];
