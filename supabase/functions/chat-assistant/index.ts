
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    // Get OpenAI API key from environment variables
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get request body
    const { message, userId, scholarshipId } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log("Processing message:", message);
    console.log("User ID:", userId);
    console.log("Scholarship ID:", scholarshipId);
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Prepare context for the AI assistant
    let context = "You are a helpful assistant for Scholar-M, a platform that helps students from Myanmar find international scholarships. ";
    
    // If there's a scholarship ID, fetch scholarship details to provide context
    if (scholarshipId) {
      try {
        // Try to get scholarship data from local data for now
        // This would normally come from Supabase, but we'll simulate it
        context += `The user is currently viewing a scholarship. Answer their questions about scholarship application processes, requirements, and provide helpful advice.`;
      } catch (error) {
        console.error("Error fetching scholarship:", error);
      }
    } else {
      context += "Answer questions about scholarships, application processes, and studying abroad. Be informative and supportive.";
    }
    
    // Prepare messages for OpenAI API
    const messages = [
      {
        role: "system",
        content: context
      },
      {
        role: "user",
        content: message
      }
    ];
    
    // Call OpenAI API
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
      })
    });
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const openAIData = await openAIResponse.json();
    const aiResponse = openAIData.choices[0].message.content;
    
    console.log("AI Response:", aiResponse);
    
    // Store the conversation in the database if a user ID is provided
    if (userId) {
      try {
        const { error } = await supabase
          .from('ai_chat_history')
          .insert({
            user_id: userId,
            message: message,
            response: aiResponse
          });
          
        if (error) {
          console.error("Error storing conversation:", error);
        }
      } catch (error) {
        console.error("Error with Supabase client:", error);
      }
    }
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error("Error in chat-assistant function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
