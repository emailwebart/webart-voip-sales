-- Create Sales Executives Table
CREATE TABLE sales_executives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    lead_source VARCHAR(100),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    city VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Call Logs Table
CREATE TABLE call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMPTZ DEFAULT NOW(),
    sales_exec_id UUID REFERENCES sales_executives(id),
    lead_id UUID REFERENCES leads(id),
    lead_type VARCHAR(50) NOT NULL,
    call_outcome VARCHAR(100) NOT NULL,
    service_pitched VARCHAR(100),
    interest_level VARCHAR(50),
    next_step_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    lead_stage VARCHAR(100),
    demo_date DATE,
    proposal_sent BOOLEAN DEFAULT FALSE,
    deal_value NUMERIC,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some sample sales executives
INSERT INTO sales_executives (name) VALUES ('John Doe'), ('Jane Smith');

-- Enable Row Level Security (RLS)
ALTER TABLE sales_executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow public read access
CREATE POLICY "Public read access for sales_executives" ON sales_executives FOR SELECT USING (true);
CREATE POLICY "Public read access for leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Public read access for call_logs" ON call_logs FOR SELECT USING (true);

-- Create RLS policies to allow public insert access
CREATE POLICY "Public insert access for leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access for call_logs" ON call_logs FOR INSERT WITH CHECK (true);
