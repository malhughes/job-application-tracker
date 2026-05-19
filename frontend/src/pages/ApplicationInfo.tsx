import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import { useAuthContext } from '@/hooks/useAuthContext';
import type { Application } from '@/components/data-table/columns';
import { apiFetch } from '@/lib/apiFetch';
import { BouncyText } from '@/components/motion/text-effects/BouncyText';
import { ApplicationHeader } from '@/components/application-info/ApplicationHeader';
import { ApplicationDetails } from '@/components/application-info/ApplicationDetails';
import { AISummary } from '@/components/application-info/AISummary';

const fadeUp = {
  hidden: { opacity: 0, y: -16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export function ApplicationInfo() {
  const { id } = useParams();
  const { user, dispatch } = useAuthContext();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    apiFetch(
      `/api/applications/${id}`,
      { headers: { Authorization: `Bearer ${user.token}` } },
      dispatch
    ).then(async (r) => {
      if (r.ok) setApplication(await r.json());
      setLoading(false);
    });
  }, [id, user, dispatch]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-2xl font-medium text-neutral-400">
        <BouncyText text="Fetching application info..." />
      </div>
    );
  if (!application) return <p>Application not found.</p>;

  return (
    <div className="px-20 py-8">
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
        <ApplicationHeader
          title={application.title}
          company={application.company}
          status={application.status}
          nextStep={application.nextStep}
          link={application.link}
        />
      </motion.div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
          <ApplicationDetails
            location={application.location ?? ''}
            skills={application.skills ?? []}
          />
        </motion.div>
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <AISummary
            aiSummary={application.aiSummary ?? ''}
            aiExtracted={application.aiExtracted ?? false}
          />
        </motion.div>
      </div>
    </div>
  );
}
