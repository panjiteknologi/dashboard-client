"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/layout/admin-layout.tsx";
import { ArrowLeftIcon } from "lucide-react";
import { SelectableCombobox } from "@/components/ui/selectable-combobox";

export default function CreateLibraryVideoPage() {
  const router = useRouter();
  const createMutation = useMutation(api.libraryVideos.create);
  const createCategoryMutation = useMutation(api.videoCategories.create);
  const createSubCategoryMutation = useMutation(api.videoSubCategories.create);

  const categories = useQuery(api.videoCategories.list);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    Id<"videoCategories"> | undefined
  >();
  const subCategories = useQuery(
    api.videoSubCategories.list,
    selectedCategoryId ? { categoryId: selectedCategoryId } : "skip"
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    subCategoryId: "" as Id<"videoSubCategories"> | "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId as Id<"videoCategories">);
    setFormData((prev) => ({ ...prev, subCategoryId: "" }));
  };

  const handleCreateCategory = async (name: string): Promise<string> => {
    try {
      const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      const categoryId = await createCategoryMutation({
        id,
        name,
      });
      toast.success("Category created successfully");
      return categoryId;
    } catch (error) {
      toast.error("Failed to create category");
      throw error;
    }
  };

  const handleCreateSubCategory = async (name: string): Promise<string> => {
    if (!selectedCategoryId) {
      toast.error("Please select a category first");
      throw new Error("No category selected");
    }
    try {
      const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      const subCategoryId = await createSubCategoryMutation({
        id,
        name,
        categoryId: selectedCategoryId,
      });
      toast.success("Sub category created successfully");
      return subCategoryId;
    } catch (error) {
      toast.error("Failed to create sub category");
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.subCategoryId) {
        toast.error("Please select a sub category");
        return;
      }

      const id = Date.now();
      await createMutation({
        id,
        title: formData.title,
        description: formData.description,
        url: formData.url,
        subCategoryId: formData.subCategoryId as Id<"videoSubCategories">,
      });
      toast.success("Video created successfully");
      router.push("/admin/library-video");
    } catch (error) {
      toast.error("Failed to create video");
      console.error(error);
    }
  };

  const categoryOptions =
    categories?.map((cat) => ({ id: cat._id, name: cat.name })) || [];
  const subCategoryOptions =
    subCategories?.map((sub) => ({ id: sub._id, name: sub.name })) || [];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/library-video")}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <h1 className="text-2xl font-bold">Create Library Video</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-8">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="url">Video URL *</Label>
                <Input
                  id="url"
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => handleChange("url", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-2">
                <SelectableCombobox
                  label="Category *"
                  options={categoryOptions}
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  onCreateNew={handleCreateCategory}
                  placeholder="Select or create category"
                  createText="Create category"
                />
              </div>

              <div className="grid gap-2">
                <SelectableCombobox
                  label="Sub Category *"
                  options={subCategoryOptions}
                  value={formData.subCategoryId}
                  onChange={(value) => handleChange("subCategoryId", value)}
                  onCreateNew={handleCreateSubCategory}
                  placeholder={
                    selectedCategoryId
                      ? "Select or create sub category"
                      : "Please select a category first"
                  }
                  createText="Create sub category"
                  emptyText={
                    selectedCategoryId
                      ? "No sub categories found"
                      : "Please select a category first"
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/library-video")}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
