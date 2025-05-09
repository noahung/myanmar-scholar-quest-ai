
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface SavedScholarshipButtonProps {
  scholarshipId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SavedScholarshipButton({ 
  scholarshipId, 
  variant = "outline", 
  size = "default",
  className 
}: SavedScholarshipButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the scholarship is already saved
    checkIfSaved();
  }, [scholarshipId, user]);

  const checkIfSaved = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_scholarships')
        .select('id')
        .eq('user_id', user.id)
        .eq('scholarship_id', scholarshipId)
        .single();

      if (!error && data) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scholarships.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_scholarships')
          .delete()
          .eq('user_id', user.id)
          .eq('scholarship_id', scholarshipId);

        if (error) throw error;

        setIsSaved(false);
        toast({
          title: "Scholarship removed",
          description: "Scholarship removed from saved items."
        });
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_scholarships')
          .insert({
            user_id: user.id,
            scholarship_id: scholarshipId
          });

        if (error) throw error;

        setIsSaved(true);
        toast({
          title: "Scholarship saved",
          description: "Scholarship saved to your profile."
        });
      }
    } catch (error: any) {
      console.error("Error toggling save status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update saved status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={isLoading}
      className={className}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="h-4 w-4 mr-2" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4 mr-2" />
          Save
        </>
      )}
    </Button>
  );
}
