import { supabase } from "./supabase";

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  config: Record<string, any>;
}

export interface ProjectPlugin {
  id: string;
  project_id: string;
  plugin_id: string;
  enabled: boolean;
  config: Record<string, any>;
  plugin: Plugin;
}

export async function installPlugin(projectId: string, pluginId: string) {
  const { data, error } = await supabase
    .from("project_plugins")
    .insert({
      project_id: projectId,
      plugin_id: pluginId,
      enabled: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uninstallPlugin(projectPluginId: string) {
  const { error } = await supabase
    .from("project_plugins")
    .delete()
    .eq("id", projectPluginId);

  if (error) throw error;
}

export async function togglePlugin(projectPluginId: string, enabled: boolean) {
  const { data, error } = await supabase
    .from("project_plugins")
    .update({ enabled })
    .eq("id", projectPluginId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProjectPlugins(projectId: string) {
  const { data, error } = await supabase
    .from("project_plugins")
    .select(
      `
      id,
      project_id,
      plugin_id,
      enabled,
      config,
      plugin:plugins(*)
    `,
    )
    .eq("project_id", projectId);

  if (error) throw error;
  return data;
}

export async function getAvailablePlugins(projectId: string) {
  const { data: installed } = await getProjectPlugins(projectId);
  const installedIds = installed?.map((p) => p.plugin_id) || [];

  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .not("id", "in", installedIds);

  if (error) throw error;
  return data;
}
