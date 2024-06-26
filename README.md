<!-- markdownlint-disable -->
<p align="center">
  <img width="180" src="./OpenAgent.svg" alt="OpenAgent 标志">
</p>
<p align="center">
  <a href="https://link.rss3.io/x"><img src="https://img.shields.io/twitter/follow/rss3_?color=%230072ff" alt="在 X（原 Twitter）上关注 RSS3"></a>
  <a href="https://link.rss3.io/discord"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord&color=%230072ff" alt="加入 RSS3 的 Discord"></a>
  <!-- add NPM and other badges when needed -->
</p>
<!-- markdownlint-enable -->

# OpenAgent 框架

OpenAgent 是一个框架，用于构建利用区块链和 RSS3 网络之神力的 AI 应用程序。

该框架由三个主要组件组成，它们一起部署以形成一个完整的应用程序。

## 后端：LLM，助手系统

一组 API，用于响应来自前端的请求。它利用 Langchain 来提供不同 LLMs 之间的互操作性。

它利用 RSS3 网络来检索知识并输入到指定的助手系统中。

### LLM 兼容性

理论上，OpenAgent 可以与任何具有函数调用功能的 LLMs 兼容。
我们鼓励您使用所选的 LLMs 进行测试，并为下面的兼容性列表做出贡献。
这里我们提供了一份经过测试，智能水平足以满足需求的 LLMs 列表：

#### 开源 LLMs

| 开源LLMs    | 性能评分 |
|-------------|----------|
| llama3      | ★★★★☆   |
| codellama   | ★★★☆☆   |
| gemma       | ★★★☆☆   |
| aya         | ★★☆☆☆   |
| mistral     | ★★☆☆☆   |
| deepseek-coder | ★☆☆☆☆ |
| solar       | ★☆☆☆☆   |
| llava       | ★☆☆☆☆   |
| phi3        | ★☆☆☆☆   |

#### 专有 LLMs

| 专有LLMs    | 性能评分 |
|-------------|----------|
| gpt-3.5-turbo | ★★★★★   |
| gpt-4-turbo   | ★★★★★   |
| gpt-4o        | ★★★★★   |
| gemini-1.5-flash | ★★★★☆ |
| gemini-1.5-pro  | ★★★★☆ |

更多开发和部署信息，请参见 [backend/README.md](backend/README.md)。

## 前端：客户端

一个示例 Web 应用程序，作为客户端，使用户能够与后端进行交互。

更多开发和部署信息，请参见 [frontend/README.md](frontend/README.md)。

## 执行器

一组 API，用于在链上执行和提交交易。在所有情况下都应加以限制，以防未经授权的访问。

此外，存储库还包含一组示例智能合约，需要在使用执行器之前部署。更多相关信息，请参见 [executor/contracts/README.md](executor/contracts/README.md)。

关于开发和部署的更多信息，请参阅 [executor/README.md](executor/README.md)。