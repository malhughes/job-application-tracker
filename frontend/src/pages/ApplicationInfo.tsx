import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useAuthContext } from '@/hooks/useAuthContext';
import type { Application } from '@/components/data-table/columns';

export function ApplicationInfo() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    fetch(`/api/applications/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setApplication(data);
        setLoading(false);
      });
  }, [id, user]);

  if (loading) return <p>Loading...</p>;
  if (!application) return <p>Application not found.</p>;

  return (
    <div>
      <Link to="/dashboard">Back to Dashboard</Link>

      <div>
        <h1>{application.title}</h1>
        <p>{application.company}</p>
        <p>{application.status}</p>
        <p>{application.nextStep}</p>
        <a href={application.link} target="_blank" rel="noopener noreferrer">
          {application.link}
        </a>
      </div>

      <div>
        <h2>AI-Gathered Info</h2>
        {!application.aiExtracted ? (
          <p>No AI data available for this application.</p>
        ) : (
          <div>
            <p>{application.location}</p>
            <ul>
              {application.skills?.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <p>{application.aiSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
}