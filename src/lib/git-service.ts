import { supabase } from "./supabase";

export interface GitStatus {
  staged: string[];
  modified: string[];
  untracked: string[];
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export async function getGitStatus(): Promise<GitStatus> {
  try {
    const { data, error } = await supabase.functions.invoke("git-status", {
      body: { command: "git status --porcelain" },
    });

    if (error) throw error;

    const status: GitStatus = {
      staged: [],
      modified: [],
      untracked: [],
    };

    const output = data.output.split("\n").filter(Boolean);
    output.forEach((line: string) => {
      const [state, file] = [line.slice(0, 2).trim(), line.slice(3)];
      if (state.includes("A") || state.includes("M")) {
        status.staged.push(file);
      } else if (state === "??") {
        status.untracked.push(file);
      } else if (state === " M") {
        status.modified.push(file);
      }
    });

    return status;
  } catch (error) {
    console.error("Error getting git status:", error);
    throw error;
  }
}

export async function stageFile(path: string): Promise<void> {
  try {
    await supabase.functions.invoke("git-stage", {
      body: { path },
    });
  } catch (error) {
    console.error("Error staging file:", error);
    throw error;
  }
}

export async function unstageFile(path: string): Promise<void> {
  try {
    await supabase.functions.invoke("git-unstage", {
      body: { path },
    });
  } catch (error) {
    console.error("Error unstaging file:", error);
    throw error;
  }
}

export async function commitChanges(message: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("git-commit", {
      body: {
        commands: [
          'git config --global user.email "user@example.com"',
          'git config --global user.name "User"',
          `git commit -m "${message}"`,
        ],
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error committing changes:", error);
    throw error;
  }
}

export async function pushChanges(): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("git-push", {
      body: { command: "git push origin main" },
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error pushing changes:", error);
    throw error;
  }
}

export async function pullChanges(): Promise<void> {
  try {
    await supabase.functions.invoke("git-pull");
  } catch (error) {
    console.error("Error pulling changes:", error);
    throw error;
  }
}
