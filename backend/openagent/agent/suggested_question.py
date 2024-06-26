import json

from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOllama, ChatOpenAI
from loguru import logger

from openagent.conf.env import settings

load_dotenv()


async def agen_suggested_questions(user_id: str, history: str) -> list[str]:
    prompt = PromptTemplate(
        template="""
根据用户聊天记录建议后续问题。

返回格式：
["问题1", "问题2", "问题3"]

示例：

Q：
ETH 价格？
A：
["BTC价格是多少？", "什么是ETH？", "你能列举一些以太坊上的热门代币吗？"]

Q：
比特币价格是多少？
A：
["ETH价格是多少？", "比特币价格是多少？", "你能列举一些以太坊上的热门代币吗？"]

-----------------------------------------------------------------

Q：
{history}
A：""",  # noqa
        input_variables=["history"],
    )
    if settings.MODEL_NAME.startswith("gpt"):
        model = ChatOpenAI(
            model=settings.MODEL_NAME,
            openai_api_base=settings.LLM_API_BASE,
            temperature=0.5,
        )
    else:
        model = ChatOllama(model=settings.MODEL_NAME, base_url=settings.LLM_API_BASE)
    interpreter = LLMChain(llm=model, prompt=prompt)
    logger.info(f"开始基于以下历史记录生成问题建议：{history}")
    output = await interpreter.arun(
        history=history,
    )
    logger.info(f"建议问题已生成：{output}")
    # parse output, it's json array str
    lst = json.loads(output)
    logger.info(f"建议问题已解析：{lst}")
    return lst
