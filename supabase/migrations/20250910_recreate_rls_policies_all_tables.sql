-- PROFILES (FIXED: uses user_id instead of id, added INSERT policy)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Allow user to select own profile" ON profiles
  FOR SELECT USING (auth.uid()::uuid = user_id);
CREATE POLICY "Allow user to update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "Allow user to delete own profile" ON profiles
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- SWIPES (Correct)
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to insert own swipe" ON swipes
  FOR INSERT WITH CHECK (auth.uid()::uuid = "userId");
CREATE POLICY "Allow user to select own swipes" ON swipes
  FOR SELECT USING (auth.uid()::uuid = "userId");
CREATE POLICY "Allow user to delete own swipes" ON swipes
  FOR DELETE USING (auth.uid()::uuid = "userId");

-- MATCHES (Correct)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to select own matches" ON matches
  FOR SELECT USING (auth.uid()::uuid = "user1Id" OR auth.uid()::uuid = "user2Id");
CREATE POLICY "Allow user to insert own matches" ON matches
  FOR INSERT WITH CHECK (auth.uid()::uuid = "user1Id" OR auth.uid()::uuid = "user2Id");
CREATE POLICY "Allow user to delete own matches" ON matches
  FOR DELETE USING (auth.uid()::uuid = "user1Id" OR auth.uid()::uuid = "user2Id");

-- MESSAGES (FIXED: table name is 'messages', not 'message')
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to select own messages" ON messages
  FOR SELECT USING (auth.uid()::uuid = "senderId" OR auth.uid()::uuid = "receiverId");
CREATE POLICY "Allow user to insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid()::uuid = "senderId");
CREATE POLICY "Allow user to delete own messages" ON messages
  FOR DELETE USING (auth.uid()::uuid = "senderId");