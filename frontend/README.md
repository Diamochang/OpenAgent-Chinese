# OpenAgent 前端

## 开发指南

### 1. 安装依赖

```bash
pnpm install
```

### 2. 数据库配置

启动本地 PostgreSQL 数据库（通过 Docker）:

```bash
pnpm run docker:db
```

执行数据库迁移:

```bash
pnpm run prisma:migrate:dev
```

### 3. 配置环境变量

将 `.env.example` 文件复制为 `.env.local`，并填写环境变量值。

#### 3.1 认证设置

使用 [Auth.js](https://authjs.dev/) 进行身份验证。需设置以下环境变量以允许用户通过谷歌、Discord 和邮箱账户登录。

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-for-dev"
AUTH_GOOGLE_CLIENT_ID=""
AUTH_GOOGLE_CLIENT_SECRET=""
AUTH_GMAIL_USER=""
AUTH_GMAIL_PASS=""
AUTH_DISCORD_CLIENT_ID=""
AUTH_DISCORD_CLIENT_SECRET=""
```

更多详情请参考 [Auth.js 文档](https://authjs.dev/)，例如 [Google 身份提供商文档](https://authjs.dev/reference/core/providers/google#resources)。

#### 3.2 数据库连接

使用 [Prisma](https://www.prisma.io/) 管理数据库。需要以下环境变量连接数据库。

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=openagent
DB_HOST=localhost
DB_PORT=5432
DB_SCHEMA=public
```

这些环境变量在 `prisma/schema.prisma` 文件中用于数据库连接。默认值已设于 `.env.example` 中，请根据实际情况调整。

#### 3.3 后端 API 配置

后端 API 用于从服务器获取数据。需要以下环境变量连接后端 API。

```bash
BACKEND_URL="https://YOUR_BACKEND_URL"
API_EXECUTOR_URL="https://YOUR_API_EXECUTOR_URL"
```

#### 3.4 钱包集成

钱包用于签署交易并与区块链交互。需设置以下环境变量以连接钱包。

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_CHAIN_ID=
```

注意：对于 `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`，依赖 WalletConnect 的每个 dApp 现在都需要从 [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) 获取项目ID。这是完全免费的，只需几分钟即可完成。

关于 `NEXT_PUBLIC_CHAIN_ID`，可参考 [Chainlist](https://www.chainlist.org/) 获取你想要连接的区块链的链 ID。例如，在生产环境中，主网应设为 `1`；而在开发环境中，Sepolia 测试网应设为 `11155111`。

### 4. 启动开发服务器

```bash
pnpm run dev
```

前端应用将在 [http://localhost:3000](http://localhost:3000) 上运行。本项目采用 [Next.js](https://nextjs.org/) 框架，更多详情请查阅 [Next.js 文档](https://nextjs.org/docs)。

## 部署

你可以将前端部署到 Vercel、Netlify 或任何支持 Next.js 的平台。项目同时提供了一个 Dockerfile 供你参考。

部署前，请确保完成 `.env.production` 文件中的环境变量配置，并设置相应的部署配置。