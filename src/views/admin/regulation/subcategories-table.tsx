"use client";

import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "convex/react";
import { toast } from "sonner";

// Helper component to display category name
function CategoryName({ categoryId }: { categoryId: Id<"regulationCategories"> }) {
  const category = useQuery(api.regulationCategories.get, { id: categoryId });
  return <span>{category?.name || "Loading..."}</span>;
}

type SubCategoryItem = {
  _id: Id<"regulationSubCategories">;
  name: string;
  categoryId: Id<"regulationCategories">;
};

type SubcategoriesTableProps = {
  subcategories: SubCategoryItem[];
  isLoading: boolean;
  onDelete: (id: Id<"regulationSubCategories">) => void;
};

export function SubcategoriesTable({
  subcategories,
  isLoading,
  onDelete,
}: SubcategoriesTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategoryItem | null>(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    Id<"regulationCategories"> | undefined
  >();

  const categories = useQuery(api.regulationCategories.list);
  const createMutation = useMutation(api.regulationSubCategories.create);
  const updateMutation = useMutation(api.regulationSubCategories.update);

  useEffect(() => {
    if (selectedSubCategory) {
      setSelectedCategoryId(selectedSubCategory.categoryId);
    }
  }, [selectedSubCategory]);

  const handleEdit = (subCategory: SubCategoryItem) => {
    setSelectedSubCategory(subCategory);
    setSubCategoryName(subCategory.name);
    setSelectedCategoryId(subCategory.categoryId);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedSubCategory(null);
    setSubCategoryName("");
    setSelectedCategoryId(undefined);
    setCreateDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    if (!subCategoryName.trim()) {
      toast.error("Sub category name is required");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }
    try {
      const id = `${subCategoryName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;
      await createMutation({
        id,
        name: subCategoryName.trim(),
        categoryId: selectedCategoryId,
      });
      toast.success("Sub category created successfully");
      setCreateDialogOpen(false);
      setSubCategoryName("");
      setSelectedCategoryId(undefined);
    } catch (error) {
      toast.error("Failed to create sub category");
      console.error(error);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedSubCategory || !subCategoryName.trim()) {
      toast.error("Sub category name is required");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }
    try {
      await updateMutation({
        id: selectedSubCategory._id,
        name: subCategoryName.trim(),
        categoryId: selectedCategoryId,
      });
      toast.success("Sub category updated successfully");
      setEditDialogOpen(false);
      setSelectedSubCategory(null);
      setSubCategoryName("");
      setSelectedCategoryId(undefined);
    } catch (error) {
      toast.error("Failed to update sub category");
      console.error(error);
    }
  };

  const categoryOptions =
    categories?.map((cat) => ({ id: cat._id, name: cat.name })) || [];

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-16 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        <p>No subcategories found.</p>
        <Button onClick={handleCreate} variant="outline" className="mt-4">
          <PlusIcon className="size-4" />
          Create Sub Category
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Subcategories</h3>
          <Button onClick={handleCreate} variant="outline" size="sm">
            <PlusIcon className="size-4" />
            Create Sub Category
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.map((subCategory) => (
              <TableRow key={subCategory._id}>
                <TableCell className="font-medium">{subCategory.name}</TableCell>
                <TableCell>
                  <CategoryName categoryId={subCategory.categoryId} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(subCategory)}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(subCategory._id)}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Sub Category</DialogTitle>
            <DialogDescription>
              Add a new regulation subcategory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={(value) =>
                  setSelectedCategoryId(value as Id<"regulationCategories">)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="Enter sub category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sub Category</DialogTitle>
            <DialogDescription>
              Update the subcategory information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={(value) =>
                  setSelectedCategoryId(value as Id<"regulationCategories">)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="Enter sub category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

