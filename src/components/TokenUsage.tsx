interface TokenUsageProps {
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
  };
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function TokenUsage({ usage }: TokenUsageProps) {
  const totalTokens =
    usage.inputTokens +
    usage.outputTokens +
    usage.cacheCreationTokens +
    usage.cacheReadTokens;

  return (
    <div className="bg-soft-black-light rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white border-b border-soft-black-lighter pb-2">
        Token Usage
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-soft-black-lighter">
              <th className="pb-2">Type</th>
              <th className="pb-2 text-right">Tokens</th>
              <th className="pb-2 text-right">Percentage</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            <tr className="border-b border-soft-black-lighter/50">
              <td className="py-2">Input Tokens</td>
              <td className="py-2 text-right font-mono">
                {formatNumber(usage.inputTokens)}
              </td>
              <td className="py-2 text-right text-gray-400">
                {totalTokens > 0
                  ? ((usage.inputTokens / totalTokens) * 100).toFixed(1)
                  : 0}
                %
              </td>
            </tr>
            <tr className="border-b border-soft-black-lighter/50">
              <td className="py-2">Output Tokens</td>
              <td className="py-2 text-right font-mono">
                {formatNumber(usage.outputTokens)}
              </td>
              <td className="py-2 text-right text-gray-400">
                {totalTokens > 0
                  ? ((usage.outputTokens / totalTokens) * 100).toFixed(1)
                  : 0}
                %
              </td>
            </tr>
            <tr className="border-b border-soft-black-lighter/50">
              <td className="py-2">Cache Creation</td>
              <td className="py-2 text-right font-mono">
                {formatNumber(usage.cacheCreationTokens)}
              </td>
              <td className="py-2 text-right text-gray-400">
                {totalTokens > 0
                  ? ((usage.cacheCreationTokens / totalTokens) * 100).toFixed(1)
                  : 0}
                %
              </td>
            </tr>
            <tr className="border-b border-soft-black-lighter/50">
              <td className="py-2">Cache Read</td>
              <td className="py-2 text-right font-mono">
                {formatNumber(usage.cacheReadTokens)}
              </td>
              <td className="py-2 text-right text-gray-400">
                {totalTokens > 0
                  ? ((usage.cacheReadTokens / totalTokens) * 100).toFixed(1)
                  : 0}
                %
              </td>
            </tr>
            <tr className="font-bold text-white">
              <td className="py-2">Total</td>
              <td className="py-2 text-right font-mono">
                {formatNumber(totalTokens)}
              </td>
              <td className="py-2 text-right">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
