export interface SalesExecutive {
  id: string;
  name: string;
  created_at: string;
}

export interface Lead {
  id: string;
  business_name: string;
  contact_name: string;
  contact_phone: string | null;
  contact_email: string | null;
  lead_source: string;
  industry: string;
  company_size: string;
  city: string | null;
  created_at: string;
}

export interface CallLog {
  id: string;
  date: string;
  sales_exec_id: string;
  lead_id: string;
  lead_type: 'New Lead' | 'Existing Lead';
  call_outcome: 'Connected' | 'Not Connected' | 'Wrong Number' | 'Call Back Later';
  service_pitched?: string | null;
  interest_level?: 'High' | 'Medium' | 'Low' | 'Not Interested' | null;
  next_step_required?: boolean;
  follow_up_date?: string | null;
  lead_stage?: 'In Discussion' | 'Demo Scheduled' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost' | null;
  demo_date?: string | null;
  proposal_sent?: boolean;
  deal_value?: number | null;
  remarks?: string | null;
  created_at: string;
}

export interface LeadWithOptions extends Lead {
  label: string;
  value: string;
}

export interface SalesExecutiveWithOptions extends SalesExecutive {
  label: string;
  value: string;
}

export interface DashboardStats {
  totalCalls: number;
  connectedCalls: number;
  newLeads: number;
  demosScheduled: number;
  dealsClosed: number;
  totalDealValue: number;
  followUpsDue: number;
}

export type DailyCallTrend = {
  date: string;
  total: number;
  connected: number;
}[];

export type ChartData = {
  name: string;
  value: number;
}[];
