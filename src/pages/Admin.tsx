
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuideEditor } from "@/components/admin/GuideEditor";
import { CommunityPostEditor } from "@/components/admin/CommunityPostEditor";
import { useIsAdmin } from "@/components/admin/AdminCheck";

export default function AdminPage() {
  const { isAdmin, isLoading } = useIsAdmin();

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

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides">Educational Guides</TabsTrigger>
          <TabsTrigger value="community">Community Posts</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides" className="mt-6">
          <GuideEditor />
        </TabsContent>
        
        <TabsContent value="community" className="mt-6">
          <CommunityPostEditor />
        </TabsContent>
        
        <TabsContent value="scholarships" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Management</CardTitle>
              <CardDescription>
                Scholarships are managed through the Python scraper. You can view and manually edit them here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The scholarship data is automatically collected via the Python scraper.
                Database connection will be implemented once Supabase is connected.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
