import AdminLayout from "@/layout/admin-layout.tsx";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>
    </AdminLayout>
  );
}
