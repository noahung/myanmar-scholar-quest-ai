import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuideEditor } from "@/components/admin/GuideEditor";
import { CommunityPostEditor } from "@/components/admin/CommunityPostEditor";
import { ScholarshipEditor } from "@/components/admin/ScholarshipEditor";
import { useIsAdmin } from "@/components/admin/AdminCheck";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserCheck, Shield, Settings, MessageSquare, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { UserAdminTable } from "@/components/admin/UserAdminTable";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Save, Plus } from "lucide-react";

type Comment = {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  post_title?: string;
}

type TranslationItem = {
  key: string;
  en: string;
  my: string;
};

// Type for nested Supabase response
interface CommentWithRelations {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
  } | null;
  posts: {
    title: string | null;
  } | null;
}

export default function AdminPage() {
  const { isAdmin, isLoading } = useIsAdmin();
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isDeletingComment, setIsDeletingComment] = useState<string | null>(null);
  
  // Translation management
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [isTranslationsLoading, setIsTranslationsLoading] = useState(false);
  const [isSavingTranslation, setIsSavingTranslation] = useState(false);
  const [newTranslationKey, setNewTranslationKey] = useState('');
  const [newTranslationEn, setNewTranslationEn] = useState('');
  const [newTranslationMy, setNewTranslationMy] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchComments();
      fetchTranslations();
    }
  }, [isAdmin]);

  async function fetchComments() {
    try {
      setIsCommentsLoading(true);
      
      // Fetch all comments with post and user details
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          post_id,
          profiles:user_id (
            full_name
          ),
          posts:post_id (
            title
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log("Fetched comments data:", data);
      
      // Cast the data with proper type assertion
      const commentsWithRelations = data as unknown as CommentWithRelations[];
      
      const formattedComments = commentsWithRelations.map(comment => ({
        id: comment.id,
        post_id: comment.post_id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        user_name: comment.profiles?.full_name || 'Unknown User',
        post_title: comment.posts?.title || 'Unknown Post'
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

  async function fetchTranslations() {
    try {
      setIsTranslationsLoading(true);
      
      // Get translations from the database
      const { data: storedTranslations, error } = await supabase
        .from('translations')
        .select('*')
        .order('key', { ascending: true });
      
      if (error) {
        // If table doesn't exist yet, we'll initialize with default translations
        console.error("Error fetching translations:", error);
        
        // Convert the built-in translations to our format
        const initialTranslations: TranslationItem[] = Object.entries(useLanguage().translations).map(([key, values]) => ({
          key,
          en: values.en,
          my: values.my,
        }));
        
        setTranslations(initialTranslations);
      } else {
        setTranslations(storedTranslations || []);
      }
    } catch (error) {
      console.error("Error in fetchTranslations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load translations."
      });
    } finally {
      setIsTranslationsLoading(false);
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

  const handleTranslationChange = (index: number, field: 'en' | 'my', value: string) => {
    const updatedTranslations = [...translations];
    updatedTranslations[index][field] = value;
    setTranslations(updatedTranslations);
  };

  const saveTranslation = async (translation: TranslationItem) => {
    try {
      setIsSavingTranslation(true);
      
      // Save to the database
      const { error } = await supabase
        .from('translations')
        .upsert({ 
          key: translation.key,
          en: translation.en,
          my: translation.my
        }, { onConflict: 'key' });
      
      if (error) throw error;
      
      // Update the language context to reflect changes immediately
      useLanguage().updateTranslation(translation.key, {
        en: translation.en,
        my: translation.my
      });
      
      toast({
        title: "Translation Saved",
        description: "Your changes have been applied successfully."
      });
      
    } catch (error) {
      console.error("Error saving translation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save translation."
      });
    } finally {
      setIsSavingTranslation(false);
    }
  };

  const addNewTranslation = async () => {
    if (!newTranslationKey || !newTranslationEn || !newTranslationMy) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all translation fields."
      });
      return;
    }
    
    // Check if key already exists
    if (translations.some(t => t.key === newTranslationKey)) {
      toast({
        variant: "destructive",
        title: "Duplicate Key",
        description: "This translation key already exists."
      });
      return;
    }
    
    try {
      setIsSavingTranslation(true);
      
      const newTranslation = {
        key: newTranslationKey,
        en: newTranslationEn,
        my: newTranslationMy
      };
      
      // Save to database
      const { error } = await supabase
        .from('translations')
        .insert(newTranslation);
      
      if (error) throw error;
      
      // Add to state
      setTranslations([...translations, newTranslation]);
      
      // Update context
      useLanguage().updateTranslation(newTranslationKey, {
        en: newTranslationEn,
        my: newTranslationMy
      });
      
      // Clear form
      setNewTranslationKey('');
      setNewTranslationEn('');
      setNewTranslationMy('');
      
      toast({
        title: "Translation Added",
        description: "New translation has been added successfully."
      });
      
    } catch (error) {
      console.error("Error adding translation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add new translation."
      });
    } finally {
      setIsSavingTranslation(false);
    }
  };

  const deleteTranslation = async (key: string) => {
    try {
      setIsSavingTranslation(true);
      
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('key', key);
      
      if (error) throw error;
      
      // Remove from state
      setTranslations(translations.filter(t => t.key !== key));
      
      toast({
        title: "Translation Deleted",
        description: "The translation has been removed."
      });
      
    } catch (error) {
      console.error("Error deleting translation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete translation."
      });
    } finally {
      setIsSavingTranslation(false);
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="scholarships">{t('Scholarships')}</TabsTrigger>
          <TabsTrigger value="guides">{t('Educational Guides')}</TabsTrigger>
          <TabsTrigger value="community">{t('Community Posts')}</TabsTrigger>
          <TabsTrigger value="comments">{t('Comments')}</TabsTrigger>
          <TabsTrigger value="translations">{t('Translations')}</TabsTrigger>
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
        
        <TabsContent value="translations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Translations</CardTitle>
              <CardDescription>
                Edit translations for all text across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-end gap-4 border-b pb-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="newTranslationKey">Translation Key</Label>
                    <Input 
                      id="newTranslationKey" 
                      placeholder="e.g., 'Welcome_Message'"
                      value={newTranslationKey}
                      onChange={(e) => setNewTranslationKey(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="newTranslationEn">English Text</Label>
                    <Input 
                      id="newTranslationEn" 
                      placeholder="e.g., 'Welcome to the platform'"
                      value={newTranslationEn}
                      onChange={(e) => setNewTranslationEn(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="newTranslationMy">Myanmar Text</Label>
                    <Input 
                      id="newTranslationMy" 
                      placeholder="e.g., 'ပလက်ဖောင်းသို့ ကြိုဆိုပါသည်'"
                      value={newTranslationMy}
                      onChange={(e) => setNewTranslationMy(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={addNewTranslation} 
                    disabled={isSavingTranslation}
                  >
                    {isSavingTranslation ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add
                  </Button>
                </div>
                
                {isTranslationsLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : translations.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No translations found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Key</TableHead>
                          <TableHead>English</TableHead>
                          <TableHead>Myanmar</TableHead>
                          <TableHead className="w-[180px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {translations.map((translation, index) => (
                          <TableRow key={translation.key}>
                            <TableCell className="font-medium">
                              {translation.key}
                            </TableCell>
                            <TableCell>
                              <Input
                                value={translation.en}
                                onChange={(e) => handleTranslationChange(index, 'en', e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={translation.my}
                                onChange={(e) => handleTranslationChange(index, 'my', e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => saveTranslation(translation)}
                                  disabled={isSavingTranslation}
                                >
                                  {isSavingTranslation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                  <span className="ml-2">Save</span>
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteTranslation(translation.key)}
                                  disabled={isSavingTranslation}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
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
