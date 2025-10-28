'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SalesExecutive } from '@/lib/types';

export function DashboardFilters({ salesExecutives }: { salesExecutives: SalesExecutive[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const salesExecId = searchParams.get('sales_exec_id');

  const dateRange: DateRange | undefined = from && to ? { from: new Date(from), to: new Date(to) } : undefined;

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleDateChange = (range: DateRange | undefined) => {
    router.push(
      pathname +
        '?' +
        createQueryString({
          from: range?.from ? format(range.from, 'yyyy-MM-dd') : null,
          to: range?.to ? format(range.to, 'yyyy-MM-dd') : null,
        })
    );
  };

  const handleExecChange = (execId: string) => {
    router.push(pathname + '?' + createQueryString({ sales_exec_id: execId === 'all' ? null : execId }));
  };
  
  const handleClearFilters = () => {
    router.push(pathname);
  }

  const areFiltersActive = !!(from || to || salesExecId);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('w-full justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Select value={salesExecId || 'all'} onValueChange={handleExecChange}>
        <SelectTrigger className="w-full md:w-[240px]">
          <SelectValue placeholder="Select Sales Executive" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sales Executives</SelectItem>
          {salesExecutives.map(exec => (
            <SelectItem key={exec.id} value={exec.id}>
              {exec.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {areFiltersActive && (
        <Button variant="ghost" onClick={handleClearFilters}>
          <FilterX className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
