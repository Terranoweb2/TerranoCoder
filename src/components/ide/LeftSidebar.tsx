import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import {
  Search,
  FileText,
  GitBranch,
  Settings,
  ChevronLeft,
  ChevronRight,
  Folder,
  File,
} from "lucide-react";

interface FileExplorerItem {
  name: string;
  type: "file" | "folder";
  children?: FileExplorerItem[];
}

interface LeftSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  files?: FileExplorerItem[];
}

const defaultFiles: FileExplorerItem[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Button.tsx", type: "file" },
          { name: "Card.tsx", type: "file" },
        ],
      },
      { name: "App.tsx", type: "file" },
      { name: "index.tsx", type: "file" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "index.html", type: "file" },
      { name: "styles.css", type: "file" },
    ],
  },
];

const FileExplorer = ({
  files = defaultFiles,
}: {
  files?: FileExplorerItem[];
}) => {
  const renderItem = (item: FileExplorerItem, depth = 0) => (
    <div key={item.name} className="pl-4">
      <div className="flex items-center gap-2 py-1 hover:bg-gray-800 rounded px-2">
        {item.type === "folder" ? <Folder size={16} /> : <File size={16} />}
        <span>{item.name}</span>
      </div>
      {item.children && (
        <div className="ml-2">
          {item.children.map((child) => renderItem(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return <div className="text-sm">{files.map((item) => renderItem(item))}</div>;
};

const LeftSidebar = ({
  isCollapsed = false,
  onToggleCollapse = () => {},
  files = defaultFiles,
}: LeftSidebarProps) => {
  const [activeTab, setActiveTab] = useState("files");

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={100}>
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-2 border-b border-gray-800">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleCollapse}
                    >
                      {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Tabs defaultValue="files" className="flex-1">
              <TabsList className="grid grid-cols-3 bg-gray-900">
                <TabsTrigger value="files">
                  <FileText size={16} />
                </TabsTrigger>
                <TabsTrigger value="search">
                  <Search size={16} />
                </TabsTrigger>
                <TabsTrigger value="git">
                  <GitBranch size={16} />
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="files" className="p-0 m-0">
                  <div className="p-4">
                    <FileExplorer files={files} />
                  </div>
                </TabsContent>

                <TabsContent value="search" className="p-4 m-0">
                  <Input placeholder="Search files..." className="mb-4" />
                  <div className="text-sm text-gray-400">No search results</div>
                </TabsContent>

                <TabsContent value="git" className="p-4 m-0">
                  <div className="text-sm text-gray-400">
                    No changes detected
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default LeftSidebar;
