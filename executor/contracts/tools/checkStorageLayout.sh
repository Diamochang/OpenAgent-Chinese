#!/usr/bin/env bash
set -x

if [ ! -d "src" ]; then
	echo "错误：脚本需要在项目根目录下运行 './tools/checkStorageLayout.sh'"
	exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for contract in OpenAgentExecutorManager
do
  file=$(mktemp /tmp/contracts-storage-layout-${contract}.XXXXX) || exit 2
  forge inspect ${contract} storage-layout --pretty > ${file} || exit 3

  diffResult=$(mktemp /tmp/contracts-storage-layout-${contract}.XXXXX) || exit 4
  diff -bB ./tools/storageLayout/${contract}-storage-layout.txt ${file}  > ${diffResult}
  if cat ${diffResult} | grep "^<" >/dev/null
  then
    echo "${contract} 检查失败！"
    cat ${diffResult}
    exit 255
  else
    cp ${file} ./tools/storageLayout/${contract}-storage-layout.txt
  fi
done
echo "存储布局检查完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"