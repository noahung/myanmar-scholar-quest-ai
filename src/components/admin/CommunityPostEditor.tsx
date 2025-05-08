
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Image, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

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
type BlogPostFormValues = z.output<typeof blogPostFormSchema>;

export function CommunityPostEditor() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<BlogPostFormInput>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      image: undefined
    }
  });

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
      // The zodResolver transforms the input values according to the schema
      // So tags will be automatically transformed from a comma-separated string to an array
      const transformedValues = blogPostFormSchema.parse(values);
      let imageUrl = null;
      
      // Upload image if provided
      if (transformedValues.image && transformedValues.image.length > 0) {
        const file = transformedValues.image[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `community-posts/${fileName}`;
        
        // Create storage bucket if it doesn't exist (this will be handled by Supabase policies)
        
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
      
      // Insert post into database
      const { data, error } = await supabase
        .from('community_posts')
        .insert([
          {
            title: transformedValues.title,
            content: transformedValues.content,
            tags: transformedValues.tags,
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

  return (
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
  );
}
