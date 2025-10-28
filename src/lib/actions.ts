'use server';

import { revalidatePath } from 'next/cache';
import { addCallLog, addLead, getDailyCallTrend, getDailySummaryData, getDashboardStats, getInterestLevelDistribution, getLeadStageDistribution, getLeads as fetchLeads, getCallLogs as fetchCallLogs, getSalesExecutives as fetchSalesExecutives } from './data';
import type { CallReportFormValues } from './schemas';

export async function getLeads() {
  try {
    const leads = await fetchLeads();
    return { data: leads, error: null };
  } catch (error) {
    console.error('Error fetching leads:', error);
    return { data: null, error: 'Failed to fetch leads.' };
  }
}

export async function getSalesExecutives() {
  try {
    const executives = await fetchSalesExecutives();
    return { data: executives, error: null };
  } catch (error) {
    console.error('Error fetching sales executives:', error);
    return { data: null, error: 'Failed to fetch sales executives.' };
  }
}

export async function getCallLogs() {
    try {
        const logs = await fetchCallLogs();
        return { data: logs, error: null };
    } catch (error) {
        console.error('Error fetching call logs:', error);
        return { data: null, error: 'Failed to fetch call logs.' };
    }
}

export async function submitCallReport(values: CallReportFormValues) {
  try {
    let leadId = values.lead_id;

    if (values.lead_type === 'New Lead') {
      const newLead = await addLead({
        business_name: values.business_name!,
        contact_name: values.contact_name!,
        contact_phone: values.contact_phone!,
        contact_email: values.contact_email || null,
        lead_source: values.lead_source || 'Other',
        industry: values.industry || 'Other',
        company_size: values.company_size || '1-10',
        city: values.city || null,
      });
      leadId = newLead.id;
    }
    
    if (!leadId) {
        throw new Error('Lead ID is missing.');
    }
    if (!values.sales_exec_id) {
        throw new Error('Sales Executive ID is missing.');
    }

    await addCallLog({
      sales_exec_id: values.sales_exec_id,
      lead_id: leadId,
      lead_type: values.lead_type,
      call_outcome: values.call_outcome,
      service_pitched: values.service_pitched,
      interest_level: values.interest_level,
      next_step_required: values.next_step_required,
      follow_up_date: values.follow_up_date ? values.follow_up_date.toISOString().split('T')[0] : null,
      lead_stage: values.lead_stage,
      demo_date: values.demo_date ? values.demo_date.toISOString().split('T')[0] : null,
      proposal_sent: values.proposal_sent,
      deal_value: values.deal_value,
      remarks: values.remarks,
    });
    
    revalidatePath('/report');
    revalidatePath('/admin');
    return { success: true, message: 'Call logged successfully. Thank you!' };
  } catch (error) {
    console.error('Error submitting call report:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to log call: ${errorMessage}` };
  }
}

export async function getStatsForDashboard() {
    try {
        const data = await getDashboardStats();
        return { data, error: null };
    } catch(e) {
        console.error('Error fetching dashboard stats:', e);
        return { data: null, error: 'Failed to fetch dashboard stats.'}
    }
}

export async function getChartDataForDashboard() {
    try {
        const [
            dailyCallTrend,
            interestLevelDistribution,
            leadStageDistribution,
        ] = await Promise.all([
            getDailyCallTrend(),
            getInterestLevelDistribution(),
            getLeadStageDistribution(),
        ]);
        return {
            data: {
                dailyCallTrend,
                interestLevelDistribution,
                leadStageDistribution,
            },
            error: null
        }
    } catch (e) {
        console.error('Error fetching chart data:', e);
        return { data: null, error: 'Failed to fetch chart data.' }
    }
}
