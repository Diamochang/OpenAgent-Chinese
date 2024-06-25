from typing import Optional, Type

import aiohttp
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
from loguru import logger
from pydantic import BaseModel, Field

from openagent.conf.env import settings


class ParamSchema(BaseModel):
    address: str = Field(
        description = """钱包地址或区块链域名，\
提示：Vitalik 的地址是 vitalik.eth"""
    )


class FeedExpert(BaseTool):
    name = "动态助手"
    description = """使用此工具获取钱包地址或\
区块链域名的活动动态，了解该地址最近的行为或正在进行的操作。"""
    args_schema: Type[ParamSchema] = ParamSchema

    def _run(
        self,
        address: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        raise NotImplementedError

    async def _arun(
        self,
        address: str,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ):
        return await fetch_feeds(address)


async def fetch_feeds(address: str):
    host = settings.RSS3_DATA_API + "/accounts"
    url = f"""{host}/{address}/activities?limit=10&action_limit=5&direction=out"""
    headers = {"Accept": "application/json"}
    async with aiohttp.ClientSession() as session:
        logger.info(f"fetching {url}")
        async with session.get(url, headers=headers) as resp:
            return await resp.text()
