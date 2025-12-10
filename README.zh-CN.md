# @wyatex/event-source-parse

[English](./README.md)

[![NPM Version](https://img.shields.io/npm/v/@wyatex/event-source-parse?style=flat-square&color=cb3837)](https://www.npmjs.com/package/@wyatex/event-source-parse)
[![License](https://img.shields.io/npm/l/@wyatex/event-source-parse?style=flat-square&color=blue)](https://github.com/wyatex/event-source-parse/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/wyatex/event-source-parse/ci.yml?style=flat-square&label=build)](https://github.com/wyatex/event-source-parse/actions)
[![Codecov](https://img.shields.io/codecov/c/github/wyatex/event-source-parse?style=flat-square)](https://codecov.io/gh/wyatex/event-source-parse)

一个健壮的、零依赖的 **Server-Sent Events (SSE)** 流解析器。

该库旨在接收 `ReadableStream` 或 `AsyncIterable` 并将其解析为标准事件消息。它完全使用 TypeScript 编写，并针对 Node.js、Bun、Deno 和现代浏览器等运行时进行了优化。

### ✨ 主要特性

*   **通用支持**：同时支持标准 Web API `ReadableStream` 和 Node.js 流。
*   **🧩 Azure OpenAI 兼容**：内置了特殊的刷新（flush）机制，能够处理不以换行符结尾的流（这在 Azure OpenAI / LangChain 场景中很常见），确保最后一条消息不会丢失。
*   **TypeScript**：完全类型化，分发包中包含 TS 源码。
*   **轻量级**：无运行时依赖。

## 📦 安装

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

## 🚀 使用方法

### 1. 高级用法（推荐）

消费流数据最简单的方法是使用辅助函数 `convertEventStreamToIterableReadableDataStream`。它可以直接将原始 SSE 流转换为由 `data` 字符串组成的异步可迭代对象（Async Iterable）。

```typescript
import { convertEventStreamToIterableReadableDataStream } from '@wyatex/event-source-parse'

async function consumeStream() {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({ stream: true, /* ... */ }),
  })

  if (!response.body) throw new Error('No body')

  // 将原始流转换为数据字符串的迭代器
  const stream = convertEventStreamToIterableReadableDataStream(response.body)

  for await (const chunk of stream) {
    console.log('收到数据块:', chunk)
  }
}
```

### 2. 低级控制（管道模式）

如果你需要完全控制解析过程（例如获取 `event` ID、`retry` 重试时间或自定义事件类型），可以手动组合解析器函数。

```typescript
import { getBytes, getLines, getMessages } from '@wyatex/event-source-parse'

async function parseCustomStream(stream: ReadableStream) {
  // 1. 创建消息处理器
  const onMessage = (msg) => {
    console.log('事件类型:', msg.event)
    console.log('数据内容:', msg.data)
    console.log('事件ID:', msg.id)
  }

  // 2. 创建处理管道
  // getMessages -> 将行数据处理成 EventSourceMessage 对象
  // getLines    -> 将原始字节处理成行
  const processLine = getMessages(onMessage)
  const processChunk = getLines(processLine)

  // 3. 开始从流中读取字节
  await getBytes(stream, processChunk)
}
```

### 3. 处理元数据事件

高级辅助函数允许你在不中断主数据流的情况下，通过回调钩入特定事件（如 `metadata`）。

```typescript
const stream = convertEventStreamToIterableReadableDataStream(
  response.body,
  (metadata) => {
    console.log('收到元数据:', metadata)
  }
)
```

## 🛠️ 本地开发

本项目使用 **Bun** 进行开发。

```bash
# 安装依赖
bun install

# 运行测试
bun run test

# 运行带覆盖率的测试
bun run test:coverage

# 代码风格检查 (Lint)
bun run lint

# 构建库
bun run build
```

## 📄 许可证

MIT
