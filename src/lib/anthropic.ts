import Anthropic from "@anthropic-ai/sdk";
import { privateEnv } from "~/config/privateEnv";

// Default model as specified in the feature requirements
export const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";

// Singleton instance for the Anthropic client
let anthropicClient: Anthropic | null = null;

/**
 * Get or create the Anthropic client instance.
 * Uses a singleton pattern to avoid creating multiple client instances.
 *
 * @throws Error if ANTHROPIC_API_KEY is not set
 */
export function getAnthropicClient(): Anthropic {
  if (anthropicClient) {
    return anthropicClient;
  }

  const apiKey = privateEnv.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY must be set in environment variables");
  }

  anthropicClient = new Anthropic({
    apiKey,
  });

  return anthropicClient;
}

/**
 * Message type for chat completions
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Options for streaming chat completions
 */
export interface StreamChatOptions {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * Create a streaming chat completion with the Anthropic API.
 * Returns an async iterable that yields text chunks as they arrive.
 *
 * @param options - The options for the chat completion
 * @returns AsyncIterable that yields text chunks
 */
export async function* streamChatCompletion(
  options: StreamChatOptions
): AsyncGenerator<string, void, unknown> {
  const client = getAnthropicClient();

  const {
    messages,
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    systemPrompt,
  } = options;

  // Build request parameters
  const requestParams: Anthropic.MessageCreateParams = {
    model,
    max_tokens: maxTokens,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  };

  // Add system prompt if provided
  if (systemPrompt) {
    requestParams.system = systemPrompt;
  }

  // Create the streaming message
  const stream = await client.messages.stream(requestParams);

  // Yield text chunks as they arrive
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

/**
 * Create a non-streaming chat completion with the Anthropic API.
 * Returns the complete response text.
 *
 * @param options - The options for the chat completion
 * @returns The complete response text
 */
export async function createChatCompletion(
  options: StreamChatOptions
): Promise<string> {
  const client = getAnthropicClient();

  const {
    messages,
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    systemPrompt,
  } = options;

  // Build request parameters
  const requestParams: Anthropic.MessageCreateParams = {
    model,
    max_tokens: maxTokens,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  };

  // Add system prompt if provided
  if (systemPrompt) {
    requestParams.system = systemPrompt;
  }

  const response = await client.messages.create(requestParams);

  // Extract text content from the response
  const textContent = response.content.find((block) => block.type === "text");
  return textContent?.text ?? "";
}

/**
 * Stream a chat completion and collect all chunks into a complete response.
 * Useful when you need both streaming behavior and the final result.
 *
 * @param options - The options for the chat completion
 * @param onChunk - Optional callback for each chunk received
 * @returns The complete response text
 */
export async function streamAndCollect(
  options: StreamChatOptions,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const chunks: string[] = [];

  for await (const chunk of streamChatCompletion(options)) {
    chunks.push(chunk);
    onChunk?.(chunk);
  }

  return chunks.join("");
}
