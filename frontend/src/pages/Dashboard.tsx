import { DataTable } from '@/components/data-table/DataTable';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useCallback, useEffect, useState } from 'react';
import type { Application } from '@/components/data-table/columns';

export function Dashboard() {
  const { user } = useAuthContext();
  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = useCallback(async () => {
    const response = await fetch('/api/applications/', {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    const json = await response.json();
    setApplications(json);
  }, [user]);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user, fetchApplications]);

  return (
    <div className="px-10 py-4">
      <span className="text-4xl font-semibold">Applications</span>
      <DataTable data={applications} onSuccess={fetchApplications} />
    </div>
  );
}
