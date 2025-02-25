import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GitCommit } from "lucide-react";
import { searchFiles, type SearchResult } from "@/lib/search";
import { useIDE } from "@/contexts/IDEContext";
import { getProjectFiles } from "@/lib/file-manager";
import { getProjects } from "@/lib/project-manager";
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
  FolderOpen,
  FileCode,
  FolderClosed,
  FileJson,
  FileType,
  FileType2,
  FileText as FileTextIcon,
} from "lucide-react";

interface FileExplorerItem {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileExplorerItem[];
}

interface LeftSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  currentFolder?: string | null;
}

const buildFileTree = (files: { path: string }[]): FileExplorerItem[] => {
  const root: { [key: string]: FileExplorerItem } = {};

  files.forEach(({ path }) => {
    const parts = path.split("/");
    let current = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (!current[currentPath]) {
        current[currentPath] = {
          name: part,
          path: currentPath,
          type: index === parts.length - 1 ? "file" : "folder",
          children: index === parts.length - 1 ? undefined : {},
        };
      }
      if (index < parts.length - 1) {
        current = current[currentPath].children as {
          [key: string]: FileExplorerItem;
        };
      }
    });
  });

  const sortFiles = (items: {
    [key: string]: FileExplorerItem;
  }): FileExplorerItem[] => {
    return Object.values(items)
      .sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "folder" ? -1 : 1;
      })
      .map((item) => ({
        ...item,
        children: item.children
          ? sortFiles(item.children as { [key: string]: FileExplorerItem })
          : undefined,
      }));
  };

  return sortFiles(root);
};

