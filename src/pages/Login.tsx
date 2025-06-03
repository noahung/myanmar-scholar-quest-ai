import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  const [tab, setTab] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();

  useEffect(() => {
    // Check for ?redirect= in the URL (from 404.html redirect)
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (user && redirect) {
      // Remove ?redirect= from URL and navigate
      navigate(redirect, { replace: true });
    } else if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    try {
      setLoading(true);
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white">
      <div className="container mx-auto h-full">
        <div className="flex h-full items-center justify-center py-12">
          <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Left side - Welcome Section */}
            <motion.div 
              className="relative hidden w-1/2 p-12 text-white lg:block overflow-hidden"
              style={{
                backgroundImage: "url('https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/images//login.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <motion.h2 
                    className="text-4xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Welcome to Scholar-M
                  </motion.h2>
                  <motion.p 
                    className="mt-4 text-lg text-blue-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Your Gateway to Effortless Scholarship Journey.
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Login/Signup Form */}
            <motion.div 
              className="w-full p-8 lg:w-1/2 lg:p-12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto max-w-md">
                <motion.div
                  className="flex flex-col items-center mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <img 
                    src="https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/images//myanmar%20scholar%20logo.png" 
                    alt="Scholar-M Logo" 
                    className="h-16 w-16 mb-4 rounded-xl border-2 border-myanmar-maroon shadow" 
                  />
                  <motion.div
                    className="flex w-full mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <button
                      className={`w-1/2 py-2 font-bold text-lg transition-colors duration-200 
                        ${tab === 'signin' 
                          ? 'bg-myanmar-maroon text-white' 
                          : 'bg-gray-100 text-myanmar-maroon'} 
                        rounded-l-xl 
                        ${tab === 'signin' ? '' : 'border-r border-gray-200'}`}
                      onClick={() => setTab('signin')}
                      type="button"
                    >
                      Sign In
                    </button>
                    <button
                      className={`w-1/2 py-2 font-bold text-lg transition-colors duration-200 
                        ${tab === 'signup' 
                          ? 'bg-myanmar-maroon text-white' 
                          : 'bg-gray-100 text-myanmar-maroon'} 
                        rounded-r-xl`}
                      onClick={() => setTab('signup')}
                      type="button"
                    >
                      Sign Up
                    </button>
                  </motion.div>
                </motion.div>

                {/* Tab Content */}
                {tab === 'signin' ? (
                  <motion.form 
                    onSubmit={handleEmailSignIn}
                    className="space-y-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-myanmar-maroon hover:bg-myanmar-maroon/90 text-white"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form 
                    onSubmit={handleEmailSignUp}
                    className="space-y-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-myanmar-maroon hover:bg-myanmar-maroon/90 text-white"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
                    </Button>
                  </motion.form>
                )}

                <motion.div
                  className="relative my-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
                    OR
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 rounded-xl border-2 hover:bg-slate-50"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Continue with Google
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-6">
                    By signing {tab === 'signin' ? 'in' : 'up'}, you agree to our{' '}
                    <a href="/terms" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>{' '}
                    and{' '}
                    <a href="/privacy" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
