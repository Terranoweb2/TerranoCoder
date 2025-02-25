import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, ChevronRight } from "lucide-react";

interface OpenFolderDialogProps {
  onFolderSelect: (path: string) => void;
}

export function OpenFolderDialog({ onFolderSelect }: OpenFolderDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [recentFolders] = React.useState([
    { id: "1", path: "/src/components", lastOpened: "2024-02-24T10:00:00Z" },
    { id: "2", path: "/src/pages", lastOpened: "2024-02-23T15:30:00Z" },
    { id: "3", path: "/public", lastOpened: "2024-02-22T09:15:00Z" },
  ]);

  const handleFolderSelect = (path: string) => {
    onFolderSelect(path);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="transition-all duration-200 hover:bg-yellow-500/20 hover:text-yellow-500"
        >
          <FolderOpen className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open Folder</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {recentFolders.map((folder) => (
              <Card
                key={folder.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleFolderSelect(folder.path)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-yellow-500" />
                    <span>{folder.path}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
