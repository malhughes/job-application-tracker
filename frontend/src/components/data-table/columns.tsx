import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router';

export type Application = {
  _id: string;
  title: string;
  company: string;
  link: string;
  status: 'applied' | 'interviewing' | 'rejected';
  nextStep: string;
  location?: string;
  skills?: string[];
  aiSummary?: string;
  aiExtracted?: boolean;
};

function ActionsCell({
  application,
  onDelete,
  onEdit,
}: {
  application: Application;
  onDelete: () => void;
  onEdit: (application: Application) => void;
}) {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const deleteApplication = async (id: string) => {
    await fetch(`/api/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    onDelete();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onEdit(application);
          }}
        >
          Edit Application
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Delete Application
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your application.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteApplication(application._id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate(`/application/${application._id}`)}>
          View Application Info
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getColumns({
  onDelete,
  onEdit,
}: {
  onDelete: () => void;
  onEdit: (application: Application) => void;
}): ColumnDef<Application>[] {
  return [
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
      accessorKey: 'nextStep',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Next Step" />,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionsCell application={row.original} onDelete={onDelete} onEdit={onEdit} />
      ),
    },
  ];
}
