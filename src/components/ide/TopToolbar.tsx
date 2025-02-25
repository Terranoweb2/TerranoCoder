import React from "react";
import { NewFileDialog } from "./dialogs/NewFileDialog";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import {
  FilePlus2,
  Save,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Play,
  Bug,
  StopCircle,
  Terminal,
  Package,
} from "lucide-react";
import { NewProjectDialog } from "./dialogs/NewProjectDialog";
import { PluginManagerDialog } from "./dialogs/PluginManagerDialog";
import { OpenFolderDialog } from "./dialogs/OpenFolderDialog";
import { useIDE } from "@/contexts/IDEContext";

export default function TopToolbar() {
  const {
    currentProject,
    currentFolder,
    setCurrentFolder,
    activeFile,
    isRunning,
    isDebugging,
    saveFile,
    runProject,
    stopProject,
    startDebug,
    stopDebug,
    handleCommit,
    handlePush,
    handlePull,
  } = useIDE();

  const handleSave = async () => {
    if (activeFile) {
      try {
        await saveFile(activeFile, ""); // Content should come from editor
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
  };

  const handleFolderSelect = (path: string) => {
    setCurrentFolder(path);
    console.log("Opening folder:", path);
  };

  return (
    <TooltipProvider>
      <div className="h-12 w-full bg-background border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg">TerranoCoder</span>
          </div>
          <NewProjectDialog
            onProjectCreated={(project) => {
              console.log("New project created:", project);
            }}
          />
          {currentProject && <PluginManagerDialog projectId={currentProject} />}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <NewFileDialog />

            <OpenFolderDialog onFolderSelect={handleFolderSelect} />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  disabled={!activeFile}
                  className="transition-all duration-200 hover:bg-green-500/20 hover:text-green-500"
                >
                  <Save className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCommit}
                  className="transition-all duration-200 hover:bg-purple-500/20 hover:text-purple-500"
                >
                  <GitCommit className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Commit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePush}
                  className="transition-all duration-200 hover:bg-indigo-500/20 hover:text-indigo-500"
                >
                  <GitBranch className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Push</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePull}
                  className="transition-all duration-200 hover:bg-pink-500/20 hover:text-pink-500"
                >
                  <GitPullRequest className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pull</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isRunning ? stopProject : runProject}
                  className="transition-all duration-200 hover:bg-emerald-500/20 hover:text-emerald-500"
                >
                  <Play className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isRunning ? "Stop" : "Run"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isDebugging ? stopDebug : startDebug}
                  className="transition-all duration-200 hover:bg-orange-500/20 hover:text-orange-500"
                >
                  <Bug className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isDebugging ? "Stop Debugging" : "Start Debugging"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={stopProject}
                  disabled={!isRunning && !isDebugging}
                  className="transition-all duration-200 hover:bg-red-500/20 hover:text-red-500"
                >
                  <StopCircle className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
