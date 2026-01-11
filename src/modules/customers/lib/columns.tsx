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
import { MoreHorizontal, Eye, Mail, Phone, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export type CustomerColumn = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "customer" | "employee" | "admin" | "super-admin";
  emailVerified: boolean;
  phoneVerified: boolean;
  orderCount: number;
  totalSpent: number;
  totalSpentFormatted: string;
  lastLoginAt: Date | null;
  createdAt: Date;
};

const getRoleBadgeVariant = (
  role: CustomerColumn["role"]
): "default" | "secondary" | "destructive" | "outline" => {
  switch (role) {
    case "super-admin":
      return "destructive";
    case "admin":
      return "default";
    case "employee":
      return "secondary";
    default:
      return "outline";
  }
};

const ActionCell = ({ customer }: { customer: CustomerColumn }) => {
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
          onClick={() =>
            router.push(`/admin/dashboard/customers/${customer.id}`)
          }
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/admin/dashboard/orders?customer=${customer.id}`)
          }
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          View Orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(customer.email)}
        >
          <Mail className="mr-2 h-4 w-4" />
          Copy Email
        </DropdownMenuItem>
        {customer.phone && (
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(customer.phone)}
          >
            <Phone className="mr-2 h-4 w-4" />
            Copy Phone
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
          <span>{row.original.email}</span>
          {row.original.emailVerified && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              ✓
            </Badge>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{row.original.phone || "—"}</span>
        {row.original.phone && row.original.phoneVerified && (
          <Badge variant="outline" className="text-[10px] px-1 py-0">
            ✓
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={getRoleBadgeVariant(row.original.role)}>
        {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: "orderCount",
    header: "Orders",
    cell: ({ row }) => (
      <div className="text-center">
        <div className="font-semibold text-blue-600 dark:text-blue-400">
          {row.original.orderCount}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => (
      <div className="font-semibold text-green-600 dark:text-green-400">
        {row.original.totalSpentFormatted}
      </div>
    ),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last Login",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.lastLoginAt ? (
          <>
            <div>
              {format(new Date(row.original.lastLoginAt), "MMM dd, yyyy")}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(row.original.lastLoginAt), "hh:mm a")}
            </div>
          </>
        ) : (
          <span className="text-muted-foreground">Never</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell customer={row.original} />,
  },
];
