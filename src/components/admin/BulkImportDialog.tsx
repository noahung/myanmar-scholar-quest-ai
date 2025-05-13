
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, Download, Upload, Loader2 } from "lucide-react";
import { processScholarshipImport, getScholarshipTemplate } from "@/utils/bulkImport";

interface BulkImportDialogProps {
  onImportComplete?: () => void;
  entityType: 'scholarships' | 'guides';
}

export function BulkImportDialog({ onImportComplete, entityType }: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    // Create template based on entity type
    let template;
    if (entityType === 'scholarships') {
      template = getScholarshipTemplate();
    } else {
      // Add guide template if needed
      template = [{
        title: "Example Guide Title",
        description: "Guide description",
        category: "Application Process",
        country: "Japan",
        steps: [
          { title: "Step 1", content: "Content for step 1" },
          { title: "Step 2", content: "Content for step 2" }
        ]
      }];
    }
    
    const jsonString = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = `${entityType}-template.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Template Downloaded",
      description: `The ${entityType} template has been downloaded. Fill it with your data and import it back.`
    });
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a JSON file to import"
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      if (entityType === 'scholarships') {
        result = await processScholarshipImport(file);
      } else {
        // Process guides import (not implemented yet)
        result = { success: false, message: "Guide import not yet implemented" };
      }
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: result.message
        });
        setIsDialogOpen(false);
        setFile(null);
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: result.message
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        variant: "destructive",
        title: "Import Error",
        description: "An unexpected error occurred during import"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Import {entityType}</DialogTitle>
          <DialogDescription>
            Upload a JSON file containing multiple {entityType} to import them at once.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">
                <Label htmlFor="file-upload" className="cursor-pointer relative text-primary hover:text-primary/80">
                  <span>Click to upload</span>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="application/json" 
                    onChange={handleFileChange}
                  />
                </Label> or drag and drop
              </div>
              <p className="text-xs text-muted-foreground">JSON files only</p>
              {file && (
                <div className="text-sm text-green-500 mt-2">
                  Selected: {file.name}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" type="button" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            
            <Button onClick={handleImport} disabled={!file || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
