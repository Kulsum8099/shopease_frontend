"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteData } from "@/hooks/useDelete";
import { useGet } from "@/hooks/useGet";
import { useUpdate } from "@/hooks/useUpdate";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CategoryApiResponse } from "../categories/list";
import Input from "../shared/Input";
import ImageInput from "../shared/MultipleImageInput";
import TextInput from "../shared/TextInput";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    category: { _id: string; name: string };
    images?: string[];
  };
  refetch: () => void;
}

interface FormValues {
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  images: File[];
}

export function EditProductDialog({ open, onOpenChange, product, refetch }: EditProductDialogProps) {
  const { toast } = useToast();

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(product.images || []);

  const { data } = useGet<CategoryApiResponse>(`/category`, ["categories"]);
  const categories = useMemo(() => data?.data?.map((c) => ({ ...c, id: c._id || c.id })) || [], [data]);

  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category._id,
    },
  });

  const { mutate: updateProduct } = useUpdate(`/product/update-product/${product.id}`, () => {
    toast({ title: "Product updated successfully!" });
    onOpenChange(false);
    refetch();
    reset();
  });

 const deleteImageMutation = useDeleteData(
  `/product/delete-image/${product.id}`,
  () => {
    // toast.success("Image removed!");
  }
);

  const handleRemoveImage = (imgUrl: string) => {
    const imagePath = imgUrl.replace(/^https?:\/\/[^\/]+\/?/, "");
  deleteImageMutation.mutate(
      { imagePath },
      {
        onSuccess: () => {
          setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
          toast({ title: "Image deleted" });
        },
        onError: (err: any) => {
          toast({ title: err.message || "Delete failed", variant: "destructive" });
        },
      }
    );
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("category", data.category);
    formData.append("description", data.description);

    if (data.images?.length > 0) {
      data.images.forEach((file) => formData.append("images", file));
    }

    updateProduct(formData);
  };

  useEffect(() => {
    setValue("images", images);
  }, [images, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[60vw] h-[80vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update fields below to edit product details.</DialogDescription>
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
                  <p className="text-sm font-normal pb-3 text-brandPrimary">Category:<span className="text-red-500"> *</span></p>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white z-[9999]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="hover:bg-brandColor">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <div className="col-span-1 lg:col-span-2 h-[250px]">
              <TextInput name="description" labelName="Description" control={control} errors={errors} setValue={setValue} required />
            </div>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="col-span-1 lg:col-span-2 space-y-2">
                <p className="font-medium">Existing Images</p>
                <div className="flex gap-3 flex-wrap">
                  {existingImages.map((imgUrl) => (
                    <div key={imgUrl} className="relative">
                      <img src={imgUrl} alt="product" className="w-24 h-24 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imgUrl)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images */}
            <div className="col-span-1 lg:col-span-2">
              <ImageInput label="Upload New Images (optional)" name="images" register={register} error={errors.images} setImages={setImages} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
