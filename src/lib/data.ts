import { addDays, format, startOfToday, subDays } from 'date-fns';
import type { Lead, CallLog, DashboardStats, DailyCallTrend, ChartData } from './types';

// Mock database tables
let leads: Lead[] = [
  {
    id: 'l1',
    business_name: 'Innovate Corp',
    contact_name: 'Alice Johnson',
    contact_phone: '123-456-7890',
    contact_email: 'alice@innovate.com',
    lead_source: 'LinkedIn',
    industry: 'IT',
    company_size: '51-200',
    city: 'San Francisco',
    created_at: subDays(new Date(), 5).toISOString(),
  },
  {
    id: 'l2',
    business_name: 'Quantum Solutions',
    contact_name: 'Bob Williams',
    contact_phone: '234-567-8901',
    contact_email: 'bob@quantum.com',
    lead_source: 'Referral',
    industry: 'Finance',
    company_size: '201-500',
    city: 'New York',
    created_at: subDays(new Date(), 10).toISOString(),
  },
];

let callLogs: CallLog[] = [
    {
        id: 'cl1', date: subDays(startOfToday(), 2).toISOString(), sales_exec_name: 'John Doe', lead_id: 'l1', lead_type: 'Existing Lead',
        call_outcome: 'Connected', service_pitched: 'Cloud PBX', interest_level: 'High', next_step_required: true, follow_up_date: addDays(new Date(), 7).toISOString(),
        lead_stage: 'Demo Scheduled', demo_date: addDays(new Date(), 3).toISOString(), proposal_sent: false, deal_value: 50000, remarks: 'Very interested in multi-location support.', created_at: subDays(startOfToday(), 2).toISOString()
    },
    {
        id: 'cl2', date: subDays(startOfToday(), 1).toISOString(), sales_exec_name: 'Jane Smith', lead_id: 'l2', lead_type: 'Existing Lead',
        call_outcome: 'Connected', service_pitched: 'SIP Trunk', interest_level: 'Medium', next_step_required: true, follow_up_date: addDays(new Date(), 14).toISOString(),
        lead_stage: 'In Discussion', proposal_sent: false, deal_value: 25000, remarks: 'Wants a detailed proposal on cost savings.', created_at: subDays(startOfToday(), 1).toISOString()
    },
    {
        id: 'cl3', date: startOfToday().toISOString(), sales_exec_name: 'John Doe', lead_id: 'l2', lead_type: 'Existing Lead',
        call_outcome: 'Connected', service_pitched: 'SIP Trunk', interest_level: 'High', next_step_required: true, follow_up_date: addDays(new Date(), 1).toISOString(),
        lead_stage: 'Proposal Sent', proposal_sent: true, deal_value: 28000, remarks: 'Proposal sent, waiting for their review.', created_at: startOfToday().toISOString()
    },
    {
        id: 'cl4', date: startOfToday().toISOString(), sales_exec_name: 'John Doe', lead_id: 'new', lead_type: 'New Lead',
        call_outcome: 'Not Connected', remarks: 'Voicemail left.', created_at: startOfToday().toISOString()
    },
    {
        id: 'cl5', date: startOfToday().toISOString(), sales_exec_name: 'Jane Smith', lead_id: 'l1', lead_type: 'Existing Lead',
        call_outcome: 'Connected', service_pitched: 'UCaaS', interest_level: 'Low', next_step_required: false,
        lead_stage: 'Closed Lost', remarks: 'Decided to go with a competitor.', created_at: startOfToday().toISOString()
    },
];


// Mock API functions
export const getLeads = async (): Promise<Lead[]> => {
  return Promise.resolve(leads);
};

export const addLead = async (leadData: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> => {
  const newLead: Lead = {
    ...leadData,
    id: `l${leads.length + 1}`,
    created_at: new Date().toISOString(),
  };
  leads.push(newLead);
  return Promise.resolve(newLead);
};

export const addCallLog = async (logData: Omit<CallLog, 'id' | 'created_at' | 'date'>): Promise<CallLog> => {
  const newLog: CallLog = {
    ...logData,
    id: `cl${callLogs.length + 1}`,
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  callLogs.push(newLog);
  return Promise.resolve(newLog);
};

export const getCallLogs = async (): Promise<(CallLog & { business_name?: string })[]> => {
    return Promise.resolve(callLogs.map(log => {
        const lead = leads.find(l => l.id === log.lead_id);
        return {
            ...log,
            business_name: lead?.business_name || 'N/A'
        }
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
}

const isToday = (date: string) => format(new Date(date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

export const getDashboardStats = async (): Promise<DashboardStats> => {
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
      .reduce((sum, l) => sum + l.deal_value!, 0),
    followUpsDue: callLogs.filter(l => l.follow_up_date && format(new Date(l.follow_up_date), 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')).length
  };
};

export const getDailyCallTrend = async (): Promise<DailyCallTrend> => {
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
    const todayLogs = callLogs.filter(log => isToday(log.date));
    const distribution: { [key: string]: number } = {};
    todayLogs.forEach(log => {
        if (log.interest_level) {
            distribution[log.interest_level] = (distribution[log.interest_level] || 0) + 1;
        }
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

export const getLeadStageDistribution = async (): Promise<ChartData> => {
    const todayLogs = callLogs.filter(log => isToday(log.date));
    const distribution: { [key: string]: number } = {};
    todayLogs.forEach(log => {
        if (log.lead_stage) {
            distribution[log.lead_stage] = (distribution[log.lead_stage] || 0) + 1;
        }
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

export const getDailySummaryData = async () => {
    const todayLogs = callLogs.filter(log => isToday(log.date));
    const stats = await getDashboardStats();

    const highlights = todayLogs
        .filter(log => log.call_outcome === 'Connected')
        .slice(0, 3) // Get top 3 highlights
        .map(log => {
            const lead = leads.find(l => l.id === log.lead_id);
            return {
                businessName: lead?.business_name || 'New Lead',
                interestLevel: log.interest_level || 'N/A',
                leadStage: log.lead_stage || 'N/A',
                followUpDate: log.follow_up_date ? format(new Date(log.follow_up_date), 'dd-MMM-yyyy') : 'None'
            };
    });

    // For the purpose of the AI prompt, we'll pick the first sales exec and the first highlight
    const firstExec = todayLogs[0]?.sales_exec_name || 'N/A';
    const firstHighlight = highlights[0] || {
        businessName: 'N/A',
        interestLevel: 'N/A',
        leadStage: 'N/A',
        followUpDate: 'N/A'
    };
    
    return {
        date: format(new Date(), 'yyyy-MM-dd'),
        totalCalls: stats.totalCalls,
        connectedCalls: stats.connectedCalls,
        newLeadsAdded: stats.newLeads,
        demosScheduled: stats.demosScheduled,
        dealsClosed: stats.dealsClosed,
        totalDealValue: stats.totalDealValue,
        followUpsSet: todayLogs.filter(l => l.next_step_required).length,
        salesExecName: firstExec,
        ...firstHighlight,
    };
}
