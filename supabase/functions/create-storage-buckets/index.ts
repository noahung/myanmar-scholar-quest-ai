
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase client');
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create storage buckets
    const buckets = [
      { name: 'profile_images', public: true },
      { name: 'post_images', public: true },
      { name: 'guide_images', public: true },
    ];
    
    const results = [];
    
    for (const bucket of buckets) {
      try {
        // First check if bucket exists
        const { data: existingBucket, error: getBucketError } = await supabase
          .storage
          .getBucket(bucket.name);
        
        if (getBucketError && getBucketError.message.includes('not found')) {
          // Bucket doesn't exist, create it
          const { data, error } = await supabase.storage.createBucket(bucket.name, {
            public: bucket.public,
          });
          
          if (error) {
            results.push({ bucket: bucket.name, status: 'error', message: error.message });
          } else {
            results.push({ bucket: bucket.name, status: 'created' });
          }
        } else {
          // Bucket exists
          results.push({ bucket: bucket.name, status: 'already exists' });
        }
      } catch (error) {
        results.push({ bucket: bucket.name, status: 'error', message: error.message });
      }
    }
    
    return new Response(
      JSON.stringify({ message: "Storage buckets configuration complete", results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
