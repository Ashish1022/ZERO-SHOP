"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { MoreHorizontal, Eye, Printer, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export type OrderColumn = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  total: string;
  totalNumeric: number;
  status: "pending" | "processing" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";
  paymentMethod: "razorpay" | "cod" | "upi" | "card" | "wallet" | null;
  createdAt: Date;
};

const getStatusBadgeVariant = (
  status: OrderColumn["status"]
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
    case "confirmed":
      return "secondary";
    case "cancelled":
    case "refunded":
      return "destructive";
    default:
      return "outline";
  }
};

const getPaymentStatusBadgeVariant = (
  status: OrderColumn["paymentStatus"]
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

const getPaymentMethodLabel = (method: OrderColumn["paymentMethod"]) => {
  if (!method) return "N/A";
  const labels: Record<string, string> = {
    razorpay: "Razorpay",
    cod: "COD",
    upi: "UPI",
    card: "Card",
    wallet: "Wallet",
  };
  return labels[method] || method;
};

const ActionCell = ({ order }: { order: OrderColumn }) => {
  const router = useRouter();

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
          onClick={() => router.push(`/admin/dashboard/orders/${order.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order.orderNumber)}
        >
          Copy Order Number
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order.email)}
        >
          Copy Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
    cell: ({ row }) => (
      <div className="font-medium text-primary">{row.original.orderNumber}</div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.customerName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <div className="font-semibold text-green-600 dark:text-green-400">
        {row.original.total}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {getPaymentMethodLabel(row.original.paymentMethod)}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => (
      <Badge variant={getPaymentStatusBadgeVariant(row.original.paymentStatus)}>
        {row.original.paymentStatus.charAt(0).toUpperCase() +
          row.original.paymentStatus.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => (
      <Badge variant={getStatusBadgeVariant(row.original.status)}>
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
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
  {
    id: "actions",
    cell: ({ row }) => <ActionCell order={row.original} />,
  },
];