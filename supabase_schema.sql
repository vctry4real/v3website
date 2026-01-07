-- 1. Add 'likes_count' column to blog_posts if it doesn't exist
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- 2. Create 'comments' table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Public Access

-- Policy: Anyone can read comments
CREATE POLICY "Public comments are viewable by everyone" 
ON comments FOR SELECT 
USING (true);

-- Policy: Anyone can insert comments (Guest posting)
CREATE POLICY "Anyone can insert comments" 
ON comments FOR INSERT 
WITH CHECK (true);

-- 5. RPC function to safely increment likes (prevents race conditions)
-- Run this in the SQL editor as well
CREATE OR REPLACE FUNCTION increment_likes(post_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET likes_count = likes_count + 1
  WHERE slug = post_slug;
END;
$$;
