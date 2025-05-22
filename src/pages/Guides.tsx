import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Book, Globe, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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

const CATEGORIES = [
  "All",
  "Application Process",
  "Visa Requirements",
  "Application Documents",
  "Study Tips",
  "Language Preparation",
  "Cultural Adjustment",
  "Subject Highlights",
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Guides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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

  // Filter guides by category
  const filteredGuides = selectedCategory === "All"
    ? guides
    : guides.filter(g => g.category === selectedCategory);

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2"
      >
        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-myanmar-maroon">Educational Guides</h1>
        <p className="text-myanmar-maroon/80 mb-8">Step-by-step guides to help you navigate the scholarship process</p>
      </motion.div>
      {/* Category filter badges */}
      <motion.div
        className="flex flex-wrap gap-4 mb-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {CATEGORIES.map((category, idx) => (
          <motion.button
            key={category}
            variants={fadeInUp}
            className={`px-5 py-2 rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-myanmar-gold/50 ${
              category === "All"
                ? "border-myanmar-jade text-myanmar-jade"
                : category === "Undergraduate"
                ? "border-myanmar-gold text-myanmar-gold"
                : category === "Masters"
                ? "border-myanmar-jade text-myanmar-jade"
                : category === "PhD"
                ? "border-myanmar-maroon text-myanmar-maroon"
                : "border-myanmar-maroon text-myanmar-maroon"
            } ${selectedCategory === category ? "bg-myanmar-gold/20 shadow" : "bg-white hover:bg-myanmar-gold/10"}`}
            onClick={() => setSelectedCategory(category)}
            type="button"
            style={{ transitionDelay: `${idx * 0.05}s` }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>
      {loading ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {Array(6).fill(0).map((_, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <GuideSkeleton />
            </motion.div>
          ))}
        </motion.div>
      ) : filteredGuides.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {filteredGuides.map((guide, idx) => (
              <motion.div
                key={guide.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <GuideCard guide={guide} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="h-12 w-12 mx-auto text-myanmar-gold mb-4" />
          <h3 className="text-xl font-semibold mb-2">No guides available</h3>
          <p className="text-muted-foreground mb-6">
            Educational guides will appear here once they're published.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col rounded-2xl shadow-lg border-0 bg-gradient-to-br from-myanmar-jade/10 via-white to-myanmar-gold/10">
      <div className="aspect-video relative bg-muted">
        <img 
          src={guide.image || "/placeholder.svg"}
          alt={guide.title}
          className="object-cover w-full h-full rounded-t-2xl"
        />
      </div>
      <CardContent className="flex-grow pt-6">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="border-myanmar-gold text-myanmar-gold bg-myanmar-gold/20 font-semibold">{guide.category}</Badge>
          <Badge variant="secondary" className="flex items-center gap-1 bg-myanmar-jade text-white border-none font-semibold">
            <Globe className="h-3 w-3" /> {guide.country}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-myanmar-maroon">{guide.title}</h3>
        <p className="text-myanmar-maroon/70 line-clamp-3">{guide.description}</p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 py-3">
        <Button variant="outline" asChild className="w-full rounded-full border-myanmar-maroon text-myanmar-maroon font-bold">
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
