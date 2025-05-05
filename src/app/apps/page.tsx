import { NavbarApps } from "@/components/navbar-apps";
import MainLayout from "@/layout/main-layout";
import AppsView from "@/views/apps";

export default function AppsPage() {
  return (
    <MainLayout>
      <NavbarApps />
      <AppsView />
    </MainLayout>
  );
}
