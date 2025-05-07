
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scholarships } from "@/data/scholarships";
import { 
  BookOpen, 
  MessageCircle, 
  GraduationCap, 
  Globe, 
  Calendar, 
  ArrowRight 
} from "lucide-react";

export default function Home() {
  // Get featured scholarships
  const featuredScholarships = scholarships.filter(scholarship => scholarship.featured);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Find Your Path to Global Education
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                Scholar-M helps Myanmar students discover and apply for international 
                scholarships and educational opportunities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:justify-center">
              <Button asChild size="lg" className="bg-myanmar-gold hover:bg-myanmar-gold/90 text-black">
                <Link to="/scholarships">
                  Browse Scholarships
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-myanmar-maroon">
                <Link to="/community">
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="pattern-border pb-2">
              <h2 className="text-3xl font-bold tracking-tighter">Featured Scholarships</h2>
            </div>
            <p className="max-w-[600px] text-muted-foreground">
              Explore these highlighted scholarship opportunities curated for Myanmar students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScholarships.map((scholarship) => (
              <Card key={scholarship.id} className="scholarship-card animate-slide-in">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge className="bg-myanmar-jade hover:bg-myanmar-jade/90">{scholarship.level}</Badge>
                    <Badge variant="outline">{scholarship.country}</Badge>
                  </div>
                  <CardTitle className="mt-2">{scholarship.title}</CardTitle>
                  <CardDescription>{scholarship.institution}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
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
          
          <div className="mt-10 text-center">
            <Button asChild variant="default">
              <Link to="/scholarships">
                View All Scholarships
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/50 myanmar-pattern">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="pattern-border pb-2">
              <h2 className="text-3xl font-bold tracking-tighter">What We Offer</h2>
            </div>
            <p className="max-w-[600px] text-muted-foreground">
              Scholar-M provides comprehensive resources to help you achieve your educational goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-myanmar-maroon mb-2" />
                <CardTitle>Scholarship Finder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Discover scholarships tailored to your profile, with detailed information and application guidance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-myanmar-maroon mb-2" />
                <CardTitle>Educational Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access comprehensive guides on application processes, visa requirements, and study abroad tips.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-myanmar-maroon mb-2" />
                <CardTitle>Community Forum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with fellow students, share experiences, and learn from those who've succeeded.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <Globe className="h-8 w-8 text-myanmar-maroon mb-2" />
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get personalized help with our bilingual AI assistant for scholarship recommendations and application support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-myanmar-maroon text-white">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Educational Journey?
          </h2>
          <p className="mb-8 max-w-[600px] text-white/80">
            Create your profile today to get personalized scholarship recommendations and connect with our community.
          </p>
          <Button asChild size="lg" className="bg-myanmar-gold hover:bg-myanmar-gold/90 text-black">
            <Link to="/signup">
              Create Free Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
