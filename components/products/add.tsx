"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Input from "../shared/Input";
import { useToast } from "@/components/ui/use-toast";
import ImageInput from "../shared/MultipleImageInput";
import { usePostFormData } from "@/hooks/usePost";
import { Controller, useForm } from "react-hook-form";
import TextInput from "../shared/TextInput";
import { useGet } from "@/hooks/useGet";
import { Category, CategoryApiResponse } from "../categories/list";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorOptions = [
  'red', 'blue', 'green', 'yellow', 'black',
  'white', 'purple', 'orange', 'pink', 'gray'
] as const;

interface FormValues {
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  features?: string;
  color?: string;
  images: File[];
}
export function AddProductDialog({
  open,
  onOpenChange,
}: AddProductDialogProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const { data, isLoading, refetch, error } = useGet<CategoryApiResponse>(
    `/category`,
    ["categories"]
  );

  const categories = useMemo<Category[]>(() => {
    return (
      data?.data?.map((category) => ({
        ...category,
        id: category._id || category.id,
      })) || []
    );
  }, [data]);
  const {
    register,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();
  const { mutate: addCategory } = usePostFormData(
    "/product/create-product",
    (responseData) => {
      console.log("responseData", responseData);
      reset();
      onOpenChange(false);
    }
  );
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("category", data.category);
    formData.append("description", data.description);
    // Add new fields if they exist
    if (data.features) {
      formData.append("features", data.features);
    }
    if (data.color) {
      formData.append("color", data.color);
    }
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file: any) => {
        formData.append("images", file);
      });
    } else {
      console.error("No images provided!");
    }
    addCategory(formData);
  };
  useEffect(() => {
    setValue("images", images);
  }, [images, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[60vw] h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Input
              label="Product Name"
              name="name"
              type="text"
              placeholder="Enter Product name"
              register={register}
              error={errors.name}
              required
            />

            <Input
              label="Price"
              name="price"
              type="number"
              placeholder="Enter Price"
              register={register}
              error={errors.price}
              required
            />
            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              placeholder="Enter Stock Quantity"
              register={register}
              error={errors.stock}
              required
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div>
                  <div className=" w-full">
                    <p className="text-sm w-full font-normal pb-3 text-brandPrimary">
                      Category:<span className="text-red-500"> *</span>
                    </p>
                  </div>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-black text-white">
                      {categories.map((category: Category) => (
                        <SelectItem
                          key={category.id}
                          className="bg-black hover:bg-brandColor"
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="w-full">
                    <p className="text-sm w-full font-normal pb-3 text-brandPrimary">
                      Color
                    </p>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Color" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-black text-white">
                      {colorOptions.map((color) => (
                        <SelectItem
                          key={color}
                          className="bg-black hover:bg-brandColor"
                          value={color}
                        >
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <div className="col-span-1 lg:col-span-2 h-[250px] mb-3.5">
              <TextInput
                name="description"
                labelName="Description"
                control={control}
                errors={errors}
                setValue={setValue}

                required={true}
              />
            </div>
            <div className="col-span-1 lg:col-span-2 h-[250px] mb-3.5">
              <TextInput
                labelName="Features"
                name="features"
                control={control}
                errors={errors}
                setValue={setValue}
                required={false}
              />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <ImageInput
                label="Images"
                name="images"
                register={register}
                error={errors.images}
                setImages={setImages}
              // required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
