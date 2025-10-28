import { addDays, format, startOfToday, subDays, eachDayOfInterval, isValid, endOfDay } from 'date-fns';
import type { Lead, CallLog, DashboardStats, DailyCallTrend, ChartData, SalesExecutive, DashboardFilter } from './types';
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
        .insert([{ ...logData, date: new Date().toISOString() }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getCallLogs = async (filters?: DashboardFilter): Promise<(CallLog & { leads: { business_name: string }, sales_executives: { name: string } })[]> => {
    let query = supabase
        .from('call_logs')
        .select(`
            *,
            leads (business_name),
            sales_executives (name)
        `)
        .order('created_at', { ascending: false });
    
    if (filters?.from) query = query.gte('date', filters.from);
    if (filters?.to) query = query.lte('date', endOfDay(new Date(filters.to)).toISOString());
    if (filters?.sales_exec_id) query = query.eq('sales_exec_id', filters.sales_exec_id);

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to match previous structure for component compatibility
    return data.map(log => ({
      ...log,
      business_name: log.leads?.business_name || 'N/A',
      sales_exec_name: log.sales_executives?.name || 'N/A'
    })) as any;
}


// --- Dashboard Analytics ---
export const getDashboardStats = async (filters?: DashboardFilter): Promise<DashboardStats> => {
  const today = startOfToday();
  const endDate = filters?.to ? new Date(filters.to) : today;
  const tomorrow = addDays(endOfDay(endDate), 1);

  let query = supabase.from('call_logs').select('*');

  if (filters?.from) query = query.gte('date', filters.from);
  if (filters?.to) query = query.lte('date', endOfDay(new Date(filters.to)).toISOString());
  if (filters?.sales_exec_id) query = query.eq('sales_exec_id', filters.sales_exec_id);

  const { data: callLogs, error } = await query;
  if (error) throw error;

  const filteredLogs = callLogs;

  const { count: followUpsDue, error: followUpError } = await supabase
    .from('call_logs')
    .select('id', { count: 'exact' })
    .eq('follow_up_date', format(tomorrow, 'yyyy-MM-dd'));
  
  if(followUpError) throw followUpError;

  return {
    totalCalls: filteredLogs.length,
    connectedCalls: filteredLogs.filter(l => l.call_outcome === 'Connected').length,
    newLeads: filteredLogs.filter(l => l.lead_type === 'New Lead').length,
    demosScheduled: filteredLogs.filter(l => l.lead_stage === 'Demo Scheduled').length,
    dealsClosed: filteredLogs.filter(l => l.lead_stage === 'Closed Won').length,
    totalDealValue: filteredLogs
      .filter(l => l.lead_stage === 'Closed Won' && l.deal_value)
      .reduce((sum, l) => sum + Number(l.deal_value!), 0),
    followUpsDue: followUpsDue ?? 0
  };
};

export const getDailyCallTrend = async (filters?: DashboardFilter): Promise<DailyCallTrend> => {
    let query = supabase.from('call_logs').select('date, call_outcome');
    if (filters?.sales_exec_id) query = query.eq('sales_exec_id', filters.sales_exec_id);

    const fromDate = filters?.from ? new Date(filters.from) : subDays(new Date(), 6);
    const toDate = filters?.to ? new Date(filters.to) : new Date();

    if (!isValid(fromDate) || !isValid(toDate)) {
      return [];
    }

    const dateRange = eachDayOfInterval({ start: fromDate, end: toDate });
    
    query = query.gte('date', format(fromDate, 'yyyy-MM-dd')).lte('date', endOfDay(toDate).toISOString());

    const { data: callLogs, error } = await query;
    if (error) throw error;

    const trend = dateRange.map(date => {
        const dateStr = format(date, 'MMM d');
        const logsOnDate = callLogs.filter(log => format(new Date(log.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        return {
            date: dateStr,
            total: logsOnDate.length,
            connected: logsOnDate.filter(l => l.call_outcome === 'Connected').length
        };
    });
    
    return trend;
}

export const getInterestLevelDistribution = async (filters?: DashboardFilter): Promise<ChartData> => {
    let query = supabase.from('call_logs').select('interest_level');
    
    if (filters?.from) query = query.gte('date', filters.from);
    if (filters?.to) query = query.lte('date', endOfDay(new Date(filters.to)).toISOString());
    if (filters?.sales_exec_id) query = query.eq('sales_exec_id', filters.sales_exec_id);
    
    const { data: callLogs, error } = await query;
    if (error) throw error;

    const distribution: { [key: string]: number } = {};
    callLogs.forEach(log => {
        if (log.interest_level) {
            distribution[log.interest_level] = (distribution[log.interest_level] || 0) + 1;
        }
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

export const getLeadStageDistribution = async (filters?: DashboardFilter): Promise<ChartData> => {
    let query = supabase.from('call_logs').select('lead_stage');

    if (filters?.from) query = query.gte('date', filters.from);
    if (filters?.to) query = query.lte('date', endOfDay(new Date(filters.to)).toISOString());
    if (filters?.sales_exec_id) query = query.eq('sales_exec_id', filters.sales_exec_id);

    const { data: callLogs, error } = await query;
    if (error) throw error;

    const distribution: { [key:string]: number } = {};
    callLogs.forEach(log => {
        if (log.lead_stage) {
            distribution[log.lead_stage] = (distribution[log.lead_stage] || 0) + 1;
        }
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}
