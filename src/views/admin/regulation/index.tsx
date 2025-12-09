"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegulationTable } from "./regulation-table";
import { DeleteRegulationDialog } from "./delete-regulation-dialog";
import { RegulationPreviewDialog } from "./regulation-preview-dialog";
import { CategoriesTable } from "./categories-table";
import { SubcategoriesTable } from "./subcategories-table";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { DeleteSubCategoryDialog } from "./delete-subcategory-dialog";

export function RegulationManagement() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRegulationId, setSelectedRegulationId] =
    useState<Id<"regulations"> | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewRegulationId, setPreviewRegulationId] =
    useState<Id<"regulations"> | null>(null);

  // Categories state
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<Id<"regulationCategories"> | null>(null);

  // Subcategories state
  const [deleteSubCategoryDialogOpen, setDeleteSubCategoryDialogOpen] =
    useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<Id<"regulationSubCategories"> | null>(null);

  const regulationsList = useQuery(api.regulations.list, { limit: 100 });
  const categoriesList = useQuery(api.regulationCategories.list, {});
  const subcategoriesList = useQuery(api.regulationSubCategories.list, {});

  const deleteMutation = useMutation(api.regulations.remove);
  const deleteCategoryMutation = useMutation(api.regulationCategories.remove);
  const deleteSubCategoryMutation = useMutation(
    api.regulationSubCategories.remove
  );

  // Regulations handlers
  const handleDelete = (id: Id<"regulations">) => {
    setSelectedRegulationId(id);
    setDeleteDialogOpen(true);
  };

  const handlePreview = (id: Id<"regulations">) => {
    setPreviewRegulationId(id);
    setPreviewDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRegulationId) return;
    try {
      await deleteMutation({ id: selectedRegulationId });
      toast.success("Regulation deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedRegulationId(null);
    } catch (error) {
      toast.error("Failed to delete regulation");
      console.error(error);
    }
  };

  // Categories handlers
  const handleDeleteCategory = (id: Id<"regulationCategories">) => {
    setSelectedCategoryId(id);
    setDeleteCategoryDialogOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!selectedCategoryId) return;
    try {
      await deleteCategoryMutation({ id: selectedCategoryId });
      toast.success("Category deleted successfully");
      setDeleteCategoryDialogOpen(false);
      setSelectedCategoryId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete category");
      console.error(error);
    }
  };

  // Subcategories handlers
  const handleDeleteSubCategory = (id: Id<"regulationSubCategories">) => {
    setSelectedSubCategoryId(id);
    setDeleteSubCategoryDialogOpen(true);
  };

  const handleConfirmDeleteSubCategory = async () => {
    if (!selectedSubCategoryId) return;
    try {
      await deleteSubCategoryMutation({ id: selectedSubCategoryId });
      toast.success("Sub category deleted successfully");
      setDeleteSubCategoryDialogOpen(false);
      setSelectedSubCategoryId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete sub category");
      console.error(error);
    }
  };

  const selectedRegulation = selectedRegulationId
    ? regulationsList?.find(
        (regulation) => regulation._id === selectedRegulationId
      )
    : null;

  const selectedCategory = selectedCategoryId
    ? categoriesList?.find((category) => category._id === selectedCategoryId)
    : null;

  const selectedSubCategory = selectedSubCategoryId
    ? subcategoriesList?.find(
        (subCategory) => subCategory._id === selectedSubCategoryId
      )
    : null;

  return (
    <div className="flex flex-col mx-auto max-w-7xl container gap-4 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Regulation Management</h1>
        <Button onClick={() => router.push("/admin/regulation/create")}>
          <PlusIcon className="size-4" />
          Create Regulation
        </Button>
      </div>

      <Tabs defaultValue="regulations" className="w-full">
        <TabsList>
          <TabsTrigger value="regulations">Regulations</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
        </TabsList>

        <TabsContent value="regulations" className="mt-4">
          <RegulationTable
            regulations={regulationsList ?? []}
            isLoading={regulationsList === undefined}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <CategoriesTable
            categories={categoriesList ?? []}
            isLoading={categoriesList === undefined}
            onDelete={handleDeleteCategory}
          />
        </TabsContent>

        <TabsContent value="subcategories" className="mt-4">
          <SubcategoriesTable
            subcategories={subcategoriesList ?? []}
            isLoading={subcategoriesList === undefined}
            onDelete={handleDeleteSubCategory}
          />
        </TabsContent>
      </Tabs>

      {selectedRegulation && (
        <DeleteRegulationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          regulationTitle={selectedRegulation.title}
          onConfirm={handleConfirmDelete}
        />
      )}

      {selectedCategory && (
        <DeleteCategoryDialog
          open={deleteCategoryDialogOpen}
          onOpenChange={setDeleteCategoryDialogOpen}
          categoryName={selectedCategory.name}
          onConfirm={handleConfirmDeleteCategory}
        />
      )}

      {selectedSubCategory && (
        <DeleteSubCategoryDialog
          open={deleteSubCategoryDialogOpen}
          onOpenChange={setDeleteSubCategoryDialogOpen}
          subCategoryName={selectedSubCategory.name}
          onConfirm={handleConfirmDeleteSubCategory}
        />
      )}

      <RegulationPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        regulationId={previewRegulationId}
      />
    </div>
  );
}
