import { z } from 'zod';

const requiredString = z.string().min(1, 'This field is required');

export const callReportSchema = z.object({
  sales_exec_id: requiredString,
  lead_type: z.enum(['New Lead', 'Existing Lead']),
  
  // New Lead Fields
  lead_source: z.string().optional(),
  business_name: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  city: z.string().optional(),

  // Existing Lead Field
  lead_id: z.string().optional(),

  call_outcome: z.enum(['Connected', 'Not Connected', 'Wrong Number', 'Call Back Later']),
  
  remarks: z.string().optional(),

  // Connected Call Fields
  service_pitched: z.string().optional(),
  interest_level: z.enum(['High', 'Medium', 'Low', 'Not Interested']).optional(),
  next_step_required: z.boolean().optional().default(false),
  follow_up_date: z.date().optional().nullable(),
  
  // Opportunity Progress
  lead_stage: z.enum(['In Discussion', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost']).optional(),
  demo_date: z.date().optional().nullable(),
  proposal_sent: z.boolean().optional().default(false),
  deal_value: z.coerce.number().optional(),

}).superRefine((data, ctx) => {
  if (data.lead_type === 'New Lead') {
    if (!data.business_name) ctx.addIssue({ code: 'custom', message: 'Business name is required', path: ['business_name'] });
    if (!data.contact_name) ctx.addIssue({ code: 'custom', message: 'Contact name is required', path: ['contact_name'] });
    if (!data.contact_phone) ctx.addIssue({ code: 'custom', message: 'Phone number is required', path: ['contact_phone'] });
  }
  if (data.lead_type === 'Existing Lead') {
    if (!data.lead_id) ctx.addIssue({ code: 'custom', message: 'Please select a lead', path: ['lead_id'] });
  }
  if (data.call_outcome === 'Connected' || data.call_outcome === 'Call Back Later') {
    if (!data.service_pitched) ctx.addIssue({ code: 'custom', message: 'Service pitched is required', path: ['service_pitched'] });
    if (!data.interest_level) ctx.addIssue({ code: 'custom', message: 'Interest level is required', path: ['interest_level'] });
  }
  if (data.next_step_required && !data.follow_up_date) {
    ctx.addIssue({ code: 'custom', message: 'Follow-up date is required', path: ['follow_up_date'] });
  }
  if (data.lead_stage === 'Demo Scheduled' && !data.demo_date) {
    ctx.addIssue({ code: 'custom', message: 'Demo date is required', path: ['demo_date'] });
  }
});

export type CallReportFormValues = z.infer<typeof callReportSchema>;
