import { getLeads } from '@/lib/actions';
import { CallReportForm } from '@/components/report/CallReportForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default async function ReportPage() {
  const { data: leads, error } = await getLeads();

  if (error) {
    return <div className="text-destructive text-center p-4">{error}</div>;
  }

  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">VoIP Sales Call Report</CardTitle>
            <CardDescription className="text-lg">Log your daily sales activities here. <Link href="/admin" className="text-primary hover:underline">Go to Admin Dashboard</Link></CardDescription>
          </CardHeader>
          <CardContent>
            <CallReportForm leads={leads || []} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
