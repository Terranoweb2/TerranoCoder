import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getGitStatus,
  type GitStatus,
  commitChanges,
  stageFile,
  unstageFile,
  pushChanges,
  pullChanges,
} from "@/lib/git-service";
import { supabase } from "@/lib/supabase";
import {
  createFile,
  updateFile,
  deleteFile,
  getProjectFiles,
} from "@/lib/file-manager";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
} from "@/lib/project-manager";

interface IDEContextType {
  currentFolder: string | null;
  setCurrentFolder: (path: string) => void;
  currentProject: string | null;
  setCurrentProject: (id: string | null) => void;
  openFiles: string[];
  activeFile: string | null;
  isRunning: boolean;
  isDebugging: boolean;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  saveFile: (path: string, content: string) => Promise<void>;
  runProject: () => Promise<void>;
  stopProject: () => Promise<void>;
  startDebug: () => Promise<void>;
  stopDebug: () => Promise<void>;
  gitStatus: GitStatus | null;
  handleCommit: (message?: string) => Promise<void>;
  handleStage: (path: string) => Promise<void>;
  handleUnstage: (path: string) => Promise<void>;
  handlePush: () => Promise<void>;
  handlePull: () => Promise<void>;
  terminalOutput: string[];
  setTerminalOutput: (output: string[]) => void;
}

export const IDEContext = createContext<IDEContextType | null>(null);

export function IDEProvider({ children }: { children: React.ReactNode }) {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const handleCommit = async (message: string = "Update") => {
    try {
      await commitChanges(message);
      const status = await getGitStatus();
      setGitStatus(status);
    } catch (error) {
      console.error("Error committing changes:", error);
    }
  };

  const handleStage = async (path: string) => {
    try {
      await stageFile(path);
      const status = await getGitStatus();
      setGitStatus(status);
    } catch (error) {
      console.error("Error staging file:", error);
    }
  };

  const handleUnstage = async (path: string) => {
    try {
      await unstageFile(path);
      const status = await getGitStatus();
      setGitStatus(status);
    } catch (error) {
      console.error("Error unstaging file:", error);
    }
  };

  const handlePush = async () => {
    try {
      await pushChanges();
      const status = await getGitStatus();
      setGitStatus(status);
    } catch (error) {
      console.error("Error pushing changes:", error);
    }
  };

  const handlePull = async () => {
    try {
      await pullChanges();
      const status = await getGitStatus();
      setGitStatus(status);
    } catch (error) {
      console.error("Error pulling changes:", error);
    }
  };

  useEffect(() => {
    const loadGitStatus = async () => {
      try {
        const status = await getGitStatus();
        setGitStatus(status);
      } catch (error) {
        console.error("Error loading git status:", error);
      }
    };

    loadGitStatus();
    const interval = setInterval(loadGitStatus, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const openFile = async (path: string) => {
    try {
      if (!openFiles.includes(path)) {
        const { data: fileData } = await supabase
          .from("files")
          .select("*")
          .eq("path", path)
          .single();

        if (fileData) {
          setOpenFiles([...openFiles, path]);
          setActiveFile(path);
        }
      } else {
        setActiveFile(path);
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const closeFile = (path: string) => {
    setOpenFiles(openFiles.filter((f) => f !== path));
    if (activeFile === path) {
      setActiveFile(openFiles[0] || null);
    }
  };

  const saveFile = async (path: string, content: string) => {
    try {
      await updateFile(path, { content });
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  };

  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [processId, setProcessId] = useState<string | null>(null);

  const runProject = async () => {
    try {
      setIsRunning(true);
      const {
        data: { id, output },
      } = await supabase.functions.invoke("run-project", {
        body: { command: "npm run dev" },
      });
      setProcessId(id);
      setTerminalOutput((prev) => [...prev, ...output]);
    } catch (error) {
      console.error("Error running project:", error);
      setTerminalOutput((prev) => [...prev, "Error: Failed to start project"]);
    }
  };

  const stopProject = async () => {
    try {
      if (processId) {
        await supabase.functions.invoke("stop-process", {
          body: { id: processId },
        });
        setProcessId(null);
      }
      setIsRunning(false);
      setTerminalOutput((prev) => [...prev, "Project stopped"]);
    } catch (error) {
      console.error("Error stopping project:", error);
    }
  };

  const startDebug = async () => {
    try {
      setIsDebugging(true);
      const {
        data: { id, output },
      } = await supabase.functions.invoke("run-project", {
        body: { command: "npm run dev:debug" },
      });
      setProcessId(id);
      setTerminalOutput((prev) => [...prev, ...output]);
    } catch (error) {
      console.error("Error starting debug:", error);
      setTerminalOutput((prev) => [
        ...prev,
        "Error: Failed to start debugging",
      ]);
    }
  };

  const stopDebug = async () => {
    try {
      if (processId) {
        await supabase.functions.invoke("stop-process", {
          body: { id: processId },
        });
        setProcessId(null);
      }
      setIsDebugging(false);
      setTerminalOutput((prev) => [...prev, "Debugging stopped"]);
    } catch (error) {
      console.error("Error stopping debug:", error);
    }
  };

  return (
    <IDEContext.Provider
      value={{
        currentFolder,
        setCurrentFolder,
        currentProject,
        setCurrentProject,
        openFiles,
        activeFile,
        isRunning,
        isDebugging,
        openFile,
        closeFile,
        saveFile,
        runProject,
        stopProject,
        startDebug,
        stopDebug,
        terminalOutput,
        setTerminalOutput,
        gitStatus,
        handleCommit,
        handleStage,
        handleUnstage,
        handlePush,
        handlePull,
      }}
    >
      {children}
    </IDEContext.Provider>
  );
}

export function useIDE() {
  const context = useContext(IDEContext);
  if (!context) {
    throw new Error("useIDE must be used within an IDEProvider");
  }
  return context;
}
