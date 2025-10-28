'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { generateAndPreviewDailyReport } from '@/lib/actions';
import type { DailySummaryEmailContentOutput } from '@/ai/flows/daily-summary-email-content';

interface DailyReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DailyReportDialog({ open, onOpenChange }: DailyReportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<DailySummaryEmailContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const fetchReport = async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);
        const result = await generateAndPreviewDailyReport();
        if (result.data) {
          setReport(result.data);
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      };
      fetchReport();
    }
  }, [open]);

  const handleSendEmail = () => {
    console.log("Sending email...");
    // In a real app, this would trigger an API call to an email service.
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Daily Summary Report Preview</DialogTitle>
          <DialogDescription>
            This is a preview of the daily summary email that will be sent to admins at 7:00 PM IST.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating report with GenAI...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {report && (
            <div className="p-4 border rounded-lg bg-muted/50">
                <div className="mb-4">
                    <span className="font-semibold">Subject: </span>
                    <span>{report.subject}</span>
                </div>
                <div className="border rounded-md p-4 bg-background">
                    <div dangerouslySetInnerHTML={{ __html: report.htmlBody }} />
                </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} disabled={isLoading || !report}>
            <Send className="mr-2 h-4 w-4" />
            Send Test Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
