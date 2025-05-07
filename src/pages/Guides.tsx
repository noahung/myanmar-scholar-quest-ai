
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, BookOpen, Globe } from "lucide-react";

const guides = [
  {
    id: "1",
    title: "Complete Guide to Applying for Japanese Scholarships",
    description: "A step-by-step approach to finding and applying for scholarships in Japan, with specific tips for MEXT, JICA, and university-specific programs.",
    category: "Application Process",
    country: "Japan",
    image: "/placeholder.svg",
    steps: 8
  },
  {
    id: "2",
    title: "UK Student Visa Application for Myanmar Students",
    description: "Everything you need to know about the UK student visa process, including document requirements, fees, and interview preparation.",
    category: "Visa Requirements",
    country: "United Kingdom",
    image: "/placeholder.svg",
    steps: 12
  },
  {
    id: "3",
    title: "How to Write a Compelling SOP for US Universities",
    description: "Tips and examples for crafting a powerful Statement of Purpose that highlights your achievements and aspirations in the US academic context.",
    category: "Application Documents",
    country: "United States",
    image: "/placeholder.svg",
    steps: 6
  },
  {
    id: "4",
    title: "Budget Planning for Students in Australia",
    description: "A practical guide to managing your finances while studying in Australia, including accommodation, food, transportation, and entertainment costs.",
    category: "Study Tips",
    country: "Australia",
    image: "/placeholder.svg",
    steps: 5
  },
  {
    id: "5",
    title: "German Language Preparation for Scholarship Applications",
    description: "Resources and strategies for learning German, from basic to advanced levels, to improve your chances for German scholarships.",
    category: "Language Preparation",
    country: "Germany",
    image: "/placeholder.svg",
    steps: 7
  },
  {
    id: "6",
    title: "Adapting to University Life in South Korea",
    description: "Cultural insights and practical advice for Myanmar students preparing to study and live in South Korea.",
    category: "Cultural Adjustment",
    country: "South Korea",
    image: "/placeholder.svg",
    steps: 9
  }
];

// Group guides by category
const groupedGuides = guides.reduce((acc, guide) => {
  if (!acc[guide.category]) {
    acc[guide.category] = [];
  }
  acc[guide.category].push(guide);
  return acc;
}, {} as Record<string, typeof guides>);

export default function Guides() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="pattern-border pb-2">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Educational Guides</h1>
        </div>
        <p className="max-w-[600px] text-muted-foreground">
          Comprehensive resources to help Myanmar students navigate the international education journey.
        </p>
      </div>

      <div className="mb-8 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{guides.length} guides available</span>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Guides</TabsTrigger>
            {Object.keys(groupedGuides).map((category) => (
              <TabsTrigger key={category} value={category} className="hidden md:inline-flex">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {Array.from(new Set(guides.map(guide => guide.country))).map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </TabsContent>

        {Object.entries(groupedGuides).map(([category, categoryGuides]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function GuideCard({ guide }: { guide: typeof guides[0] }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="h-48 bg-muted relative">
        <img 
          src={guide.image} 
          alt={guide.title} 
          className="object-cover w-full h-full"
        />
        <Badge 
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90"
        >
          {guide.country}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-myanmar-jade" />
          <CardDescription>{guide.category}</CardDescription>
        </div>
        <CardTitle className="line-clamp-2">{guide.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {guide.description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/guides/${guide.id}`}>
            View Guide ({guide.steps} steps)
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Import this component to prevent error
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
