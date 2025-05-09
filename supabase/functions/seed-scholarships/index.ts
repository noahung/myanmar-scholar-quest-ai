
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
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Scholarship data
    const scholarships = [
      {
        title: "MEXT Scholarship for Graduate Studies",
        institution: "Japanese Government (Monbukagakusho)",
        country: "Japan",
        deadline: "2025-05-20",
        level: "Masters",
        fields: ["All Fields", "Engineering", "Social Sciences", "Natural Sciences"],
        description: "The Ministry of Education, Culture, Sports, Science, and Technology (MEXT) offers scholarships to international students who wish to study at Japanese universities as research students (graduate students) under the Japanese Government Scholarship Program.",
        requirements: [
          "Must be under 35 years of age",
          "Must have completed at least 16 years of education",
          "Have excellent academic records",
          "Willingness to learn Japanese language",
          "Good health condition",
          "Not having received a Japanese Government Scholarship in the past"
        ],
        benefits: [
          "Full tuition coverage",
          "Monthly stipend of 143,000 yen (approx. 1,300 USD)",
          "Round-trip air ticket",
          "Exemption from entrance examination fees",
          "Six-month Japanese language training"
        ],
        application_url: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-research.html",
        source_url: "https://www.studyinjapan.go.jp/en/",
        featured: true
      },
      {
        title: "Fulbright Foreign Student Program",
        institution: "U.S. Department of State",
        country: "United States",
        deadline: "2025-06-15",
        level: "Masters",
        fields: ["All Fields", "Public Health", "Environmental Studies", "Education"],
        description: "The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from Myanmar to study and conduct research in the United States. The Fulbright program operates in more than 160 countries worldwide and has provided approximately 390,000 participants the opportunity to study, teach, or conduct research.",
        requirements: [
          "Myanmar citizenship",
          "Bachelor's degree or equivalent",
          "Proficiency in English (TOEFL score of at least 90 iBT)",
          "Demonstrated leadership and community involvement",
          "Clear research or study objectives"
        ],
        benefits: [
          "Full tuition coverage",
          "Monthly stipend for living expenses",
          "Health insurance coverage",
          "Round-trip airfare",
          "Opportunities for cultural exchange activities"
        ],
        application_url: "https://foreign.fulbrightonline.org/",
        source_url: "https://mm.usembassy.gov/education-culture/fulbright-program/",
        featured: true
      },
      {
        title: "Australia Awards Scholarships",
        institution: "Australian Government",
        country: "Australia",
        deadline: "2025-04-30",
        level: "Masters",
        fields: ["Agriculture", "Governance", "Health", "Infrastructure", "Education"],
        description: "Australia Awards Scholarships (AAS) are prestigious international awards offered by the Australian Government to the next generation of global leaders for development. Through study and research, recipients develop the skills and knowledge to drive change and help build enduring people-to-people links with Australia.",
        requirements: [
          "Myanmar citizenship",
          "Not hold Australian or New Zealand citizenship or permanent residency",
          "Bachelor's degree with at least 2 years work experience",
          "Not applying for a visa to live in Australia",
          "Return to Myanmar for at least 2 years after completing studies"
        ],
        benefits: [
          "Full tuition fees",
          "Return air travel",
          "Establishment allowance",
          "Contribution to living expenses",
          "Overseas Student Health Cover",
          "Pre-course English training"
        ],
        application_url: "https://australiaawardsmyanmar.org/",
        source_url: "https://www.dfat.gov.au/people-to-people/australia-awards/Pages/australia-awards-scholarships",
        featured: false
      },
      {
        title: "Chevening Scholarships",
        institution: "UK Government",
        country: "United Kingdom",
        deadline: "2025-11-01",
        level: "Masters",
        fields: ["All Fields", "Politics", "Law", "Business", "Media"],
        description: "Chevening is the UK government's international awards program aimed at developing global leaders. Funded by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations, Chevening offers one-year master's degree scholarships at UK universities to emerging leaders from Myanmar and around the world.",
        requirements: [
          "Myanmar citizenship",
          "Bachelors degree (equivalent to UK 2:1)",
          "2+ years work experience",
          "Meet English language requirements",
          "Return to Myanmar for at least 2 years after graduation",
          "Apply to three different eligible UK university courses"
        ],
        benefits: [
          "Full tuition fees",
          "Monthly stipend",
          "Travel costs (to and from UK)",
          "Arrival allowance",
          "Homeward departure allowance",
          "Cost of one visa application"
        ],
        application_url: "https://www.chevening.org/",
        source_url: "https://www.chevening.org/scholarship/myanmar/",
        featured: true
      },
      {
        title: "DAAD Development-Related Postgraduate Courses",
        institution: "German Academic Exchange Service",
        country: "Germany",
        deadline: "2025-09-15",
        level: "Masters",
        fields: ["Economic Sciences", "Development Cooperation", "Engineering", "Environmental Sciences"],
        description: "The German Academic Exchange Service (DAAD) offers scholarships for development-related postgraduate courses. These scholarships aim to qualify future leaders from developing countries through high-quality academic training that prepares students for professional career within the field of sustainable development.",
        requirements: [
          "Bachelor's degree with above average results",
          "At least 2 years of professional experience",
          "Language proficiency (English/German depending on the course)",
          "Not living in Germany for more than 15 months at the time of application"
        ],
        benefits: [
          "Full tuition coverage",
          "Monthly stipend of 850-1,000 EUR",
          "Travel and health insurance allowance",
          "Study and research subsidies",
          "Rent subsidies (where applicable)",
          "Family allowances (where applicable)"
        ],
        application_url: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
        source_url: "https://www2.daad.de/medien/der-daad/unsere-aufgaben/entwicklungszusammenarbeit/pdfs/daad_programmbroschuere_entwicklungsbezogene_postgraduiertenstudiengaenge.pdf",
        featured: false
      }
    ];
    
    // Insert scholarships into database
    const { data, error } = await supabase.from('scholarships').upsert(scholarships);
    
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ message: "Successfully seeded scholarships", count: scholarships.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error("Error seeding scholarships:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
