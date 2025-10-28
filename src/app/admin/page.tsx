import { Suspense } from 'react';
import { getChartDataForDashboard, getStatsForDashboard, getCallLogs } from '@/lib/actions';
import { SummaryCards, SummaryCardsSkeleton } from '@/components/dashboard/SummaryCards';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CallTrendChart, ChartSkeleton } from '@/components/dashboard/charts/CallTrendChart';
import { InterestLevelChart } from '@/components/dashboard/charts/InterestLevelChart';
import { LeadStageChart } from '@/components/dashboard/charts/LeadStageChart';
import { CallLogTable, TableSkeleton } from '@/components/dashboard/CallLogTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader />
      
      <Suspense fallback={<SummaryCardsSkeleton />}>
        <StatsLoader />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Daily Call Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<ChartSkeleton />}>
              <ChartsLoader chart="trend" />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Interest Level Breakdown (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <ChartsLoader chart="interest" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-1">
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Lead Stage Distribution (Today)</CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<ChartSkeleton />}>
                    <ChartsLoader chart="stage" />
                </Suspense>
            </CardContent>
         </Card>
       </div>

      <div>
        <Suspense fallback={<TableSkeleton />}>
            <CallLogsLoader />
        </Suspense>
      </div>
    </div>
  );
}

async function StatsLoader() {
  const { data: stats, error } = await getStatsForDashboard();
  if (error) return <p className="text-destructive p-4">{error}</p>
  return <SummaryCards stats={stats} />;
}

async function ChartsLoader({ chart }: { chart: 'trend' | 'interest' | 'stage' }) {
  const { data: chartData, error } = await getChartDataForDashboard();
  if (error) return <p className="text-destructive p-4">{error}</p>
  if (chart === 'trend') return <CallTrendChart data={chartData?.dailyCallTrend} />;
  if (chart === 'interest') return <InterestLevelChart data={chartData?.interestLevelDistribution} />;
  if (chart === 'stage') return <LeadStageChart data={chartData?.leadStageDistribution} />;
  return null;
}

async function CallLogsLoader() {
    const { data: logs, error } = await getCallLogs();
    if (error) return <p className="text-destructive p-4">{error}</p>
    return <CallLogTable data={logs || []} />
}
