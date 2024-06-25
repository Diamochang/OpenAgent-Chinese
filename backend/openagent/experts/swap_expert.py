from typing import Optional, Type

import aiohttp
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
from loguru import logger
from pydantic import BaseModel, Field

from openagent.dto.mutation import Swap
from openagent.experts import (
    chain_name_to_id,
    get_token_data_by_key,
    select_best_token,
)


class ParamSchema(BaseModel):
    from_token: str = Field(
        description = """从查询中提取提及的源加密货币，
例如："BTC", "ETH", "RSS3", "USDT", "USDC" 等。默认为 "ETH"。"""
    )

    to_token: str = Field(
        description = """从查询中提取提及的目标加密货币，
例如："BTC", "ETH", "RSS3", "USDT", "USDC" 等。默认为 "ETH"。"""
    )

    chain_name: str = Field(
        description = """从查询中提取提及的区块链名称，
例如："ethereum", "binance_smart_chain", "arbitrum" 等。默认为 "ethereum"。"""
    )

    amount: str = Field(
        description = """从查询中提取提及的加密货币数量，
例如："0.1", "1", "10" 等。默认为 "1"。"""
    )


class SwapExpert(BaseTool):
    name = "交易助手"
    description = """使用此工具进行加密货币交易。\n\
"""
    args_schema: Type[ParamSchema] = ParamSchema
    return_direct = False

    def _run(
        self,
        from_token: str,
        to_token: str,
        chain_name: str,
        amount: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        raise NotImplementedError

    async def _arun(
        self,
        from_token: str,
        to_token: str,
        chain_name: str = "ethereum",
        amount: str = "1",
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ):
        return await fetch_swap(from_token, to_token, chain_name, amount)


async def fetch_swap(from_token: str, to_token: str, chain_name: str, amount: str):
    url = """https://li.quest/v1/tokens"""
    headers = {"Accept": "application/json"}
    chain_id = chain_name_to_id(chain_name)
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as resp:
            logger.info(f"fetching {url}")
            token_list = await resp.json()
            token_list["tokens"][chain_id]
            res = {
                "from": from_token,
                "to": to_token,
                "amount": amount,
            }
            results = [
                await select_best_token(res["from"], chain_id),
                await select_best_token(res["to"], chain_id),
            ]
            swap = Swap(
                from_token=get_token_data_by_key(results[0], "symbol"),
                from_token_address=get_token_data_by_key(results[0], "address"),
                to_token=get_token_data_by_key(results[1], "symbol"),
                to_token_address=get_token_data_by_key(results[1], "address"),
                chain_id=chain_id,
                amount=res.get("amount", "1"),
            )
            return swap.model_dump_json()
