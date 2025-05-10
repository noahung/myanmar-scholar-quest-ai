
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuideEditor } from "@/components/admin/GuideEditor";
import { CommunityPostEditor } from "@/components/admin/CommunityPostEditor";
import { ScholarshipEditor } from "@/components/admin/ScholarshipEditor";
import { useIsAdmin } from "@/components/admin/AdminCheck";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserCheck, Shield, Settings, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { UserAdminTable } from "@/components/admin/UserAdminTable";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";

type Comment = {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  post_title?: string;
}

export default function AdminPage() {
  const { isAdmin, isLoading } = useIsAdmin();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isDeletingComment, setIsDeletingComment] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchComments();
    }
  }, [isAdmin]);

  async function fetchComments() {
    try {
      setIsCommentsLoading(true);
      
      // Fetch all comments with post and user details
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          post:post_id (
            title
          ),
          profile:user_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedComments = data?.map(comment => ({
        id: comment.id,
        post_id: comment.post_id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        user_name: comment.profile?.full_name || 'Unknown User',
        post_title: comment.post?.title || 'Unknown Post'
      }));
      
      setComments(formattedComments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load comments."
      });
    } finally {
      setIsCommentsLoading(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      setIsDeletingComment(commentId);
      
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) {
        throw error;
      }
      
      setComments(comments.filter(comment => comment.id !== commentId));
      
      toast({
        title: "Comment Deleted",
        description: "The comment has been successfully removed."
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment."
      });
    } finally {
      setIsDeletingComment(null);
    }
  }

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scholarships">{t('Scholarships')}</TabsTrigger>
          <TabsTrigger value="guides">{t('Educational Guides')}</TabsTrigger>
          <TabsTrigger value="community">{t('Community Posts')}</TabsTrigger>
          <TabsTrigger value="comments">{t('Comments')}</TabsTrigger>
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
        
        <TabsContent value="comments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Comments</CardTitle>
              <CardDescription>
                Review and moderate comments across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCommentsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No comments found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Post</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium">
                            {comment.post_title}
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <div className="truncate">{comment.content}</div>
                          </TableCell>
                          <TableCell>{comment.user_name}</TableCell>
                          <TableCell>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={isDeletingComment === comment.id}
                            >
                              {isDeletingComment === comment.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              <span className="ml-2">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
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
