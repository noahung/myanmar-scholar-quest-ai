
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { API_URL, SUPABASE_ANON_KEY } from "@/lib/constants";
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
    if (user) {
      checkIfSaved();
    }
  }, [scholarshipId, user]);

  const checkIfSaved = async () => {
    if (!user) return;
    
    try {
      // Use RPC function to check if scholarship is saved
      const { data, error } = await supabase.rpc('is_scholarship_saved', {
        p_user_id: user.id,
        p_scholarship_id: scholarshipId
      });

      if (error) {
        console.error("Error checking saved status:", error);
        // Fallback to REST API
        const session = await supabase.auth.getSession();
        if (session.data.session) {
          const response = await fetch(
            `${API_URL}/saved_scholarships?user_id=eq.${user.id}&scholarship_id=eq.${scholarshipId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.data.session.access_token}`,
                'apikey': SUPABASE_ANON_KEY,
                'Accept': 'application/vnd.pgrst.object+json'
              }
            }
          );
          
          if (response.ok) {
            const result = await response.json();
            setIsSaved(!!result);
          } else {
            setIsSaved(false);
          }
        }
      } else {
        setIsSaved(!!data);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
      setIsSaved(false);
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
        // Remove from saved - use rpc function
        const { error } = await supabase.rpc('remove_saved_scholarship', {
          p_user_id: user.id,
          p_scholarship_id: scholarshipId
        });

        if (error) {
          // Fallback to REST API
          const session = await supabase.auth.getSession();
          if (session.data.session) {
            const response = await fetch(
              `${API_URL}/saved_scholarships?user_id=eq.${user.id}&scholarship_id=eq.${scholarshipId}`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.data.session.access_token}`,
                  'apikey': SUPABASE_ANON_KEY
                }
              }
            );
            
            if (!response.ok) {
              throw new Error("Failed to remove scholarship");
            }
          }
        }

        setIsSaved(false);
        toast({
          title: "Scholarship removed",
          description: "Scholarship removed from saved items."
        });
      } else {
        // Add to saved - use rpc function
        const { error } = await supabase.rpc('save_scholarship', {
          p_user_id: user.id,
          p_scholarship_id: scholarshipId
        });

        if (error) {
          // Fallback to REST API
          const session = await supabase.auth.getSession();
          if (session.data.session) {
            const response = await fetch(`${API_URL}/saved_scholarships`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.data.session.access_token}`,
                'apikey': SUPABASE_ANON_KEY,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({
                user_id: user.id,
                scholarship_id: scholarshipId
              })
            });
            
            if (!response.ok) {
              throw new Error("Failed to save scholarship");
            }
          }
        }

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
