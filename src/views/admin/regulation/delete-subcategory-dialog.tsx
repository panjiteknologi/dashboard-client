"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteSubCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCategoryName: string;
  onConfirm: () => void;
};

export function DeleteSubCategoryDialog({
  open,
  onOpenChange,
  subCategoryName,
  onConfirm,
}: DeleteSubCategoryDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the subcategory &quot;{subCategoryName}&quot;. This action
            cannot be undone. If there are regulations linked to this
            subcategory, the deletion will fail.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

