import { Suspense } from 'react';
import { getChartDataForDashboard, getStatsForDashboard, getCallLogs, getSalesExecutives } from '@/lib/actions';
import { SummaryCards, SummaryCardsSkeleton } from '@/components/dashboard/SummaryCards';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CallTrendChart, ChartSkeleton } from '@/components/dashboard/charts/CallTrendChart';
import { InterestLevelChart } from '@/components/dashboard/charts/InterestLevelChart';
import { LeadStageChart } from '@/components/dashboard/charts/LeadStageChart';
import { CallLogTable, TableSkeleton } from '@/components/dashboard/CallLogTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import type { SalesExecutive } from '@/lib/types';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: {
    from?: string;
    to?: string;
    sales_exec_id?: string;
  };
}) {
  const from = searchParams?.from;
  const to = searchParams?.to;
  const salesExecId = searchParams?.sales_exec_id;

  const { data: salesExecutives } = await getSalesExecutives();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader from={from} to={to} />
      <DashboardFilters salesExecutives={(salesExecutives as SalesExecutive[]) || []} />
      
      <Suspense fallback={<SummaryCardsSkeleton />}>
        <StatsLoader from={from} to={to} salesExecId={salesExecId} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Daily Call Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<ChartSkeleton />}>
              <ChartsLoader chart="trend" from={from} to={to} salesExecId={salesExecId} />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Interest Level Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <ChartsLoader chart="interest" from={from} to={to} salesExecId={salesExecId} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-1">
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Lead Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<ChartSkeleton />}>
                    <ChartsLoader chart="stage" from={from} to={to} salesExecId={salesExecId} />
                </Suspense>
            </CardContent>
         </Card>
       </div>

      <div>
        <Suspense fallback={<TableSkeleton />}>
            <CallLogsLoader from={from} to={to} salesExecId={salesExecId} />
        </Suspense>
      </div>
    </div>
  );
}

async function StatsLoader({ from, to, salesExecId }: { from?: string; to?: string; salesExecId?: string }) {
  const { data: stats, error } = await getStatsForDashboard({ from, to, sales_exec_id: salesExecId });
  if (error) return <p className="text-destructive p-4">{error}</p>
  return <SummaryCards stats={stats} />;
}

async function ChartsLoader({ chart, from, to, salesExecId }: { chart: 'trend' | 'interest' | 'stage', from?: string; to?: string; salesExecId?: string }) {
  const { data: chartData, error } = await getChartDataForDashboard({ from, to, sales_exec_id: salesExecId });
  if (error) return <p className="text-destructive p-4">{error}</p>
  if (chart === 'trend') return <CallTrendChart data={chartData?.dailyCallTrend} />;
  if (chart === 'interest') return <InterestLevelChart data={chartData?.interestLevelDistribution} />;
  if (chart === 'stage') return <LeadStageChart data={chartData?.leadStageDistribution} />;
  return null;
}

async function CallLogsLoader({ from, to, salesExecId }: { from?: string; to?: string; salesExecId?: string }) {
    const { data: logs, error } = await getCallLogs({ from, to, sales_exec_id: salesExecId });
    if (error) return <p className="text-destructive p-4">{error}</p>
    return <CallLogTable data={logs || []} />
}
