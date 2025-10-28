import { getLeads, getSalesExecutives } from '@/lib/actions';
import { CallReportForm } from '@/components/report/CallReportForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default async function ReportPage() {
  const { data: leads, error: leadsError } = await getLeads();
  const { data: salesExecutives, error: execError } = await getSalesExecutives();

  if (leadsError || execError) {
    return <div className="text-destructive text-center p-4">{leadsError || execError}</div>;
  }

  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">WebArt Voip Sales Call Report</CardTitle>
            <CardDescription className="text-lg">Log your daily sales activities here.</CardDescription>
          </CardHeader>
          <CardContent>
            <CallReportForm leads={leads || []} salesExecutives={salesExecutives || []} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
