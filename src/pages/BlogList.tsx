import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_id?: string;
  author_name?: string;
  cover_image_url?: string;
  tags?: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (!error && data) setBlogs(data);
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  // Add a mock blog post if there are no blogs
  const displayBlogs = blogs.length === 0 ? [
    {
      id: "mock-1",
      title: "Welcome to the Scholar-M Blog!",
      slug: "welcome-to-the-scholar-m-blog",
      content: "This is a mock blog post. You can use markdown to write your content.\n\n**Features:**\n- Write in markdown\n- Add cover images\n- Tag your posts\n- And more!",
      author_id: undefined,
      author_name: "Admin",
      cover_image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      tags: ["welcome", "demo"],
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ] : blogs;

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-myanmar-maroon">Blog</h1>
        {isAdmin && (
          <Button asChild className="bg-myanmar-gold text-myanmar-maroon font-bold rounded-full">
            <Link to="/blog/new">New Blog Post</Link>
          </Button>
        )}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : displayBlogs.length === 0 ? (
        <div>No blog posts yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBlogs.map(blog => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow">
              {blog.cover_image_url && (
                <img src={blog.cover_image_url} alt={blog.title} className="w-full h-48 object-cover rounded-t-xl" />
              )}
              <CardHeader>
                <CardTitle>
                  <Link to={`/blog/${blog.slug}`} className="hover:underline text-myanmar-maroon">
                    {blog.title}
                  </Link>
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-1">
                  {blog.author_name} • {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-myanmar-maroon/80 mb-2">
                  {blog.content.replace(/[#*_`>\-\[\]!\(\)]/g, '').slice(0, 120)}...
                </p>
                <Link to={`/blog/${blog.slug}`} className="text-myanmar-gold font-semibold hover:underline">Read More</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 