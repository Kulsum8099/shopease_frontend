"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/components/ui/use-toast";
import Input from "../shared/Input";
import ImageInput from "../shared/ImageInput";
import { usePostFormData } from "@/hooks/usePost";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormValues {
  name: string;
  description: string;
  logo: string;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
}: AddCategoryDialogProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();
  const { mutate: addCategory } = usePostFormData(
    "/category/create-category",
    (responseData) => {
      console.log("responseData", responseData);
      reset();
      onOpenChange(false);
    }
  );
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        if (data.logo && data.logo[0]) {          
            formData.append("logo", data.logo[0]);  
        }
    addCategory(formData)
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) reset();
        onOpenChange(open);
      }}
    >
      <DialogContent className="w-[50vw]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Input
              label="Category Name"
              name="name"
              type="text"
              placeholder="Enter Category name"
              register={register}
              error={errors.name}
              required
            />

            <Input
              label="Description"
              name="description"
              type="text"
              placeholder="Enter Category description"
              register={register}
              error={errors.description}
            />

            <div className="col-span-1 lg:col-span-2">
              <ImageInput
                label="Category Image"
                name="logo"
                register={register}
                error={errors.logo}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
