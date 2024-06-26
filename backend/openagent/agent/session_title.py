from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOllama, ChatOpenAI
from loguru import logger

from openagent.conf.env import settings
from openagent.db.database import DBSession
from openagent.db.models import ChatSession

load_dotenv()


async def agen_session_title(user_id: str, session_id: str, history: str) -> list[str]:
    prompt = PromptTemplate(
        template="""
根据以下用户聊天记录，创建一个会话标题。\
你的回答需少于 10 个单词，并直接返回结果。

聊天记录：
{history}
会话标题：
    """,
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
    logger.info(f"开始基于以下历史记录生成会话标题：{history}")
    output = await interpreter.arun(
        history=history,
        metadata={"agentName": "openagent-chainlit", "userId": user_id},
    )
    output = output.strip("'").strip('"')
    logger.info(f"会话标题已生成：{output}")
    with DBSession() as db_session:
        db_session.query(ChatSession).filter(
            ChatSession.session_id == session_id
        ).update({ChatSession.title: output})
        db_session.commit()
    return output
