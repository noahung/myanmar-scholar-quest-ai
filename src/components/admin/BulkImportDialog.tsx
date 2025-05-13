
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
      title: "Bulk import temporarily disabled",
      description: "Please manually add entries by editing the data files directly.",
    });
    setIsDialogOpen(false);
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
            Bulk import is temporarily disabled. Please manually edit the data files.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <Button onClick={handleManualImport}>
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
