import React, { useState, useRef, KeyboardEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Bug, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIDE } from "@/contexts/IDEContext";
import { supabase } from "@/lib/supabase";

interface BottomPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultTab?: string;
}

const BottomPanel = ({
  isOpen = true,
  onClose = () => {},
  defaultTab = "terminal",
}: BottomPanelProps) => {
  const { terminalOutput, setTerminalOutput } = useIDE();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [command, setCommand] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleCommand = async () => {
    if (!command.trim()) return;

    try {
      setTerminalOutput([...terminalOutput, `$ ${command}`]);
      const { data, error } = await supabase.functions.invoke("terminal", {
        body: { command },
      });

      if (error) throw error;

      if (data?.output) {
        setTerminalOutput((prev) => [...prev, data.output]);
      }
    } catch (error) {
      console.error("Error executing command:", error);
      setTerminalOutput((prev) => [...prev, "Error executing command"]);
    }

    setCommand("");
    scrollToBottom();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand();
    }
  };

  const handleClear = () => {
    setTerminalOutput([]);
  };

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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-zinc-700"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-zinc-700"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="terminal" className="h-full flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="font-mono text-sm text-zinc-300">
                {terminalOutput.map((line, index) => (
                  <div key={index} className="mb-1">
                    {line}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-zinc-700">
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter command..."
                className="bg-zinc-800 border-zinc-700 text-zinc-300"
              />
            </div>
          </TabsContent>

          <TabsContent value="debug" className="h-full">
            <ScrollArea className="h-full p-4">
              <div className="font-mono text-sm text-zinc-300">
                <div className="mb-1">Debug session started.</div>
                <div className="mb-1">Breakpoint hit at line 42</div>
                <div className="mb-1">Variable x = 10</div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="h-full">
            <div className="w-full h-full bg-white">
              <iframe
                src={import.meta.env.VITE_PREVIEW_URL}
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
