
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// Schema for the guide form
const guideFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  country: z.string().min(1, { message: "Please select a country" }),
  image: z.string().optional(),
  steps: z.array(z.object({
    title: z.string().min(3, { message: "Step title is required" }),
    content: z.string().min(10, { message: "Step content is required" })
  })).min(1, { message: "Add at least one step" })
});

type Guide = z.infer<typeof guideFormSchema>;

export function GuideEditor() {
  const { user } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([{ title: "", content: "" }]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const form = useForm<Guide>({
    resolver: zodResolver(guideFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      country: "",
      image: "",
      steps: [{ title: "", content: "" }]
    }
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    if (editingGuide) {
      form.reset({
        id: editingGuide.id,
        title: editingGuide.title,
        description: editingGuide.description,
        category: editingGuide.category,
        country: editingGuide.country,
        image: editingGuide.image || "",
        steps: editingGuide.steps
      });
      setSteps(editingGuide.steps);
    } else {
      form.reset({
        title: "",
        description: "",
        category: "",
        country: "",
        image: "",
        steps: [{ title: "", content: "" }]
      });
      setSteps([{ title: "", content: "" }]);
    }
  }, [editingGuide, form]);

  async function fetchGuides() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guides')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Fetch steps for each guide
      const guidesWithSteps = await Promise.all(
        data.map(async (guide) => {
          const { data: stepsData, error: stepsError } = await supabase
            .from('guide_steps')
            .select('*')
            .eq('guide_id', guide.id)
            .order('step_order', { ascending: true });
            
          if (stepsError) {
            console.error("Error fetching steps for guide:", stepsError);
            return { ...guide, steps: [] };
          }
          
          return {
            ...guide,
            steps: stepsData.map(step => ({
              title: step.title,
              content: step.content
            }))
          };
        })
      );
      
      setGuides(guidesWithSteps);
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load guides"
      });
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: Guide) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to create or edit guides."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const isEditing = !!values.id;
      
      // Prepare guide data
      const guideData = {
        title: values.title,
        description: values.description,
        category: values.category,
        country: values.country,
        image: values.image,
        author_id: user.id,
        steps: values.steps.length,
        updated_at: new Date().toISOString()
      };
      
      let guideId: string;
      
      if (isEditing) {
        // Update existing guide
        const { data, error } = await supabase
          .from('guides')
          .update(guideData)
          .eq('id', values.id)
          .select()
          .single();
          
        if (error) throw error;
        guideId = data.id;
        
        // Delete existing steps
        const { error: deleteError } = await supabase
          .from('guide_steps')
          .delete()
          .eq('guide_id', guideId);
          
        if (deleteError) throw deleteError;
      } else {
        // Create new guide
        const { data, error } = await supabase
          .from('guides')
          .insert({ ...guideData, created_at: new Date().toISOString() })
          .select()
          .single();
          
        if (error) throw error;
        guideId = data.id;
      }
      
      // Insert steps
      const stepsData = values.steps.map((step, index) => ({
        guide_id: guideId,
        step_order: index + 1,
        title: step.title,
        content: step.content
      }));
      
      const { error: stepsError } = await supabase
        .from('guide_steps')
        .insert(stepsData);
        
      if (stepsError) throw stepsError;
      
      toast({
        title: isEditing ? "Guide Updated" : "Guide Created",
        description: isEditing ? "Your changes have been saved." : "Your new guide has been created."
      });
      
      setIsDialogOpen(false);
      fetchGuides();
      
    } catch (error) {
      console.error("Error saving guide:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save guide."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this guide?")) return;
    
    try {
      setIsDeleting(id);
      
      // Delete guide steps first (foreign key constraint)
      const { error: stepsError } = await supabase
        .from('guide_steps')
        .delete()
        .eq('guide_id', id);
        
      if (stepsError) throw stepsError;
      
      // Delete the guide
      const { error } = await supabase
        .from('guides')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Guide Deleted",
        description: "The guide has been successfully deleted."
      });
      
      fetchGuides();
    } catch (error) {
      console.error("Error deleting guide:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete guide."
      });
    } finally {
      setIsDeleting(null);
    }
  }

  function handleEdit(guide: Guide) {
    setEditingGuide(guide);
    setIsDialogOpen(true);
  }

  function handleNewGuide() {
    setEditingGuide(null);
    form.reset({
      title: "",
      description: "",
      category: "",
      country: "",
      image: "",
      steps: [{ title: "", content: "" }]
    });
    setSteps([{ title: "", content: "" }]);
    setIsDialogOpen(true);
  }

  function onCloseDialog() {
    setEditingGuide(null);
    setIsDialogOpen(false);
  }

  const addStep = () => {
    const newSteps = [...steps, { title: "", content: "" }];
    setSteps(newSteps);
    form.setValue("steps", newSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
      form.setValue("steps", newSteps);
    }
  };

  const updateStepTitle = (index: number, title: string) => {
    const newSteps = [...steps];
    newSteps[index].title = title;
    setSteps(newSteps);
    form.setValue("steps", newSteps);
  };

  const updateStepContent = (index: number, content: string) => {
    const newSteps = [...steps];
    newSteps[index].content = content;
    setSteps(newSteps);
    form.setValue("steps", newSteps);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Educational Guides</h2>
          <p className="text-muted-foreground">Create and manage educational guides</p>
        </div>
        
        <Button onClick={handleNewGuide}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Guide
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Guides List</CardTitle>
          <CardDescription>Manage your educational guides</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No guides found</p>
              <p className="text-sm mt-2">Create your first guide using the button above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Steps</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guides.map((guide) => (
                    <TableRow key={guide.id}>
                      <TableCell className="font-medium">{guide.title}</TableCell>
                      <TableCell>{guide.category}</TableCell>
                      <TableCell>{guide.country}</TableCell>
                      <TableCell>{guide.steps?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(guide)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(guide.id!)}
                            disabled={isDeleting === guide.id}
                          >
                            {isDeleting === guide.id ? (
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGuide ? "Edit Guide" : "Create New Guide"}</DialogTitle>
            <DialogDescription>
              {editingGuide ? "Update guide information" : "Fill in the details to create a new guide"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    placeholder="Guide title" 
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="A brief description of the guide"
                    rows={3}
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={form.watch("category")} 
                      onValueChange={value => form.setValue("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Application Process">Application Process</SelectItem>
                        <SelectItem value="Visa Requirements">Visa Requirements</SelectItem>
                        <SelectItem value="Application Documents">Application Documents</SelectItem>
                        <SelectItem value="Study Tips">Study Tips</SelectItem>
                        <SelectItem value="Language Preparation">Language Preparation</SelectItem>
                        <SelectItem value="Cultural Adjustment">Cultural Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={form.watch("country")} 
                      onValueChange={value => form.setValue("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="South Korea">South Korea</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.country && (
                      <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Featured Image URL</Label>
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
                    Enter a URL or upload an image (Supabase storage will be integrated)
                  </p>
                </div>
              </div>

              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Guide Steps</h3>
                
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <Card key={index}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Step {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(index)}
                            disabled={steps.length <= 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`step-title-${index}`}>Title</Label>
                          <Input
                            id={`step-title-${index}`}
                            value={step.title}
                            onChange={(e) => updateStepTitle(index, e.target.value)}
                            placeholder="Step title"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`step-content-${index}`}>Content</Label>
                          <Textarea
                            id={`step-content-${index}`}
                            value={step.content}
                            onChange={(e) => updateStepContent(index, e.target.value)}
                            placeholder="Step content"
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addStep}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingGuide ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingGuide ? "Update Guide" : "Create Guide"}
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
