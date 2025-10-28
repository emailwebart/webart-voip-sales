# **App Name**: VoIP Sales Insights

## Core Features:

- Dynamic Sales Call Form: Public form adapts based on lead type (new/existing) and call outcome to streamline data entry.
- Supabase Integration: Stores sales call data securely in Supabase with leads and call_logs tables.
- Admin Authentication: Secure admin panel accessible only via Supabase Auth.
- Daily Summary Email: Automated SMTP email report sent at 7 PM IST, summarizing the day's sales activities. Uses a tool to decide what data to include in its reasoning.
- Dashboard Summary Cards: Display key metrics such as total calls, connected calls, new leads, demos scheduled, and total deal value in summary cards.
- Interactive Charts: Visualize data trends with daily call trends (line chart), interest level breakdown (pie chart), and lead stage distribution (bar chart).
- Data Export: Admin function that allows the current dataset to be exported to a file in CSV or PDF format

## Style Guidelines:

- Primary color: Strong blue (#2962FF), reflecting professionalism and reliability.
- Background color: Very light blue (#E5EAF9), providing a clean and modern look.
- Accent color: Violet (#7A47F7) for interactive elements and key highlights, differentiating them clearly.
- Headline font: 'Space Grotesk' sans-serif for a modern, tech-forward look.
- Body font: 'Inter' sans-serif, for clarity and readability in reports and form fields.
- Crisp, minimalist icons to represent KPIs and actions in the admin dashboard.
- Clean, well-spaced layout with clear sections to enhance user experience and data accessibility.