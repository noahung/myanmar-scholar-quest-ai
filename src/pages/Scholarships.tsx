import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  ArrowRight, 
  Search,
  Filter,
  BookOpen,
  Loader2
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
      
      console.log("Scholarships data from Supabase:", data);
      
      let allScholarships: Scholarship[] = [];
      
      // If we have data in Supabase, use it
      if (data && data.length > 0) {
        // Ensure fields properties are arrays
        const formattedData = data.map((scholarship: any) => ({
          ...scholarship,
          fields: Array.isArray(scholarship.fields) ? scholarship.fields : [],
          benefits: Array.isArray(scholarship.benefits) ? scholarship.benefits : [],
          requirements: Array.isArray(scholarship.requirements) ? scholarship.requirements : []
        }));
        
        allScholarships = [...formattedData];
      }
      
      // Also check local data to merge with Supabase data
      try {
        const localData = await import('@/data/scholarships');
        const localScholarships = localData.scholarships as Scholarship[];
        
        // Create a map of existing scholarships by ID to avoid duplicates
        const scholarshipMap = new Map();
        allScholarships.forEach(s => scholarshipMap.set(s.id, s));
        
        // Only add local scholarships if they don't already exist in the DB
        localScholarships.forEach(scholarship => {
          if (!scholarshipMap.has(scholarship.id)) {
            scholarshipMap.set(scholarship.id, scholarship);
          }
        });
        
        // Convert map back to array
        allScholarships = Array.from(scholarshipMap.values());
      } catch (localError) {
        console.error("Error loading local data:", localError);
        if (allScholarships.length === 0) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load scholarships data"
          });
        }
      }
      
      setScholarships(allScholarships);
      
      // Extract unique values and filter out empty strings and undefined
      if (allScholarships.length > 0) {
        const uniqueCountries = Array.from(
          new Set(allScholarships.map(s => s.country))
        ).filter(country => country && country.trim() !== "");
        
        const uniqueFields = Array.from(
          new Set(allScholarships.flatMap(s => s.fields || []))
        ).filter(field => field && field.trim() !== "");
        
        const uniqueLevels = Array.from(
          new Set(allScholarships.map(s => s.level))
        ).filter(level => level && level.trim() !== "");
        
        setCountries(uniqueCountries);
        setFields(uniqueFields);
        setLevels(uniqueLevels);
      }
    } catch (error) {
      console.error("Error in fetchScholarships:", error);
      
      // Fallback to local data on error
      try {
        const localData = await import('@/data/scholarships');
        const localScholarships = localData.scholarships as Scholarship[];
        
        setScholarships(localScholarships);
        
        // Extract unique values and filter out empty strings
        const uniqueCountries = Array.from(
          new Set(localScholarships.map(s => s.country))
        ).filter(country => country && country.trim() !== "");
        
        const uniqueFields = Array.from(
          new Set(localScholarships.flatMap(s => s.fields || []))
        ).filter(field => field && field.trim() !== "");
        
        const uniqueLevels = Array.from(
          new Set(localScholarships.map(s => s.level))
        ).filter(level => level && level.trim() !== "");
        
        setCountries(uniqueCountries);
        setFields(uniqueFields);
        setLevels(uniqueLevels);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load scholarships data"
        });
        setScholarships([]);
      }
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
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="pattern-border pb-2">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Scholarships</h1>
        </div>
        <p className="max-w-[600px] text-muted-foreground">
          Find and filter international scholarships available for Myanmar students.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scholarships..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="md:w-auto flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">Advanced Filters</span>
            <span className="md:hidden">Filters</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedCountry || "_all"} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedField || "_all"} onValueChange={handleFieldChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Field of Study" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Fields</SelectItem>
              {fields.map(field => (
                <SelectItem key={field} value={field}>{field}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLevel || "_all"} onValueChange={handleLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Degree Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Levels</SelectItem>
              {levels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {filteredScholarships.length} scholarships found
        </span>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-myanmar-jade" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && scholarships.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No scholarships found</h3>
          <p className="text-muted-foreground mt-2">Try importing scholarship data from your web scraper</p>
        </div>
      )}

      {/* No results after filtering */}
      {!isLoading && scholarships.length > 0 && filteredScholarships.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No scholarships match your filters</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search term</p>
        </div>
      )}

      {/* Scholarships grid */}
      {!isLoading && filteredScholarships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="scholarship-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className="bg-myanmar-jade hover:bg-myanmar-jade/90">{scholarship.level}</Badge>
                  <Badge variant="outline">{scholarship.country}</Badge>
                </div>
                <CardTitle className="mt-2 text-lg">{scholarship.title}</CardTitle>
                <CardDescription>{scholarship.institution}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(scholarship.fields) && scholarship.fields.map((field, index) => (
                    field ? <Badge key={index} variant="outline" className="text-xs">{field}</Badge> : null
                  ))}
                </div>
                <p className="line-clamp-3 text-sm">
                  {scholarship.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/scholarships/${scholarship.id}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
