
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Plus, Save, Trash2, BookmarkPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export type Note = {
  id: string;
  title: string;
  content: string;
  is_from_ai: boolean;
  scholarship_id?: string | null;
  created_at: string;
  updated_at: string;
};

interface UserNotesProps {
  scholarshipId?: string;
  onAddFromAI?: (content: string) => void;
  className?: string;
}

export function UserNotes({ scholarshipId, onAddFromAI, className }: UserNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setNotes([]);
      setIsLoading(false);
    }
  }, [user, scholarshipId]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('user_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (scholarshipId) {
        query = query.eq('scholarship_id', scholarshipId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Failed to load notes",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add notes",
        variant: "destructive",
      });
      return;
    }

    if (!newNote.title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title for your note",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user.id,
          title: newNote.title,
          content: newNote.content,
          scholarship_id: scholarshipId || null,
          is_from_ai: false
        })
        .select();

      if (error) throw error;

      toast({
        title: "Note added",
        description: "Your note has been saved successfully",
      });

      setNotes([data[0], ...notes]);
      setNewNote({ title: "", content: "" });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Failed to add note",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;

    try {
      const { error } = await supabase
        .from('user_notes')
        .update({
          title: editingNote.title,
          content: editingNote.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingNote.id);

      if (error) throw error;

      toast({
        title: "Note updated",
        description: "Your changes have been saved",
      });

      setNotes(notes.map(note => 
        note.id === editingNote.id ? editingNote : note
      ));
      setEditingNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Failed to update note",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Note deleted",
        description: "Your note has been deleted",
      });

      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Failed to delete note",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>My Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p>Please log in to view and manage your notes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>My Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new note form */}
          <div className="space-y-2">
            <Input
              placeholder="Note title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddNote} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Note
            </Button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {/* Notes list */}
          {!isLoading && notes.length === 0 && (
            <div className="py-4 text-center text-muted-foreground">
              <p>You don't have any notes yet.</p>
            </div>
          )}

          {!isLoading &&
            notes.map((note) => (
              <Card key={note.id} className={note.is_from_ai ? "border-myanmar-jade/30" : ""}>
                <CardHeader className="py-3">
                  {editingNote?.id === note.id ? (
                    <Input
                      value={editingNote.title}
                      onChange={(e) =>
                        setEditingNote({ ...editingNote, title: e.target.value })
                      }
                      className="font-medium"
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{note.title}</h3>
                      <div className="text-xs text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="py-2">
                  {editingNote?.id === note.id ? (
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) =>
                        setEditingNote({ ...editingNote, content: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="py-2 flex justify-end gap-2">
                  {editingNote?.id === note.id ? (
                    <Button size="sm" onClick={handleUpdateNote} variant="outline">
                      <Save className="h-3.5 w-3.5 mr-1" /> Save Changes
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingNote(note)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function SaveToNotesButton({ content, scholarshipId }: { content: string, scholarshipId?: string }) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToNotes = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save to notes",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user.id,
          title: 'Note from AI Assistant',
          content: content,
          scholarship_id: scholarshipId || null,
          is_from_ai: true
        })
        .select();

      if (error) throw error;

      toast({
        title: "Saved to notes",
        description: "AI response has been saved to your notes",
      });
    } catch (error) {
      console.error("Error saving to notes:", error);
      toast({
        title: "Failed to save note",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-auto"
      onClick={handleSaveToNotes}
      disabled={isSaving}
    >
      <BookmarkPlus className="h-4 w-4 mr-2" />
      {isSaving ? "Saving..." : "Save to Notes"}
    </Button>
  );
}
