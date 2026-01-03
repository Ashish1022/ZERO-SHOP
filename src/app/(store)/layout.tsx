import { Space_Grotesk } from "next/font/google";

import { Navbar } from "@/modules/store/ui/layout/navbar";
import { Footer } from "@/modules/store/ui/layout/footer";
import TargetCursor from "@/components/target-cursor";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${spaceGrotesk.className} min-h-screen`}>
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
