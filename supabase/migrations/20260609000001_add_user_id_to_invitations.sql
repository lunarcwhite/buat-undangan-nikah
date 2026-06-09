-- Add user_id column referencing auth.users table
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security (RLS) on invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Note: "Allow public read to invitations" exists from migration 01, keeping public reads active for guests

-- Write policies: only allow authenticated owners to insert, update, or delete
CREATE POLICY "Allow owner insert"
  ON invitations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow owner update"
  ON invitations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow owner delete"
  ON invitations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
