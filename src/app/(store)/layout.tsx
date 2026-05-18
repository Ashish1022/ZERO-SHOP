import { Navbar } from "@/modules/store/ui/layout/navbar";
import { Footer } from "@/modules/store/ui/layout/footer";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
