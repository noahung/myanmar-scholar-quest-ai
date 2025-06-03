import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase-client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/postgrest-js";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

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
  const { toast, dismiss } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownWelcomeToast = React.useRef(false);
  const isInitialized = React.useRef(false);

  // Check if we have a code and state in the URL (Google OAuth callback)
  useEffect(() => {
    const checkForOAuthCode = async () => {
      let searchParams = new URLSearchParams(window.location.search);
      let code = searchParams.get('code');
      let state = searchParams.get('state');
      console.log('[AuthContext] OAuth check: code:', code, 'state:', state, 'search:', window.location.search);

      // If not found in main URL, check ?redirect= param (for GitHub Pages/SPA 404.html redirects)
      if ((!code || !state) && searchParams.get('redirect')) {
        try {
          const redirectParam = searchParams.get('redirect');
          if (redirectParam) {
            // Fix: decode the redirect param before extracting code/state
            const decoded = decodeURIComponent(redirectParam);
            let codeFromRedirect = null;
            let stateFromRedirect = null;
            const qIndex = decoded.indexOf('?');
            if (qIndex !== -1) {
              const qs = decoded.substring(qIndex + 1);
              const params = new URLSearchParams(qs);
              codeFromRedirect = params.get('code');
              stateFromRedirect = params.get('state');
            }
            if (codeFromRedirect && stateFromRedirect) {
              code = codeFromRedirect;
              state = stateFromRedirect;
              window.history.replaceState({}, document.title, window.location.pathname);
              console.log('[AuthContext] Extracted code/state from redirect param:', code, state);
            }
          }
        } catch (e) {
          console.error('[AuthContext] Error parsing redirect param:', e);
        }
      }

      if (code && state) {
        console.log('[AuthContext] Detected OAuth code in URL (main or redirect) on route:', window.location.pathname, 'code:', code, 'state:', state);
        setIsLoading(true);
        toast({
          title: 'Processing login...',
          description: 'Please wait while we complete your authentication.'
        });

        try {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          console.log('[AuthContext] exchangeCodeForSession result:', { data, error });
          if (error) {
            console.error('[AuthContext] Error exchanging code for session:', error);
            toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: error.message,
              duration: 2000
            });
          } else {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            console.log('[AuthContext] Session and user set after exchange:', data.session, data.session?.user);
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            if (data.session?.user) {
              await fetchUserProfile(data.session.user.id);
            }
          }
        } catch (error) {
          console.error('[AuthContext] Error in OAuth callback:', error);
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'An unexpected error occurred during authentication.',
            duration: 2000
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('[AuthContext] No OAuth code/state found in URL.');
      }
    };
    checkForOAuthCode();
  }, [location]);

  useEffect(() => {
    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[AuthContext] Auth state changed:', event, 'Session:', newSession?.user?.id, newSession);
        if (!mounted) return;
        try {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('[AuthContext] Setting session and user');
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSession?.user && !hasShownWelcomeToast.current) {
              dismiss();
              console.log('[AuthContext] Attempting to fetch profile data for user:', newSession.user.id);
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
              });
              try {
                const result = await Promise.race([
                  supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', newSession.user.id)
                    .single(),
                  timeoutPromise
                ]) as PostgrestSingleResponse<Profile>;
                const { data: profileData, error: profileError } = result;
                console.log('[AuthContext] Profile fetch response:', { data: profileData, error: profileError });
                if (profileError) {
                  console.error('[AuthContext] Error fetching profile:', profileError);
                  if (
                    profileError.message?.includes('found') ||
                    profileError.code === 'PGRST116' ||
                    profileError.message?.includes('multiple (or no) row is returned')
                  ) {
                    console.log('[AuthContext] Profile not found, creating new profile');
                    await createUserProfile(newSession.user.id);
                  }
                } else if (profileData) {
                  console.log('[AuthContext] Profile found:', profileData);
                  setIsAdmin(!!profileData.is_admin);
                  const userName = profileData.full_name || newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0];
                  toast({
                    title: 'Signed in successfully',
                    description: `Welcome${userName ? ', ' + userName : ''}!`,
                    duration: 1500
                  });
                }
                hasShownWelcomeToast.current = true;
                if (location.pathname === '/login') {
                  navigate('/');
                }
              } catch (error) {
                console.error('[AuthContext] Profile fetch failed:', error);
                toast({
                  title: 'Signed in',
                  description: 'Welcome! Profile data may be incomplete.',
                  duration: 1500
                });
                hasShownWelcomeToast.current = true;
              }
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('[AuthContext] Handling sign out');
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            hasShownWelcomeToast.current = false;
            dismiss();
            toast({
              title: 'Signed out successfully',
              duration: 1500
            });
          }
        } catch (error) {
          console.error('[AuthContext] Error in auth state change:', error);
        } finally {
          console.log('[AuthContext] Setting isLoading to false after auth state change');
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (existingSession?.user) {
          console.log("Found existing session for user:", existingSession.user.id);
          setSession(existingSession);
          setUser(existingSession.user);
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', existingSession.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile in initializeAuth:", profileError);
            if (
              profileError.message?.includes('found') ||
              profileError.code === 'PGRST116' ||
              profileError.message?.includes('multiple (or no) row is returned')
            ) {
              console.log("Profile not found in initializeAuth, creating new profile");
              await createUserProfile(existingSession.user.id);
            }
          } else {
            console.log("Profile found in initializeAuth:", profileData);
            setIsAdmin(!!profileData?.is_admin);
            hasShownWelcomeToast.current = true;
          }
        } else {
          console.log("No existing session found");
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        if (mounted) {
          console.log("Setting isLoading to false after initialization");
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
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
      console.log("Creating user profile for:", userId);
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        // Get name from various possible sources
        const fullName = 
          userData.user.user_metadata?.full_name || 
          userData.user.user_metadata?.name ||
          userData.user.user_metadata?.given_name && userData.user.user_metadata?.family_name 
            ? `${userData.user.user_metadata.given_name} ${userData.user.user_metadata.family_name}`.trim()
            : userData.user.email?.split('@')[0];

        console.log("Inserting new profile with name:", fullName);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: fullName,
            email: userData.user.email,
            avatar_url: userData.user.user_metadata?.avatar_url || null,
            is_admin: false
          });
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        } else {
          console.log("Successfully created user profile");
        }
        
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
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
        hasShownWelcomeToast.current = true; // Prevent duplicate toast
      } else {
        console.error("Sign in error:", error);
        dismiss();
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message || "Invalid credentials",
          duration: 1500
        });
      }
      
      setIsLoading(false);
      return { error };
    } catch (error) {
      console.error("Sign in exception:", error);
      dismiss();
      toast({
        variant: "destructive",
        title: "Sign in error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        duration: 1500
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
          emailRedirectTo: window.location.origin
        },
      });
      
      if (!error) {
        dismiss();
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
          duration: 1500
        });
        hasShownWelcomeToast.current = true;
        navigate("/");
      } else {
        console.error("Sign up error:", error);
        dismiss();
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
          duration: 1500
        });
      }
      
      setIsLoading(false);
      return { error };
    } catch (error) {
      console.error("Sign up exception:", error);
      dismiss();
      toast({
        variant: "destructive",
        title: "Sign up error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        duration: 1500
      });
      setIsLoading(false);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign-in process");
      // Always use the canonical login route for redirect
      const redirectTo = window.location.origin + "/login";
      console.log("Setting redirect URL:", redirectTo);
      dismiss();
      toast({
        title: "Connecting to Google",
        description: "You'll be redirected to sign in with Google.",
        duration: 1500
      });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          }
        },
      });
      console.log("SignInWithOAuth response:", { data, error });
      if (error) {
        console.error("Google sign-in error:", error);
        dismiss();
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
          duration: 1500
        });
      }
      return { error };
    } catch (error) {
      console.error("Google sign-in exception:", error);
      dismiss();
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred",
        duration: 1500
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        dismiss();
        toast({
          title: "Signed out successfully",
          duration: 1500
        });
        navigate("/");
      } else {
        console.error("Sign out error:", error);
        dismiss();
        toast({
          variant: "destructive",
          title: "Sign out failed",
          description: error.message,
          duration: 1500
        });
      }
      return { error };
    } catch (error) {
      console.error("Sign out exception:", error);
      dismiss();
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
        duration: 1500
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
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
