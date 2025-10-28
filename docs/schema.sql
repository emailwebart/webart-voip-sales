-- Create Sales Executives Table
CREATE TABLE IF NOT EXISTS public.sales_executives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    lead_source VARCHAR(100) NOT NULL DEFAULT 'Other',
    industry VARCHAR(100) NOT NULL DEFAULT 'Other',
    company_size VARCHAR(50) NOT NULL DEFAULT '1-10',
    city VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create Call Logs Table
CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    sales_exec_id UUID NOT NULL REFERENCES public.sales_executives(id),
    lead_id UUID NOT NULL REFERENCES public.leads(id),
    lead_type VARCHAR(50) NOT NULL CHECK (lead_type IN ('New Lead', 'Existing Lead')),
    call_outcome VARCHAR(50) NOT NULL CHECK (call_outcome IN ('Connected', 'Not Connected', 'Wrong Number', 'Call Back Later')),
    service_pitched VARCHAR(100),
    interest_level VARCHAR(50) CHECK (interest_level IN ('High', 'Medium', 'Low', 'Not Interested')),
    next_step_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    lead_stage VARCHAR(50) CHECK (lead_stage IN ('In Discussion', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost')),
    demo_date DATE,
    proposal_sent BOOLEAN DEFAULT FALSE,
    deal_value NUMERIC(12, 2),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.sales_executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow public read access
CREATE POLICY "Enable read access for all users" ON "public"."sales_executives"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."leads"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."call_logs"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Create RLS policies to allow authenticated users to insert/update/delete
CREATE POLICY "Enable insert for authenticated users only" ON "public"."sales_executives"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."leads"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."call_logs"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- Insert some sample data for Sales Executives
INSERT INTO public.sales_executives (name) VALUES
('Amit Kumar'),
('Priya Sharma'),
('Rahul Verma')
ON CONFLICT DO NOTHING;

-- Grant usage on schema public to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant all privileges on all tables in schema public to the anon role
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Grant all privileges on all tables in schema public to the authenticated role
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
