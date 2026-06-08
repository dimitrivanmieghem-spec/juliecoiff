import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import FloatingButtons from "@/components/FloatingButtons";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pb-14 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <FloatingButtons />
    </div>
  );
}
