
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowRight, BookmarkMinus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { scholarships as localScholarships } from "@/data/scholarships";

export interface SavedScholarshipProps {
  className?: string;
}

export function SavedScholarships({ className }: SavedScholarshipProps) {
  const [savedScholarships, setSavedScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedScholarships();
    } else {
      setLoading(false);
      setSavedScholarships([]);
    }
  }, [user]);

  const fetchSavedScholarships = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_scholarships')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;

      // For each saved scholarship, get the scholarship details
      if (data && data.length > 0) {
        const scholarshipDetails = await Promise.all(data.map(async (saved) => {
          // Try to get from Supabase first
          try {
            const { data: schData, error: schError } = await supabase
              .from('scholarships')
              .select('*')
              .eq('id', saved.scholarship_id)
              .maybeSingle();
              
            if (schData) {
              return { ...schData, savedId: saved.id };
            }
          } catch (err) {
            console.error("Error fetching scholarship:", err);
          }
          
          // Fall back to local data
          const localScholarship = localScholarships.find(s => s.id === saved.scholarship_id);
          if (localScholarship) {
            return { ...localScholarship, savedId: saved.id };
          }
          
          return null;
        }));
        
        // Filter out null values (scholarships not found)
        setSavedScholarships(scholarshipDetails.filter(Boolean));
      } else {
        setSavedScholarships([]);
      }
    } catch (error) {
      console.error("Error fetching saved scholarships:", error);
      toast({
        title: "Error",
        description: "Failed to load saved scholarships",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (savedId: string) => {
    try {
      const { error } = await supabase
        .from('saved_scholarships')
        .delete()
        .eq('id', savedId);
        
      if (error) throw error;
      
      setSavedScholarships(prev => prev.filter(s => s.savedId !== savedId));
      
      toast({
        title: "Scholarship removed",
        description: "Scholarship removed from saved items."
      });
    } catch (error) {
      console.error("Error removing scholarship:", error);
      toast({
        title: "Error",
        description: "Failed to remove scholarship",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Saved Scholarships</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="mb-4">You need to sign in to view your saved scholarships.</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Saved Scholarships</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : savedScholarships.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">You haven't saved any scholarships yet.</p>
            <Button asChild>
              <Link to="/scholarships">Browse Scholarships</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedScholarships.map((scholarship) => (
              <div key={scholarship.savedId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{scholarship.title}</h3>
                    <p className="text-sm text-muted-foreground">{scholarship.institution}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemove(scholarship.savedId)}
                  >
                    <BookmarkMinus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 my-2">
                  <Badge variant="outline">{scholarship.level}</Badge>
                  <Badge variant="outline">{scholarship.country}</Badge>
                  {scholarship.deadline && new Date(scholarship.deadline) < new Date() && (
                    <Badge variant="destructive">Deadline Passed</Badge>
                  )}
                </div>
                <div className="mt-2">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={`/scholarships/${scholarship.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
