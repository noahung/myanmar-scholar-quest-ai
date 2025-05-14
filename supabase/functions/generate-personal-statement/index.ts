
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PersonalStatementData {
  scholarship: string;
  academicGoals: string;
  careerGoals: string;
  personalStory: string;
  achievements: string;
  challenges: string;
  values: string;
  strengths: string;
}

const generatePersonalStatement = async (data: PersonalStatementData): Promise<string> => {
  try {
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openAIApiKey) {
      throw new Error("Missing OpenAI API Key");
    }

    const systemPrompt = `
You are an expert personal statement coach and writer, specialising in helping students craft compelling, authentic, and scholarship-winning personal statements. Use the information provided to generate a well-structured, persuasive, and polished statement. Follow best practices in narrative writing, tone, and clarity. You understand the expectations of scholarship committees and help students stand out by highlighting their unique stories, values, challenges, goals, and achievements. The statement should be between 500-800 words.
    `;

    const userPrompt = `
Please write a scholarship personal statement using the following information:

Scholarship: ${data.scholarship || "Not specified"}
Academic Goals: ${data.academicGoals || "Not specified"}
Career Goals: ${data.careerGoals || "Not specified"}
Personal Story/Motivation: ${data.personalStory || "Not specified"}
Achievements/Extracurriculars: ${data.achievements || "Not specified"}
Challenges Overcome: ${data.challenges || "Not specified"}
Values/Qualities: ${data.values || "Not specified"}
Strengths/Why They're a Strong Candidate: ${data.strengths || "Not specified"}

The statement should be compelling, authentic, and persuasive. The tone should be confident but humble, and it should follow a logical flow from motivation to achievements to goals. Include a strong introduction, a detailed body that connects personal experiences to academic/career goals, and a conclusive ending that reinforces suitability for the scholarship.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", result);
      throw new Error(`OpenAI API error: ${result.error?.message || "Unknown error"}`);
    }

    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error generating personal statement:", error);
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data: PersonalStatementData = await req.json();
    
    // Validate minimal required fields
    if (!data.scholarship || !data.academicGoals || !data.personalStory) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const personalStatement = await generatePersonalStatement(data);

    return new Response(
      JSON.stringify({
        personalStatement,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
