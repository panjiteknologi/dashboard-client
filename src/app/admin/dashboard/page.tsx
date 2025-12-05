import AdminLayout from "@/layout/admin-layout.tsx";

export default function AdminDashboardPage() {
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
