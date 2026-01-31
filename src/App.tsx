import { useState } from 'react';
import type { ParsedSession } from './types';
import { parseJsonl, analyzeSession, ParseError } from './parser';
import {
  FileUpload,
  SessionInfo,
  TokenUsage,
  ToolUsage,
  ConversationFlow,
  Footer,
  ErrorPage,
} from './components';

function App() {
  const [session, setSession] = useState<ParsedSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | undefined>(undefined);

  const handleFileLoad = (content: string) => {
    try {
      setError(null);
      setErrorDetails(undefined);
      const entries = parseJsonl(content);
      if (entries.length === 0) {
        setError('No valid entries found in the file.');
        return;
      }
      const parsed = analyzeSession(entries);
      setSession(parsed);
    } catch (err) {
      if (err instanceof ParseError) {
        setError(err.message);
        setErrorDetails(err.details);
      } else {
        setError(`Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const handleReset = () => {
    setSession(null);
    setError(null);
    setErrorDetails(undefined);
  };

  return (
    <div className="min-h-screen bg-soft-black text-white">
      <header className="bg-soft-black-light border-b border-soft-black-lighter px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-brand-400">claude</span>logs
          </h1>
          {session && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Load New File
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error ? (
          <ErrorPage message={error} details={errorDetails} onRetry={handleReset} />
        ) : !session ? (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Claude Code Session Viewer</h2>
              <p className="text-gray-400">
                Upload your Claude Code session log to view formatted session data
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Fully local and private - no data is stored or sent anywhere.
              </p>
            </div>
            <FileUpload onFileLoad={handleFileLoad} />
          </div>
        ) : (
          <div className="space-y-6">
            {session.system && (
              <SessionInfo
                system={session.system}
                durationMs={session.durationMs}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TokenUsage usage={session.totalUsage} />
              <ToolUsage toolCalls={session.toolCalls} />
            </div>

            <ConversationFlow flow={session.conversationFlow} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
