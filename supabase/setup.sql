-- Create tables for the portfolio admin panel

-- Hero section table
CREATE TABLE IF NOT EXISTS hero (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  email TEXT NOT NULL,
  github TEXT,
  linkedin TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About section table
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  summary TEXT NOT NULL,
  experience TEXT NOT NULL,
  projects TEXT NOT NULL,
  clients TEXT NOT NULL,
  technologies TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] NOT NULL,
  technologies TEXT[] NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  university TEXT NOT NULL,
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  gpa TEXT,
  description TEXT NOT NULL,
  achievements TEXT[] NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tech TEXT[] NOT NULL,
  github TEXT,
  live TEXT,
  featured BOOLEAN DEFAULT FALSE,
  image TEXT,
  screenshots TEXT[],
  role TEXT NOT NULL,
  contributions TEXT[] NOT NULL,
  analytics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  banner_image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  published_at DATE,
  read_time INTEGER NOT NULL,
  author TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile image table
CREATE TABLE IF NOT EXISTS profile_image (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT NOT NULL,
  alt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume table
CREATE TABLE IF NOT EXISTS resume (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file TEXT NOT NULL,
  filename TEXT NOT NULL,
  last_updated DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_image ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (you can modify these based on your needs)
CREATE POLICY "Enable read access for all users" ON hero FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON hero FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON hero FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON hero FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat for other tables...
CREATE POLICY "Enable read access for all users" ON about FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON about FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON about FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON about FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO hero (name, title, description, email) 
VALUES ('Victory Johnson', 'Full-Stack Software Engineer', 'Crafting exceptional digital experiences with 4+ years of expertise in full-stack development, no-code solutions, and modern web technologies.', 'victory@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO about (summary, experience, projects, clients, technologies) 
VALUES ('I''m a passionate full-stack software engineer with over 4 years of experience building scalable web applications and innovative digital solutions.', '4+', '50+', '25+', '20+')
ON CONFLICT DO NOTHING; 