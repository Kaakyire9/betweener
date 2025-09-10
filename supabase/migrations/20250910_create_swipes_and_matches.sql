
-- Drop old matches table if it exists (for clean slate and new structure)
DROP TABLE IF EXISTS matches CASCADE;

-- 1. Create swipes table
CREATE TABLE IF NOT EXISTS swipes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action text NOT NULL CHECK (action IN ('like', 'pass', 'superlike')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user1_id, user2_id)
);

-- Optional: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_target_id ON swipes(target_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches(user2_id);
