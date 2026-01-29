interface ToolUsageProps {
  toolCalls: {
    name: string;
    count: number;
    errors: number;
  }[];
}

export function ToolUsage({ toolCalls }: ToolUsageProps) {
  const totalCalls = toolCalls.reduce((sum, t) => sum + t.count, 0);
  const totalErrors = toolCalls.reduce((sum, t) => sum + t.errors, 0);

  return (
    <div className="bg-soft-black-light rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white border-b border-soft-black-lighter pb-2">
        Tool Usage
      </h2>
      {toolCalls.length === 0 ? (
        <p className="text-gray-400">No tool calls in this session.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-soft-black-lighter">
                <th className="pb-2">Tool</th>
                <th className="pb-2 text-right">Calls</th>
                <th className="pb-2 text-right">Errors</th>
                <th className="pb-2 text-right">Success Rate</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {toolCalls.map((tool) => {
                const successRate =
                  tool.count > 0
                    ? (((tool.count - tool.errors) / tool.count) * 100).toFixed(1)
                    : '100.0';
                return (
                  <tr key={tool.name} className="border-b border-soft-black-lighter/50">
                    <td className="py-2 font-mono text-brand-400">{tool.name}</td>
                    <td className="py-2 text-right">{tool.count}</td>
                    <td className="py-2 text-right">
                      {tool.errors > 0 ? (
                        <span className="text-red-400">{tool.errors}</span>
                      ) : (
                        <span className="text-gray-500">0</span>
                      )}
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className={
                          parseFloat(successRate) === 100
                            ? 'text-green-400'
                            : parseFloat(successRate) >= 80
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }
                      >
                        {successRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="font-bold text-white">
                <td className="py-2">Total</td>
                <td className="py-2 text-right">{totalCalls}</td>
                <td className="py-2 text-right">
                  {totalErrors > 0 ? (
                    <span className="text-red-400">{totalErrors}</span>
                  ) : (
                    <span>0</span>
                  )}
                </td>
                <td className="py-2 text-right">
                  {totalCalls > 0
                    ? (((totalCalls - totalErrors) / totalCalls) * 100).toFixed(1)
                    : '100.0'}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
