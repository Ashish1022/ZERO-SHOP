"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
  Tag,
  Truck,
  Star,
  MessageSquare,
  Wallet,
  TrendingUp,
  FileText,
  UserCog,
  RotateCcw,
  Gift,
  LayoutDashboard,
} from "lucide-react";
import { SidebarMain } from "./sidebar-main";
import { SidebarAnalytics } from "./sidebar-analytics";
import { SidebarSecondary } from "./sidebar-secondary";

const mainItems = [
  {
    name: "Products",
    url: `/admin/dashboard/products`,
    icon: Package,
  },
  {
    name: "Categories",
    url: `/admin/dashboard/categories`,
    icon: FolderTree,
  },
  {
    name: "Orders",
    url: "/admin/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    url: "/admin/dashboard/customers",
    icon: Users,
  },
  {
    name: "Inventory",
    url: "/admin/dashboard/inventory",
    icon: Truck,
  },
];

const analyticsItems = [
  {
    name: "Analytics",
    url: "/admin/dashboard/analytics",
    icon: TrendingUp,
  },
  {
    name: "Payments",
    url: "/admin/dashboard/payments",
    icon: Wallet,
  },
];

const secondaryItems = [
  {
    name: "Coupons & Discounts",
    url: "/admin/dashboard/coupons",
    icon: Tag,
  },
  {
    name: "Gift Cards",
    url: "/admin/dashboard/gift-cards",
    icon: Gift,
  },
  {
    name: "Reviews",
    url: "/admin/dashboard/reviews",
    icon: Star,
  },
  {
    name: "Returns & Refunds",
    url: "/admin/dashboard/returns",
    icon: RotateCcw,
  },
  {
    name: "Settings",
    url: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="top-16 h-[calc(100vh-3rem)] scrollbar-hide" collapsible="icon">
      <SidebarContent>
        <SidebarMain items={mainItems} />
        <SidebarAnalytics items={analyticsItems} />
        <SidebarSecondary items={secondaryItems} />
      </SidebarContent>
    </Sidebar>
  );
}
