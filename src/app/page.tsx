import HeroSection from "@/components/hero";
import { Navbar } from "@/components/navbar";
import MainLayout from "@/layout/main-layout";

export default function Home() {
  return (
    <MainLayout>
      <Navbar />
      <HeroSection />
    </MainLayout>
  );
}
