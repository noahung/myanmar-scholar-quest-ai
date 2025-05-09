
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
    const { message, userId, scholarshipId } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get scholarship details if scholarshipId is provided
    let scholarshipDetails = null;
    if (scholarshipId) {
      try {
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .eq('id', scholarshipId)
          .maybeSingle();
          
        if (!error && data) {
          scholarshipDetails = data;
        }
      } catch (err) {
        console.error("Error fetching scholarship details:", err);
      }
    }

    // Set up the messages for OpenAI
    const systemMessage = scholarshipDetails ? 
      `You are a helpful scholarship assistant for the "${scholarshipDetails.title}" scholarship. Here are the details of this scholarship:
      
      Title: ${scholarshipDetails.title}
      Institution: ${scholarshipDetails.institution}
      Country: ${scholarshipDetails.country}
      Deadline: ${scholarshipDetails.deadline}
      Level: ${scholarshipDetails.level}
      Fields of Study: ${scholarshipDetails.fields?.join(', ')}
      
      Description: ${scholarshipDetails.description}
      
      Requirements:
      ${scholarshipDetails.requirements?.map(req => `- ${req}`).join('\n')}
      
      Benefits:
      ${scholarshipDetails.benefits?.map(benefit => `- ${benefit}`).join('\n')}
      
      Application URL: ${scholarshipDetails.application_url}
      
      When answering questions, provide specific information about this scholarship based on the details above. If you don't know something specific about this scholarship that isn't included in these details, be honest about not having that information.`
      :
      `You are a helpful assistant for Myanmar students looking for scholarships and educational opportunities. Your name is Scholar-M Assistant. You should help them find educational opportunities, explain application requirements, and provide guidance on studying abroad. You can respond in either English or Burmese (Myanmar language), matching the language the user uses. Be friendly, informative, and encourage users to pursue their educational goals.`;

    // Call OpenAI for a response
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const openAIData = await openAIResponse.json();
    
    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', openAIData);
      throw new Error(`OpenAI API error: ${openAIData.error?.message || 'Unknown error'}`);
    }
    
    const response = openAIData.choices[0].message.content;

    // Store the conversation in the database if userId is provided
    if (userId) {
      try {
        await supabase.from('ai_chat_history').insert({
          user_id: userId,
          message,
          response,
          scholarship_id: scholarshipId || null
        });
      } catch (error) {
        console.error('Error saving chat history:', error);
        // Continue even if saving fails
      }
    }

    return new Response(
      JSON.stringify({
        response,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
