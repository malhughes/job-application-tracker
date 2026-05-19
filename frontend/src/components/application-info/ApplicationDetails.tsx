import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApplicationDetailsProps {
  location: string;
  skills: string[];
}

export function ApplicationDetails({ location, skills }: ApplicationDetailsProps) {
  return (
    <Card className="border-border bg-card gap-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-lg font-semibold">Job Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-xs uppercase tracking-wider">Location</h3>
          {location.length > 0 ? (
            <div className="text-foreground flex items-center gap-2">
              <MapPin className="text-primary h-4 w-4" />
              <span>{location}</span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Could not extract location.</p>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-muted-foreground text-xs uppercase tracking-wider">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">Could not extract required skills.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
