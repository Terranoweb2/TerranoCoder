import React from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import {
  FileIcon,
  FolderIcon,
  SaveIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  PlayIcon,
  BugIcon,
  StopCircleIcon,
} from "lucide-react";

interface TopToolbarProps {
  onNewFile?: () => void;
  onOpenFolder?: () => void;
  onSave?: () => void;
  onGitCommit?: () => void;
  onGitPush?: () => void;
  onGitPull?: () => void;
  onRun?: () => void;
  onDebug?: () => void;
  onStop?: () => void;
}

const TopToolbar = ({
  onNewFile = () => {},
  onOpenFolder = () => {},
  onSave = () => {},
  onGitCommit = () => {},
  onGitPush = () => {},
  onGitPull = () => {},
  onRun = () => {},
  onDebug = () => {},
  onStop = () => {},
}: TopToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="h-12 w-full bg-background border-b flex items-center px-4 space-x-4">
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onNewFile}>
                <FileIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New File</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onOpenFolder}>
                <FolderIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open Folder</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSave}>
                <SaveIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onGitCommit}>
                <GitCommitIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Commit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onGitPush}>
                <GitBranchIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Push</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onGitPull}>
                <GitPullRequestIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pull</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRun}>
                <PlayIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Run</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDebug}>
                <BugIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Debug</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onStop}>
                <StopCircleIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TopToolbar;
