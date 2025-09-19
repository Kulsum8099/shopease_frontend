"use client";

import { useState, useMemo } from "react";
import { Edit, Trash2, Eye, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteCategoryDialog } from "./delete";
import { EditCategoryDialog } from "./edit";
import { useGet } from "@/hooks/useGet";

export type Category = {
  id: string;
  name: string;
  description: string;
  productsCount?: number;
  status?: string;
  logo: string;
};

export type CategoryApiResponse = {
  data: Array<Category & { _id?: string }>;
};

export function CategoryList() {
  const { data, isLoading, refetch, error } = useGet<CategoryApiResponse>(
    `/category`,
    ["categories"]
  );

  const categories = useMemo<Category[]>(() => {
    return data?.data?.map((category) => ({
      ...category,
      id: category._id || category.id,
    })) || [];
  }, [data]);

  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const editCategoryData = categories.find((cat) => cat.id === editCategoryId);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Grid className="h-4 w-4 text-muted-foreground" />
                  {category.name}
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-500 font-medium bg-rose-50 hover:text-white hover:bg-rose-500 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 rounded-md shadow-sm"
                      >
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* <DropdownMenuItem onClick={() => (window.location.href = `/admin/categories/${category.id}`)}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() => setEditCategoryId(category.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteCategoryId(category.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editCategoryId && editCategoryData && (
        <EditCategoryDialog
          open={!!editCategoryId}
          onOpenChange={(open) => !open && setEditCategoryId(null)}
          defaultValues={{
            id: editCategoryId,
            name: editCategoryData.name,
            description: editCategoryData.description,
            logo: editCategoryData.logo,
          }}
          refetch={refetch}
        />
      )}

      {deleteCategoryId && (
        <DeleteCategoryDialog
          categoryId={deleteCategoryId}
          open={!!deleteCategoryId}
          onOpenChange={(open) => !open && setDeleteCategoryId(null)}
        />
      )}
    </>
  );
}
