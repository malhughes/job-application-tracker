import * as React from 'react';
import {
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerOverlay,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ApplicationForm } from '../ApplicationForm';
import { getColumns, type Application } from './columns';

interface DataTableProps {
  data: Application[];
  onSuccess: () => void;
}

export function DataTable({ data, onSuccess }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleEdit = (application: Application) => {
    setSelectedApp(application);
    setEditOpen(true);
  };

  const isOpen = addOpen || editOpen;

  const columns = getColumns({ onDelete: onSuccess, onEdit: handleEdit });

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-3/4' : 'w-full'}`}>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter companies..."
          value={(table.getColumn('company')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('company')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        {/* Add Drawer */}
        <Drawer direction="right" open={addOpen} onOpenChange={setAddOpen}>
          <DrawerTrigger asChild>
            <Button>
              <Plus />
              Add Application
            </Button>
          </DrawerTrigger>
          <DrawerOverlay className="fixed inset-0 bg-black/5" />
          <DrawerContent className="!max-w-1/4 bottom-2 right-2 top-2 rounded-l-xl">
            <div>
              <DrawerHeader>
                <DrawerTitle className="text-2xl">Add Application</DrawerTitle>
                <DrawerDescription>
                  Enter job details and AI will gather details from the provided URL to use when you
                  access the application later.
                </DrawerDescription>
              </DrawerHeader>
              <ApplicationForm
                onSuccess={() => {
                  onSuccess();
                  setAddOpen(false);
                }}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Edit Drawer */}
      <Drawer direction="right" open={editOpen} onOpenChange={setEditOpen}>
        <DrawerOverlay className="fixed inset-0 bg-black/5" />
        <DrawerContent className="!max-w-1/4 bottom-2 right-2 top-2 rounded-l-xl">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">Edit Application</DrawerTitle>
            <DrawerDescription>Update the details for this application.</DrawerDescription>
          </DrawerHeader>
          {selectedApp && (
            <ApplicationForm
              application={selectedApp}
              onSuccess={() => {
                onSuccess();
                setEditOpen(false);
              }}
            />
          )}
        </DrawerContent>
      </Drawer>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="p-3" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-base">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="p-3" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
