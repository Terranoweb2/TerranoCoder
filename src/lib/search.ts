import { supabase } from "./supabase";

export interface SearchResult {
  type: "file" | "content";
  path: string;
  title: string;
  preview?: string;
  lineNumber?: number;
}

export async function searchFiles(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    // Search in file names
    const { data: fileResults } = await supabase
      .from("files")
      .select("*")
      .ilike("path", `%${query}%`);

    // Search in file contents
    const { data: contentResults } = await supabase
      .from("files")
      .select("*")
      .ilike("content", `%${query}%`);

    const results: SearchResult[] = [];

    // Process file name matches
    fileResults?.forEach((file) => {
      results.push({
        type: "file",
        path: file.path,
        title: file.path.split("/").pop() || file.path,
      });
    });

    // Process content matches
    contentResults?.forEach((file) => {
      const lines = file.content.split("\n");
      let lineNumber = 1;

      lines.forEach((line: string) => {
        if (line.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            type: "content",
            path: file.path,
            title: file.path.split("/").pop() || file.path,
            preview: line.trim(),
            lineNumber,
          });
        }
        lineNumber++;
      });
    });

    return results;
  } catch (error) {
    console.error("Error searching files:", error);
    return [];
  }
}
