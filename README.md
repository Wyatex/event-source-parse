# @wyatex/event-source-parse

[简体中文](./README.zh-CN.md)

[![NPM Version](https://img.shields.io/npm/v/@wyatex/event-source-parse?style=flat-square&color=cb3837)](https://www.npmjs.com/package/@wyatex/event-source-parse)
[![License](https://img.shields.io/npm/l/@wyatex/event-source-parse?style=flat-square&color=blue)](https://github.com/wyatex/event-source-parse/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/wyatex/event-source-parse/ci.yml?style=flat-square&label=build)](https://github.com/wyatex/event-source-parse/actions)
[![Codecov](https://img.shields.io/codecov/c/github/wyatex/event-source-parse?style=flat-square)](https://codecov.io/gh/wyatex/event-source-parse)

A robust, zero-dependency parser for **Server-Sent Events (SSE)** streams.

This library is designed to consume `ReadableStream` or `AsyncIterable` and parse them into event messages. It is written in TypeScript and optimized for modern runtimes like Node.js, Bun, Deno, and Browsers.

### ✨ Key Features

*   **Universal Support**: Works with standard Web API `ReadableStream` and Node.js streams.
*   **🧩 Azure OpenAI Compatible**: Includes a specific flush mechanism to handle streams that don't end with a newline (common in Azure OpenAI / LangChain scenarios), ensuring no data is lost.
*   **TypeScript**: Fully typed with TS sources included.
*   **Lightweight**: No runtime dependencies.

## 📦 Installation

```bash
# npm
npm install @wyatex/event-source-parse

# bun
bun add @wyatex/event-source-parse

# pnpm
pnpm add @wyatex/event-source-parse

# yarn
yarn add @wyatex/event-source-parse
```

## 🚀 Usage

### 1. High-Level Usage (Recommended)

The easiest way to consume a stream is using the helper function `convertEventStreamToIterableReadableDataStream`. This converts a raw SSE stream directly into an async iterable of data strings.

```typescript
import { convertEventStreamToIterableReadableDataStream } from '@wyatex/event-source-parse'

async function consumeStream() {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({ stream: true, /* ... */ }),
  })

  if (!response.body) throw new Error('No body')

  // Convert the raw stream into an iterable of data strings
  const stream = convertEventStreamToIterableReadableDataStream(response.body)

  for await (const chunk of stream) {
    console.log('Received chunk:', chunk)
  }
}
```

### 2. Low-Level Control (Pipeline)

If you need full control over the parsing process (e.g., accessing `event` ID, `retry` time, or custom event types), you can compose the parser functions manually.

```typescript
import { getBytes, getLines, getMessages } from '@wyatex/event-source-parse'

async function parseCustomStream(stream: ReadableStream) {
  // 1. Create a message handler
  const onMessage = (msg) => {
    console.log('Event:', msg.event)
    console.log('Data:', msg.data)
    console.log('ID:', msg.id)
  }

  // 2. Create the pipeline
  // getMessages -> processes lines into EventSourceMessage objects
  // getLines    -> processes raw bytes into lines
  const processLine = getMessages(onMessage)
  const processChunk = getLines(processLine)

  // 3. Start reading bytes from the stream
  await getBytes(stream, processChunk)
}
```

### 3. Handling Metadata Events

The high-level helpers allow you to hook into specific events like `metadata` without disrupting the main data flow.

```typescript
const stream = convertEventStreamToIterableReadableDataStream(
  response.body,
  (metadata) => {
    console.log('Received metadata:', metadata)
  }
)
```

## 🛠️ Development

This project uses **Bun** for development.

```bash
# Install dependencies
bun install

# Run tests
bun run test

# Run tests with coverage
bun run test:coverage

# Lint code
bun run lint

# Build library
bun run build
```

## 📄 License

MIT
