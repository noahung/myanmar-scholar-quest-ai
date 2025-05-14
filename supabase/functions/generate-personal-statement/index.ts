
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
    }

    const { 
      scholarship, 
      academicGoals, 
      careerGoals,
      personalStory,
      achievements,
      challenges,
      values,
      strengths 
    } = await req.json();

    // Building the prompt for OpenAI
    const systemPrompt = `You are an expert personal statement coach and writer, specialising in helping students craft compelling, authentic, and scholarship-winning personal statements. Create a well-structured, persuasive, and polished personal statement draft of approximately 800 words that follows best practices in narrative writing, tone, and clarity. Understand the expectations of scholarship committees and help students stand out by highlighting their unique stories, values, challenges, goals, and achievements.`;
    
    // Create user prompt from provided information
    const userPrompt = `Please write a compelling personal statement for a scholarship application based on the following information:

Scholarship: ${scholarship || "Not specified"}
Academic Goals: ${academicGoals || "Not specified"}
Career Goals: ${careerGoals || "Not specified"}
Personal Story/Motivation: ${personalStory || "Not specified"}
Achievements/Extracurriculars: ${achievements || "Not specified"}
Challenges Overcome: ${challenges || "Not specified"}
Values/Qualities: ${values || "Not specified"}
Strengths as a Candidate: ${strengths || "Not specified"}

The personal statement should:
- Be around 800 words
- Have a compelling introduction that hooks the reader
- Tell a coherent story that connects my background to my goals
- Highlight my unique strengths and achievements
- Address any challenges I've overcome
- Explain why I'm a strong fit for this scholarship
- End with a strong conclusion that reinforces my main message

Please write in first person perspective and make it sound natural and authentic.`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const openAIData = await openAIResponse.json();
    
    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', openAIData);
      throw new Error('Failed to generate personal statement');
    }

    const personalStatement = openAIData.choices[0]?.message?.content || 'Failed to generate personal statement';

    return new Response(
      JSON.stringify({ personalStatement }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-personal-statement function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
