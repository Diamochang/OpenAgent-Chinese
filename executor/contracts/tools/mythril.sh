#!/usr/bin/env bash
#set -x

if [ ! -d "src" ]; then
	echo "错误：脚本需要在项目根目录下运行 './tools/mythril.sh'"
	exit 1
fi

platform=""
if [[ "$(uname -s)" == "Darwin" ]]; then
    platform="--platform linux/amd64"
fi

echo '
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "OpenAgentExecutorManager: "
myth -v4 analyze src/OpenAgentExecutorManager.sol --solc-json mythril.config.json --solv 0.8.20 --max-depth 10 --execution-timeout 900  --solver-timeout 900 &&
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" ' |
docker run --rm -v "$PWD":/project -i --workdir=/project --entrypoint=sh ${platform} mythril/myth