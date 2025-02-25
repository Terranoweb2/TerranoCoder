import { supabase } from "./supabase";

export interface FileData {
  id?: string;
  project_id: string;
  name: string;
  content: string;
  path: string;
}

export async function createFile(fileData: FileData) {
  const { data, error } = await supabase
    .from("files")
    .insert(fileData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFile(id: string, updates: Partial<FileData>) {
  const { data, error } = await supabase
    .from("files")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFile(id: string) {
  const { error } = await supabase.from("files").delete().eq("id", id);

  if (error) throw error;
}

export async function getProjectFiles(projectId: string) {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("project_id", projectId)
    .order("path");

  if (error) throw error;
  return data;
}
