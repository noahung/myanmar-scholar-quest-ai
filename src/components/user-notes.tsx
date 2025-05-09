
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash, Save, Plus, BookmarkPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_from_ai: boolean;
  scholarship_id?: string;
}

interface SaveToNotesButtonProps {
  content: string;
  scholarshipId?: string;
}

export function SaveToNotesButton({ content, scholarshipId }: SaveToNotesButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSaveToNotes = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save notes",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add to user_notes table
      const { error } = await supabase.from('user_notes').insert({
        user_id: user.id,
        title: "AI Assistant Note",
        content: content,
        scholarship_id: scholarshipId || null,
        is_from_ai: true
      });

      if (error) throw error;

      toast({
        title: "Saved to Notes",
        description: "The AI response has been saved to your notes"
      });
    } catch (error: any) {
      console.error("Error saving to notes:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save to notes",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-5 w-5 p-0 text-gray-500 hover:text-gray-700"
      onClick={handleSaveToNotes}
      title="Save to notes"
    >
      <BookmarkPlus className="h-4 w-4" />
      <span className="sr-only">Save to notes</span>
    </Button>
  );
}

export function UserNotes({ scholarshipId }: { scholarshipId?: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
      setIsLoading(false);
    }
  }, [user, scholarshipId]);

  const loadNotes = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (scholarshipId) {
        query = query.eq('scholarship_id', scholarshipId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setNotes(data || []);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save notes",
        variant: "destructive"
      });
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Empty Fields",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingId) {
        // Update existing note
        const { error } = await supabase
          .from('user_notes')
          .update({ 
            title, 
            content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        toast({
          title: "Note Updated",
          description: "Your note has been updated successfully"
        });
      } else {
        // Create new note
        const { error } = await supabase
          .from('user_notes')
          .insert({ 
            user_id: user.id,
            title,
            content,
            scholarship_id: scholarshipId || null
          });
        
        if (error) throw error;
        
        toast({
          title: "Note Created",
          description: "Your note has been created successfully"
        });
      }
      
      // Reset form and reload notes
      setTitle('');
      setContent('');
      setEditingId(null);
      loadNotes();
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save note",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Note Deleted",
        description: "Your note has been deleted successfully"
      });
      
      loadNotes();
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">Please log in to save and view your notes.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-2">
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {editingId ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Note
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading your notes...</p>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <Card key={note.id} className={note.is_from_ai ? "border-myanmar-jade border-2" : ""}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{note.title}</h3>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(note)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-muted-foreground">{note.content}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {note.is_from_ai && (
                      <span className="text-myanmar-jade font-medium mr-2">
                        From AI Assistant
                      </span>
                    )}
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">You don't have any notes yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
