
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

const PAGE_TITLES: Record<string, string> = {
  'about': 'About Us',
  'faq': 'Frequently Asked Questions',
  'privacy': 'Privacy Policy',
  'terms': 'Terms of Service'
};

export default function StaticPage() {
  const { pageId = 'about' } = useParams<{ pageId?: string }>();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { isAdmin } = useAuth();

  const pageTitle = PAGE_TITLES[pageId] || 'Information';

  useEffect(() => {
    fetchPageContent();
  }, [pageId]);

  async function fetchPageContent() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .select('content')
        .eq('page_id', pageId)
        .single();
      
      if (error && error.code !== 'PGSQL_RELATION_DOES_NOT_EXIST') {
        throw error;
      }
      
      if (data) {
        setContent(data.content);
        setEditContent(data.content);
      } else {
        // Default content for each page type
        let defaultContent = '';
        
        switch(pageId) {
          case 'about':
            defaultContent = `# About Scholar-M\n\nScholar-M is a platform dedicated to helping Myanmar students find and apply for international scholarships. Our mission is to make educational opportunities more accessible to talented individuals from Myanmar.\n\n## Our Mission\n\nTo bridge the information gap and provide resources that help Myanmar students pursue higher education abroad.`;
            break;
          case 'faq':
            defaultContent = `# Frequently Asked Questions\n\n## What is Scholar-M?\n\nScholar-M is a platform that helps Myanmar students discover and apply for international scholarships.\n\n## How do I use this platform?\n\nBrowse our scholarship database, read educational guides, and connect with the community to learn from others' experiences.`;
            break;
          case 'privacy':
            defaultContent = `# Privacy Policy\n\nEffective Date: May 1, 2025\n\n## Introduction\n\nThis Privacy Policy describes how Scholar-M collects, uses, and shares your personal information when you use our website and services.\n\n## Information We Collect\n\nWe collect information that you provide directly to us, such as when you create an account, fill out a form, or communicate with us.`;
            break;
          case 'terms':
            defaultContent = `# Terms of Service\n\nEffective Date: May 1, 2025\n\n## Acceptance of Terms\n\nBy accessing or using Scholar-M, you agree to be bound by these Terms of Service.\n\n## Use of Services\n\nYou may use our services only as permitted by law and according to these terms.`;
            break;
          default:
            defaultContent = `# ${pageTitle}\n\nThis page is under construction. Content will be added soon.`;
        }
        
        setContent(defaultContent);
        setEditContent(defaultContent);
        
        // Create the page in the database if admin is viewing
        if (isAdmin) {
          await supabase
            .from('static_pages')
            .insert([
              { page_id: pageId, content: defaultContent }
            ]);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${pageId} page:`, error);
      // Set default content on error
      const errorContent = `# ${pageTitle}\n\nContent currently unavailable.`;
      setContent(errorContent);
      setEditContent(errorContent);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!isAdmin) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('static_pages')
        .upsert([
          { page_id: pageId, content: editContent }
        ]);
      
      if (error) throw error;
      
      setContent(editContent);
      setIsEditing(false);
      toast({
        title: "Page Updated",
        description: "The content has been saved successfully.",
      });
    } catch (error: any) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tighter">{pageTitle}</h1>
        {isAdmin && (
          isEditing ? (
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsEditing(false)} 
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Page
            </Button>
          )
        )}
      </div>

      {isEditing ? (
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="min-h-[500px] font-mono text-sm w-full"
          placeholder="Write page content in Markdown format..."
        />
      ) : (
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
