# OpenAgent 执行器合约

## 使用说明

### 构建

```shell
forge build
```

### 测试

```shell
forge test
```

### 部署

在 [deploy-config](./deploy-config) 目录下的 JSON 文件中设置 `proxyAdminOwner` 和 `manager` 两个参数。

```shell
make deploy-sepolia
```
