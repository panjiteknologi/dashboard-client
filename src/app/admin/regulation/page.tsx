import AdminLayout from "@/layout/admin-layout.tsx";
import { RegulationManagement } from "@/views/admin/regulation";

export default function RegulationPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <RegulationManagement />
      </div>
    </AdminLayout>
  );
}
