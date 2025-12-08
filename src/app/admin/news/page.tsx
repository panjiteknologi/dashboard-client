import AdminLayout from "@/layout/admin-layout.tsx";
import { NewsManagement } from "@/views/admin/news";

export default function NewsPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <NewsManagement />
      </div>
    </AdminLayout>
  );
}
