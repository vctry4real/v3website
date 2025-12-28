-- Fix projects table array columns
-- Ensure tags and tech columns exist and have proper default values

-- Add tags column if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add tech column if it doesn't exist  
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech text[] DEFAULT '{}';

-- Add screenshots column if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots text[] DEFAULT '{}';

-- Add contributions column if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contributions text[] DEFAULT '{}';

-- Update any existing records that have NULL values for these arrays
UPDATE projects SET tags = '{}' WHERE tags IS NULL;
UPDATE projects SET tech = '{}' WHERE tech IS NULL;
UPDATE projects SET screenshots = '{}' WHERE screenshots IS NULL;
UPDATE projects SET contributions = '{}' WHERE contributions IS NULL;

-- Ensure category constraint is correct
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;
ALTER TABLE projects ADD CONSTRAINT projects_category_check 
  CHECK (category IN ('fullstack', 'backend', 'frontend'));

-- Update any existing invalid categories to 'fullstack'
UPDATE projects SET category = 'fullstack' 
WHERE category NOT IN ('fullstack', 'backend', 'frontend');
