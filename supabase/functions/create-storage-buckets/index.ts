
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Create images bucket
    const createImagesBucket = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'images',
        name: 'images',
        public: true,
      }),
    });

    const imagesResponse = await createImagesBucket.json();

    // Create public policy for the images bucket
    const createImagesPolicy = await fetch(`${supabaseUrl}/storage/v1/bucket/images/policy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Public Access',
        definition: {
          "buckets": ["images"],
          "operations": ["select", "insert", "update", "delete"],
          "resources": ["*"]
        }
      }),
    });

    const policyResponse = await createImagesPolicy.json();

    return new Response(
      JSON.stringify({ 
        message: 'Storage buckets created successfully', 
        images: imagesResponse, 
        policy: policyResponse 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating storage buckets:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
