import { supabase } from "./supabase";

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
}

class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second

  constructor(maxTokens = 50, refillRate = 10) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }

  async waitForToken(): Promise<void> {
    this.refillTokens();
    if (this.tokens <= 0) {
      const waitTime = (1000 / this.refillRate) * Math.abs(this.tokens);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.refillTokens();
    }
    this.tokens--;
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const refill = (timePassed / 1000) * this.refillRate;
    this.tokens = Math.min(this.maxTokens, this.tokens + refill);
    this.lastRefill = now;
  }
}

const rateLimiter = new RateLimiter();

export async function* streamAIResponse(
  prompt: string,
): AsyncGenerator<string> {
  await rateLimiter.waitForToken();

  const {
    data: { deepseek_key },
  } = await supabase.from("api_keys").select("deepseek_key").single();

  if (!deepseek_key) {
    throw new Error("DeepSeek API key not found");
  }

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${deepseek_key}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are TerranoCoder's intelligent coding assistant, designed to help developers write better code. You provide concise, accurate responses and specialize in code review, bug fixing, best practices, and modern development patterns.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Response body is null");

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line.includes("[DONE]")) return;

        try {
          const parsed = JSON.parse(line.replace(/^data: /, ""));
          if (parsed.choices[0].delta?.content) {
            yield parsed.choices[0].delta.content;
          }
        } catch (e) {
          console.error("Error parsing streaming response:", e);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function generateAIResponse(prompt: string): Promise<string> {
  let fullResponse = "";
  try {
    for await (const chunk of streamAIResponse(prompt)) {
      fullResponse += chunk;
    }
    return fullResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}
