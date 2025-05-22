import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight, Globe, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase-client";
import { FancyButton } from "@/components/ui/fancy-button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allGuides, setAllGuides] = useState<{id: string, title: string}[]>([]);

  useEffect(() => {
    async function fetchGuide() {
      setLoading(true);
      setError(null);
      setGuide(null);
      if (!id) {
        setError("Guide not found");
        setLoading(false);
        return;
      }
      // Fetch the guide
      const { data: guideData, error: guideError } = await supabase
        .from("guides")
        .select("*")
        .eq("id", id)
        .single();
      if (guideError || !guideData) {
        setError("Guide not found");
        setLoading(false);
        return;
      }
      // Fetch the steps for the guide
      const { data: stepsData, error: stepsError } = await supabase
        .from("guide_steps")
        .select("title, content, step_order")
        .eq("guide_id", id)
        .order("step_order", { ascending: true });
      if (stepsError) {
        setError("Could not load guide steps");
        setLoading(false);
        return;
      }
      setGuide({
        ...guideData,
        steps_content: stepsData || [],
      });
      setLoading(false);
    }
    fetchGuide();
  }, [id]);

  useEffect(() => {
    // Fetch all guide IDs and titles for navigation
    async function fetchAllGuides() {
      const { data, error } = await supabase
        .from("guides")
        .select("id, title")
        .order("created_at", { ascending: true });
      if (!error && data) setAllGuides(data);
    }
    fetchAllGuides();
  }, []);

  // Find previous and next guide IDs
  const currentIndex = allGuides.findIndex(g => g.id === id);
  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex >= 0 && currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

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
    <motion.div
      className="container py-8 md:py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div className="flex flex-col max-w-3xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        {/* Back button */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Button variant="outline" asChild>
            <Link to="/guides">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guides
            </Link>
          </Button>
        </motion.div>
        {/* Guide header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          {guide.image && (
            <div className="w-full aspect-video mb-6 rounded-2xl overflow-hidden bg-muted">
              <img
                src={guide.image}
                alt={guide.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline">{guide.category}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> {guide.country}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">{guide.title}</h1>
          <p className="text-muted-foreground mt-4">{guide.description}</p>
        </motion.div>
        <Separator className="mb-8" />
        {/* Steps */}
        <motion.div className="space-y-8" initial="initial" animate="animate" variants={{ initial: {}, animate: { transition: { staggerChildren: 0.15 } } }}>
          {guide.steps_content?.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * index }}>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-myanmar-jade text-white flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
              <div className="ml-11">
                <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: step.content }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Navigation */}
        <motion.div className="mt-12 flex flex-wrap justify-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          {prevGuide && (
            <Button 
              variant="outline" 
              asChild 
              className="rounded-full border-myanmar-maroon text-myanmar-maroon font-bold"
            >
              <Link to={`/guides/${prevGuide.id}`} className="hidden sm:flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Guide
              </Link>
            </Button>
          )}
          {nextGuide && (
            <Button 
              variant="outline" 
              asChild 
              className="rounded-full border-myanmar-maroon text-myanmar-maroon font-bold"
            >
              <Link to={`/guides/${nextGuide.id}`} className="hidden sm:flex items-center">
                Next Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </motion.div>
      </motion.div>
      <style>{`
        .ml-11 iframe {
          width: 100% !important;
          max-width: 100%;
          aspect-ratio: 16/9;
          border-radius: 1rem;
          margin: 1.5rem 0;
          display: block;
        }
      `}</style>
    </motion.div>
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
