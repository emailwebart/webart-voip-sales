import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/lib/types';
import { Users, Phone, PhoneForwarded, PlusCircle, CheckCircle, IndianRupee, CalendarClock } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const cardIcons = {
  totalCalls: Phone,
  connectedCalls: PhoneForwarded,
  newLeads: PlusCircle,
  demosScheduled: CheckCircle,
  dealsClosed: CheckCircle,
  totalDealValue: IndianRupee,
  followUpsDue: CalendarClock,
};

type CardData = {
  title: string;
  value: string;
  icon: keyof typeof cardIcons;
};

export function SummaryCards({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return <p className="text-destructive">Could not load dashboard stats.</p>;

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

  const cards: CardData[] = [
    { title: 'Total Calls Today', value: stats.totalCalls.toString(), icon: 'totalCalls' },
    { title: 'Connected Calls', value: stats.connectedCalls.toString(), icon: 'connectedCalls' },
    { title: 'New Leads Added', value: stats.newLeads.toString(), icon: 'newLeads' },
    { title: 'Demos Scheduled', value: stats.demosScheduled.toString(), icon: 'demosScheduled' },
    { title: 'Deals Closed', value: stats.dealsClosed.toString(), icon: 'dealsClosed' },
    { title: 'Total Deal Value', value: formatCurrency(stats.totalDealValue), icon: 'totalDealValue' },
    { title: 'Follow-ups Due Tomorrow', value: stats.followUpsDue.toString(), icon: 'followUpsDue' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map(card => {
        const Icon = cardIcons[card.icon];
        return (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function SummaryCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
                 <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
