'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { CallLog } from '@/lib/types';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

type CallLogWithBusiness = CallLog & { business_name?: string };

const interestLevelVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'High': 'default',
    'Medium': 'secondary',
    'Low': 'outline',
    'Not Interested': 'destructive',
}

export function CallLogTable({ data }: { data: CallLogWithBusiness[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [execFilter, setExecFilter] = useState('all');
    const [outcomeFilter, setOutcomeFilter] = useState('all');

    const salesExecs = useMemo(() => ['all', ...Array.from(new Set(data.map(log => log.sales_exec_name)))], [data]);
    const outcomes = useMemo(() => ['all', ...Array.from(new Set(data.map(log => log.call_outcome)))], [data]);

    const filteredData = useMemo(() => {
        return data.filter(log => {
            const matchesSearch = searchTerm === '' ||
                log.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.sales_exec_name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesExec = execFilter === 'all' || log.sales_exec_name === execFilter;
            const matchesOutcome = outcomeFilter === 'all' || log.call_outcome === outcomeFilter;

            return matchesSearch && matchesExec && matchesOutcome;
        });
    }, [data, searchTerm, execFilter, outcomeFilter]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Call Logs</CardTitle>
                <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <Input 
                        placeholder="Search by business or exec..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={execFilter} onValueChange={setExecFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by Executive" />
                        </SelectTrigger>
                        <SelectContent>
                            {salesExecs.map(exec => <SelectItem key={exec} value={exec}>{exec === 'all' ? 'All Executives' : exec}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by Outcome" />
                        </SelectTrigger>
                        <SelectContent>
                            {outcomes.map(outcome => <SelectItem key={outcome} value={outcome}>{outcome === 'all' ? 'All Outcomes' : outcome}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Executive</TableHead>
                            <TableHead>Business</TableHead>
                            <TableHead>Outcome</TableHead>
                            <TableHead>Interest</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Follow-up</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>{format(new Date(log.date), 'dd MMM, HH:mm')}</TableCell>
                                    <TableCell>{log.sales_exec_name}</TableCell>
                                    <TableCell>{log.business_name}</TableCell>
                                    <TableCell>{log.call_outcome}</TableCell>
                                    <TableCell>
                                        {log.interest_level && <Badge variant={interestLevelVariant[log.interest_level]}>{log.interest_level}</Badge>}
                                    </TableCell>
                                    <TableCell>{log.lead_stage || 'N/A'}</TableCell>
                                    <TableCell>{log.follow_up_date ? format(new Date(log.follow_up_date), 'dd MMM yyyy') : 'N/A'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">No call logs found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


export function TableSkeleton() {
    return (
        <Card>
            <CardHeader>
                 <Skeleton className="h-8 w-48" />
                 <div className="mt-4 flex gap-4">
                    <Skeleton className="h-10 w-full max-w-sm" />
                    <Skeleton className="h-10 w-[180px]" />
                    <Skeleton className="h-10 w-[180px]" />
                 </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {Array.from({length: 5}).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
