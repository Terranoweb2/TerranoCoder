import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, GitFork, AlertTriangle, CheckCircle } from "lucide-react";

interface Metric {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  status?: "success" | "warning" | "error";
}

interface CodeIssue {
  id: string;
  type: "warning" | "error";
  message: string;
  location: string;
}

export default function CodeAnalytics() {
  const metrics: Metric[] = [
    {
      id: "1",
      title: "Code Coverage",
      value: "87%",
      change: "+2.3%",
      status: "success",
    },
    { id: "2", title: "Technical Debt", value: "3.2", status: "warning" },
    { id: "3", title: "Code Duplication", value: "4.5%", status: "success" },
    { id: "4", title: "Complexity Score", value: "24", status: "warning" },
  ];

  const issues: CodeIssue[] = [
    {
      id: "1",
      type: "warning",
      message: "Unused variable detected",
      location: "src/components/Editor.tsx:45",
    },
    {
      id: "2",
      type: "error",
      message: "Missing error handling",
      location: "src/utils/api.ts:23",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-500" />
          Code Analytics
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  {metric.change && (
                    <p
                      className={`text-sm ${metric.status === "success" ? "text-green-500" : "text-red-500"}`}
                    >
                      {metric.change}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Code Issues</h3>
          {issues.map((issue) => (
            <Card key={issue.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {issue.type === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <GitFork className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{issue.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {issue.location}
                    </p>
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
