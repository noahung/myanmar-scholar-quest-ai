import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthContext";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function BlogEditor() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return <div className="container py-10">You do not have permission to access this page.</div>;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(slugify(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("blogs").insert({
      title,
      slug,
      cover_image_url: coverImageUrl,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      content,
      published,
      author_id: user?.id,
      author_name: user?.full_name || user?.email || "Admin"
    });
    setLoading(false);
    if (!error) navigate("/blog");
    // TODO: show error if needed
  };

  return (
    <div className="container py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-myanmar-maroon">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={title} onChange={handleTitleChange} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Slug</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={slug} onChange={e => setSlug(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Cover Image URL</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Tags (comma separated)</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Content (Markdown)</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-[200px] font-mono" value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} id="published" />
          <label htmlFor="published">Published</label>
        </div>
        <Button type="submit" className="bg-myanmar-gold text-myanmar-maroon font-bold rounded-full" disabled={loading}>
          {loading ? "Saving..." : "Save Blog Post"}
        </Button>
      </form>
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-2">Preview</h2>
        <Card className="p-4">
          <ReactMarkdown className="prose max-w-none text-myanmar-maroon">
            {content || "Nothing to preview yet..."}
          </ReactMarkdown>
        </Card>
      </div>
    </div>
  );
} 