const FileExplorer = () => {
  const { currentProject, openFile } = useIDE();
  const [files, setFiles] = useState<FileExplorerItem[]>([]);

  useEffect(() => {
    const loadFiles = async () => {
      if (currentProject) {
        try {
          const projectFiles = await getProjectFiles(currentProject);
          setFiles(buildFileTree(projectFiles));
        } catch (error) {
          console.error("Error loading files:", error);
        }
      }
    };
    loadFiles();
  }, [currentProject]);
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: string]: boolean;
  }>({});

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "tsx":
      case "jsx":
        return (
          <FileCode
            size={16}
            className="text-blue-500 transition-all duration-200 group-hover:text-blue-400"
          />
        );
      case "json":
        return (
          <FileJson
            size={16}
            className="text-green-500 transition-all duration-200 group-hover:text-green-400"
          />
        );
      case "css":
        return (
          <FileType
            size={16}
            className="text-purple-500 transition-all duration-200 group-hover:text-purple-400"
          />
        );
      case "html":
        return (
          <FileType2
            size={16}
            className="text-orange-500 transition-all duration-200 group-hover:text-orange-400"
          />
        );
      default:
        return (
          <FileTextIcon
            size={16}
            className="text-gray-500 transition-all duration-200 group-hover:text-gray-400"
          />
        );
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderItem = (item: FileExplorerItem, depth = 0) => {
    const isExpanded = expandedFolders[item.path];

    return (
      <div key={item.path} style={{ paddingLeft: `${depth * 12}px` }}>
        <div
          className="group flex items-center gap-2 py-1.5 hover:bg-gray-800/50 rounded-md px-2 cursor-pointer transition-all duration-200"
          onClick={() => {
            if (item.type === "folder") {
              toggleFolder(item.path);
            } else {
              openFile(item.path);
            }
          }}
        >
          {item.type === "folder" ? (
            isExpanded ? (
              <FolderOpen
                size={16}
                className="text-yellow-500 transition-all duration-200 group-hover:text-yellow-400"
              />
            ) : (
              <FolderClosed
                size={16}
                className="text-yellow-500 transition-all duration-200 group-hover:text-yellow-400"
              />
            )
          ) : (
            getFileIcon(item.name)
          )}
          <span className="select-none">{item.name}</span>
        </div>
        {item.children && isExpanded && (
          <div className="mt-1">
            {item.children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-sm py-2">{files.map((item) => renderItem(item))}</div>
  );
};

const LeftSidebar = ({
  isCollapsed = false,
  onToggleCollapse = () => {},
  currentFolder = null,
}: LeftSidebarProps) => {
  const {
    currentFolder: contextFolder,
    gitStatus,
    handleCommit,
    handleStage,
    handleUnstage,
    handlePush,
    handlePull,
  } = useIDE();
  const [activeTab, setActiveTab] = useState("files");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = await searchFiles(query);
    setSearchResults(results);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleSearch]);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setCurrentProject(data[0]);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const loadFiles = async () => {
      if (currentProject) {
        try {
          const data = await getProjectFiles(currentProject.id);
          setProjectFiles(data);
        } catch (error) {
          console.error("Error loading files:", error);
        }
      }
    };
    loadFiles();
  }, [currentProject]);

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
                <TabsTrigger
                  value="files"
                  className="transition-all duration-200 data-[state=active]:bg-blue-500/20 hover:bg-gray-800/50"
                >
                  <FileText
                    size={16}
                    className="transition-all duration-200 group-hover:scale-110"
                  />
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  className="transition-all duration-200 data-[state=active]:bg-purple-500/20 hover:bg-gray-800/50"
                >
                  <Search
                    size={16}
                    className="transition-all duration-200 group-hover:scale-110"
                  />
                </TabsTrigger>
                <TabsTrigger
                  value="git"
                  className="transition-all duration-200 data-[state=active]:bg-green-500/20 hover:bg-gray-800/50"
                >
                  <GitBranch
                    size={16}
                    className="transition-all duration-200 group-hover:scale-110"
                  />
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="files" className="p-0 m-0">
                  <div className="p-4">
                    <FileExplorer />
                  </div>
                </TabsContent>

                <TabsContent value="search" className="p-4 m-0">
                  <div className="space-y-4">
                    <Input
                      placeholder="Search files and content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                    <ScrollArea className="h-[calc(100vh-180px)]">
                      {searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map((result, index) => (
                            <Card
                              key={`${result.path}-${index}`}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => openFile(result.path)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  {result.type === "file" ? (
                                    <FileText className="h-4 w-4 mt-1 text-blue-500" />
                                  ) : (
                                    <Search className="h-4 w-4 mt-1 text-green-500" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {result.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {result.path}
                                    </p>
                                    {result.preview && (
                                      <p className="text-sm mt-1 text-muted-foreground">
                                        Line {result.lineNumber}:{" "}
                                        {result.preview}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div className="text-sm text-muted-foreground">
                          No results found
                        </div>
                      ) : null}
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="git" className="p-4 m-0">
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium">Changes</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCommit()}
                            className="gap-2"
                          >
                            <GitCommit className="h-4 w-4" />
                            Commit
                          </Button>
                        </div>
                        {gitStatus ? (
                          <div className="space-y-4">
                            {gitStatus.staged.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium mb-2 text-green-500">
                                  Staged
                                </h4>
                                {gitStatus.staged.map((file) => (
                                  <div
                                    key={file}
                                    className="flex items-center justify-between py-1 text-sm"
                                  >
                                    <span className="truncate">{file}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleUnstage(file)}
                                    >
                                      Unstage
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {gitStatus.modified.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium mb-2 text-yellow-500">
                                  Modified
                                </h4>
                                {gitStatus.modified.map((file) => (
                                  <div
                                    key={file}
                                    className="flex items-center justify-between py-1 text-sm"
                                  >
                                    <span className="truncate">{file}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleStage(file)}
                                    >
                                      Stage
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {gitStatus.untracked.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium mb-2 text-blue-500">
                                  Untracked
                                </h4>
                                {gitStatus.untracked.map((file) => (
                                  <div
                                    key={file}
                                    className="flex items-center justify-between py-1 text-sm"
                                  >
                                    <span className="truncate">{file}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleStage(file)}
                                    >
                                      Stage
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No changes detected
                          </div>
                        )}
                      </CardContent>
                    </Card>
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
