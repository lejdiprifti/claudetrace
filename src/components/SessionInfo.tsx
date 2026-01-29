import type { SystemMessage } from '../types';

interface SessionInfoProps {
  system: SystemMessage;
  durationMs: number | null;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function SessionInfo({ system, durationMs }: SessionInfoProps) {
  return (
    <div className="bg-soft-black-light rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white border-b border-soft-black-lighter pb-2">
        Session Information
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Session ID:</span>
          <span className="ml-2 text-gray-200 font-mono text-xs">
            {system.session_id}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Model:</span>
          <span className="ml-2 text-brand-400">{system.model}</span>
        </div>
        <div>
          <span className="text-gray-400">Version:</span>
          <span className="ml-2 text-gray-200">{system.claude_code_version}</span>
        </div>
        <div>
          <span className="text-gray-400">Permission Mode:</span>
          <span className="ml-2 text-gray-200">{system.permissionMode}</span>
        </div>
        <div>
          <span className="text-gray-400">Working Directory:</span>
          <span className="ml-2 text-gray-200 font-mono text-xs">{system.cwd}</span>
        </div>
        <div>
          <span className="text-gray-400">API Key Source:</span>
          <span className="ml-2 text-gray-200">{system.apiKeySource}</span>
        </div>
        <div>
          <span className="text-gray-400">Execution Time:</span>
          <span className="ml-2 text-brand-400 font-semibold">
            {durationMs !== null ? formatDuration(durationMs) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-gray-400 text-sm">Available Tools:</div>
        <div className="flex flex-wrap gap-2">
          {system.tools?.map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 bg-soft-black-lighter text-gray-300 rounded text-xs"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {system.mcp_servers?.length > 0 && (
        <div className="space-y-2">
          <div className="text-gray-400 text-sm">MCP Servers:</div>
          <div className="flex flex-wrap gap-2">
            {system.mcp_servers.map((server) => (
              <span
                key={server.name}
                className={`px-2 py-1 rounded text-xs ${
                  server.status === 'connected'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-red-900 text-red-300'
                }`}
              >
                {server.name}: {server.status}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
