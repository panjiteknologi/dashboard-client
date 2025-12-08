import AdminLayout from "@/layout/admin-layout.tsx";
import { LibraryVideoManagement } from "@/views/admin/library-video";

export default function LibraryVideoPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <LibraryVideoManagement />
      </div>
    </AdminLayout>
  );
}
