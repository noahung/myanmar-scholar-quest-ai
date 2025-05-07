
import { useState } from "react";
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
import { Save, Plus, Image, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Schema for the guide form
const guideFormSchema = z.object({
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

export function GuideEditor() {
  const [steps, setSteps] = useState([{ title: "", content: "" }]);
  
  const form = useForm({
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

  function onSubmit(values: z.infer<typeof guideFormSchema>) {
    toast({
      title: "Guide Submitted",
      description: "Your guide has been saved successfully.",
    });
    console.log(values);
    // This will be replaced with Supabase insert once integrated
  }

  const addStep = () => {
    setSteps([...steps, { title: "", content: "" }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    }
  };

  const updateStepTitle = (index: number, title: string) => {
    const newSteps = [...steps];
    newSteps[index].title = title;
    setSteps(newSteps);
  };

  const updateStepContent = (index: number, content: string) => {
    const newSteps = [...steps];
    newSteps[index].content = content;
    setSteps(newSteps);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Educational Guide</CardTitle>
        <CardDescription>
          Create a new educational guide for Myanmar students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
                  <Select onValueChange={value => form.setValue("category", value)}>
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
                  <Select onValueChange={value => form.setValue("country", value)}>
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
          
          <div className="mt-6">
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Guide
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
