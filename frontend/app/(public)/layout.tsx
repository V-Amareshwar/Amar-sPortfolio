import LenisProvider from "../../components/motion/LenisProvider";
import Navbar from "../../components/sections/Navbar";
import Footer from "../../components/sections/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500/30">
        <Navbar />
        {children}
        <Footer />
      </div>
    </LenisProvider>
  );
}
