
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase-client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false);

  // Check if we have a code and state in the URL (Google OAuth callback)
  useEffect(() => {
    const checkForOAuthCode = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      
      if (code && state) {
        // If we have OAuth parameters, show a toast to indicate login processing
        toast({
          title: "Processing login...",
          description: "Please wait while we complete your authentication."
        });
      }
    };
    
    checkForOAuthCode();
  }, [location]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Show welcome toast only if we haven't shown it yet during this session
          if (!hasShownWelcomeToast) {
            toast({
              title: "Signed in successfully",
              description: `Welcome${newSession?.user?.user_metadata?.full_name ? ', ' + newSession.user.user_metadata.full_name : ''}!`
            });
            setHasShownWelcomeToast(true);
          }
          
          // Navigate to home or previous page after login
          if (location.pathname === '/login') {
            navigate("/");
          }

          // Defer fetching user profile with setTimeout to prevent deadlock
          if (newSession?.user) {
            setTimeout(() => {
              fetchUserProfile(newSession.user.id);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          setHasShownWelcomeToast(false);
          
          toast({
            title: "Signed out successfully",
          });
        } else if (event === 'USER_UPDATED') {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Defer fetching user profile with setTimeout to prevent deadlock
          if (newSession?.user) {
            setTimeout(() => {
              fetchUserProfile(newSession.user.id);
            }, 0);
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        fetchUserProfile(existingSession.user.id);
        // Don't show welcome toast on initial load for existing sessions
        setHasShownWelcomeToast(true);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(userId: string) {
    try {
      console.log("Fetching user profile for:", userId);
      
      // Check if the profiles table exists first
      try {
        // First, check if the profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin, full_name, avatar_url, email')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          // Check if it's a "relation does not exist" error
          if (error.message?.includes("does not exist")) {
            console.log("Profiles table doesn't exist, creating it...");
            // Create the profiles table
            await createProfilesTableIfNeeded();
            // Then create the user profile
            await createUserProfile(userId);
          }
        } else if (!data) {
          // If profile doesn't exist, create one
          console.log("Profile doesn't exist, creating one");
          await createUserProfile(userId);
          setIsAdmin(false);
        } else {
          console.log("Found profile with is_admin:", data.is_admin);
          setIsAdmin(!!data.is_admin);
        }
      } catch (error) {
        console.error('Error in profile check:', error);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setIsLoading(false);
    }
  }

  // Helper function to create the user profile
  async function createUserProfile(userId: string) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0],
            email: userData.user.email,
            avatar_url: userData.user.user_metadata?.avatar_url || null,
            is_admin: false
          });
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
        
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  // Helper function to create the profiles table if it doesn't exist
  async function createProfilesTableIfNeeded() {
    // This is a placeholder - we'd actually need to handle this server-side
    // through a migration or RPC function as client doesn't have permission to create tables
    console.log("Note: Profiles table needs to be created from server-side");
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error) {
        setHasShownWelcomeToast(true); // Prevent duplicate toast
      } else {
        console.error("Sign in error:", error);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message || "Invalid credentials"
        });
      }
      
      setIsLoading(false);
      return { error };
    } catch (error) {
      console.error("Sign in exception:", error);
      toast({
        variant: "destructive",
        title: "Sign in error",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      setIsLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
          },
          // This makes it more likely that the callback will succeed
          emailRedirectTo: window.location.origin
        },
      });
      
      if (!error) {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account."
        });
        
        // Even without requiring email verification, we can redirect to home
        setHasShownWelcomeToast(true);
        navigate("/");
      } else {
        console.error("Sign up error:", error);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message
        });
      }
      
      setIsLoading(false);
      return { error };
    } catch (error) {
      console.error("Sign up exception:", error);
      toast({
        variant: "destructive",
        title: "Sign up error",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      setIsLoading(false);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign-in process");
      
      // Get the current origin with protocol
      const redirectTo = window.location.origin;
      console.log("Redirect URL:", redirectTo);
      
      // Show a toast to inform the user
      toast({
        title: "Connecting to Google",
        description: "You'll be redirected to sign in with Google."
      });
      
      // Use the origin as the redirect URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            // This tells Google to create a new user if they don't exist
            prompt: 'select_account',
            access_type: 'offline',
          }
        },
      });
      
      console.log("SignInWithOAuth response:", { data, error });
      
      if (error) {
        console.error("Google sign-in error:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message
        });
      }
      
      return { error };
    } catch (error) {
      console.error("Google sign-in exception:", error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        toast({
          title: "Signed out successfully",
        });
        navigate("/");
      } else {
        console.error("Sign out error:", error);
        toast({
          variant: "destructive",
          title: "Sign out failed",
          description: error.message
        });
      }
      return { error };
    } catch (error) {
      console.error("Sign out exception:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out"
      });
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
