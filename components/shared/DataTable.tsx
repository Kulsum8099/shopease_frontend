"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps<TData> = {
  data: any[];
  columns: ColumnDef<any>[];
  searchFieldName: keyof any;
  tableName: string;
  setAddModalOpen: Function;
};

export function DataTable<TData>({ data, columns, searchFieldName, tableName, setAddModalOpen }: DataTableProps<any>) {

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const fieldValue = item[searchFieldName];
      return (
        typeof fieldValue === "string" &&
        fieldValue.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [data, search, searchFieldName]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });



  return (
    <div className="w-full">
      <div className="grid grid-cols-3 ">
        <div className="col-span-1 flex justify-start items-center">
          <input
            type="text"
            placeholder={`Search by ${searchFieldName as string} `}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border focus:border-brandColor rounded focus:outline-none"
          />
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <p className="text-3xl font-semibold text-brandColor">{tableName}</p>
        </div>
        <div className="col-span-1 flex items-center justify-end gap-2">
          <button onClick={() => setAddModalOpen(true)} className="px-3 py-1 rounded bg-primary hover:bg-brandColor text-2xl text-white">
            +
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-backgroundColor">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border mt-4">
        <Table className="border-t-2 border-t-black">
          <TableHeader className="bg-black text-white rounded-t-md border-t border-t-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
