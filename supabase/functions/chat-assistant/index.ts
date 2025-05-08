
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
        // Get the scholarship details from the previous chat context or from a database
        context += `The user is currently viewing a scholarship with ID ${scholarshipId}. Answer their questions about scholarship application processes, requirements, and provide helpful advice. Take the role of a knowledgeable scholarship advisor who has helped many Myanmar students successfully apply for international scholarships. Be detailed in your responses, but keep a conversational tone. If asked about specific scholarship details that you don't have, suggest where they might find that information on the scholarship website.`;
        
        // For scholarships stored locally, we could add some generic information
        context += `\n\nSome general scholarship advice:\n
        1. Always check eligibility requirements carefully before applying
        2. Pay attention to deadlines and prepare documents well in advance
        3. Take time to craft a strong personal statement that shows your passion and goals
        4. Request recommendation letters from professors or employers who know you well
        5. Research the institution and program thoroughly before applying`;
      } catch (error) {
        console.error("Error preparing scholarship context:", error);
      }
    } else {
      context += "Answer questions about scholarships, application processes, and studying abroad. Be informative and supportive. Use a friendly, helpful tone, and provide detailed responses that would be useful for students from Myanmar looking to study abroad.";
    }
    
    // Get chat history if user is logged in
    let chatHistory = [];
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('ai_chat_history')
          .select('message, response')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(5);
        
        if (!error && data) {
          chatHistory = data;
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    }
    
    // Prepare messages for OpenAI API
    const messages = [
      {
        role: "system",
        content: context
      }
    ];
    
    // Add previous messages from chat history
    chatHistory.forEach(item => {
      messages.push({
        role: "user",
        content: item.message
      });
      messages.push({
        role: "assistant",
        content: item.response
      });
    });
    
    // Add current message
    messages.push({
      role: "user",
      content: message
    });
    
    console.log("Sending messages to OpenAI:", messages);
    
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
            response: aiResponse,
            scholarship_id: scholarshipId || null
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
