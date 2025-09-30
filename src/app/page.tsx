import HeroSection from "@/components/hero";
import { Navbar } from "@/components/navbar";
import WhatsappButton from "@/components/ui/whatsapp-button";
import MainLayout from "@/layout/main-layout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <MainLayout>
      <Navbar />
      <HeroSection />
      <WhatsappButton />
    </MainLayout>
  );
}
