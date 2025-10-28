'use server';

/**
 * @fileOverview Generates the content for the daily summary email, highlighting key insights and trends.
 *
 * - generateDailySummaryEmailContent - A function that generates the daily summary email content.
 * - DailySummaryEmailContentInput - The input type for the generateDailySummaryEmailContent function.
 * - DailySummaryEmailContentOutput - The return type for the generateDailySummaryEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailySummaryEmailContentInputSchema = z.object({
  date: z.string().describe('The date for which the summary is being generated (YYYY-MM-DD).'),
  totalCalls: z.number().describe('The total number of calls made on the specified date.'),
  connectedCalls: z.number().describe('The number of connected calls made on the specified date.'),
  newLeadsAdded: z.number().describe('The number of new leads added on the specified date.'),
  demosScheduled: z.number().describe('The number of demos scheduled on the specified date.'),
  dealsClosed: z.number().describe('The number of deals closed on the specified date.'),
  totalDealValue: z.number().describe('The total value of deals closed on the specified date.'),
  followUpsSet: z.number().describe('The number of follow-ups scheduled on the specified date.'),
  salesExecName: z.string().describe('The name of the sales executive.'),
  businessName: z.string().describe('The name of the business.'),
  interestLevel: z.string().describe('The interest level of the lead.'),
  leadStage: z.string().describe('The current stage of the lead.'),
  followUpDate: z.string().describe('The date of the follow-up.'),
});
export type DailySummaryEmailContentInput = z.infer<typeof DailySummaryEmailContentInputSchema>;

const DailySummaryEmailContentOutputSchema = z.object({
  subject: z.string().describe('The subject line for the daily summary email.'),
  htmlBody: z.string().describe('The HTML content of the daily summary email.'),
});
export type DailySummaryEmailContentOutput = z.infer<typeof DailySummaryEmailContentOutputSchema>;

export async function generateDailySummaryEmailContent(
  input: DailySummaryEmailContentInput
): Promise<DailySummaryEmailContentOutput> {
  return dailySummaryEmailContentFlow(input);
}

const summarizeInsights = ai.defineTool({
  name: 'summarizeInsights',
  description: 'Summarizes the key insights and trends from the daily sales activities.',
  inputSchema: z.object({
    totalCalls: z.number().describe('The total number of calls made on the specified date.'),
    connectedCalls: z.number().describe('The number of connected calls made on the specified date.'),
    newLeadsAdded: z.number().describe('The number of new leads added on the specified date.'),
    demosScheduled: z.number().describe('The number of demos scheduled on the specified date.'),
    dealsClosed: z.number().describe('The number of deals closed on the specified date.'),
    totalDealValue: z.number().describe('The total value of deals closed on the specified date.'),
    followUpsSet: z.number().describe('The number of follow-ups scheduled on the specified date.'),
  }),
  outputSchema: z.string().describe('A summary of the key insights and trends.'),
},
async (input) => {
    return `Here\'s the summary for today:\nTotal Calls: ${input.totalCalls}\nConnected Calls: ${input.connectedCalls}\nNew Leads Added: ${input.newLeadsAdded}\nDemos Scheduled: ${input.demosScheduled}\nDeals Closed: ${input.dealsClosed}\nTotal Deal Value: ${input.totalDealValue}\nFollow-ups Set: ${input.followUpsSet}`;
});

const prompt = ai.definePrompt({
  name: 'dailySummaryEmailContentPrompt',
  tools: [summarizeInsights],
  input: {schema: DailySummaryEmailContentInputSchema},
  output: {schema: DailySummaryEmailContentOutputSchema},
  prompt: `You are an AI assistant tasked with generating daily sales summary emails.

  Today\'s Date: {{{date}}}
  Sales Executive: {{{salesExecName}}}

  Here’s the daily summary for {{date}}:

  Total Calls: {{totalCalls}}
  Connected Calls: {{connectedCalls}}
  New Leads Added: {{newLeadsAdded}}
  Demos Scheduled: {{demosScheduled}}
  Deals Closed: {{dealsClosed}} (₹{{totalDealValue}})
  Follow-ups Set: {{followUpsSet}}

  The following business had the following highlights:

  Business Name: {{businessName}}
  Interest Level: {{interestLevel}}
  Lead Stage: {{leadStage}}
  Follow-up Date: {{followUpDate}}

  {{#tool_use "summarizeInsights"}}
  {{~tool_input totalCalls=totalCalls connectedCalls=connectedCalls newLeadsAdded=newLeadsAdded demosScheduled=demosScheduled dealsClosed=dealsClosed totalDealValue=totalDealValue followUpsSet=followUpsSet}}
  {{/tool_use}}

  Based on the above information, provide the subject and the body of the email. The subject should be concise and informative.
  The body should start with a greeting, then a brief summary of the day\'s activities, and then highlight any key insights or trends. Conclude with a closing.
`,
});

const dailySummaryEmailContentFlow = ai.defineFlow(
  {
    name: 'dailySummaryEmailContentFlow',
    inputSchema: DailySummaryEmailContentInputSchema,
    outputSchema: DailySummaryEmailContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
