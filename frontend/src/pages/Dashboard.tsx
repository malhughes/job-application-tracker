import { DataTable } from '@/components/data-table/DataTable';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useCallback, useEffect, useState } from 'react';
import type { Application } from '@/components/data-table/columns';
import { BouncyText } from '@/components/motion/text-effects/BouncyText';
import { motion } from 'motion/react';
import { apiFetch } from '@/lib/apiFetch';

export function Dashboard() {
  const { user, dispatch } = useAuthContext();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const response = await apiFetch(
      '/api/applications/',
      { headers: { Authorization: `Bearer ${user?.token}` } },
      dispatch,
    );
    if (response.ok) {
      const json = await response.json();
      setApplications(json);
    }
    setLoading(false);
  }, [user, dispatch]);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user, fetchApplications]);

  return (
    <>
      {loading ? (
        <>
          <div className="flex h-screen items-center justify-center text-2xl font-medium text-neutral-400">
            <BouncyText text="Fetching your applications..." />
          </div>
        </>
      ) : (
        <motion.div
          className="px-10 py-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="text-4xl font-semibold">Applications</span>
          <DataTable data={applications} onSuccess={fetchApplications} />
        </motion.div>
      )}
    </>
  );
}
