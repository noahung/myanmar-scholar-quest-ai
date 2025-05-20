import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  MessageCircle, 
  GraduationCap, 
  Globe, 
  Calendar, 
  ArrowRight,
  Search,
  Users,
  Pencil
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { slugify } from "@/utils/slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FancyButton } from "@/components/ui/fancy-button";

export type Scholarship = {
  id: string;
  title: string;
  country: string;
  institution: string;
  deadline: string;
  fields: string[];
  level: "Masters" | "Undergraduate" | "PhD" | "Research" | "Training";
  description: string;
  benefits: string[];
  requirements: string[];
  application_url: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
  source_url?: string;
  image_url?: string;
};

export default function Home() {
  const [featuredScholarships, setFeaturedScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Filter/search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

  useEffect(() => {
    fetchFeaturedScholarships();
  }, []);

  async function fetchFeaturedScholarships() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('scholarships')
        .select('*');
      if (error) throw error;
      if (data) {
        const formattedData = data.map((scholarship: any) => ({
          ...scholarship,
          fields: Array.isArray(scholarship.fields) ? scholarship.fields : [],
          benefits: Array.isArray(scholarship.benefits) ? scholarship.benefits : [],
          requirements: Array.isArray(scholarship.requirements) ? scholarship.requirements : []
        }));
        setFeaturedScholarships(formattedData);
        // Extract unique values for filters
        const uniqueCountries = Array.from(new Set(formattedData.map(s => s.country))).filter(Boolean);
        const uniqueFields = Array.from(new Set(formattedData.flatMap(s => s.fields || []))).filter(Boolean);
        const uniqueLevels = Array.from(new Set(formattedData.map(s => s.level))).filter(Boolean);
        setCountries(uniqueCountries);
        setFields(uniqueFields);
        setLevels(uniqueLevels);
      }
    } catch (error) {
      console.error("Error fetching featured scholarships:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load featured scholarships"
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Filtering logic (same as Scholarships page)
  const filteredScholarships = featuredScholarships.filter(scholarship => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || selectedCountry === "_all" || scholarship.country === selectedCountry;
    const matchesField = !selectedField || selectedField === "_all"
      ? true
      : scholarship.fields && Array.isArray(scholarship.fields) && scholarship.fields.some(field => field === selectedField);
    const matchesLevel = !selectedLevel || selectedLevel === "_all" || scholarship.level === selectedLevel;
    return matchesSearch && matchesCountry && matchesField && matchesLevel;
  });

  // Handlers for dropdowns
  const handleCountryChange = (value: string) => setSelectedCountry(value === "_all" ? "" : value);
  const handleFieldChange = (value: string) => setSelectedField(value === "_all" ? "" : value);
  const handleLevelChange = (value: string) => setSelectedLevel(value === "_all" ? "" : value);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-myanmar-jade/30 via-white to-myanmar-gold/10">
      {/* Hero Section */}
      <section className="w-full relative min-h-[420px] md:min-h-[600px] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Responsive Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          poster="https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/videos//desktop%20hero.mp4"
        >
          <source src="https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/videos//desktop%20hero.mp4" media="(min-width: 768px)" type="video/mp4" />
          <source src="https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/videos//mobile%20hero.mp4" media="(max-width: 767px)" type="video/mp4" />
        </video>
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20 z-10" />
        <div className="relative z-20 w-full flex flex-col items-center pt-16 pb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
            Empowering Myanmar Students<br className="hidden md:block" /> to Achieve Global Education
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-white/90 mb-8 drop-shadow">
            Discover international scholarships, connect with a supportive community, and get AI-powered guidance for your academic journey.
          </p>
          {/* Search/filter bar with dropdowns */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto bg-white/80 rounded-xl shadow-lg p-4 md:p-2 items-center mb-8 backdrop-blur-sm">
            <div className="flex-1 flex items-center relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-myanmar-maroon/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search scholarships, program, or keyword..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-myanmar-jade/30 focus:ring-2 focus:ring-myanmar-gold outline-none text-myanmar-maroon bg-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCountry || "_all"} onValueChange={handleCountryChange}>
              <SelectTrigger className="min-w-[150px] bg-white border-myanmar-jade/30 rounded-lg">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedField || "_all"} onValueChange={handleFieldChange}>
              <SelectTrigger className="min-w-[150px] bg-white border-myanmar-jade/30 rounded-lg">
                <SelectValue placeholder="Field of Study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Fields</SelectItem>
                {fields.map(field => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel || "_all"} onValueChange={handleLevelChange}>
              <SelectTrigger className="min-w-[150px] bg-white border-myanmar-jade/30 rounded-lg">
                <SelectValue placeholder="Degree Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-myanmar-gold text-myanmar-maroon font-bold px-8 py-2 rounded-lg shadow hover:bg-myanmar-gold/90 transition-all" onClick={() => {}}>
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-white via-myanmar-gold/10 to-myanmar-jade/10 flex flex-col items-center relative overflow-hidden">
        <div className="w-full flex justify-center mb-4">
          <div className="h-1 w-24 bg-myanmar-gold/60 rounded-full" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-myanmar-maroon text-center mb-2">Platform Features</h2>
        <p className="text-myanmar-maroon/70 text-center mb-10 max-w-2xl">Discover what makes Scholar-M unique. Our platform is designed to empower Myanmar students with smart tools, a supportive community, and resources for global success.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {/* Feature 1: AI Assistant */}
          <div className="bg-white rounded-3xl border border-myanmar-gold/20 shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl group cursor-pointer">
            <div className="bg-gradient-to-br from-myanmar-gold/40 to-myanmar-gold/10 rounded-full p-4 mb-4 shadow-sm">
              <MessageCircle className="w-8 h-8 text-myanmar-maroon" />
            </div>
            <h3 className="text-xl font-semibold text-myanmar-maroon mb-2 text-center">AI Assistant for Scholarship Guidance</h3>
            <p className="text-myanmar-maroon/70 text-center">Get instant, personalized help with scholarships and applications from our integrated AI assistant, available anywhere on the platform.</p>
          </div>
          {/* Feature 2: Myanmar-Focused Discovery */}
          <div className="bg-white rounded-3xl border border-myanmar-jade/20 shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl group cursor-pointer">
            <div className="bg-gradient-to-br from-myanmar-jade/40 to-myanmar-jade/10 rounded-full p-4 mb-4 shadow-sm">
              <Globe className="w-8 h-8 text-myanmar-maroon" />
            </div>
            <h3 className="text-xl font-semibold text-myanmar-maroon mb-2 text-center">Myanmar-Focused Scholarship Discovery</h3>
            <p className="text-myanmar-maroon/70 text-center">A platform dedicated to Myanmar students, with bilingual support and tailored content for your unique needs.</p>
          </div>
          {/* Feature 3: Scholarship Management */}
          <div className="bg-white rounded-3xl border border-myanmar-maroon/20 shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl group cursor-pointer">
            <div className="bg-gradient-to-br from-myanmar-maroon/30 to-myanmar-gold/10 rounded-full p-4 mb-4 shadow-sm">
              <GraduationCap className="w-8 h-8 text-myanmar-maroon" />
            </div>
            <h3 className="text-xl font-semibold text-myanmar-maroon mb-2 text-center">Comprehensive Scholarship Management</h3>
            <p className="text-myanmar-maroon/70 text-center">Browse, filter, and save scholarships. Access detailed info, deadlines, and application links all in one place.</p>
          </div>
          {/* Feature 4: Community Forum */}
          <div className="bg-white rounded-3xl border border-myanmar-gold/20 shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl group cursor-pointer">
            <div className="bg-gradient-to-br from-myanmar-gold/40 to-myanmar-maroon/10 rounded-full p-4 mb-4 shadow-sm">
              <Users className="w-8 h-8 text-myanmar-maroon" />
            </div>
            <h3 className="text-xl font-semibold text-myanmar-maroon mb-2 text-center">Community Forum</h3>
            <p className="text-myanmar-maroon/70 text-center">Connect with peers, ask questions, and share experiences in a supportive Myanmar student community.</p>
          </div>
          {/* Feature 5: Guides and Resources */}
          <div className="bg-white rounded-3xl border border-myanmar-jade/20 shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl group cursor-pointer">
            <div className="bg-gradient-to-br from-myanmar-jade/40 to-myanmar-gold/10 rounded-full p-4 mb-4 shadow-sm">
              <BookOpen className="w-8 h-8 text-myanmar-maroon" />
            </div>
            <h3 className="text-xl font-semibold text-myanmar-maroon mb-2 text-center">Guides and Resources</h3>
            <p className="text-myanmar-maroon/70 text-center">Access step-by-step guides and resources to help you prepare and succeed in your scholarship journey.</p>
          </div>
          {/* Feature 6: User Notes System */}
          <div className="bg-white rounded-3xl border border-myanmar-maroon/20 shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl group cursor-pointer">
            <div className="bg-gradient-to-br from-myanmar-maroon/30 to-myanmar-jade/10 rounded-full p-4 mb-4 shadow-sm">
              <Pencil className="w-8 h-8 text-myanmar-maroon" />
            </div>
            <h3 className="text-xl font-semibold text-myanmar-maroon mb-2 text-center">User Notes System</h3>
            <p className="text-myanmar-maroon/70 text-center">Create, organize, and save your own notes—including AI responses—linked to scholarships for easy reference.</p>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <Button asChild className="bg-myanmar-gold text-myanmar-maroon font-bold px-8 py-3 rounded-full shadow hover:bg-myanmar-gold/90 text-lg transition-all">
            <Link to="/about">Explore All Features</Link>
          </Button>
        </div>
      </section>

      {/* Discover Programs Section */}
      <section className="w-full py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-myanmar-maroon text-center mb-8">Discover The New In Programs</h2>
          {/* Functional badge tabs for level filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { label: 'All', value: '_all', color: 'border-myanmar-jade text-myanmar-jade' },
              { label: 'Undergraduate', value: 'Undergraduate', color: 'border-myanmar-gold text-myanmar-gold' },
              { label: 'Masters', value: 'Masters', color: 'border-myanmar-jade text-myanmar-jade' },
              { label: 'PhD', value: 'PhD', color: 'border-myanmar-maroon text-myanmar-maroon' },
            ].map(tab => (
              <button
                key={tab.value}
                className={`px-5 py-2 rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-myanmar-gold/50 ${tab.color} ${selectedLevel === tab.value || (tab.value === '_all' && (!selectedLevel || selectedLevel === '_all')) ? 'bg-myanmar-gold/20 shadow' : 'bg-white hover:bg-myanmar-gold/10'}`}
                onClick={() => handleLevelChange(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-myanmar-maroon"></div>
              </div>
            ) : filteredScholarships.length > 0 ? (
              filteredScholarships.slice(0, 24).map((scholarship) => (
                <Card key={scholarship.id} className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-myanmar-jade/10 via-white to-myanmar-gold/10 hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-myanmar-gold/40 flex items-center justify-center mb-2">
                      <GraduationCap className="w-8 h-8 text-myanmar-maroon" />
                    </div>
                    <CardTitle className="text-lg font-bold text-myanmar-maroon text-center">{scholarship.title}</CardTitle>
                    <CardDescription className="text-myanmar-maroon/70 text-center">{scholarship.institution}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="flex gap-2 mb-2 flex-wrap justify-center">
                      <Badge variant="default" className="bg-myanmar-jade/80 text-white border-none">{scholarship.country}</Badge>
                      <Badge variant="outline" className="border-myanmar-gold text-myanmar-gold">{scholarship.level}</Badge>
                    </div>
                    <p className="text-xs text-myanmar-maroon/70 text-center line-clamp-2">{scholarship.description}</p>
                    <p className="text-xs text-myanmar-maroon/70 text-center mt-2">
                      <Calendar className="inline-block w-4 h-4 mr-1 align-text-bottom" />
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button asChild variant="outline" className="rounded-full border-myanmar-maroon text-myanmar-maroon font-bold">
                      <Link to={`/scholarships/${scholarship.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No featured scholarships available at the moment.
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <FancyButton asChild icon={<ArrowRight />}>
              <Link to="/scholarships">View All</Link>
            </FancyButton>
          </div>
        </div>
      </section>

      {/* Clients/Partners Section */}
      <section className="w-full py-12 bg-myanmar-jade/10 flex flex-col items-center">
        <h3 className="text-2xl font-bold text-myanmar-maroon mb-4">We are happy to Follow Us with incredible clients</h3>
        <p className="text-myanmar-maroon/70 mb-4">Plus hundreds of Myanmar students and organizations have trusted us to find the perfect match.</p>
        {/* Placeholder for client logo */}
        <div className="mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Client Logo" className="h-16" />
        </div>
        <div className="flex gap-4 justify-center">
          {/* Social icons */}
          <a href="#" className="text-myanmar-maroon hover:text-myanmar-gold"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" className="h-8" /></a>
          <a href="#" className="text-myanmar-maroon hover:text-myanmar-gold"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" className="h-8" /></a>
          <a href="#" className="text-myanmar-maroon hover:text-myanmar-gold"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" className="h-8" /></a>
          <a href="#" className="text-myanmar-maroon hover:text-myanmar-gold"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" alt="WhatsApp" className="h-8" /></a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 bg-white flex flex-col items-center">
        <h3 className="text-2xl font-bold text-myanmar-maroon mb-8">Frequently asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* FAQ Accordion */}
          <div className="flex flex-col gap-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1" className="rounded-lg border border-myanmar-jade/30 bg-[#FFF8F2] mb-4 shadow">
                <AccordionTrigger className="text-lg font-semibold text-myanmar-maroon px-6 py-4">
                  <span className="flex items-center gap-2"><span className="inline-block bg-myanmar-gold/40 rounded-full w-8 h-8 flex items-center justify-center font-bold text-myanmar-maroon">01</span> How do I create an account?</span>
                </AccordionTrigger>
                <AccordionContent className="text-myanmar-maroon/80 px-6 pb-4">
                  Click the sign up button and fill in your details. You'll get access to all features for free.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2" className="rounded-lg border border-myanmar-jade/30 bg-[#FFF8F2] mb-4 shadow">
                <AccordionTrigger className="text-lg font-semibold text-myanmar-maroon px-6 py-4">
                  <span className="flex items-center gap-2"><span className="inline-block bg-myanmar-gold/40 rounded-full w-8 h-8 flex items-center justify-center font-bold text-myanmar-maroon">02</span> How do I join the community?</span>
                </AccordionTrigger>
                <AccordionContent className="text-myanmar-maroon/80 px-6 pb-4">
                  Go to the Community page and join discussions, ask questions, and connect with others.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3" className="rounded-lg border border-myanmar-jade/30 bg-[#FFF8F2] mb-4 shadow">
                <AccordionTrigger className="text-lg font-semibold text-myanmar-maroon px-6 py-4">
                  <span className="flex items-center gap-2"><span className="inline-block bg-myanmar-gold/40 rounded-full w-8 h-8 flex items-center justify-center font-bold text-myanmar-maroon">03</span> Is it free to use?</span>
                </AccordionTrigger>
                <AccordionContent className="text-myanmar-maroon/80 px-6 pb-4">
                  Yes, all features are free for Myanmar students.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {/* Illustration */}
          <div className="flex items-center justify-center">
            <img src="https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/images//faq%20section.jpg" alt="FAQ Illustration" className="w-80 h-80 object-contain" />
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}
