-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  default_config JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'attending' | 'declined' | 'tentative'
  guests_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create guestbooks table
CREATE TABLE IF NOT EXISTS guestbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Enable Public Insertion Policies for rsvps
CREATE POLICY "Allow public insert to RSVPs"
  ON rsvps
  FOR INSERT
  WITH CHECK (true);

-- Enable Public Insertion Policies for guestbooks
CREATE POLICY "Allow public insert to Guestbook"
  ON guestbooks
  FOR INSERT
  WITH CHECK (true);

-- Allow Public Reads for all tables so invitations render anonymously
CREATE POLICY "Allow public read to templates" ON templates FOR SELECT USING (true);
CREATE POLICY "Allow public read to invitations" ON invitations FOR SELECT USING (true);
CREATE POLICY "Allow public read to rsvps" ON rsvps FOR SELECT USING (true);
CREATE POLICY "Allow public read to guestbooks" ON guestbooks FOR SELECT USING (true);
