import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Save, Plus, Image, Trash, Loader2, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BulkImportDialog } from "./BulkImportDialog";

// Define a schema for the scholarship form
const scholarshipFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  country: z.string().min(1, { message: "Please select a country" }),
  institution: z.string().min(3, { message: "Institution must be at least 3 characters" }),
  deadline: z.string().min(1, { message: "Please select a deadline" }),
  fields: z.array(z.string()).optional(),
  level: z.enum(["Masters", "Undergraduate", "PhD", "Research", "Training"]),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  benefits: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  application_url: z.string().url({ message: "Invalid URL format" }),
  featured: z.boolean().default(false),
  source_url: z.string().url({ message: "Invalid URL format" }).optional(),
  image_url: z.string().url({ message: "Invalid URL format" }).optional(),
});

export type Scholarship = z.infer<typeof scholarshipFormSchema>;

export function ScholarshipEditor() {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const form = useForm<Scholarship>({
    resolver: zodResolver(scholarshipFormSchema),
    defaultValues: {
      title: "",
      country: "",
      institution: "",
      deadline: new Date().toISOString().split('T')[0],
      fields: [],
      level: "Masters",
      description: "",
      benefits: [],
      requirements: [],
      application_url: "",
      featured: false,
      source_url: "",
      image_url: "",
    },
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    if (editingScholarship) {
      form.reset({
        id: editingScholarship.id,
        title: editingScholarship.title,
        country: editingScholarship.country,
        institution: editingScholarship.institution,
        deadline: editingScholarship.deadline,
        fields: editingScholarship.fields,
        level: editingScholarship.level,
        description: editingScholarship.description,
        benefits: editingScholarship.benefits,
        requirements: editingScholarship.requirements,
        application_url: editingScholarship.application_url,
        featured: editingScholarship.featured,
        source_url: editingScholarship.source_url,
        image_url: editingScholarship.image_url,
      });
    } else {
      form.reset({
        title: "",
        country: "",
        institution: "",
        deadline: new Date().toISOString().split('T')[0],
        fields: [],
        level: "Masters",
        description: "",
        benefits: [],
        requirements: [],
        application_url: "",
        featured: false,
        source_url: "",
        image_url: "",
      });
    }
  }, [editingScholarship, form]);

  async function fetchScholarships() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scholarships')
        .select('*');

      if (error) {
        throw error;
      }

      setScholarships(data as Scholarship[]);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scholarships"
      });
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: Scholarship) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to create or edit scholarships."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const isEditing = !!values.id;

      if (isEditing) {
        // Update existing scholarship
        const { error } = await supabase
          .from('scholarships')
          .update(values)
          .eq('id', values.id);

        if (error) throw error;

        toast({
          title: "Scholarship Updated",
          description: "Your changes have been saved."
        });
      } else {
        // Create new scholarship
        const { error } = await supabase
          .from('scholarships')
          .insert([values]);

        if (error) throw error;

        toast({
          title: "Scholarship Created",
          description: "Your new scholarship has been created."
        });
      }

      setIsDialogOpen(false);
      fetchScholarships();

    } catch (error) {
      console.error("Error saving scholarship:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save scholarship."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;

    try {
      setIsDeleting(id);
      const { error } = await supabase
        .from('scholarships')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Scholarship Deleted",
        description: "The scholarship has been successfully deleted."
      });

      fetchScholarships();
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete scholarship."
      });
    } finally {
      setIsDeleting(null);
    }
  }

  function handleEdit(scholarship: Scholarship) {
    setEditingScholarship(scholarship);
    setIsDialogOpen(true);
  }

  function handleNewScholarship() {
    setEditingScholarship(null);
    form.reset({
      title: "",
      country: "",
      institution: "",
      deadline: new Date().toISOString().split('T')[0],
      fields: [],
      level: "Masters",
      description: "",
      benefits: [],
      requirements: [],
      application_url: "",
      featured: false,
      source_url: "",
      image_url: "",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scholarships</h2>
          <p className="text-muted-foreground">Create and manage scholarship listings</p>
        </div>
        
        <div className="flex gap-2">
          <BulkImportDialog 
            entityType="scholarships"
            onImportComplete={fetchScholarships}
          />
          <Button onClick={handleNewScholarship}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Scholarship
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scholarships List</CardTitle>
          <CardDescription>Manage your scholarship listings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : scholarships.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No scholarships found</p>
              <p className="text-sm mt-2">Create your first scholarship using the button above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scholarships.map((scholarship) => (
                    <TableRow key={scholarship.id}>
                      <TableCell className="font-medium">{scholarship.title}</TableCell>
                      <TableCell>{scholarship.country}</TableCell>
                      <TableCell>{scholarship.institution}</TableCell>
                      <TableCell>{new Date(scholarship.deadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(scholarship)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(scholarship.id!)}
                            disabled={isDeleting === scholarship.id}
                          >
                            {isDeleting === scholarship.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingScholarship(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingScholarship ? "Edit Scholarship" : "Create New Scholarship"}</DialogTitle>
            <DialogDescription>
              {editingScholarship ? "Update scholarship information" : "Fill in the details to create a new scholarship"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Scholarship title"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      {...form.register("country")}
                    />
                    {form.formState.errors.country && (
                      <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      placeholder="Institution"
                      {...form.register("institution")}
                    />
                    {form.formState.errors.institution && (
                      <p className="text-sm text-red-500">{form.formState.errors.institution.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    type="date"
                    id="deadline"
                    {...form.register("deadline")}
                  />
                  {form.formState.errors.deadline && (
                    <p className="text-sm text-red-500">{form.formState.errors.deadline.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fields">Fields of Study</Label>
                  <Input
                    id="fields"
                    placeholder="e.g., Engineering, Computer Science"
                    {...form.register("fields")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter comma-separated values
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={form.watch("level")}
                    onValueChange={(value) => form.setValue("level", value as "Masters" | "Undergraduate" | "PhD" | "Research" | "Training")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masters">Masters</SelectItem>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.level && (
                    <p className="text-sm text-red-500">{form.formState.errors.level.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of the scholarship"
                    rows={3}
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    placeholder="List the benefits of the scholarship"
                    rows={2}
                    {...form.register("benefits")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter comma-separated values
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List the requirements for the scholarship"
                    rows={2}
                    {...form.register("requirements")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter comma-separated values
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="application_url">Application URL</Label>
                  <Input
                    id="application_url"
                    placeholder="https://example.com/apply"
                    type="url"
                    {...form.register("application_url")}
                  />
                  {form.formState.errors.application_url && (
                    <p className="text-sm text-red-500">{form.formState.errors.application_url.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="source_url">Source URL</Label>
                  <Input
                    id="source_url"
                    placeholder="https://example.com/source"
                    type="url"
                    {...form.register("source_url")}
                  />
                  {form.formState.errors.source_url && (
                    <p className="text-sm text-red-500">{form.formState.errors.source_url.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      placeholder="http://example.com/image.jpg"
                      type="url"
                      {...form.register("image_url")}
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a URL or upload an image (Supabase storage will be integrated)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={form.watch("featured")}
                    onCheckedChange={(checked) => form.setValue("featured", checked !== undefined ? checked : false)}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingScholarship ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingScholarship ? "Update Scholarship" : "Create Scholarship"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
