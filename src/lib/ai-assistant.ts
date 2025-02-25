import { supabase } from "./supabase";

export interface AIMessage {
  id?: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const {
      data: { deepseek_key },
    } = await supabase.from("api_keys").select("deepseek_key").single();

    if (!deepseek_key) {
      throw new Error("DeepSeek API key not found");
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepseek_key}`,
        },
        body: JSON.stringify({
          model: "deepseek-coder-33b-instruct",
          messages: [
            {
              role: "system",
              content:
                "You are an expert coding assistant. Provide concise, accurate code suggestions and improvements.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

export async function saveMessage(message: AIMessage) {
  const { data, error } = await supabase
    .from("ai_messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessageHistory() {
  const { data, error } = await supabase
    .from("ai_messages")
    .select("*")
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return data;
}
