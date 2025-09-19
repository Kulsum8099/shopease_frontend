"use client";

import { useState } from "react";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryList } from "@/components/categories/list";
import { AddCategoryDialog } from "@/components/categories/add";

export default function AdminCategoriesPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* <div className="flex w-full max-w-sm items-center space-x-2">
        <Input placeholder="Search categories..." className="w-full" />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button variant="outline" size="sm" disabled>
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
        <Button variant="outline" size="sm" disabled>
          <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
        </Button>
      </div> */}

      <CategoryList />
      <div>
        <AddCategoryDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      </div>
    </div>
  );
}
