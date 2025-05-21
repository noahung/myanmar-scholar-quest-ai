import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  ArrowRight, 
  Search,
  Filter,
  BookOpen,
  Loader2,
  GraduationCap,
  Sparkles
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { slugify } from "@/utils/slugify";

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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function Scholarships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const scholarshipsPerPage = 16;
  const { toast } = useToast();

  useEffect(() => {
    fetchScholarships();
  }, []);

  async function fetchScholarships() {
    try {
      setIsLoading(true);
      
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('scholarships')
        .select('*');
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (data) {
        // Ensure fields properties are arrays
        const formattedData = data.map((scholarship: any) => ({
          ...scholarship,
          fields: Array.isArray(scholarship.fields) ? scholarship.fields : [],
          benefits: Array.isArray(scholarship.benefits) ? scholarship.benefits : [],
          requirements: Array.isArray(scholarship.requirements) ? scholarship.requirements : []
        }));
        
        setScholarships(formattedData);
        
        // Extract unique values and filter out empty strings and undefined
        const uniqueCountries = Array.from(
          new Set(formattedData.map(s => s.country))
        ).filter(country => country && country.trim() !== "");
        
        const uniqueFields = Array.from(
          new Set(formattedData.flatMap(s => s.fields || []))
        ).filter(field => field && field.trim() !== "");
        
        const uniqueLevels = Array.from(
          new Set(formattedData.map(s => s.level))
        ).filter(level => level && level.trim() !== "");
        
        setCountries(uniqueCountries);
        setFields(uniqueFields);
        setLevels(uniqueLevels);
      }
    } catch (error) {
      console.error("Error in fetchScholarships:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scholarships data"
      });
      setScholarships([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter scholarships based on user input
  const filteredScholarships = scholarships.filter(scholarship => {
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

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedField, selectedLevel]);

  // Pagination logic
  const totalPages = Math.ceil(filteredScholarships.length / scholarshipsPerPage);
  const paginatedScholarships = filteredScholarships.slice(
    (currentPage - 1) * scholarshipsPerPage,
    currentPage * scholarshipsPerPage
  );

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value === "_all" ? "" : value);
  };

  const handleFieldChange = (value: string) => {
    setSelectedField(value === "_all" ? "" : value);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value === "_all" ? "" : value);
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Banner Section */}
      <motion.section
        className="w-full mb-8 rounded-3xl bg-[#D6F0FF] flex flex-col md:flex-row items-center justify-between px-6 py-10 md:py-14 relative overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Left: Headline and Search */}
        <div className="flex-1 flex flex-col items-start justify-center z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-myanmar-maroon mb-2">Find the Best Scholarships</h2>
          <p className="text-lg text-myanmar-maroon/80 mb-6 max-w-xl">Search and filter international scholarships available for Myanmar students. Start your journey here!</p>
          <div className="w-full max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-myanmar-maroon/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search scholarships, program, or keyword..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-myanmar-jade/30 focus:ring-2 focus:ring-myanmar-gold outline-none text-myanmar-maroon bg-white shadow"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex justify-end items-center mt-8 md:mt-0 z-10">
          {/* Placeholder SVG illustration: student with laptop */}
          <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="110" cy="170" rx="70" ry="10" fill="#B3E0FF" />
            <circle cx="110" cy="60" r="32" fill="#FFD6E3" />
            <rect x="80" y="90" width="60" height="40" rx="12" fill="#fff" stroke="#A3A3A3" strokeWidth="2" />
            <rect x="100" y="110" width="20" height="10" rx="3" fill="#D6F0FF" />
            <rect x="95" y="130" width="30" height="8" rx="2" fill="#FFD6E3" />
            <rect x="105" y="98" width="10" height="8" rx="2" fill="#B3E0FF" />
            <ellipse cx="110" cy="60" rx="10" ry="12" fill="#fff" />
            <ellipse cx="110" cy="60" rx="5" ry="6" fill="#A3A3A3" />
            <rect x="90" y="50" width="40" height="10" rx="5" fill="#fff" />
            <rect x="100" y="40" width="20" height="10" rx="5" fill="#FFD6E3" />
          </svg>
        </div>
        {/* Decorative background blob */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#B3E0FF] rounded-full opacity-30 z-0" />
      </motion.section>

      {/* Search and Filters */}
      <motion.div 
        className="mb-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-2 items-center">
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
        </div>
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { label: 'All', value: '_all', color: 'border-myanmar-jade text-myanmar-jade' },
            { label: 'Undergraduate', value: 'Undergraduate', color: 'border-myanmar-gold text-myanmar-gold' },
            { label: 'Masters', value: 'Masters', color: 'border-myanmar-jade text-myanmar-jade' },
            { label: 'PhD', value: 'PhD', color: 'border-myanmar-maroon text-myanmar-maroon' },
          ].map((tab, index) => (
            <motion.button
              key={tab.value}
              variants={fadeInUp}
              className={`px-5 py-2 rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-myanmar-gold/50 ${tab.color} ${selectedLevel === tab.value || (tab.value === '_all' && (!selectedLevel || selectedLevel === '_all')) ? 'bg-myanmar-gold/20 shadow' : 'bg-white hover:bg-myanmar-gold/10'}`}
              onClick={() => handleLevelChange(tab.value)}
              type="button"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Results count */}
      <motion.div 
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {filteredScholarships.length} scholarships found
        </span>
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <motion.div 
          className="flex justify-center items-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-myanmar-jade" />
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && scholarships.length === 0 && (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-myanmar-gold" />
          <h3 className="text-lg font-medium">No scholarships found</h3>
          <p className="text-muted-foreground mt-2">Try importing scholarship data from your web scraper</p>
        </motion.div>
      )}

      {/* No results after filtering */}
      {!isLoading && scholarships.length > 0 && filteredScholarships.length === 0 && (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-myanmar-gold" />
          <h3 className="text-lg font-medium">No scholarships match your filters</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search term</p>
        </motion.div>
      )}

      {/* Scholarships grid */}
      {!isLoading && filteredScholarships.length > 0 && (
        <motion.div
          key={currentPage}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {paginatedScholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="h-full"
            >
              <Card className="h-full rounded-2xl shadow-lg border-0 bg-gradient-to-br from-myanmar-jade/10 via-white to-myanmar-gold/10 transition-all">
                <CardHeader className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-myanmar-gold/40 flex items-center justify-center mb-2">
                    <GraduationCap className="w-8 h-8 text-myanmar-maroon" />
                  </div>
                  <CardTitle className="text-lg font-bold text-myanmar-maroon text-center line-clamp-2">{scholarship.title}</CardTitle>
                  <CardDescription className="text-myanmar-maroon/70 text-center line-clamp-1">{scholarship.institution}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2 flex-wrap justify-center">
                    <Badge variant="default" className="bg-myanmar-jade text-white border-none font-semibold">{scholarship.country}</Badge>
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
                  <div className="flex flex-wrap gap-2 mb-2 justify-center">
                    {Array.isArray(scholarship.fields) && scholarship.fields.map((field, index) => (
                      field ? <Badge key={index} variant="outline" className="text-xs bg-myanmar-maroon/10 border-myanmar-maroon text-myanmar-maroon font-medium">{field}</Badge> : null
                    ))}
                  </div>
                  <p className="text-xs text-myanmar-maroon/70 text-center line-clamp-2">{scholarship.description}</p>
                  <p className="text-xs text-myanmar-maroon/70 text-center mt-2">
                    <Calendar className="inline-block w-4 h-4 mr-1 align-text-bottom" />
                    Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button asChild variant="outline" className="rounded-full border-myanmar-maroon text-myanmar-maroon font-bold w-full">
                    <Link to={`/scholarships/${scholarship.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <motion.div 
          className="flex justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-full px-3 py-2"
            aria-label="Previous page"
          >
            &larr;
          </Button>
          {/* Numbered page buttons with ellipsis logic */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            // Show first, last, current, and nearby pages; ellipsis for gaps
            if (
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1
            ) {
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-full px-3 py-2 font-semibold ${page === currentPage ? 'bg-myanmar-maroon text-white' : ''}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              );
            }
            // Ellipsis before/after current page
            if (
              (page === currentPage - 2 && page > 1) ||
              (page === currentPage + 2 && page < totalPages)
            ) {
              return (
                <span key={page} className="px-2 text-lg text-muted-foreground select-none">…</span>
              );
            }
            return null;
          })}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full px-3 py-2"
            aria-label="Next page"
          >
            &rarr;
          </Button>
        </motion.div>
      )}
    </div>
  );
}
