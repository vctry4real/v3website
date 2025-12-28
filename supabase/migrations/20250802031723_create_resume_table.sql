-- Create resume table if it doesn't exist
CREATE TABLE IF NOT EXISTS resume (
  id SERIAL PRIMARY KEY,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now)
CREATE POLICY "Allow all operations on resume" ON resume
  FOR ALL USING (true);

-- Insert default resume record if table is empty
INSERT INTO resume (file_url, file_name)
SELECT 
  'https://example.com/resume.pdf',
  'Victory_Johnson_Resume.pdf'
WHERE NOT EXISTS (SELECT 1 FROM resume);

-- Grant necessary permissions
GRANT ALL ON resume TO authenticated;
GRANT ALL ON resume TO anon;
GRANT USAGE, SELECT ON SEQUENCE resume_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE resume_id_seq TO anon;
