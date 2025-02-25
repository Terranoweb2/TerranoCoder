import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Sparkles, Loader2 } from "lucide-react";
import {
  generateAIResponse,
  saveMessage,
  getMessageHistory,
  type AIMessage,
} from "@/lib/ai-assistant";

export default function AIAssistant() {
  const [messages, setMessages] = React.useState<AIMessage[]>([
    {
      id: "1",
      content:
        "Welcome to TerranoCoder! I'm your AI coding assistant powered by DeepSeek. How can I help you write better code today?",
      role: "assistant",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateAIResponse(input);
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          TerranoCoder AI Assistant
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`${message.role === "assistant" ? "bg-muted" : "bg-primary/10"}`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about coding..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
