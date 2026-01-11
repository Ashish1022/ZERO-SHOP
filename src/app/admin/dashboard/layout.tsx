import { redirect } from "next/navigation";

import { caller } from "@/trpc/server";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/modules/dashboard/ui/layout/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/dashboard/ui/sidebar/app-sidebar";
import { SitebarHeader } from "@/modules/dashboard/ui/sidebar/sidebar-header";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // const { isAuthenticated } = await caller.auth.session();
  // if (!isAuthenticated) redirect("/");
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SitebarHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 p-4">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
