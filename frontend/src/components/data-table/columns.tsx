import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';

type Application = {
  id: string;
  title: string;
  company: string;
  status: 'applied' | 'interviewing' | 'rejected';
  next: 'follow up' | '1st round' | '2nd round' | 'none';
};

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Job Title" />,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  },
  {
    accessorKey: 'next',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Next Step" />,
  },
];
