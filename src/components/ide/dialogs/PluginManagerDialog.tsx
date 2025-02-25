import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Search, Settings, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Plugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  config: Record<string, any>;
}

interface ProjectPlugin {
  id: string;
  project_id: string;
  plugin_id: string;
  enabled: boolean;
  config: Record<string, any>;
  plugin: Plugin;
}

interface PluginManagerDialogProps {
  projectId: string;
}

export function PluginManagerDialog({ projectId }: PluginManagerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [installedPlugins, setInstalledPlugins] = React.useState<
    ProjectPlugin[]
  >([]);
  const [availablePlugins, setAvailablePlugins] = React.useState<Plugin[]>([]);

  const loadPlugins = async () => {
    try {
      // Load installed plugins
      const { data: installed } = await supabase
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

      setInstalledPlugins(installed || []);

      // Load available plugins
      const { data: available } = await supabase
        .from("plugins")
        .select("*")
        .not(
          "id",
          "in",
          (installed || []).map((p) => p.plugin_id),
        );

      setAvailablePlugins(available || []);
    } catch (error) {
      console.error("Error loading plugins:", error);
    }
  };

  React.useEffect(() => {
    if (open) {
      loadPlugins();
    }
  }, [open, projectId]);

  const handleInstall = async (plugin: Plugin) => {
    setLoading(true);
    try {
      await supabase.from("project_plugins").insert({
        project_id: projectId,
        plugin_id: plugin.id,
        enabled: true,
        config: plugin.config,
      });
      await pluginSystem.initialize(projectId);
      await loadPlugins();
    } catch (error) {
      console.error("Error installing plugin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (projectPlugin: ProjectPlugin) => {
    try {
      await supabase
        .from("project_plugins")
        .update({ enabled: !projectPlugin.enabled })
        .eq("id", projectPlugin.id);
      await loadPlugins();
    } catch (error) {
      console.error("Error toggling plugin:", error);
    }
  };

  const filteredAvailablePlugins = availablePlugins.filter((plugin) =>
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredInstalledPlugins = installedPlugins.filter((plugin) =>
    plugin.plugin.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Package className="h-4 w-4" />
          Manage Plugins
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Plugin Manager</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue="installed">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="installed">Installed</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
          </TabsList>

          <TabsContent value="installed">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {filteredInstalledPlugins.map((projectPlugin) => (
                  <Card key={projectPlugin.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {projectPlugin.plugin.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          v{projectPlugin.plugin.version}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Open settings dialog
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={projectPlugin.enabled}
                          onCheckedChange={() => handleToggle(projectPlugin)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="available">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {filteredAvailablePlugins.map((plugin) => (
                  <Card key={plugin.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{plugin.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          v{plugin.version}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleInstall(plugin)}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Install"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
