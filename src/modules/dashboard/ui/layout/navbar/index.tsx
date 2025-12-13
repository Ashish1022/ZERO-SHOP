"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  MenuIcon,
  ShoppingBag,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { NavbarSidebar } from "./sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  href: string;
  children: string;
}

const navbarItems: NavItem[] = [
  { href: "/", children: "Home" },
  { href: "/products", children: "Products" },
  { href: "/dashboard/notifications", children: "Notifications" },
  { href: "#testimonials", children: "Testimonials" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-primary to-primary/60 blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
        <ShoppingBag className="h-8 w-8 text-primary relative z-10 group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-xl font-bold bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent tracking-tight">
        ZERO<span className="font-extrabold">HUB</span>
      </span>
    </Link>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();

      if (pathname !== "/") {
        router.push("/" + href);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group relative px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary/5 rounded-lg"
    >
      <span
        className={
          active
            ? "text-primary font-semibold"
            : "text-foreground/80 group-hover:text-primary"
        }
      >
        {children}
      </span>
      {active && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-primary to-primary/50 rounded-full" />
      )}
    </Link>
  );
}

function UserMenu({ user }: { user: boolean }) {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-all"
        >
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationBell() {
  const [hasNotifications] = useState(true); 

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 hover:bg-primary/5 transition-all"
      asChild
    >
      <Link href="/dashboard/notifications">
        <Bell className="h-5 w-5" />
        {hasNotifications && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full ring-2 ring-background" />
        )}
      </Link>
    </Button>
  );
}

function AuthButtons({ user }: { user: boolean }) {
  return (
    <div className="hidden md:flex items-center gap-2">
      {user ? (
        <>
          <NotificationBell />
          <UserMenu user={user} />
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            className="text-foreground/80 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-200 font-medium"
            asChild
          >
            <Link href="/sign-in">Login</Link>
          </Button>

          <Button className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
            <Link href="/sign-up">Start Journey</Link>
          </Button>
        </>
      )}
    </div>
  );
}

function MobileMenuButton({
  isSidebarOpen,
  onToggle,
}: {
  isSidebarOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      className="size-10 border-transparent md:hidden hover:bg-primary/5 hover:text-primary transition-all duration-200"
      variant="ghost"
      onClick={onToggle}
      aria-label={
        isSidebarOpen ? "Close navigation menu" : "Open navigation menu"
      }
      aria-expanded={isSidebarOpen}
      aria-controls="mobile-navigation"
    >
      <MenuIcon
        className={`h-5 w-5 transition-all duration-200 ${
          isSidebarOpen ? "rotate-90 text-primary" : "text-foreground/80"
        }`}
      />
    </Button>
  );
}

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const user = true;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`h-16 w-full sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-md border-b"
          : "bg-background/95 backdrop-blur-lg shadow-sm border-b"
      }`}
    >
      <div className="container mx-auto flex justify-between font-medium items-center h-full px-4 lg:px-6">
        <NavbarSidebar
          items={navbarItems}
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          user={user}
        />

        <Logo />

        <nav className="md:flex items-center gap-1 hidden">
          {navbarItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={pathname === item.href}
            >
              {item.children}
            </NavLink>
          ))}
        </nav>

        <AuthButtons user={user} />

        <MobileMenuButton
          isSidebarOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
        />
      </div>
    </header>
  );
};
