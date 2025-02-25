import React, { useState, useEffect, useRef, useCallback } from "react";
import { useIDE } from "@/contexts/IDEContext";
import { supabase } from "@/lib/supabase";
import { updateFile } from "@/lib/file-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { monaco } from "@/lib/monaco";
import { generateAIResponse } from "@/lib/ai-assistant";

interface EditorTab {
  id: string;
  title: string;
  content: string;
  language?: string;
}

interface EditorProps {
  tabs?: EditorTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onChange?: (content: string) => void;
}

const defaultTabs: EditorTab[] = [
  {
    id: "tab1",
    title: "index.tsx",
    content: "function App() {\n  return <div>Hello World</div>;\n}",
    language: "typescript",
  },
  {
    id: "tab2",
    title: "styles.css",
    content: ".container {\n  padding: 20px;\n}",
    language: "css",
  },
];

const getLanguageFromFileName = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
      return "javascript";
    case "jsx":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "css":
      return "css";
    case "html":
      return "html";
    case "json":
      return "json";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
};

export default function Editor({
  isFullscreen = false,
  onToggleFullscreen = () => {},
}: EditorProps) {
  const { openFiles, activeFile, saveFile, openFile, closeFile } = useIDE();
  const [tabs, setTabs] = useState<EditorTab[]>([]);

  useEffect(() => {
    const loadFiles = async () => {
      const loadedTabs = await Promise.all(
        openFiles.map(async (path) => {
          const { data: fileData } = await supabase
            .from("files")
            .select("*")
            .eq("path", path)
            .single();

          return {
            id: path,
            title: path.split("/").pop() || path,
            content: fileData?.content || "",
            language: getLanguageFromFileName(path),
          };
        }),
      );
      setTabs(loadedTabs);
    };
    loadFiles();
  }, [openFiles]);

  const handleTabClose = (tabId: string) => {
    closeFile(tabId);
  };

  const handleChange = async (content: string) => {
    if (activeFile) {
      try {
        const { data: fileData } = await supabase
          .from("files")
          .select("id")
          .eq("path", activeFile)
          .single();

        if (fileData) {
          await saveFile(fileData.id, { content });
        }
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
  };
  const [currentTab, setCurrentTab] = useState(activeFile);
  const editorRef = useRef<{
    [key: string]: monaco.editor.IStandaloneCodeEditor;
  }>({});
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    tabs.forEach((tab) => {
      if (containerRefs.current[tab.id] && !editorRef.current[tab.id]) {
        const editor = monaco.editor.create(containerRefs.current[tab.id]!, {
          value: tab.content,
          language: tab.language || getLanguageFromFileName(tab.title),
          theme: "tempo-dark",
          minimap: { enabled: true },
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          renderWhitespace: "selection",
          folding: true,
          tabSize: 2,
        });

        editor.onDidChangeModelContent(async () => {
          const content = editor.getValue();
          handleChange(content);

          // Optional: Get AI suggestions as you type
          try {
            const suggestion = await generateAIResponse(
              `Review this code:\n${content}`,
            );
            // Handle the suggestion (e.g., show in a tooltip or sidebar)
          } catch (error) {
            console.error("Error getting AI suggestions:", error);
          }
        });

        editorRef.current[tab.id] = editor;
      }
    });

    return () => {
      Object.values(editorRef.current).forEach((editor) => {
        editor.dispose();
      });
    };
  }, [tabs]);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    openFile(tabId);
    setTimeout(() => {
      editorRef.current[tabId]?.layout();
    }, 0);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white border border-[#333333]">
      <div className="flex items-center justify-between px-2 py-1 bg-[#252526] border-b border-[#333333]">
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="flex-1"
        >
          <TabsList className="bg-transparent border-none">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center">
                <TabsTrigger
                  value={tab.id}
                  className="px-3 py-1.5 text-sm data-[state=active]:bg-[#1e1e1e] data-[state=active]:border-t-2 data-[state=active]:border-blue-500"
                >
                  {tab.title}
                </TabsTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-1 hover:bg-[#333333]"
                  onClick={() => onTabClose(tab.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="flex-1 m-0 p-0 h-[calc(100vh-6rem)]"
            >
              <div
                ref={(el) => (containerRefs.current[tab.id] = el)}
                className="h-full w-full"
              />
            </TabsContent>
          ))}
        </Tabs>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={onToggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
