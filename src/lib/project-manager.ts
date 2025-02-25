import { supabase } from "./supabase";

export interface ProjectData {
  id?: string;
  name: string;
  description?: string;
}

export async function createProject(projectData: ProjectData) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert(projectData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(id: string, updates: Partial<ProjectData>) {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
}

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
