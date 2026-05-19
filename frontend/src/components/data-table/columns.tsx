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
import { useState } from 'react';

export type Application = {
  _id: string;
  status: 'applied' | 'interviewing' | 'rejected';
  nextStep: string;
  jobDetails: {
    title: string;
    company: string;
    link: string;
    location?: string;
    compensation?: { label: string; range: string }[] | null;
    skills?: string[];
    aiSummary?: string;
    aiExtracted?: boolean;
  };
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteApplication = async (id: string) => {
    setDeleting(true);
    await fetch(`/api/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    setDeleting(false);
    setDialogOpen(false);
    onDelete();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p0 h-8 w-8">
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
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleting}
                onClick={(e) => {
                  e.preventDefault();
                  deleteApplication(application._id);
                }}
              >
                {deleting ? 'Deleting...' : 'Continue'}
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
      id: 'title',
      accessorFn: (row) => row.jobDetails.title,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Job Title" />,
    },
    {
      id: 'company',
      accessorFn: (row) => row.jobDetails.company,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue<string>('status');
        return status.charAt(0).toUpperCase() + status.slice(1);
      },
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
