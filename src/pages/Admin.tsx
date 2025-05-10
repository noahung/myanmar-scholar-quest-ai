
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuideEditor } from "@/components/admin/GuideEditor";
import { CommunityPostEditor } from "@/components/admin/CommunityPostEditor";
import { ScholarshipEditor } from "@/components/admin/ScholarshipEditor";
import { useIsAdmin } from "@/components/admin/AdminCheck";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserCheck, Shield, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { UserAdminTable } from "@/components/admin/UserAdminTable";

export default function AdminPage() {
  const { isAdmin, isLoading } = useIsAdmin();
  const { toast } = useToast();
  const { t } = useLanguage();

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
          <h1 className="text-3xl font-bold tracking-tighter mb-2">{t('Admin Dashboard')}</h1>
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

      <UserAdminTable />

      <Tabs defaultValue="scholarships" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scholarships">{t('Scholarships')}</TabsTrigger>
          <TabsTrigger value="guides">{t('Educational Guides')}</TabsTrigger>
          <TabsTrigger value="community">{t('Community Posts')}</TabsTrigger>
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
