-- Migration: Clean slate conversion of profiles.id to uuid and update all references

-- 1. Drop foreign key constraints in referencing tables
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_target_id_fkey;
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_user_id_fkey;
ALTER TABLE "ProfileInterest" DROP CONSTRAINT IF EXISTS "ProfileInterest_profileId_fkey";

-- 2. Truncate referencing tables (clean slate)
TRUNCATE TABLE messages RESTART IDENTITY CASCADE;
TRUNCATE TABLE matches RESTART IDENTITY CASCADE;
TRUNCATE TABLE "ProfileInterest" RESTART IDENTITY CASCADE;

-- 3. Drop old id column and add new uuid id to profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE profiles DROP COLUMN id;
ALTER TABLE profiles ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();

-- 4. Update referencing tables to use uuid for foreign keys
ALTER TABLE messages DROP COLUMN receiver_id;
ALTER TABLE messages ADD COLUMN receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE messages DROP COLUMN sender_id;
ALTER TABLE messages ADD COLUMN sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE matches DROP COLUMN target_id;
ALTER TABLE matches ADD COLUMN target_id uuid REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE matches DROP COLUMN user_id;
ALTER TABLE matches ADD COLUMN user_id uuid REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE "ProfileInterest" DROP COLUMN "profileId";
ALTER TABLE "ProfileInterest" ADD COLUMN "profileId" uuid REFERENCES profiles(id) ON DELETE CASCADE;

-- 5. (Optional) Add indexes for new uuid columns if needed
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_matches_target_id ON matches(target_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_profileinterest_profileid ON "ProfileInterest"("profileId");
