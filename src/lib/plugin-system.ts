import { supabase } from "./supabase";

export interface PluginConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  config: Record<string, any>;
  hooks: {
    onInit?: () => Promise<void>;
    onEnable?: () => Promise<void>;
    onDisable?: () => Promise<void>;
    onUninstall?: () => Promise<void>;
  };
}

class PluginSystem {
  private plugins: Map<string, PluginConfig> = new Map();
  private projectId: string | null = null;

  async initialize(projectId: string) {
    this.projectId = projectId;
    await this.loadPlugins();
  }

  private async loadPlugins() {
    if (!this.projectId) return;

    try {
      const { data: projectPlugins } = await supabase
        .from("project_plugins")
        .select(
          `
          id,
          plugin_id,
          enabled,
          config,
          plugin:plugins(*)
        `,
        )
        .eq("project_id", this.projectId)
        .eq("enabled", true);

      for (const plugin of projectPlugins || []) {
        await this.loadPlugin(plugin);
      }
    } catch (error) {
      console.error("Error loading plugins:", error);
    }
  }

  private async loadPlugin(projectPlugin: any) {
    try {
      const pluginModule = await import(
        `/plugins/${projectPlugin.plugin.name}`
      );
      const pluginConfig: PluginConfig = {
        id: projectPlugin.plugin_id,
        name: projectPlugin.plugin.name,
        version: projectPlugin.plugin.version,
        enabled: true,
        config: projectPlugin.config,
        hooks: pluginModule.default.hooks,
      };

      this.plugins.set(projectPlugin.plugin_id, pluginConfig);
      await pluginConfig.hooks.onInit?.();
    } catch (error) {
      console.error(
        `Error loading plugin ${projectPlugin.plugin.name}:`,
        error,
      );
    }
  }

  async enablePlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !this.projectId) return;

    try {
      await supabase
        .from("project_plugins")
        .update({ enabled: true })
        .eq("project_id", this.projectId)
        .eq("plugin_id", pluginId);

      await plugin.hooks.onEnable?.();
    } catch (error) {
      console.error(`Error enabling plugin ${pluginId}:`, error);
    }
  }

  async disablePlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !this.projectId) return;

    try {
      await supabase
        .from("project_plugins")
        .update({ enabled: false })
        .eq("project_id", this.projectId)
        .eq("plugin_id", pluginId);

      await plugin.hooks.onDisable?.();
      this.plugins.delete(pluginId);
    } catch (error) {
      console.error(`Error disabling plugin ${pluginId}:`, error);
    }
  }

  async uninstallPlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !this.projectId) return;

    try {
      await plugin.hooks.onUninstall?.();
      await supabase
        .from("project_plugins")
        .delete()
        .eq("project_id", this.projectId)
        .eq("plugin_id", pluginId);

      this.plugins.delete(pluginId);
    } catch (error) {
      console.error(`Error uninstalling plugin ${pluginId}:`, error);
    }
  }

  getPlugin(pluginId: string) {
    return this.plugins.get(pluginId);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
}

export const pluginSystem = new PluginSystem();
