import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Home,
  Package,
  Bell,
  MessageSquare,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-5 w-5" />,
  Products: <Package className="h-5 w-5" />,
  Notifications: <Bell className="h-5 w-5" />,
  Testimonials: <MessageSquare className="h-5 w-5" />,
};

function SidebarNavLink({
  href,
  children,
  onNavigate,
  active,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
  active?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();

      onNavigate();

      if (pathname !== "/") {
        router.push("/" + href);
      } else {
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      onNavigate();
    }
  };

  const icon = typeof children === "string" ? iconMap[children] : null;

  return (
    <Link
      href={href}
      className={`group w-full text-left px-4 py-3.5 font-medium flex items-center justify-between text-base transition-all duration-200 rounded-xl ${
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={active ? "text-primary" : "text-foreground/60"}>
            {icon}
          </span>
        )}
        {children}
      </div>
      <ChevronRight
        className={`h-4 w-4 transition-transform ${
          active ? "text-primary" : "text-foreground/40"
        } group-hover:translate-x-1`}
      />
    </Link>
  );
}

function UserSection({
  user,
  onClose,
}: {
  user: boolean;
  onClose: () => void;
}) {
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="px-4 py-3 bg-primary/5 rounded-xl border-2 border-primary/10">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
          <User className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">John Doe</p>
          <p className="text-xs text-muted-foreground">john@example.com</p>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-primary/10 hover:text-primary"
          asChild
        >
          <Link href="/admin/dashboard" onClick={onClose}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            handleLogout();
            onClose();
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

function AuthSection({
  onClose,
  user,
}: {
  onClose: () => void;
  user: boolean;
}) {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="pt-4 mt-4 border-t space-y-3 px-4">
      {user ? (
        <Button
          variant="outline"
          className="w-full border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200 font-medium"
          onClick={() => {
            handleLogout();
            onClose();
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            className="w-full border-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-200 font-medium"
            asChild
          >
            <Link href="/sign-in" onClick={onClose}>
              <User className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>

          <Button
            className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            asChild
          >
            <Link href="/sign-up" onClick={onClose}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Start Journey
            </Link>
          </Button>
        </>
      )}

      {user && (
        <Button
          className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          asChild
        >
          <Link href="/admin/dashboard" onClick={onClose}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      )}
    </div>
  );
}

export const NavbarSidebar = ({
  items,
  onOpenChange,
  open,
  user = false,
}: Props) => {
  const handleClose = () => onOpenChange(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none w-[85vw] sm:w-[400px] bg-background"
        aria-label="Navigation menu"
      >
        <SheetHeader className="p-6 border-b bg-linear-to-br from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-primary to-primary/60 blur-lg opacity-30" />
              <ShoppingBag className="h-10 w-10 text-primary relative z-10" />
            </div>
            <div>
              <SheetTitle className="text-left font-bold text-xl bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                ZEROHUB
              </SheetTitle>
              <p className="text-xs text-muted-foreground">
                Your shopping companion
              </p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-auto h-[calc(100vh-120px)]">
          <div className="p-4 space-y-6">
            {user && <UserSection user={user} onClose={handleClose} />}

            <div className="space-y-1">
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Navigation
              </p>
              {items.map((item) => (
                <SidebarNavLink
                  key={item.href}
                  href={item.href}
                  onNavigate={handleClose}
                  active={pathname === item.href}
                >
                  {item.children}
                </SidebarNavLink>
              ))}
            </div>

            {user && (
              <div className="space-y-1">
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Quick Actions
                </p>
                <Link
                  href="/orders"
                  onClick={handleClose}
                  className="group w-full text-left px-4 py-3.5 font-medium flex items-center justify-between text-base text-foreground/80 hover:bg-primary/5 hover:text-primary transition-all duration-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-foreground/60" />
                    My Orders
                  </div>
                  <Badge variant="secondary">3</Badge>
                </Link>
              </div>
            )}
          </div>

          <AuthSection onClose={handleClose} user={user} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
