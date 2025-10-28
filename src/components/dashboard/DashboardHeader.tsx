'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';
import { DailyReportDialog } from './DailyReportDialog';

export function DashboardHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = (format: 'CSV' | 'PDF') => {
    console.log(`Exporting data as ${format}...`);
    // In a real app, this would trigger a file download.
  };

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Generate Daily Report
          </Button>
        </div>
      </div>
      <DailyReportDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
