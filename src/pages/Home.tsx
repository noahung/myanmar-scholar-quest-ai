import { Link, useNavigate } from "react-router-dom";
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
  Pencil,
  Bot,
  Sparkles,
  Languages,
  Brain
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
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 }
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

  const navigate = useNavigate();

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
        <motion.div 
          className="relative z-20 w-full flex flex-col items-center pt-16 pb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Empowering Myanmar Students<br className="hidden md:block" /> to Achieve Global Education
          </motion.h1>
          <motion.p 
            className="max-w-xl mx-auto text-lg md:text-xl text-white/90 mb-8 drop-shadow"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Discover international scholarships, connect with a supportive community, and get AI-powered guidance for your academic journey.
          </motion.p>
          <motion.div 
            className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto bg-white/80 rounded-xl shadow-lg p-4 md:p-2 items-center mb-8 backdrop-blur-sm"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
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
            <Button
              className="bg-myanmar-gold text-myanmar-maroon font-bold px-8 py-2 rounded-lg shadow hover:bg-myanmar-gold/90 transition-all"
              onClick={() => {
                const params = new URLSearchParams();
                if (searchTerm) params.set("q", searchTerm);
                if (selectedCountry) params.set("country", selectedCountry);
                if (selectedField) params.set("field", selectedField);
                if (selectedLevel) params.set("level", selectedLevel);
                navigate(`/scholarships?${params.toString()}`);
              }}
            >
              Search
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Platform Features Section */}
      <section className="w-full py-16 md:py-24 bg-white flex flex-col items-center relative overflow-hidden">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-myanmar-maroon text-center mb-2"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Platform Features
        </motion.h2>
        <motion.p 
          className="text-myanmar-maroon/70 text-center mb-10 max-w-2xl"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Discover what makes Scholar-M unique. Empowering Myanmar students with smart tools, a supportive community, and resources for global success.
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Feature Cards */}
          {[
            {
              label: "AI",
              bg: "bg-[#D6F0FF]",
              title: "AI Scholarship Guide",
              desc: "Get instant, personalised help with scholarships and applications. Guidance is available anywhere on the platform.",
              icon: <MessageCircle className="w-8 h-8 text-myanmar-maroon" />, 
            },
            {
              label: "Discovery",
              bg: "bg-[#FFE3EC]",
              title: "Myanmar-Focused Discovery",
              desc: "Bilingual, tailored content for Myanmar students. Find opportunities and resources made just for you.",
              icon: <Globe className="w-8 h-8 text-myanmar-maroon" />, 
            },
            {
              label: "Management",
              bg: "bg-[#FFF7D6]",
              title: "Scholarship Management",
              desc: "Save, filter, and track scholarships easily. Stay organized and never miss a deadline again.",
              icon: <GraduationCap className="w-8 h-8 text-myanmar-maroon" />, 
            },
            {
              label: "Community",
              bg: "bg-[#E6F7E6]",
              title: "Community Forum",
              desc: "Connect, ask questions, and share experiences with Myanmar peers in a supportive community.",
              icon: <Users className="w-8 h-8 text-myanmar-maroon" />, 
            },
            {
              label: "Guides",
              bg: "bg-[#F3E8FF]",
              title: "Guides & Resources",
              desc: "Step-by-step guides and resources to help you prepare, apply, and succeed in your journey.",
              icon: <BookOpen className="w-8 h-8 text-myanmar-maroon" />, 
            },
            {
              label: "Notes",
              bg: "bg-[#FFEFD6]",
              title: "User Notes System",
              desc: "Create, organize, and save your own notes—including AI responses—for easy reference.",
              icon: <Pencil className="w-8 h-8 text-myanmar-maroon" />, 
            },
          ].map((feature, idx) => (
          <motion.div 
              key={feature.label}
              className={`relative rounded-2xl ${feature.bg} p-8 flex flex-col justify-between min-h-[260px] shadow-lg transition-transform duration-200 hover:scale-[1.03] group cursor-pointer`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
            >
              {/* Badge */}
              <span className="absolute top-6 left-6 bg-white/80 text-myanmar-maroon text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {feature.label}
              </span>
              {/* Title & Icon */}
              <div className="flex items-center gap-4 mt-8 mb-4">
                <div className="flex-shrink-0">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-myanmar-maroon leading-tight">{feature.title}</h3>
            </div>
              {/* Description */}
              <p className="text-myanmar-maroon/70 text-base mb-2 min-h-[72px]">{feature.desc}</p>
          </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Discover Programs Section */}
      <section className="w-full py-12 md:py-16 bg-white">
        <motion.div 
          className="container mx-auto px-4"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold text-myanmar-maroon text-center mb-8"
            variants={fadeInUp}
          >
            Discover The New In Programs
          </motion.h2>
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
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
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-myanmar-maroon"></div>
              </div>
            ) : filteredScholarships.length > 0 ? (
              filteredScholarships.slice(0, 24).map((scholarship, index) => (
                <motion.div
                  key={scholarship.id}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-myanmar-jade/10 via-white to-myanmar-gold/10 hover:scale-105 transition-transform h-[420px] flex flex-col">
                    <CardHeader className="flex flex-col items-center flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-myanmar-gold/40 flex items-center justify-center mb-2">
                      <GraduationCap className="w-8 h-8 text-myanmar-maroon" />
                    </div>
                      <CardTitle className="text-lg font-bold text-myanmar-maroon text-center line-clamp-2 min-h-[3.5rem]">{scholarship.title}</CardTitle>
                      <CardDescription className="text-myanmar-maroon/70 text-center line-clamp-1">{scholarship.institution}</CardDescription>
                  </CardHeader>
                    <CardContent className="flex flex-col items-center flex-grow">
                      <div className="flex gap-2 mb-3 flex-wrap justify-center">
                      <Badge variant="default" className="bg-myanmar-jade/80 text-white border-none">{scholarship.country}</Badge>
                        <Badge
                          className={
                            `font-semibold px-3 py-1 rounded-full text-white ` +
                            (scholarship.level === 'Undergraduate' ? 'bg-blue-500' :
                              scholarship.level === 'Masters' ? 'bg-green-500' :
                              scholarship.level === 'PhD' ? 'bg-purple-600' :
                              'bg-gray-400')
                          }
                        >
                          {scholarship.level}
                        </Badge>
                    </div>
                      <p className="text-sm text-myanmar-maroon/70 text-center line-clamp-3 mb-auto">{scholarship.description}</p>
                      <p className="text-xs text-myanmar-maroon/70 text-center mt-3 flex items-center justify-center">
                        <Calendar className="inline-block w-4 h-4 mr-1" />
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                  </CardContent>
                    <CardFooter className="flex justify-center mt-auto pt-4">
                      <Button asChild variant="outline" className="rounded-full border-myanmar-maroon text-myanmar-maroon font-bold hover:bg-myanmar-maroon hover:text-white transition-colors">
                      <Link to={`/scholarships/${scholarship.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No featured scholarships available at the moment.
              </div>
            )}
          </motion.div>
          <motion.div 
            className="flex justify-center mt-8"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <FancyButton asChild icon={<ArrowRight />}>
              <Link to="/scholarships">View All</Link>
            </FancyButton>
          </motion.div>
        </motion.div>
      </section>

      {/* AI Assistant Feature Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-white via-myanmar-gold/5 to-myanmar-jade/5">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          {/* Left side: Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-myanmar-maroon mb-6">
              Meet Your AI Study Abroad Assistant
            </h2>
            <p className="text-myanmar-maroon/70 text-lg mb-8">
              Over the years, the scholarship landscape has evolved.
              Our AI Assistant has learned from thousands of successful applications
              to provide you with personalised guidance at every step.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-myanmar-gold/20 p-2 rounded-lg">
                  <Bot className="w-6 h-6 text-myanmar-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-myanmar-maroon mb-1">24/7 Assistance</h3>
                  <p className="text-sm text-myanmar-maroon/70">Get instant answers to your questions anytime, anywhere</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-myanmar-jade/20 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-myanmar-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-myanmar-maroon mb-1">Smart Recommendations</h3>
                  <p className="text-sm text-myanmar-maroon/70">Personalised scholarship matches based on your profile</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="bg-myanmar-maroon/20 p-2 rounded-lg">
                  <Languages className="w-6 h-6 text-myanmar-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-myanmar-maroon mb-1">Bilingual Support</h3>
                  <p className="text-sm text-myanmar-maroon/70">Communicate in both English and Myanmar language</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="bg-myanmar-gold/20 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-myanmar-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-myanmar-maroon mb-1">Application Tips</h3>
                  <p className="text-sm text-myanmar-maroon/70">Expert guidance on essays, interviews, and documents</p>
                </div>
              </motion.div>
            </div>
            <Button 
              asChild
              className="bg-myanmar-maroon text-white hover:bg-myanmar-maroon/90 rounded-full px-8 py-6 text-lg font-semibold"
            >
              <Link to="/ai-companion">Try AI Companion Now</Link>
            </Button>
          </motion.div>

          {/* Right side: Video/Image */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-4">
              <video
                className="w-full rounded-xl"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/videos//web%20promo.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Bot className="w-5 h-5 text-myanmar-maroon" />
                    <p className="text-sm font-medium text-myanmar-maroon">AI Companion</p>
                  </div>
                  <p className="text-sm text-myanmar-maroon/70">
                    "Scholarship များနဲ့ ပတ်သက်ပြီး မေးခွန်းများ၊ အကြံပြုချက်များ၊ အကူအညီများကို AI Companion မှ တိုက်ရိုက် ရယူနိုင်ပါတယ်။"
                  </p>
                </div>
              </div>
          </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 bg-white flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-myanmar-maroon text-center mb-3"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          className="text-myanmar-maroon/70 text-center mb-12 max-w-2xl"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Here are the most common questions from Myanmar students about Scholar-M.
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16 px-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            {
              icon: <Sparkles className="w-7 h-7 text-myanmar-gold" />, 
              title: "What is Scholar-M?",
              desc: "Scholar-M is a free platform for Myanmar students to discover scholarships, connect with peers, and get AI-powered guidance for studying abroad."
            },
            {
              icon: <Bot className="w-7 h-7 text-myanmar-jade" />, 
              title: "How does the AI Assistant help me?",
              desc: "Our AI Assistant answers your questions, helps you find scholarships, and provides tips for applications—all in English or Myanmar."
            },
            {
              icon: <Users className="w-7 h-7 text-myanmar-maroon" />, 
              title: "How do I join the community?",
              desc: "Simply visit the Community page to join discussions, ask questions, and connect with other Myanmar students and alumni."
            },
            {
              icon: <GraduationCap className="w-7 h-7 text-myanmar-gold" />, 
              title: "Are all features really free?",
              desc: "Yes! Scholar-M is completely free for Myanmar students. There are no hidden fees or charges for using our core features."
            },
            {
              icon: <BookOpen className="w-7 h-7 text-myanmar-jade" />, 
              title: "How do I find the right scholarship?",
              desc: "Use our filters on the Scholarships page to search by country, degree, or field. Each listing has details and deadlines."
            },
            {
              icon: <Pencil className="w-7 h-7 text-myanmar-maroon" />, 
              title: "Can I save notes or AI answers?",
              desc: "Yes, you can save your own notes and AI responses for future reference—perfect for tracking your application journey."
            },
          ].map((faq, idx) => (
          <motion.div 
              key={faq.title}
              className="flex flex-col items-start gap-4 min-h-[160px]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-myanmar-gold/10 mb-2">
                {faq.icon}
              </div>
              <h4 className="font-bold text-lg text-myanmar-maroon mb-1">{faq.title}</h4>
              <p className="text-myanmar-maroon/70 text-base leading-relaxed">{faq.desc}</p>
            </motion.div>
          ))}
          </motion.div>
          <motion.div 
          className="w-full max-w-2xl mx-auto bg-[#F8FAFC] rounded-2xl shadow-lg flex flex-col items-center py-10 px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex -space-x-4 mb-4">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User 3" className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="User 4" className="w-10 h-10 rounded-full border-2 border-white shadow" />
            <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="User 5" className="w-10 h-10 rounded-full border-2 border-white shadow" />
          </div>
          <h4 className="text-xl font-bold text-myanmar-maroon mb-2">Join Our Community</h4>
          <p className="text-myanmar-maroon/70 text-center mb-6">If you have more questions or want to connect, join our community forum to chat, share, and learn together.</p>
          <Button asChild size="lg" className="rounded-full bg-myanmar-maroon text-white font-bold px-8 py-2 shadow hover:bg-myanmar-gold/90 hover:text-myanmar-maroon transition-all">
            <Link to="/community">Join Community</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
