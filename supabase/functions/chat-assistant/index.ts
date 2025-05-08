
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Required for OpenAI SDK in Deno

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ScholarshipContext = {
  id: string;
  title: string;
  country: string;
  institution: string;
  deadline: string;
  level: string;
  description: string;
  benefits: string[];
  requirements: string[];
  applicationUrl: string;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, scholarshipId } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const client = Deno.env.get("SUPABASE_URL") || "";
    const key = Deno.env.get("SUPABASE_ANON_KEY") || "";

    // Get scholarship context if scholarshipId is provided
    let scholarshipContext = null;
    if (scholarshipId) {
      const supabaseResponse = await fetch(`${client}/rest/v1/scholarships?id=eq.${scholarshipId}&select=*`, {
        headers: {
          "Content-Type": "application/json",
          "apikey": key,
          "Authorization": `Bearer ${key}`
        }
      });
      
      const scholarships = await supabaseResponse.json();
      if (scholarships && scholarships.length > 0) {
        scholarshipContext = scholarships[0];
      }
    }

    // Build system message
    let systemMessage = "You are a helpful assistant for Myanmar students seeking scholarships abroad. Provide accurate, helpful information about scholarship opportunities, application processes, and studying abroad. Be concise, friendly and always try to provide actionable advice.";
    
    if (scholarshipContext) {
      systemMessage += `\n\nYou are currently answering questions about the following scholarship:\n
      Scholarship: ${scholarshipContext.title}
      Country: ${scholarshipContext.country}
      Institution: ${scholarshipContext.institution}
      Deadline: ${scholarshipContext.deadline}
      Level: ${scholarshipContext.level}
      Description: ${scholarshipContext.description}
      Benefits: ${scholarshipContext.benefits.join(', ')}
      Requirements: ${scholarshipContext.requirements.join(', ')}
      Application URL: ${scholarshipContext.application_url}
      
      Use this information to provide precise answers about this specific scholarship.`;
    }
    
    // Get previous chat history if userId is provided
    let chatHistory = [];
    if (userId) {
      const historyResponse = await fetch(
        `${client}/rest/v1/ai_chat_history?user_id=eq.${userId}&order=created_at.asc&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        }
      );
      
      const history = await historyResponse.json();
      chatHistory = history.map(item => [
        { role: "user", content: item.message },
        { role: "assistant", content: item.response }
      ]).flat();
    }
    
    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: systemMessage },
      ...chatHistory,
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save the message and response to the database if userId is provided
    if (userId) {
      await fetch(`${client}/rest/v1/ai_chat_history`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "apikey": key,
          "Authorization": `Bearer ${key}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          user_id: userId,
          message: message,
          response: aiResponse
        })
      });
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
