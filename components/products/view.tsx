"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ViewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    category: {
      _id: string;
      name: string;
    };
    images?: string[];
  };
}

export function ViewProductDialog({
  open,
  onOpenChange,
  product,
}: ViewProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[50vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {product.name}
          </DialogTitle>
          <DialogDescription>Details of this product.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-primary">Category</p>
            <p>{product.category.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-primary">Price</p>
              <p>৳{product.price.toFixed(2)}</p>
            </div>

            <div>
              <p className="font-semibold text-primary">Stock</p>
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of Stock"}
              </Badge>
            </div>
          </div>

          <div>
            <p className="font-semibold text-primary">Description</p>
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {(product.images?.length ?? 0) > 0 && (
            <div>
              <p className="font-semibold text-primary mb-2">Images</p>
              <div className="flex gap-3 flex-wrap">
                {product.images?.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`Product ${i + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
