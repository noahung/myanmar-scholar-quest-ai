
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        // Defer fetching user profile with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
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
      // First, check if the profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin, full_name, avatar_url, email')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // If profile doesn't exist, create one
        const { data: userData } = await supabase.auth.getUser(userId);
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
      } else {
        setIsAdmin(!!data.is_admin);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setIsLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error) {
        toast({
          title: "Signed in successfully",
          description: "Welcome back!"
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
          },
        },
      });
      
      if (!error) {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account."
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Get the current origin with protocol
      const origin = window.location.origin;
      
      // Use the origin as the redirect URL
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      return { error };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
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
