import { Link } from 'react-router';
import { ArrowLeft, ExternalLink, Clock, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ApplicationHeaderProps {
  title: string;
  company: string;
  status: string;
  nextStep: string;
  link: string;
}

export function ApplicationHeader({
  title,
  company,
  status,
  nextStep,
  link,
}: ApplicationHeaderProps) {
  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    switch (lower) {
      case 'applied':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'interviewing':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-secondary text-secondary-foreground border-border';
    }
  };
  return (
    <header>
      <Link
        to="/dashboard"
        className="text-muted-foreground hover:text-foreground group mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to applications
      </Link>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-foreground text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <div className="text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="text-lg">{company}</span>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`h-fit shrink-0 px-3 py-1.5 text-lg font-medium ${getStatusColor(status)}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex items-center gap-3">
            <Clock className="text-primary h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Next Step</p>
              <p className="text-foreground font-medium">{nextStep}</p>
            </div>
          </div>

          <Button variant="outline" className="shrink-0" asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              View Job Posting
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
