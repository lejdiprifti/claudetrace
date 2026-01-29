import { useState } from 'react';
import type { ConversationEntry, ToolCallDetail, ToolResultDetail, ContentBlock } from '../types';

interface ConversationFlowProps {
  flow: ConversationEntry[];
}

function ToolCallCard({ toolCall }: { toolCall: ToolCallDetail }) {
  const [expanded, setExpanded] = useState(false);
  const inputStr = JSON.stringify(toolCall.input, null, 2);
  const isLong = inputStr.length > 200;

  return (
    <div className="bg-brand-900/30 border border-brand-700/50 rounded-lg p-3 mt-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-mono text-brand-300 font-semibold">
          {toolCall.name}
        </span>
        {isLong && (
          <button className="text-xs text-brand-400 hover:text-brand-300">
            {expanded ? '▼ Collapse' : '▶ Expand'}
          </button>
        )}
      </div>
      <pre
        className={`mt-2 text-xs text-gray-300 bg-gray-900/50 p-2 rounded overflow-x-auto ${
          !expanded && isLong ? 'max-h-24 overflow-hidden' : ''
        }`}
      >
        {inputStr}
      </pre>
    </div>
  );
}

function formatToolResultContent(content: string | ContentBlock[]): string {
  if (typeof content === 'string') {
    return content;
  }
  return content
    .map((block) => {
      if (block.type === 'text') return block.text || '';
      return JSON.stringify(block, null, 2);
    })
    .join('\n');
}

function ToolResultCard({ toolResult }: { toolResult: ToolResultDetail }) {
  const [expanded, setExpanded] = useState(false);
  const contentStr = formatToolResultContent(toolResult.content);
  const isLong = contentStr.length > 300;

  return (
    <div
      className={`border rounded-lg p-3 mt-2 ${
        toolResult.isError
          ? 'bg-red-900/30 border-red-700/50'
          : 'bg-gray-700/30 border-gray-600/50'
      }`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-gray-300 font-semibold">
            {toolResult.toolName}
          </span>
          {toolResult.isError && (
            <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded">
              ERROR
            </span>
          )}
        </div>
        {isLong && (
          <button className="text-xs text-gray-400 hover:text-gray-300">
            {expanded ? '▼ Collapse' : '▶ Expand'}
          </button>
        )}
      </div>
      <pre
        className={`mt-2 text-xs text-gray-300 bg-gray-900/50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words ${
          !expanded && isLong ? 'max-h-32 overflow-hidden' : ''
        }`}
      >
        {contentStr}
      </pre>
    </div>
  );
}

export function ConversationFlow({ flow }: ConversationFlowProps) {
  return (
    <div className="bg-soft-black-light rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white border-b border-soft-black-lighter pb-2">
        Conversation Flow
      </h2>
      {flow.length === 0 ? (
        <p className="text-gray-400">No conversation entries found.</p>
      ) : (
        <div className="space-y-4">
          {flow.map((entry, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                entry.role === 'User'
                  ? 'bg-brand-900/30 border-l-4 border-brand-400'
                  : 'bg-gray-700/50 border-l-4 border-gray-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    entry.role === 'User'
                      ? 'bg-brand-400 text-white'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  {entry.role}
                </span>
              </div>

              {entry.text && (
                <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                  {entry.text}
                </p>
              )}

              {entry.toolCalls && entry.toolCalls.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-400 mb-1">Tool Calls:</div>
                  {entry.toolCalls.map((tc, tcIndex) => (
                    <ToolCallCard key={tcIndex} toolCall={tc} />
                  ))}
                </div>
              )}

              {entry.toolResults && entry.toolResults.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-400 mb-1">Tool Results:</div>
                  {entry.toolResults.map((tr, trIndex) => (
                    <ToolResultCard key={trIndex} toolResult={tr} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
