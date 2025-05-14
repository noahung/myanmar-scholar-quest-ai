
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface PersonalStatementFormData {
  scholarship: string;
  academicGoals: string;
  careerGoals: string;
  personalStory: string;
  achievements: string;
  challenges: string;
  values: string;
  strengths: string;
}

export function PreparationHelper() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("checklist");
  const [isLoading, setIsLoading] = useState(false);
  const [generatingStatement, setGeneratingStatement] = useState(false);
  const [personalStatement, setPersonalStatement] = useState("");
  const [editedStatement, setEditedStatement] = useState("");
  
  // Checklist state
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: "1", text: "Prepare academic transcripts", completed: false },
    { id: "2", text: "Get recommendation letters", completed: false },
    { id: "3", text: "Research scholarship requirements", completed: false },
    { id: "4", text: "Prepare CV/Resume", completed: false },
    { id: "5", text: "Prepare personal statement", completed: false },
    { id: "6", text: "Check application deadlines", completed: false },
    { id: "7", text: "Prepare financial documentation", completed: false },
    { id: "8", text: "Prepare proof of language proficiency", completed: false },
  ]);
  const [newItemText, setNewItemText] = useState("");
  
  // Personal statement form
  const [formData, setFormData] = useState<PersonalStatementFormData>({
    scholarship: "",
    academicGoals: "",
    careerGoals: "",
    personalStory: "",
    achievements: "",
    challenges: "",
    values: "",
    strengths: ""
  });
  
  useEffect(() => {
    loadUserChecklist();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const toggleItemCompletion = async (id: string) => {
    const updatedItems = checklistItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklistItems(updatedItems);
    await saveChecklistItems(updatedItems);
  };
  
  const addNewItem = async () => {
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false
    };
    
    const updatedItems = [...checklistItems, newItem];
    setChecklistItems(updatedItems);
    await saveChecklistItems(updatedItems);
    setNewItemText("");
  };
  
  const removeItem = async (id: string) => {
    const updatedItems = checklistItems.filter(item => item.id !== id);
    setChecklistItems(updatedItems);
    await saveChecklistItems(updatedItems);
  };
  
  const saveChecklistItems = async (items: ChecklistItem[]) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // First check if a record exists
      const { data: existingData, error: fetchError } = await supabase
        .from('user_preparation')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let saveError;
      
      if (existingData?.id) {
        // Update existing record
        const { error } = await supabase
          .from('user_preparation')
          .update({
            checklist_items: items,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        
        saveError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_preparation')
          .insert({
            user_id: user.id,
            checklist_items: items
          });
        
        saveError = error;
      }
      
      if (saveError) throw saveError;
      
      toast({
        title: "Checklist saved",
        description: "Your checklist has been updated successfully."
      });
      
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast({
        title: "Error",
        description: "Failed to save your checklist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generatePersonalStatement = async () => {
    if (!user) return;
    
    try {
      setGeneratingStatement(true);
      
      // Check if we have enough information
      const requiredFields: (keyof PersonalStatementFormData)[] = ['scholarship', 'academicGoals', 'personalStory'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill out at least the scholarship, academic goals, and personal story fields",
          variant: "destructive"
        });
        setGeneratingStatement(false);
        return;
      }
      
      // Call edge function to generate the statement
      const { data, error } = await supabase.functions.invoke('generate-personal-statement', {
        body: JSON.stringify(formData)
      });
      
      if (error) throw error;
      
      setPersonalStatement(data.personalStatement);
      setEditedStatement(data.personalStatement);
      
      toast({
        title: "Personal Statement Generated",
        description: "Your personal statement has been generated successfully."
      });
      
    } catch (error) {
      console.error("Error generating personal statement:", error);
      toast({
        title: "Error",
        description: "Failed to generate personal statement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingStatement(false);
    }
  };
  
  const savePersonalStatement = async () => {
    if (!user || !editedStatement) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user.id,
          title: `Personal Statement for ${formData.scholarship || "Scholarship"}`,
          content: editedStatement,
          is_from_ai: true
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your personal statement has been saved to your notes"
      });
      
    } catch (error) {
      console.error("Error saving personal statement:", error);
      toast({
        title: "Error",
        description: "Failed to save your personal statement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load user's checklist on initial render
  const loadUserChecklist = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_preparation')
        .select('checklist_items')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned
        throw error;
      }
      
      if (data?.checklist_items && Array.isArray(data.checklist_items)) {
        setChecklistItems(data.checklist_items);
      }
      
    } catch (error) {
      console.error("Error loading checklist:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="checklist">Application Checklist</TabsTrigger>
        <TabsTrigger value="statement">Personal Statement Writer</TabsTrigger>
      </TabsList>
      
      <TabsContent value="checklist" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Checklist</CardTitle>
            <CardDescription>
              Track your scholarship application preparation progress. Add or remove items as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleItemCompletion(item.id)}
                  />
                  <Label
                    htmlFor={`item-${item.id}`}
                    className={`${item.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {item.text}
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="flex space-x-2">
              <Input
                placeholder="Add new item..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && addNewItem()}
              />
              <Button 
                onClick={addNewItem} 
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="statement" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Statement Writer</CardTitle>
            <CardDescription>
              Generate a personalized statement for your scholarship application by answering the questions below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scholarship">Which scholarship are you applying for, and why?</Label>
              <Textarea
                id="scholarship"
                name="scholarship"
                placeholder="E.g., MEXT Scholarship - I'm applying because it offers comprehensive support for international students and aligns with my research interests."
                value={formData.scholarship}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academicGoals">What are your academic goals?</Label>
                <Textarea
                  id="academicGoals"
                  name="academicGoals"
                  placeholder="E.g., I aim to pursue a master's degree in Environmental Engineering to develop solutions for water conservation."
                  value={formData.academicGoals}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="careerGoals">What are your career goals?</Label>
                <Textarea
                  id="careerGoals"
                  name="careerGoals"
                  placeholder="E.g., I plan to become an environmental consultant focusing on sustainable development in Southeast Asia."
                  value={formData.careerGoals}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personalStory">What personal story or experience defines your motivation or resilience?</Label>
              <Textarea
                id="personalStory"
                name="personalStory"
                placeholder="E.g., Growing up near a river that became increasingly polluted motivated me to pursue environmental studies."
                value={formData.personalStory}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="achievements">What achievements or extracurriculars are you proud of?</Label>
                <Textarea
                  id="achievements"
                  name="achievements"
                  placeholder="E.g., Led a student project that won the university innovation award; volunteered for coastal cleanup initiatives."
                  value={formData.achievements}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenges">What financial, personal, or social challenges have you faced?</Label>
                <Textarea
                  id="challenges"
                  name="challenges"
                  placeholder="E.g., I'm a first-generation college student and have worked part-time throughout my studies to support my education."
                  value={formData.challenges}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="values">What values or qualities define you?</Label>
                <Textarea
                  id="values"
                  name="values"
                  placeholder="E.g., I value perseverance, innovation, and community service."
                  value={formData.values}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strengths">Why are you a strong candidate for this scholarship?</Label>
                <Textarea
                  id="strengths"
                  name="strengths"
                  placeholder="E.g., My research experience in water quality assessment and my dedication to community-based solutions make me well-suited for this opportunity."
                  value={formData.strengths}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={generatePersonalStatement}
                disabled={generatingStatement}
                className="w-full"
              >
                {generatingStatement && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Personal Statement
              </Button>
            </div>
            
            {personalStatement && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="generatedStatement">Your Personal Statement</Label>
                  <Textarea
                    id="generatedStatement"
                    className="min-h-[300px] mt-2"
                    value={editedStatement}
                    onChange={(e) => setEditedStatement(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={savePersonalStatement} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save to Notes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
