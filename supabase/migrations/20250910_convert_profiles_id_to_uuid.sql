-- Migration: Convert profiles.id from text to uuid

-- 1. Add a new uuid column
ALTER TABLE profiles ADD COLUMN id_uuid uuid;

-- 2. Populate the new column with generated UUIDs (if you want to keep existing users, otherwise skip this step for a clean slate)
UPDATE profiles SET id_uuid = gen_random_uuid();

-- 3. If you have foreign keys referencing profiles.id, drop them first (handle in dependent tables)
-- (You may need to update other tables to reference id_uuid instead of id)

-- 4. Drop the old id column and rename id_uuid to id
ALTER TABLE profiles DROP COLUMN id;
ALTER TABLE profiles RENAME COLUMN id_uuid TO id;

-- 5. Set the new id column as PRIMARY KEY
ALTER TABLE profiles ADD PRIMARY KEY (id);

-- 6. (Optional) Update all references in other tables to use uuid type and reference profiles(id)
-- This step must be done for all foreign keys referencing profiles.id
