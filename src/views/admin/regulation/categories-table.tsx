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
import { useState } from "react";
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
import { useMutation } from "convex/react";
import { toast } from "sonner";

type CategoryItem = {
  _id: Id<"regulationCategories">;
  name: string;
};

type CategoriesTableProps = {
  categories: CategoryItem[];
  isLoading: boolean;
  onDelete: (id: Id<"regulationCategories">) => void;
};

export function CategoriesTable({
  categories,
  isLoading,
  onDelete,
}: CategoriesTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryItem | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const createMutation = useMutation(api.regulationCategories.create);
  const updateMutation = useMutation(api.regulationCategories.update);

  const handleEdit = (category: CategoryItem) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setCategoryName("");
    setCreateDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const id = `${categoryName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}-${Date.now()}`;
      await createMutation({ id, name: categoryName.trim() });
      toast.success("Category created successfully");
      setCreateDialogOpen(false);
      setCategoryName("");
    } catch (error) {
      toast.error("Failed to create category");
      console.error(error);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedCategory || !categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await updateMutation({
        id: selectedCategory._id,
        name: categoryName.trim(),
      });
      toast.success("Category updated successfully");
      setEditDialogOpen(false);
      setSelectedCategory(null);
      setCategoryName("");
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
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

  if (categories.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        <p>No categories found.</p>
        <Button
          onClick={handleCreate}
          variant="outline"
          className="mt-4"
        >
          <PlusIcon className="size-4" />
          Create Category
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Categories</h3>
          <Button onClick={handleCreate} variant="outline" size="sm">
            <PlusIcon className="size-4" />
            Create Category
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(category._id)}
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
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new regulation category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
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
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
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

