"use client";

import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
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
import { PencilIcon, TrashIcon, EyeIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Component to handle thumbnail with storage ID support
function ThumbnailCell({
  image,
  imageStorageId,
  title,
}: {
  image?: string;
  imageStorageId?: Id<"_storage">;
  title: string;
}) {
  const imageUrl = useQuery(
    api.regulations.getImageUrl,
    imageStorageId ? { storageId: imageStorageId } : "skip"
  );

  const displayImage = image || imageUrl;

  if (displayImage) {
    return (
      <img
        src={displayImage}
        alt={title}
        className="h-12 w-16 object-cover rounded"
      />
    );
  }

  return (
    <div className="h-12 w-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
      No Image
    </div>
  );
}

// Helper component to display subcategory name
function RegulationSubCategoryName({
  subCategoryId,
}: {
  subCategoryId?: Id<"regulationSubCategories">;
}) {
  const subCategory = useQuery(
    api.regulationSubCategories.get,
    subCategoryId ? { id: subCategoryId } : "skip"
  );
  if (!subCategoryId) {
    return <span className="text-muted-foreground">-</span>;
  }
  return <span>{subCategory?.name || "Loading..."}</span>;
}

// Helper component to display category name via subcategory
function RegulationCategoryName({
  subCategoryId,
}: {
  subCategoryId?: Id<"regulationSubCategories">;
}) {
  const subCategory = useQuery(
    api.regulationSubCategories.get,
    subCategoryId ? { id: subCategoryId } : "skip"
  );
  const category = useQuery(
    api.regulationCategories.get,
    subCategory?.categoryId ? { id: subCategory.categoryId } : "skip"
  );
  if (!subCategoryId) {
    return <span className="text-muted-foreground">-</span>;
  }
  return <span>{category?.name || "Loading..."}</span>;
}

type RegulationItem = {
  _id: Id<"regulations">;
  title: string;
  type: string;
  status: "Berlaku" | "Dicabut" | "Draft";
  publishedAt: string;
  image?: string;
  imageStorageId?: Id<"_storage">;
  subCategoryId?: Id<"regulationSubCategories">;
};

type RegulationTableProps = {
  regulations: RegulationItem[];
  isLoading: boolean;
  onDelete: (id: Id<"regulations">) => void;
  onPreview: (id: Id<"regulations">) => void;
};

export function RegulationTable({
  regulations,
  isLoading,
  onDelete,
  onPreview,
}: RegulationTableProps) {
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-12 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
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

  if (regulations.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No regulations found. Create your first regulation.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sub Category</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regulations.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <ThumbnailCell
                  image={item.image}
                  imageStorageId={item.imageStorageId}
                  title={item.title}
                />
              </TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    item.status === "Berlaku"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : item.status === "Dicabut"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  }`}
                >
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <RegulationCategoryName subCategoryId={item.subCategoryId} />
              </TableCell>
              <TableCell>
                <RegulationSubCategoryName subCategoryId={item.subCategoryId} />
              </TableCell>
              <TableCell>{item.publishedAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPreview(item._id)}
                    title="Preview"
                  >
                    <EyeIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/regulation/${item._id}`)}
                    title="Edit"
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item._id)}
                    title="Delete"
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
  );
}

