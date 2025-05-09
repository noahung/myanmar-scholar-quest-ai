
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuideEditor } from "@/components/admin/GuideEditor";
import { CommunityPostEditor } from "@/components/admin/CommunityPostEditor";
import { ScholarshipEditor } from "@/components/admin/ScholarshipEditor";
import { useIsAdmin } from "@/components/admin/AdminCheck";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserCheck, Shield, Settings } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function AdminPage() {
  const { isAdmin, isLoading } = useIsAdmin();
  const [email, setEmail] = useState("");
  const [makingAdmin, setMakingAdmin] = useState(false);
  const { toast } = useToast();

  // Function to make a user an admin
  const makeUserAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    try {
      setMakingAdmin(true);
      const { data, error } = await supabase.rpc('make_user_admin', {
        user_email: email.trim()
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `User ${email} has been made an admin`
      });
      setEmail("");
    } catch (error: any) {
      console.error("Error making user admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to make user an admin",
        variant: "destructive"
      });
    } finally {
      setMakingAdmin(false);
    }
  };

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access the admin area.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="pattern-border pb-2">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Admin Dashboard</h1>
        </div>
        <p className="max-w-[600px] text-muted-foreground">
          Manage content for Scholar-M
        </p>
      </div>

      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Admin Area</AlertTitle>
        <AlertDescription>
          You have administrative privileges. Changes made here will affect all users of the platform.
        </AlertDescription>
      </Alert>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            User Administration
          </CardTitle>
          <CardDescription>
            Grant admin privileges to other users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="max-w-xs"
            />
            <Button onClick={makeUserAdmin} disabled={makingAdmin}>
              <Shield className="h-4 w-4 mr-2" />
              {makingAdmin ? "Processing..." : "Make Admin"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scholarships" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="guides">Educational Guides</TabsTrigger>
          <TabsTrigger value="community">Community Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scholarships" className="mt-6">
          <ScholarshipEditor />
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <GuideEditor />
        </TabsContent>
        
        <TabsContent value="community" className="mt-6">
          <CommunityPostEditor />
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <a href="https://supabase.com/dashboard/project/aysvkiyuzqktcumdzxqh/editor" target="_blank" rel="noopener noreferrer">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings (Supabase Dashboard)
          </a>
        </Button>
      </div>
    </div>
  );
}
