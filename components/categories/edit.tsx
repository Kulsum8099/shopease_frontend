"use client";

import React, { useEffect } from "react";
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
import { useUpdate } from "@/hooks/useUpdate";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: {
      id:string;
    name: string;
    description?: string;
    logo: string;
  };
  refetch:()=>void
}

interface FormValues {
  name: string;
  description: string;
  logo: string;
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  defaultValues,
  refetch
}: EditCategoryDialogProps) {
  console.log(defaultValues)
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);


    const { mutate: updateCategory } = useUpdate(
    `/category/update-category/${defaultValues.id}`,
    () => {
      // toast.success("Tag updated successfully");
      refetch?.();
      onOpenChange(false);

    }
  );
  const onSubmit = async (data: FormValues) => {
        const formData = new FormData();
        if(data.name!==defaultValues.name){
          formData.append("name", data.name);
        }
        if(data.name!==defaultValues.description){
          formData.append("description", data.description);
        }
        if (data.logo && data.logo[0] && data.logo!==defaultValues.logo) {          
            formData.append("logo", data.logo[0]);  
        }
    updateCategory(formData)
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) reset(defaultValues);
        onOpenChange(open);
      }}
    >
      <DialogContent className="w-[70vw]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update the category details below.</DialogDescription>
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
              placeholder="Enter product description"
              register={register}
              error={errors.description}
            />

            <div className="col-span-1 lg:col-span-2">
              <ImageInput
                label="Category Image"
                name="logo"
                register={register}
                defaultImage={defaultValues.logo}
                error={errors.logo}
                // required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset(defaultValues);
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
