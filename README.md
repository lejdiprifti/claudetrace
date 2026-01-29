# claudetrace

A web-based viewer for Claude Code session logs. Upload your `.json` or `.jsonl` session files to visualize conversations, tool usage, and token statistics.

## Features

- **Session Information** - View session metadata including model, version, working directory, available tools, and MCP servers
- **Token Usage** - Breakdown of input, output, cache creation, and cache read tokens with percentages
- **Tool Usage** - Statistics on tool calls with error counts and success rates
- **Conversation Flow** - Full conversation history with:
  - Complete text messages (not truncated)
  - Tool calls with full input parameters
  - Tool results with response content
  - Error highlighting for failed tool calls
  - Collapsible sections for long content

## Installation

```bash
npm install
```

## Usage

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. Open the application in your browser
2. Drag and drop a Claude Code session log file (`.json` or `.jsonl`) onto the upload area, or click "Browse Files" to select one
3. View the parsed session data organized into sections:
   - Session Information
   - Token Usage
   - Tool Usage
   - Conversation Flow

Session logs are typically found at `~/.claude/projects/<project-path>/<session-id>.jsonl`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
