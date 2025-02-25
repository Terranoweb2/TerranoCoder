import React from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Code, FileText } from "lucide-react";

interface SearchResult {
  id: string;
  type: "file" | "symbol" | "definition";
  title: string;
  description: string;
  path?: string;
}

export default function SmartSearch() {
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);

  const handleSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchFiles(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, handleSearch]);

  const [results2, setResults2] = React.useState<SearchResult[]>([
    {
      id: "1",
      type: "file",
      title: "App.tsx",
      description: "Main application component",
      path: "/src/App.tsx",
    },
    {
      id: "2",
      type: "symbol",
      title: "handleSearch",
      description: "Function in SearchContext",
      path: "/src/contexts/SearchContext.tsx",
    },
  ]);

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "file":
        return <FileText className="h-4 w-4" />;
      case "symbol":
      case "definition":
        return <Code className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background p-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search files, symbols, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 mt-4">
        <div className="space-y-2">
          {results.map((result) => (
            <Card key={result.id} className="cursor-pointer hover:bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  {getIcon(result.type)}
                  <div>
                    <p className="font-medium">{result.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.description}
                    </p>
                    {result.path && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.path}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
