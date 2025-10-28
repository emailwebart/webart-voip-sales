'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface DashboardHeaderProps {
  from?: string;
  to?: string;
}

export function DashboardHeader({ from, to }: DashboardHeaderProps) {

  const handleExport = (format: 'CSV' | 'PDF') => {
    console.log(`Exporting data as ${format}...`);
    // In a real app, this would trigger a file download.
  };

  const getTitle = () => {
    if (from && to) {
      return `Dashboard for ${format(new Date(from), 'LLL dd, y')} - ${format(new Date(to), 'LLL dd, y')}`;
    }
    if (from) {
      return `Dashboard for ${format(new Date(from), 'LLL dd, y')}`;
    }
    return 'Dashboard for All Time';
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">{getTitle()}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button asChild size="sm">
            <Link href="/report">Go to Report Form</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
