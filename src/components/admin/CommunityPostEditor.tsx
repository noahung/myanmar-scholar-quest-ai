
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Image } from "lucide-react";

// Schema for the blog post form
const blogPostFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
  image: z.string().optional()
});

// Define the input type (what the form receives)
type BlogPostFormInput = z.input<typeof blogPostFormSchema>;

// Define the output type (what the schema transforms the data into)
type BlogPostFormValues = z.output<typeof blogPostFormSchema>;

export function CommunityPostEditor() {
  const form = useForm<BlogPostFormInput>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      image: ""
    }
  });

  function onSubmit(values: BlogPostFormInput) {
    // The zodResolver transforms the input values according to the schema
    // So tags will be automatically transformed from a comma-separated string to an array
    const transformedValues = blogPostFormSchema.parse(values);
    
    toast({
      title: "Post Created",
      description: "Your community post has been published.",
    });
    console.log(transformedValues);
    // This will be replaced with Supabase insert once integrated
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
                Markdown formatting is supported (rich text editor will be implemented)
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
              <div className="flex gap-2">
                <Input 
                  id="image" 
                  placeholder="http://example.com/image.jpg"
                  {...form.register("image")} 
                />
                <Button type="button" variant="outline" size="icon">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a URL or upload an image (Supabase storage will be implemented)
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button type="submit" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Publish Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
