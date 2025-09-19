"use client";

import { useMemo, useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProductDialog } from "./edit";
import { DeleteProductDialog } from "./delete";
import { useGet } from "@/hooks/useGet";
import { ViewProductDialog } from "./view";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: { _id: string; name: string };
  images?: string[];
  slug: string;
  features?: string;
  color?: string;
};

export type productApiResponse = {
  data: Array<Product & { _id?: string }>;
  meta: { page: number; limit: number; total: number };
};

type ProductListProps = {
  searchTerm?: string;
  categoryFilter?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
};

export function ProductList({
  searchTerm = "",
  categoryFilter = "all",
  sortField = "name",
  sortOrder = "asc",
}: ProductListProps) {
  const [editProduct, setEditProduct] = useState<string | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (searchTerm.trim()) queryParams.append("searchTerm", searchTerm.trim());
  if (categoryFilter !== "all") queryParams.append("category", categoryFilter);
  queryParams.append("sortBy", sortField);
  queryParams.append("sortOrder", sortOrder);

  const { data, isLoading, refetch, error } = useGet<productApiResponse>(
    `/product?${queryParams.toString()}&page=${pageNumber}`,
    ["products", searchTerm, categoryFilter, sortField, sortOrder, `${pageNumber}`]
  );

  const products = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((product) => ({
      ...product,
      id: product._id || product.id,
    }));
  }, [data]);

  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 1;

  const editProductData = products.find((prod) => prod.id === editProduct);
  const viewProductData = products.find((p) => p.id === viewProduct);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 py-8">
        Error loading products: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>৳{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setViewProduct(product.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditProduct(product.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteProduct(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No products found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-3 justify-end items-center mt-4">
          <Button
            variant="outline"
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            disabled={pageNumber === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={pageNumber >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Dialogs */}
      {editProductData && (
        <EditProductDialog
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
          product={{
            id: editProductData.id,
            name: editProductData.name,
            price: editProductData.price,
            stock: editProductData.stock,
            description: editProductData.description,
            category: editProductData.category,
            images: editProductData.images,
          }}
          refetch={refetch}
        />
      )}

      {viewProductData && (
        <ViewProductDialog
          open={!!viewProduct}
          onOpenChange={(open) => !open && setViewProduct(null)}
          product={{
            id: viewProductData.id,
            name: viewProductData.name,
            price: viewProductData.price,
            stock: viewProductData.stock,
            description: viewProductData.description,
            category: viewProductData.category,
            images: viewProductData.images,
          }}
        />
      )}

      {deleteProduct && (
        <DeleteProductDialog
          productId={deleteProduct}
          open={!!deleteProduct}
          onOpenChange={(open) => !open && setDeleteProduct(null)}
        />
      )}
    </>
  );
}
