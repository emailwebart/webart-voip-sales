import { addDays, format, startOfToday, subDays } from 'date-fns';
import type { Lead, CallLog, DashboardStats, DailyCallTrend, ChartData, SalesExecutive } from './types';
import { supabase } from './supabase/client';


// --- Sales Executives ---
export const getSalesExecutives = async (): Promise<SalesExecutive[]> => {
  const { data, error } = await supabase.from('sales_executives').select('*');
  if (error) throw error;
  return data;
};

// --- Leads ---
export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addLead = async (leadData: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> => {
    const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();
    if (error) throw error;
    return data;
};

// --- Call Logs ---
export const addCallLog = async (logData: Omit<CallLog, 'id' | 'created_at' | 'date'>): Promise<CallLog> => {
    const { data, error } = await supabase
        .from('call_logs')
        .insert([logData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getCallLogs = async (): Promise<(CallLog & { leads: { business_name: string }, sales_executives: { name: string } })[]> => {
    const { data, error } = await supabase
        .from('call_logs')
        .select(`
            *,
            leads (business_name),
            sales_executives (name)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match previous structure for component compatibility
    return data.map(log => ({
      ...log,
      business_name: log.leads?.business_name || 'N/A',
      sales_exec_name: log.sales_executives?.name || 'N/A'
    })) as any;
}


// --- Dashboard Analytics ---
const isToday = (date: string) => format(new Date(date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data: callLogs, error } = await supabase.from('call_logs').select('*');
  if (error) throw error;

  const todayLogs = callLogs.filter(log => isToday(log.date));
  const tomorrow = addDays(new Date(), 1);

  return {
    totalCalls: todayLogs.length,
    connectedCalls: todayLogs.filter(l => l.call_outcome === 'Connected').length,
    newLeads: todayLogs.filter(l => l.lead_type === 'New Lead').length,
    demosScheduled: todayLogs.filter(l => l.lead_stage === 'Demo Scheduled').length,
    dealsClosed: todayLogs.filter(l => l.lead_stage === 'Closed Won').length,
    totalDealValue: todayLogs
      .filter(l => l.lead_stage === 'Closed Won' && l.deal_value)
      .reduce((sum, l) => sum + Number(l.deal_value!), 0),
    followUpsDue: callLogs.filter(l => l.follow_up_date && format(new Date(l.follow_up_date), 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')).length
  };
};

export const getDailyCallTrend = async (): Promise<DailyCallTrend> => {
    const { data: callLogs, error } = await supabase.from('call_logs').select('date, call_outcome');
    if (error) throw error;

    const trend: DailyCallTrend = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'MMM d');
        const logsOnDate = callLogs.filter(log => format(new Date(log.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        trend.push({
            date: dateStr,
            total: logsOnDate.length,
            connected: logsOnDate.filter(l => l.call_outcome === 'Connected').length
        });
    }
    return trend;
}

export const getInterestLevelDistribution = async (): Promise<ChartData> => {
    const { data: callLogs, error } = await supabase.from('call_logs').select('interest_level');
    if (error) throw error;

    const todayLogs = callLogs.filter(log => isToday(log.created_at));
    const distribution: { [key: string]: number } = {};
    todayLogs.forEach(log => {
        if (log.interest_level) {
            distribution[log.interest_level] = (distribution[log.interest_level] || 0) + 1;
        }
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

export const getLeadStageDistribution = async (): Promise<ChartData> => {
    const { data: callLogs, error } = await supabase.from('call_logs').select('lead_stage');
    if (error) throw error;

    const todayLogs = callLogs.filter(log => isToday(log.created_at));
    const distribution: { [key: string]: number } = {};
    todayLogs.forEach(log => {
        if (log.lead_stage) {
            distribution[log.lead_stage] = (distribution[log.lead_stage] || 0) + 1;
        }
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}
