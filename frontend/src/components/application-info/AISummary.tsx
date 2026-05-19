import { Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AISummaryProps {
  aiExtracted: boolean;
  aiSummary: string;
}

export function AISummary({ aiExtracted, aiSummary }: AISummaryProps) {
  if (!aiExtracted) {
    return (
      <Card className="border-border bg-card gap-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="text-primary h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-border bg-secondary/50 flex items-start gap-3 rounded-lg border p-4">
            <AlertCircle className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-muted-foreground text-sm">
              No AI data available for this application. AI insights will appear here once the job
              posting is analyzed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card gap-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="text-primary h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-muted-foreground text-xs uppercase tracking-wider">Summary</h3>
            <p className="text-foreground/90 text-sm leading-relaxed">{aiSummary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
