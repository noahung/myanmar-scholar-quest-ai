
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Globe, 
  GraduationCap, 
  FileText, 
  Link as LinkIcon, 
  Calendar as CalendarIcon,
  MessageSquare
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AiAssistant } from "@/components/ai-assistant";
import { UserNotes } from "@/components/user-notes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { scholarships } from "@/data/scholarships";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { SavedScholarshipButton } from "@/components/saved-scholarship-button";

export type Scholarship = {
  id: string;
  title: string;
  institution: string;
  country: string;
  deadline: string;
  level: string;
  fields: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  application_url: string;
  source_url?: string;
  featured?: boolean;
};

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchScholarship() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Try to fetch from Supabase first
        // Access the scholarships table if it exists
        try {
          const { data: supabaseScholarship, error: supabaseError } = await supabase
            .from('scholarships')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (supabaseScholarship) {
            setScholarship(supabaseScholarship as Scholarship);
            return;
          }
        } catch (err) {
          console.error("Error fetching from Supabase, using local data instead:", err);
        }
        
        // Fall back to local data
        const localScholarship = scholarships.find(s => s.id === id);
            
        if (localScholarship) {
          setScholarship(localScholarship);
        } else {
          setError("Scholarship not found");
        }
      } catch (err: any) {
        console.error("Failed to load scholarship:", err);
        setError(err.message || "Failed to load scholarship data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchScholarship();
  }, [id]);

  if (loading) {
    return <ScholarshipDetailSkeleton />;
  }

  if (error || !scholarship) {
    return (
      <div className="container py-12 flex flex-col items-center">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Scholarship not found"}</p>
          <Button asChild>
            <Link to="/scholarships">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scholarships
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format deadline date
  const deadlineDate = new Date(scholarship.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Check if deadline has passed
  const deadlinePassed = deadlineDate < new Date();

  const handleAiButtonClick = () => {
    setActiveTab("ai-assistant");
    // Find the AI tab and click it
    document.getElementById('ai-tab')?.click();
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/scholarships">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scholarships
            </Link>
          </Button>
        </div>

        {/* Scholarship header */}
        <h1 className="text-3xl font-bold tracking-tighter mb-4">{scholarship.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-myanmar-jade hover:bg-myanmar-jade/90">{scholarship.level}</Badge>
          <Badge variant="outline">{scholarship.country}</Badge>
          {scholarship.featured && <Badge variant="secondary">Featured</Badge>}
          {deadlinePassed && <Badge variant="destructive">Deadline Passed</Badge>}
          {isAdmin && (
            <Link to="/admin">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Edit in Admin
              </Badge>
            </Link>
          )}
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full mb-8"
        >
          <TabsList className="w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="ai-assistant" id="ai-tab">AI Assistant</TabsTrigger>
            <TabsTrigger value="my-notes">My Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            {/* Key information card */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-semibold">Key Information</h2>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-myanmar-jade mt-0.5" />
                  <div>
                    <p className="font-medium">Institution</p>
                    <p className="text-sm text-muted-foreground">{scholarship.institution}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarIcon className="h-5 w-5 text-myanmar-jade mt-0.5" />
                  <div>
                    <p className="font-medium">Application Deadline</p>
                    <p className="text-sm text-muted-foreground">{formattedDeadline}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GraduationCap className="h-5 w-5 text-myanmar-jade mt-0.5" />
                  <div>
                    <p className="font-medium">Degree Level</p>
                    <p className="text-sm text-muted-foreground">{scholarship.level}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-myanmar-jade mt-0.5" />
                  <div>
                    <p className="font-medium">Fields of Study</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {scholarship.fields.map((field, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{scholarship.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Benefits</h2>
              <ul className="space-y-2 list-disc pl-5">
                {scholarship.benefits.map((benefit, index) => (
                  <li key={index} className="text-muted-foreground">{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Eligibility Requirements</h2>
              <ul className="space-y-2 list-disc pl-5">
                {scholarship.requirements.map((requirement, index) => (
                  <li key={index} className="text-muted-foreground">{requirement}</li>
                ))}
              </ul>
            </div>

            {/* Application button and AI chat */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <a href={scholarship.application_url} target="_blank" rel="noopener noreferrer">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Apply Now
                </a>
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleAiButtonClick}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI About This Scholarship
              </Button>

              <SavedScholarshipButton 
                scholarshipId={scholarship.id}
                size="lg"
              />
            </div>

            {/* Show original source */}
            {scholarship.source_url && (
              <div className="mt-4 text-center">
                <a 
                  href={scholarship.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  View original source
                </a>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-assistant" className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Scholarship Assistant</h2>
                <p className="text-sm text-muted-foreground">Ask any questions about this scholarship</p>
              </CardHeader>
              <CardContent className="h-[500px]">
                <AiAssistant 
                  scholarshipId={scholarship.id}
                  isScholarshipAssistant={true}
                  initialMessage={`Tell me more about the ${scholarship.title} scholarship.`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-notes" className="mt-6">
            <UserNotes scholarshipId={scholarship.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ScholarshipDetailSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Skeleton className="h-12 w-3/4 mb-4" />
        
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>

        <Skeleton className="h-64 w-full mb-8" />
        
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-24 w-full mb-8" />
        
        <Skeleton className="h-1 w-full my-6" />
        
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-2 mb-8">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-2 mb-8">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-12 w-36" />
        </div>
      </div>
    </div>
  );
}
