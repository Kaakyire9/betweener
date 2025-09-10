-- Drop all RLS policies on matches before migration
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'matches' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON matches;', pol.policyname);
    END LOOP;
END $$;

-- (After migration, recreate your policies. Example template:)
-- CREATE POLICY "Allow authenticated select on matches" ON matches
--   FOR SELECT USING (auth.uid() = user_id OR auth.uid() = target_id);

-- Add your updated policy definitions here after the schema change.
