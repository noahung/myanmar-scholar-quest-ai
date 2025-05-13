
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BulkImportDialogProps {
  onImportComplete?: () => void;
  entityType: 'scholarships' | 'guides';
}

export function BulkImportDialog({ onImportComplete, entityType }: BulkImportDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleManualImport = () => {
    toast({
      title: "Manual data entry required",
      description: `Please edit the ${entityType} data files directly in the project code.`,
    });
    setIsDialogOpen(false);
    
    // Still call the onImportComplete callback if provided
    if (onImportComplete) {
      onImportComplete();
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
            The bulk import feature has been disabled. Please manually add {entityType} by editing the 
            corresponding data files directly in the codebase.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <Button onClick={handleManualImport}>
              I Understand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
