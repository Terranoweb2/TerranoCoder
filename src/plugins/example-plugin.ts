import { PluginConfig } from "@/lib/plugin-system";

const examplePlugin: PluginConfig = {
  id: "example-plugin",
  settings: {
    enabled: true,
    config: {
      // Plugin-specific configuration
    },
  },
  hooks: {
    onInit: async () => {
      console.log("Example plugin initialized");
    },
    onEnable: async () => {
      console.log("Example plugin enabled");
    },
    onDisable: async () => {
      console.log("Example plugin disabled");
    },
    onUninstall: async () => {
      console.log("Example plugin uninstalled");
    },
  },
};

export default examplePlugin;
