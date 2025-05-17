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
        const { data: supabaseScholarship, error: supabaseError } = await supabase
          .from('scholarships')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (supabaseError) throw supabaseError;
        if (supabaseScholarship) {
          setScholarship({
            ...supabaseScholarship,
            fields: Array.isArray(supabaseScholarship.fields) ? supabaseScholarship.fields : [],
            benefits: Array.isArray(supabaseScholarship.benefits) ? supabaseScholarship.benefits : [],
            requirements: Array.isArray(supabaseScholarship.requirements) ? supabaseScholarship.requirements : [],
          });
        } else {
          setError("Scholarship not found");
        }
      } catch (err: any) {
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
          <Button variant="outline" asChild className="rounded-full border-myanmar-maroon text-myanmar-maroon font-bold">
            <Link to="/scholarships">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scholarships
            </Link>
          </Button>
        </div>

        {/* Scholarship header */}
        <h1 className="text-3xl font-bold tracking-tighter mb-4 text-myanmar-maroon">{scholarship.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="border-myanmar-gold text-myanmar-gold font-semibold">{scholarship.level}</Badge>
          <Badge variant="default" className="bg-myanmar-jade/80 text-white border-none">{scholarship.country}</Badge>
          {scholarship.featured && <Badge variant="secondary">Featured</Badge>}
          {deadlinePassed && <Badge variant="destructive">Deadline Passed</Badge>}
          {isAdmin && (
            <Link to="/admin">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Edit in Admin</Badge>
            </Link>
          )}
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full mb-8"
        >
          <TabsList className="w-full bg-myanmar-jade/10 rounded-xl p-1 flex gap-2">
            <TabsTrigger value="details" className="rounded-full px-6 py-2 font-semibold">Details</TabsTrigger>
            <TabsTrigger value="ai-assistant" id="ai-tab" className="rounded-full px-6 py-2 font-semibold">AI Assistant</TabsTrigger>
            <TabsTrigger value="my-notes" className="rounded-full px-6 py-2 font-semibold">My Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            {/* Key information card */}
            <Card className="mb-8 rounded-2xl shadow-lg border-0 bg-gradient-to-br from-myanmar-jade/10 via-white to-myanmar-gold/10">
              <CardHeader>
                <h2 className="text-xl font-semibold text-myanmar-maroon">Key Information</h2>
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
                        <Badge key={index} variant="outline" className="text-xs border-myanmar-gold text-myanmar-gold">
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
              <h2 className="text-xl font-semibold mb-4 text-myanmar-maroon">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{scholarship.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-myanmar-maroon">Benefits</h2>
              <ul className="space-y-2 list-disc pl-5">
                {scholarship.benefits.map((benefit, index) => (
                  <li key={index} className="text-muted-foreground">{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-myanmar-maroon">Eligibility Requirements</h2>
              <ul className="space-y-2 list-disc pl-5">
                {scholarship.requirements.map((requirement, index) => (
                  <li key={index} className="text-muted-foreground">{requirement}</li>
                ))}
              </ul>
            </div>

            {/* Application button and AI chat */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="rounded-full bg-myanmar-gold text-myanmar-maroon font-bold px-8 py-2 shadow hover:bg-myanmar-gold/90 transition-all">
                <a href={scholarship.application_url} target="_blank" rel="noopener noreferrer">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Apply Now
                </a>
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full border-myanmar-maroon text-myanmar-maroon font-bold px-8 py-2"
                onClick={handleAiButtonClick}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI About This Scholarship
              </Button>

              <SavedScholarshipButton 
                scholarshipId={scholarship.id}
                size="lg"
                className="rounded-full"
              />
            </div>

            {/* Show original source */}
            {scholarship.source_url && (
              <div className="mt-4 text-center">
                <a 
                  href={scholarship.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-myanmar-maroon hover:underline"
                >
                  View original source
                </a>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-assistant" className="mt-6">
            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-myanmar-jade/10 via-white to-myanmar-gold/10">
              <CardHeader>
                <h2 className="text-xl font-semibold text-myanmar-maroon">Scholarship Assistant</h2>
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
