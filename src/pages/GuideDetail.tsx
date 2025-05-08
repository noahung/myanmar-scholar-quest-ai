import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface GuideStep {
  title: string;
  content: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  country: string;
  image: string;
  steps: number;
  steps_content?: GuideStep[];
}

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This will be replaced with a Supabase query
    // For now, we're simulating an API call
    setLoading(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      // Mock data for development - will be replaced with actual data from Supabase
      const mockGuide = {
        id: "1",
        title: "Complete Guide to Applying for Japanese Scholarships",
        description: "A step-by-step approach to finding and applying for scholarships in Japan, with specific tips for MEXT, JICA, and university-specific programs.",
        category: "Application Process",
        country: "Japan",
        image: "/placeholder.svg",
        steps: 8,
        steps_content: [
          {
            title: "Research Available Scholarships",
            content: "Start by researching the various scholarship options available for Myanmar students in Japan. The main government scholarships are MEXT (Ministry of Education), JICA, and university-specific scholarships. Each has different eligibility requirements, application periods, and coverage. MEXT scholarships are generally announced in April with applications due in May/June. JICA scholarships often have rolling deadlines depending on the specific program."
          },
          {
            title: "Check Eligibility Requirements",
            content: "Carefully review the eligibility criteria for each scholarship you're interested in. Common requirements for Japanese scholarships include age limits (typically under 35), academic performance (GPA of at least 2.3 on the MEXT scale, which is roughly 70-80% or higher in most grading systems), language proficiency (Japanese and/or English), and relevant work experience. Some scholarships may have specific requirements related to your field of study or career goals."
          },
          {
            title: "Prepare Required Documents",
            content: "Japanese scholarship applications typically require several documents: academic transcripts, certificates of graduation, research proposal or study plan, recommendation letters from professors or employers, certificate of language proficiency, and a medical certificate. For MEXT scholarships, you'll also need to fill out specific application forms provided by the Japanese embassy. Start collecting these documents early, as some may take time to obtain, particularly official transcripts and recommendation letters."
          },
          {
            title: "Write a Strong Research Proposal",
            content: "For graduate scholarships, a research proposal is crucial. It should clearly outline your research objectives, methodology, timeline, and expected outcomes. Connect your research interests to Japan specifically - explain why you need to study in Japan and how your research will benefit both countries. Be specific about potential supervisors at Japanese universities who work in your field. Your proposal should be well-structured, concise (typically 2-3 pages), and demonstrate the significance of your research."
          },
          {
            title: "Apply Through the Correct Channels",
            content: "MEXT scholarships are usually applied through the Japanese Embassy in Myanmar. University scholarships are applied directly to the university. JICA scholarships may have specific application procedures. Follow the instructions exactly as provided by the scholarship provider. Embassy applications typically involve submitting physical documents and attending in-person interviews if shortlisted."
          },
          {
            title: "Prepare for Screening Exams and Interviews",
            content: "Many Japanese scholarships require written examinations (testing subjects related to your field and/or Japanese language) and interviews. For MEXT, you'll typically take exams in English, mathematics, and possibly Japanese language. The interview will assess your motivation, communication skills, and knowledge of Japan and your field. Practice with sample questions and prepare to discuss your research proposal in detail."
          },
          {
            title: "Connect with Potential Supervisors",
            content: "For research and graduate scholarships, it's important to establish contact with potential academic supervisors in Japan. Search for professors working in your field of interest and email them with a brief introduction, your CV, and a summary of your research proposal. Explain why you're interested in working with them specifically. Having a professor agree to supervise you can significantly strengthen your application."
          },
          {
            title: "Prepare for Life in Japan",
            content: "Once accepted, prepare for your move to Japan. This includes applying for a student visa, arranging accommodation (university dormitories or private housing), and familiarizing yourself with Japanese culture and customs. Many scholarships provide pre-departure orientations. Basic Japanese language skills will be very helpful, even if your program is taught in English. Connect with Myanmar student associations in Japan for practical advice and support networks."
          }
        ]
      };

      if (id === "1") {
        setGuide(mockGuide);
      } else {
        setError("Guide not found");
      }
      
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return <GuideDetailSkeleton />;
  }

  if (error || !guide) {
    return (
      <div className="container py-12 flex flex-col items-center">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Guide not found"}</p>
          <Button asChild>
            <Link to="/guides">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guides
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/guides">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guides
            </Link>
          </Button>
        </div>

        {/* Guide header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline">{guide.category}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> {guide.country}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">{guide.title}</h1>
          <p className="text-muted-foreground mt-4">{guide.description}</p>
        </div>

        <Separator className="mb-8" />

        {/* Steps */}
        <div className="space-y-8">
          {guide.steps_content?.map((step, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-myanmar-jade text-white flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
              <div className="ml-11">
                <p className="text-muted-foreground">{step.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Button variant="outline" asChild disabled>
            <Link to="#">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Guide
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="#">
              Next Guide
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function GuideDetailSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col max-w-3xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-16 w-full" />
        </div>

        <Skeleton className="h-1 w-full mb-8" />

        <div className="space-y-8">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index}>
              <div className="flex items-center mb-2">
                <Skeleton className="w-8 h-8 rounded-full mr-3" />
                <Skeleton className="h-7 w-1/2" />
              </div>
              <div className="ml-11">
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
