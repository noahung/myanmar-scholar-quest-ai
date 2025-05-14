
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Book, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "@/components/ui/use-toast";

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

export default function Guides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  // Updated fetchGuides function to merge both local and Supabase data
  async function fetchGuides() {
    setLoading(true);
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('guides')
        .select('*');
        
      if (error) throw error;
      
      // Get guide steps for each guide
      const guidesWithSteps = await Promise.all(
        data.map(async (guide) => {
          const { data: stepsData, error: stepsError } = await supabase
            .from('guide_steps')
            .select('*')
            .eq('guide_id', guide.id)
            .order('step_order', { ascending: true });
            
          if (stepsError) {
            console.error("Error fetching steps:", stepsError);
            return { ...guide, steps_content: [] };
          }
          
          return {
            ...guide,
            steps_content: stepsData.map(step => ({
              title: step.title,
              content: step.content
            }))
          };
        })
      );
      
      setGuides(guidesWithSteps);
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch guides"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tighter mb-2">Educational Guides</h1>
      <p className="text-muted-foreground mb-8">Step-by-step guides to help you navigate the scholarship process</p>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <GuideSkeleton key={index} />
          ))}
        </div>
      ) : guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No guides available</h3>
          <p className="text-muted-foreground mb-6">
            Educational guides will appear here once they're published.
          </p>
        </div>
      )}
    </div>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video relative bg-muted">
        <img 
          src={guide.image || "/placeholder.svg"}
          alt={guide.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="flex-grow pt-6">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline">{guide.category}</Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="h-3 w-3" /> {guide.country}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{guide.title}</h3>
        <p className="text-muted-foreground line-clamp-3">{guide.description}</p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 py-3">
        <Button variant="outline" asChild className="w-full">
          <Link to={`/guides/${guide.id}`}>
            View Guide ({guide.steps} steps)
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function GuideSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="pt-6">
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="border-t bg-muted/50 py-3">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
