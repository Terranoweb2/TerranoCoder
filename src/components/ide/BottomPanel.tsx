import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Bug, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultTab?: string;
  terminalContent?: string[];
  debugContent?: string[];
  previewUrl?: string;
}

const BottomPanel = ({
  isOpen = true,
  onClose = () => {},
  defaultTab = "terminal",
  terminalContent = [
    "> npm install",
    "added 1234 packages in 2m",
    "> npm start",
    "Server running at http://localhost:3000",
  ],
  debugContent = [
    "Debug session started.",
    "Breakpoint hit at line 42",
    "Variable x = 10",
  ],
  previewUrl = "https://example.com",
}: BottomPanelProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="w-full h-[300px] bg-zinc-900 border-t border-zinc-700 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="terminal" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Terminal
            </TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Debug Console
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Live Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-zinc-700"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="terminal" className="h-full">
            <ScrollArea className="h-full p-4">
              <div className="font-mono text-sm text-zinc-300">
                {terminalContent.map((line, index) => (
                  <div key={index} className="mb-1">
                    {line}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="debug" className="h-full">
            <ScrollArea className="h-full p-4">
              <div className="font-mono text-sm text-zinc-300">
                {debugContent.map((line, index) => (
                  <div key={index} className="mb-1">
                    {line}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="h-full">
            <div className="w-full h-full bg-white">
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BottomPanel;
