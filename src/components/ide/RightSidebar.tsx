import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Package, MessageSquare, Users } from "lucide-react";

interface RightSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const RightSidebar = ({ isOpen = true, onClose }: RightSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for extensions
  const mockExtensions = [
    {
      id: 1,
      name: "Python Support",
      description: "Python language support",
      downloads: "2.5M",
    },
    {
      id: 2,
      name: "Git Lens",
      description: "Git supercharged",
      downloads: "1.8M",
    },
    {
      id: 3,
      name: "ESLint",
      description: "JavaScript linting utility",
      downloads: "3.1M",
    },
  ];

  // Mock data for AI suggestions
  const mockAiSuggestions = [
    { id: 1, content: "Consider using a more efficient algorithm here" },
    { id: 2, content: "This code could be refactored for better readability" },
    { id: 3, content: "Add error handling for this function" },
  ];

  // Mock data for collaborators
  const mockCollaborators = [
    {
      id: 1,
      name: "Alice Smith",
      status: "online",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
    {
      id: 2,
      name: "Bob Johnson",
      status: "away",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
    {
      id: 3,
      name: "Carol White",
      status: "offline",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="w-[300px] h-full border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
      <Tabs defaultValue="extensions" className="w-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="extensions">
              <Package className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="ai">
              <MessageSquare className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="extensions" className="p-0">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-130px)]">
            <div className="p-4 space-y-4">
              {mockExtensions.map((extension) => (
                <Card key={extension.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">{extension.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {extension.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-500">
                      {extension.downloads} downloads
                    </div>
                    <Button size="sm" variant="outline" className="mt-2 w-full">
                      Install
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="ai" className="p-0">
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 space-y-4">
              {mockAiSuggestions.map((suggestion) => (
                <Card key={suggestion.id}>
                  <CardContent className="p-4">
                    <p className="text-sm">{suggestion.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="team" className="p-0">
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 space-y-4">
              {mockCollaborators.map((collaborator) => (
                <Card key={collaborator.id}>
                  <CardContent className="p-4 flex items-center space-x-4">
                    <img
                      src={collaborator.avatar}
                      alt={collaborator.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium">{collaborator.name}</p>
                      <p className="text-xs text-gray-500">
                        {collaborator.status}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
