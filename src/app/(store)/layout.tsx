import { Footer } from "@/modules/store/ui/layout/footer";
import { Navbar } from "@/modules/store/ui/layout/navbar";
import { ThemeProvider } from "@/providers/theme-provider";
import { ScrollToTop } from "@/modules/store/ui/layout/scroll-to-top";
import { AnnouncementBar } from "@/components/announcement-bar";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      defaultTheme="dark"
      attribute="class"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className="relative flex min-h-screen flex-col">
        <AnnouncementBar />

        <Navbar />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            {children}
          </div>
        </main>

        <Footer />

        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}
