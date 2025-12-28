export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test database connection
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: 'Missing Supabase credentials',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test resume table
    const { data, error } = await supabase
      .from('resume')
      .select('*')
      .limit(1);

    if (error) {
      return res.status(500).json({ 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }

    return res.status(200).json({ 
      success: true,
      data: data,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Resume test error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}
