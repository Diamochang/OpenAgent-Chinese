# OpenAgent 后端

## 开发

1. 安装依赖项

```bash
poetry shell
poetry install
```

2. 配置环境变量

将 `.env.example` 文件复制为 `.env.local`，并填写环境变量值。

3. 启动容器

```bash
docker compose up -d
```

4. 运行应用程序

```bash
python main.py
```

### 添加新助手

1. 在 [openagent/experts](./openagent/experts) 目录下添加你的助手，包含与外部数据源交互的逻辑及相应的提示信息。该目录中含有一些示例助手，可帮助你快速开始。
2. 在 [openagent/agent/function_agent.py](./openagent/agent/function_agent.py) 中注册你的助手以启用它，之后即完成配置。

## 部署

自带的 [Dockerfile](./Dockerfile) 和 [docker-compose.yml](./docker-compose.yml) 文件为部署提供了基本设置。

## 环境变量

[.env.example](./.env.example) 文件中包含了所需的所有环境变量。