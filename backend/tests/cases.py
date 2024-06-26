import asyncio
import time

from openagent.agent.function_agent import get_agent

question_list = [
    "你好？",
    "以太坊的价格是多少？", # 译注：以太坊 = ETH
    "vitalik.eth 最近有什么动态？",
    "向 vitalik.eth 发送 0.01 ETH",
    "将 1 ETH 兑换成 USDT",
    "MODE 链是什么？",
    "请让我看看比特币的价格走势图",
    "列举一些受欢迎的 NFT",
    "你能推荐一些关于 Web3 的文章给我吗？",
    "Solana 上交易量最大的去中心化交易所是什么？", # 译注：去中心化交易所 = dex
    "ETH ETF 19b-4 表格何时获批？",
    "EigenLayer 的主要投资者都有谁？",
]


async def dummy(_) -> None:
    pass


async def init():
    # langchain.debug=True
    start = time.time()
    agent = get_agent("")
    for question in question_list:
        print(f"问题：{question}")
        try:
            await agent.arun(question)
        except Exception as e:
            print(f"错误：{e}")
        time.sleep(1)

        print("--------------")

    end = time.time()

    print(f"时间已过：{end - start}")


if __name__ == "__main__":
    asyncio.run(init())
