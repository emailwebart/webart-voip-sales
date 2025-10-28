'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { callReportSchema, type CallReportFormValues } from '@/lib/schemas';
import type { Lead, LeadWithOptions } from '@/lib/types';
import { submitCallReport } from '@/lib/actions';
import { Switch } from '../ui/switch';
import { useState } from 'react';

const formSections = [
  { name: 'Sales Executive Info', fields: ['sales_exec_name', 'lead_type'] },
  { name: 'Lead Details', fields: ['lead_id', 'business_name', 'contact_name', 'contact_phone', 'contact_email', 'lead_source', 'industry', 'company_size', 'city'] },
  { name: 'Call Details', fields: ['call_outcome', 'remarks'] },
  { name: 'Connected Call Details', fields: ['service_pitched', 'interest_level', 'next_step_required', 'follow_up_date', 'remarks'] },
  { name: 'Opportunity Progress', fields: ['lead_stage', 'demo_date', 'proposal_sent', 'deal_value'] },
];

const fieldOptions = {
  lead_source: ['LinkedIn', 'Cold Call', 'Referral', 'Website', 'Partner', 'Other'],
  industry: ['IT', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other'],
  company_size: ['1-10', '11-50', '51-200', '201-500', '500+'],
  call_outcome: ['Connected', 'Not Connected', 'Wrong Number', 'Call Back Later'],
  service_pitched: ['Cloud PBX', 'SIP Trunk', 'Hosted VoIP', 'UCaaS', 'Call Center', 'Other'],
  interest_level: ['High', 'Medium', 'Low', 'Not Interested'],
  lead_stage: ['In Discussion', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'],
};

export function CallReportForm({ leads }: { leads: Lead[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<CallReportFormValues>({
    resolver: zodResolver(callReportSchema),
    defaultValues: {
      sales_exec_name: '',
      lead_type: 'New Lead',
      call_outcome: 'Connected',
      next_step_required: false,
      proposal_sent: false,
    },
  });

  const leadType = form.watch('lead_type');
  const callOutcome = form.watch('call_outcome');
  const nextStepRequired = form.watch('next_step_required');
  const leadStage = form.watch('lead_stage');

  const leadOptions: LeadWithOptions[] = leads.map(lead => ({
    ...lead,
    label: lead.business_name,
    value: lead.id,
  }));

  async function onSubmit(data: CallReportFormValues) {
    setIsSubmitting(true);
    const result = await submitCallReport(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Sales Executive Info */}
          <FormField control={form.control} name="sales_exec_name" render={({ field }) => (
            <FormItem>
              <FormLabel>Sales Executive Name</FormLabel>
              <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lead_type" render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select lead type" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="New Lead">New Lead</SelectItem>
                  <SelectItem value="Existing Lead">Existing Lead</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Section 2: Lead Details (Conditional) */}
        {leadType === 'New Lead' && (
          <div className="p-4 border rounded-lg bg-primary/5 space-y-6">
            <h3 className="font-headline text-lg font-semibold text-primary">New Lead Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField control={form.control} name="business_name" render={({ field }) => (<FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="contact_name" render={({ field }) => (<FormItem><FormLabel>Contact Person</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="contact_phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="contact_email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="jane.smith@acme.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City / Location</FormLabel><FormControl><Input placeholder="San Francisco" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="lead_source" render={({ field }) => (<FormItem><FormLabel>Lead Source</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger></FormControl><SelectContent>{fieldOptions.lead_source.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="industry" render={({ field }) => (<FormItem><FormLabel>Industry</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl><SelectContent>{fieldOptions.industry.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="company_size" render={({ field }) => (<FormItem><FormLabel>Company Size</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger></FormControl><SelectContent>{fieldOptions.company_size.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
          </div>
        )}
        {leadType === 'Existing Lead' && (
          <FormField control={form.control} name="lead_id" render={({ field }) => (
            <FormItem>
              <FormLabel>Select Lead</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select an existing lead by business name" /></SelectTrigger></FormControl>
                <SelectContent><>{leadOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</ Odds-on Favorites</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        )}
        
        {/* Section 3: Call Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="call_outcome" render={({ field }) => (
                <FormItem>
                <FormLabel>Call Outcome</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select call outcome" /></SelectTrigger></FormControl>
                    <SelectContent>{fieldOptions.call_outcome.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )} />
        </div>

        {/* Conditional Sections */}
        {(callOutcome === 'Connected' || callOutcome === 'Call Back Later') ? (
          <div className="space-y-8">
            <div className="p-4 border rounded-lg bg-primary/5 space-y-6">
                <h3 className="font-headline text-lg font-semibold text-primary">Connected Call Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="service_pitched" render={({ field }) => (<FormItem><FormLabel>VoIP Service Pitched</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger></FormControl><SelectContent>{fieldOptions.service_pitched.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="interest_level" render={({ field }) => (<FormItem><FormLabel>Interest Level</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select interest level" /></SelectTrigger></FormControl><SelectContent>{fieldOptions.interest_level.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="next_step_required" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8"><div className="space-y-0.5"><FormLabel>Next Step Required?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                    {nextStepRequired && <FormField control={form.control} name="follow_up_date" render={({ field }) => (<FormItem className="flex flex-col mt-2"><FormLabel>Follow-up Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />}
                </div>
            </div>

            <div className="p-4 border rounded-lg bg-primary/5 space-y-6">
                <h3 className="font-headline text-lg font-semibold text-primary">Opportunity Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="lead_stage" render={({ field }) => (<FormItem><FormLabel>Lead Stage</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select lead stage" /></SelectTrigger></FormControl><SelectContent>{fieldOptions.lead_stage.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                    {leadStage === 'Demo Scheduled' && <FormField control={form.control} name="demo_date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Demo Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />}
                    <FormField control={form.control} name="proposal_sent" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8"><div className="space-y-0.5"><FormLabel>Proposal Sent?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="deal_value" render={({ field }) => (<FormItem><FormLabel>Estimated Deal Value (INR)</FormLabel><FormControl><Input type="number" placeholder="50000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </div>
            
            <FormField control={form.control} name="remarks" render={({ field }) => (<FormItem><FormLabel>Call Summary / Notes</FormLabel><FormControl><Textarea placeholder="Detailed notes from the call..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>)} />

          </div>
        ) : (
            <FormField control={form.control} name="remarks" render={({ field }) => (<FormItem><FormLabel>Remarks</FormLabel><FormControl><Textarea placeholder="e.g., Number was out of service." {...field} /></FormControl><FormMessage /></FormItem>)} />
        )}
        
        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Call Log'}
        </Button>
      </form>
    </Form>
  );
}
