import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!error && data) setBlog(data);
      setLoading(false);
    }
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="container py-10">Loading...</div>;
  if (!blog) return <div className="container py-10">Blog post not found.</div>;

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <Button asChild variant="outline" className="mb-6 rounded-full border-myanmar-maroon text-myanmar-maroon font-bold">
        <Link to="/blog">Back to Blog</Link>
      </Button>
      {blog.cover_image_url && (
        <img src={blog.cover_image_url} alt={blog.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      )}
      <h1 className="text-3xl font-bold text-myanmar-maroon mb-2">{blog.title}</h1>
      <div className="text-sm text-muted-foreground mb-6">
        {blog.author_name} • {new Date(blog.created_at).toLocaleDateString()}
      </div>
      <Card className="p-6">
        <ReactMarkdown className="prose max-w-none text-myanmar-maroon">
          {blog.content}
        </ReactMarkdown>
      </Card>
    </div>
  );
} 