import json
import re
import uuid

from fastapi import APIRouter
from loguru import logger
from sse_starlette import EventSourceResponse

from openagent.dto.chat_req import ChatReq
from openagent.dto.chat_resp import ChatResp

onboarding_router = APIRouter(tags=["入门指南"])

introduction_text = """\
嗨，数字探索者！🚀 我是 OpenAgent，是你在广阔而充满活力的 Web3 宇宙中的得力助手！🌐✨

想知道我能做些什么吗？那就系好安全带，因为我将带你穿越区块链网络、代币、NFT 和去中心化应用（即 dApps）的宇宙迷宫。无论你是想交易一些代币、向朋友转账加密货币，还是仅仅对最新的 NFT 热潮感到好奇，我都为你保驾护航！

以下是我的一些超能力简介：

- **代币交易**：需要向朋友发送一些 USDC 吗？我将比流星更快地指引你的交易到达目的地！🌠💸
- **区块链情报**：对以太坊的燃料费或币安智能链的区块高度感到好奇吗？我会像追逐彗星的太空猎犬一样获取那些信息！🐕🌠
- **NFT 洞察**：想知道 NFT 世界里哪些最热门吗？我将为你呈现市值、底价以及最热门的 NFT！🖼️📈
- **DApp 探索**：寻找下一个去中心化金融宝物或社交 dApp 来连接太空同行者吗？我将成为你通往去中心化宇宙的向导！🌌🔍
- **加密货币疑问**：有关代币价格或市值的问题吗？我就像一本拥有最新数据的加密货币百科全书！📚💹

因此，如果你准备踏上 Web3 冒险之旅，只需联系我，让我们一起创造些星际魔法吧！记住，我在这里是为了让一切变得有趣活泼，所以路上丢一两个双关语别感到惊讶哦！🎉👾
"""  # noqa: E501

# 建议提问列表
suggested_questions = [
    "当前以太坊的燃料费是多少？",
    "能展示一下 vitalik.eth 最近的交易吗？",
    "Bored Ape Yacht Club NFT 系列的底价是多少？",
    "1 ETH 现在相当于多少 USDT？",
    "告诉我总锁定价值最高的去中心化金融项目。", # 译注：TVL = 总锁定价值 (Total Value Locked)；DeFi = 去中心化金融（上同）
    "Uniswap 上的热门用户是谁？",
    "你能帮我向 vitalik.eth 转 0.1 ETH 吗？",
]


def generate_stream():
    unique_message_id = str(uuid.uuid4())

    tokens = re.findall(r"\S+\s*", introduction_text)

    for token in tokens:
        yield f'{{"message_id":"{unique_message_id}","block_id":null,"type":"natural_language","body":{json.dumps(token)}}}'  # noqa: E501

    questions_json = json.dumps(suggested_questions)
    yield f'{{"message_id":"{unique_message_id}","block_id":null,"type":"suggested_questions","body":{questions_json}}}'  # noqa: E501


@onboarding_router.post("/onboarding/", response_model=ChatResp)
async def onboarding(req: ChatReq):
    logger.info(f"收到请求：req={req}")
    return EventSourceResponse(generate_stream())
