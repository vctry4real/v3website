-- Update existing projects to use new categories
-- This migration updates any old category values to the new fullstack/backend/frontend categories

-- First, let's see what categories currently exist
SELECT DISTINCT category FROM projects;

-- Update any old categories to new ones
-- You may need to manually review and update these based on your actual data
UPDATE projects 
SET category = 'fullstack' 
WHERE category NOT IN ('fullstack', 'backend', 'frontend') 
   OR category IS NULL;

-- Ensure all projects have tags array (even if empty)
UPDATE projects 
SET tags = '{}' 
WHERE tags IS NULL;

-- Ensure all projects have tech array (even if empty)
UPDATE projects 
SET tech = '{}' 
WHERE tech IS NULL;

-- Ensure all projects have contributions array (even if empty)
UPDATE projects 
SET contributions = '{}' 
WHERE contributions IS NULL;

-- Ensure all projects have screenshots array (even if empty)
UPDATE projects 
SET screenshots = '{}' 
WHERE screenshots IS NULL; 