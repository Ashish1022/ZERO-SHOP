import { Navbar } from "@/modules/store/ui/layout/navbar";
import { Footer } from "@/modules/store/ui/layout/footer";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`min-h-screen`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
