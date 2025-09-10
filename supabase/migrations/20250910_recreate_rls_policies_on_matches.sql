-- Example RLS policy: Allow authenticated users to select matches where they are involved

CREATE POLICY "Allow authenticated select on matches" ON matches
  FOR SELECT USING (
    auth.uid()::uuid = user1_id OR auth.uid()::uuid = user2_id
  );

-- Example RLS policy: Allow authenticated users to insert matches where they are involved
CREATE POLICY "Allow authenticated insert on matches" ON matches
  FOR INSERT WITH CHECK (
    auth.uid()::uuid = user1_id OR auth.uid()::uuid = user2_id
  );

-- Example RLS policy: Allow authenticated users to delete their own matches
CREATE POLICY "Allow authenticated delete on matches" ON matches
  FOR DELETE USING (
    auth.uid()::uuid = user1_id OR auth.uid()::uuid = user2_id
  );

-- Enable RLS on matches table
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
