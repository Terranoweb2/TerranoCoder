import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFile } from "@/lib/file-manager";
import { Loader2, FilePlus2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIDE } from "@/contexts/IDEContext";

export function NewFileDialog() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const { currentProject, currentFolder, openFile } = useIDE();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currentProject) return;

    setLoading(true);
    try {
      const path = currentFolder ? `${currentFolder}/${name}` : name;
      const file = await createFile({
        project_id: currentProject,
        name,
        path,
        content: "",
      });

      openFile(path);
      setOpen(false);
      toast({
        title: "Success",
        description: "File created successfully",
      });
    } catch (error) {
      console.error("Error creating file:", error);
      toast({
        title: "Error",
        description: "Failed to create file",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="transition-all duration-200 hover:bg-blue-500/20 hover:text-blue-500"
        >
          <FilePlus2 className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">File Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter file name (e.g. App.tsx)"
              required
            />
          </div>
          <Button type="submit" disabled={loading || !name.trim()}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Create File
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
