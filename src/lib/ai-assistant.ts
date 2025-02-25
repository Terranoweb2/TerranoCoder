import { supabase } from "./supabase";

export interface AIMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    // For now, return a mock response while we debug the API connection
    return "I understand you want to create a cocoa sales website. I can help you with that! Let's start by creating a basic structure. Would you like to begin with the homepage or product catalog?";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I apologize, but I encountered an unexpected error. Please try again in a moment.";
  }
}

export async function saveMessage(message: AIMessage): Promise<AIMessage> {
  try {
    const { data, error } = await supabase
      .from("ai_messages")
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving message:", error);
    return message; // Return original message if save fails
  }
}

export async function getMessageHistory(): Promise<AIMessage[]> {
  try {
    const { data, error } = await supabase
      .from("ai_messages")
      .select("*")
      .order("timestamp", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching message history:", error);
    return [];
  }
}
