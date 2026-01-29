import type {
  LogEntry,
  SystemMessage,
  AssistantMessage,
  UserMessage,
  ParsedSession,
  ContentBlock,
  ConversationEntry,
  ToolCallDetail,
  ToolResultDetail,
} from './types';

export function parseJsonl(content: string): LogEntry[] {
  const lines = content.split('\n').filter((line) => line.trim());
  const entries: LogEntry[] = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line) as LogEntry;
      entries.push(entry);
    } catch {
      // Skip malformed lines
    }
  }

  return entries;
}

export function analyzeSession(entries: LogEntry[]): ParsedSession {
  let system: SystemMessage | null = null;
  const messages: (AssistantMessage | UserMessage)[] = [];
  const toolCallMap = new Map<string, { count: number; errors: number }>();

  const totalUsage = {
    inputTokens: 0,
    outputTokens: 0,
    cacheCreationTokens: 0,
    cacheReadTokens: 0,
  };

  for (const entry of entries) {
    if (entry.type === 'system') {
      system = entry as SystemMessage;
    } else if (entry.type === 'assistant') {
      const assistantMsg = entry as AssistantMessage;
      messages.push(assistantMsg);

      // Aggregate usage
      if (assistantMsg.message.usage) {
        totalUsage.inputTokens += assistantMsg.message.usage.input_tokens || 0;
        totalUsage.outputTokens += assistantMsg.message.usage.output_tokens || 0;
        totalUsage.cacheCreationTokens += assistantMsg.message.usage.cache_creation_input_tokens || 0;
        totalUsage.cacheReadTokens += assistantMsg.message.usage.cache_read_input_tokens || 0;
      }

      // Track tool calls
      for (const block of assistantMsg.message.content) {
        if (block.type === 'tool_use' && block.name) {
          const existing = toolCallMap.get(block.name) || { count: 0, errors: 0 };
          existing.count++;
          toolCallMap.set(block.name, existing);
        }
      }
    } else if (entry.type === 'user') {
      const userMsg = entry as UserMessage;
      messages.push(userMsg);

      // Track tool result errors
      for (const block of userMsg.message.content) {
        if (block.type === 'tool_result' && block.is_error) {
          const toolName = findToolName(messages, block.tool_use_id);
          if (toolName) {
            const existing = toolCallMap.get(toolName) || { count: 0, errors: 0 };
            existing.errors++;
            toolCallMap.set(toolName, existing);
          }
        }
      }
    }
  }

  const toolCalls = Array.from(toolCallMap.entries()).map(([name, stats]) => ({
    name,
    count: stats.count,
    errors: stats.errors,
  }));

  toolCalls.sort((a, b) => b.count - a.count);

  const conversationFlow = extractConversationFlow(messages);

  // Extract duration from result entry
  const durationMs = extractDurationMs(entries);

  return {
    system,
    messages,
    totalUsage,
    toolCalls,
    conversationFlow,
    durationMs,
  };
}

function extractDurationMs(entries: LogEntry[]): number | null {
  for (const entry of entries) {
    const e = entry as unknown as Record<string, unknown>;
    if (e.type === 'result' && typeof e.duration_ms === 'number') {
      return e.duration_ms as number;
    }
  }
  return null;
}

function findToolName(
  messages: (AssistantMessage | UserMessage)[],
  toolUseId?: string
): string | null {
  if (!toolUseId) return null;

  for (const msg of messages) {
    if (msg.type === 'assistant') {
      for (const block of msg.message.content) {
        if (block.type === 'tool_use' && block.id === toolUseId) {
          return block.name || null;
        }
      }
    }
  }
  return null;
}

function extractConversationFlow(
  messages: (AssistantMessage | UserMessage)[]
): ConversationEntry[] {
  const flow: ConversationEntry[] = [];
  const toolUseMap = new Map<string, string>(); // tool_use_id -> tool name

  for (const msg of messages) {
    if (msg.type === 'assistant') {
      const textBlocks = msg.message.content.filter(
        (b): b is ContentBlock & { type: 'text' } => b.type === 'text'
      );
      const toolBlocks = msg.message.content.filter(
        (b): b is ContentBlock & { type: 'tool_use' } => b.type === 'tool_use'
      );

      const text = textBlocks.map((b) => b.text || '').join('\n\n');

      const toolCalls: ToolCallDetail[] = toolBlocks.map((b) => {
        if (b.id) {
          toolUseMap.set(b.id, b.name || 'unknown');
        }
        return {
          name: b.name || 'unknown',
          input: b.input || {},
        };
      });

      if (text || toolCalls.length > 0) {
        flow.push({
          role: 'Assistant',
          text,
          toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        });
      }
    } else if (msg.type === 'user') {
      const textBlocks = msg.message.content.filter(
        (b): b is ContentBlock & { type: 'text' } => b.type === 'text'
      );
      const toolResultBlocks = msg.message.content.filter(
        (b): b is ContentBlock & { type: 'tool_result' } => b.type === 'tool_result'
      );

      const text = textBlocks.map((b) => b.text || '').join('\n\n');

      const toolResults: ToolResultDetail[] = toolResultBlocks.map((b) => ({
        toolName: toolUseMap.get(b.tool_use_id || '') || 'unknown',
        content: b.content || '',
        isError: b.is_error || false,
      }));

      if (text || toolResults.length > 0) {
        flow.push({
          role: 'User',
          text,
          toolResults: toolResults.length > 0 ? toolResults : undefined,
        });
      }
    }
  }

  return flow;
}
