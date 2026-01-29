export interface SystemMessage {
  type: 'system';
  subtype: string;
  cwd: string;
  session_id: string;
  tools: string[];
  mcp_servers: { name: string; status: string }[];
  model: string;
  permissionMode: string;
  slash_commands: string[];
  apiKeySource: string;
  claude_code_version: string;
  output_style: string;
  agents: string[];
  skills: string[];
  plugins: string[];
  uuid: string;
  timestamp?: string;
}

export interface ContentBlock {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  tool_use_id?: string;
  content?: string | ContentBlock[];
  is_error?: boolean;
}

export interface Usage {
  input_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  output_tokens: number;
  service_tier?: string;
}

export interface AssistantMessageContent {
  model: string;
  id: string;
  type: 'message';
  role: 'assistant';
  content: ContentBlock[];
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: Usage;
  context_management: unknown;
}

export interface AssistantMessage {
  type: 'assistant';
  message: AssistantMessageContent;
  parent_tool_use_id: string | null;
  session_id: string;
  uuid: string;
  timestamp?: string;
}

export interface UserMessageContent {
  role: 'user';
  content: ContentBlock[];
}

export interface UserMessage {
  type: 'user';
  message: UserMessageContent;
  parent_tool_use_id: string | null;
  session_id: string;
  uuid: string;
  tool_use_result?: Record<string, unknown>;
  timestamp?: string;
}

export type LogEntry = SystemMessage | AssistantMessage | UserMessage;

export interface ParsedSession {
  system: SystemMessage | null;
  messages: (AssistantMessage | UserMessage)[];
  totalUsage: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
  };
  toolCalls: {
    name: string;
    count: number;
    errors: number;
  }[];
  conversationFlow: ConversationEntry[];
  durationMs: number | null;
}

export interface ToolCallDetail {
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultDetail {
  toolName: string;
  content: string | ContentBlock[];
  isError: boolean;
}

export interface ConversationEntry {
  role: 'User' | 'Assistant';
  text: string;
  toolCalls?: ToolCallDetail[];
  toolResults?: ToolResultDetail[];
}
