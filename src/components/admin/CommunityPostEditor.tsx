
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Image, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Schema for the blog post form
const blogPostFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
  image: z.instanceof(FileList).optional().transform(val => val && val.length > 0 ? val : undefined)
});

// Define the input type (what the form receives)
type BlogPostFormInput = z.input<typeof blogPostFormSchema>;

// Define the output type (what the schema transforms the data into)
type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

type Post = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  image_url?: string;
};

export function CommunityPostEditor() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingPost, setIsDeletingPost] = useState<string | null>(null);
  
  const form = useForm<BlogPostFormInput>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      image: undefined
    }
  });

  // Fetch existing posts
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setPosts(data || []);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load community posts."
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: BlogPostFormInput) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create a post.",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (values.image && values.image.length > 0) {
        const file = values.image[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `community-posts/${fileName}`;
        
        try {
          // Check if bucket exists and create if needed
          const { data: buckets } = await supabase.storage.listBuckets();
          const imagesBucketExists = buckets?.some(bucket => bucket.name === 'images');
          
          if (!imagesBucketExists) {
            await supabase.storage.createBucket('images', { public: true });
          }
        } catch (err) {
          console.error("Error checking/creating bucket:", err);
        }
        
        // Upload the file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      // Ensure tags is properly formatted as an array
      const processedTags = Array.isArray(values.tags) 
        ? values.tags 
        : values.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      // Insert post into database
      const { data, error } = await supabase
        .from('community_posts')
        .insert([
          {
            title: values.title,
            content: values.content,
            tags: processedTags, // Store as array
            image_url: imageUrl,
            author_id: user.id,
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Post Created",
        description: "Your community post has been published.",
      });
      
      // Reset form
      form.reset();
      
      // Refresh posts
      fetchPosts();
      
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeletePost(postId: string) {
    if (!user) return;
    
    try {
      setIsDeletingPost(postId);
      
      // First delete all comments associated with the post
      const { error: commentsError } = await supabase
        .from('post_comments')
        .delete()
        .eq('post_id', postId);
        
      if (commentsError) {
        throw commentsError;
      }
      
      // Then delete all likes associated with the post
      const { error: likesError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId);
        
      if (likesError) {
        throw likesError;
      }
      
      // Delete the post itself
      const { error: postError } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);
        
      if (postError) {
        throw postError;
      }
      
      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted.",
      });
      
      // Refresh posts
      setPosts(posts.filter(post => post.id !== postId));
      
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete post. Please try again.",
      });
    } finally {
      setIsDeletingPost(null);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Community Post</CardTitle>
          <CardDescription>
            Share information, tips, or experiences with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  placeholder="Post title" 
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Write your post content here..."
                  rows={10}
                  {...form.register("content")}
                />
                <p className="text-xs text-muted-foreground">
                  Markdown formatting is supported
                </p>
                {form.formState.errors.content && (
                  <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags"
                  placeholder="Enter tags separated by commas (e.g. JICA, Japan, Experience)" 
                  {...form.register("tags")}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Featured Image</Label>
                <Input 
                  id="image" 
                  type="file"
                  accept="image/*"
                  {...form.register("image")}
                />
                <p className="text-xs text-muted-foreground">
                  Upload an image for your post (optional)
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Manage posts section */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Community Posts</CardTitle>
          <CardDescription>
            View and manage all community posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No posts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {post.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(post.tags) && post.tags.map((tag, i) => (
                            <Badge key={i} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(post.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          disabled={isDeletingPost === post.id}
                        >
                          {isDeletingPost === post.id ? (
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
    </div>
  );
}
