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

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  userId?: string;
  scholarshipId?: string;
  conversationContext?: Message[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, scholarshipId, conversationContext = [] }: RequestBody = await req.json();
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

    // Set up the system message
    const systemMessage = scholarshipDetails ? 
      `You are a helpful scholarship assistant for the "${scholarshipDetails.title}" scholarship.\n\n- Always reply in Markdown format for clear, well-structured, and visually appealing answers (use headings, bullet points, bold, italics, etc.).\n- If the user writes in Burmese, always reply in natural, fluent Burmese. If the user writes in English, reply in English.\n\nHere are the details of this scholarship:\n\n**Title:** ${scholarshipDetails.title}  \n**Institution:** ${scholarshipDetails.institution}  \n**Country:** ${scholarshipDetails.country}  \n**Deadline:** ${scholarshipDetails.deadline}  \n**Level:** ${scholarshipDetails.level}  \n**Fields of Study:** ${scholarshipDetails.fields?.join(', ')}\n\n**Description:**\n${scholarshipDetails.description}\n\n**Requirements:**\n${scholarshipDetails.requirements?.map(req => `- ${req}`).join('\n')}\n\n**Benefits:**\n${scholarshipDetails.benefits?.map(benefit => `- ${benefit}`).join('\n')}\n\n**Application URL:** ${scholarshipDetails.application_url}\n\nWhen answering questions, always use Markdown formatting for clarity. If you don't know something specific about this scholarship that isn't included in these details, be honest about not having that information.`
      :
      `You are a helpful assistant for Myanmar students looking for scholarships and educational opportunities. Always reply in Markdown format for clarity and structure. If the user writes in Burmese, always reply in natural, fluent Burmese. If the user writes in English, reply in English. Your name is Scholar-M Assistant. You should help them find educational opportunities, explain application requirements, and provide guidance on studying abroad. Be friendly, informative, and encourage users to pursue their educational goals.`;

    // Prepare messages array with conversation context
    const messages: Message[] = [
      { role: 'system', content: systemMessage },
      ...conversationContext,
      { role: 'user', content: message }
    ];

    // Retry mechanism for OpenAI API calls
    const maxRetries = 3;
    let retryCount = 0;
    let openAIResponse;
    let openAIData;

    while (retryCount < maxRetries) {
      try {
        openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini', // Updated to use GPT-4
            messages,
            max_tokens: 4000, // Increased token limit for longer responses
            temperature: 0.7,
          }),
        });

        openAIData = await openAIResponse.json();
        
        if (openAIResponse.ok) {
          break;
        }

        // If rate limited, wait before retrying
        if (openAIResponse.status === 429) {
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
          continue;
        }

        throw new Error(`OpenAI API error: ${openAIData.error?.message || 'Unknown error'}`);
      } catch (error) {
        if (retryCount === maxRetries - 1) {
          throw error;
        }
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }
    
    if (!openAIResponse.ok) {
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

    // Return both the response and the updated conversation context
    return new Response(
      JSON.stringify({
        response,
        conversationContext: [...conversationContext, 
          { role: 'user', content: message },
          { role: 'assistant', content: response }
        ].slice(-10) // Keep last 10 messages for context
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
