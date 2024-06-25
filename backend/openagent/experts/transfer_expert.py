from typing import Optional, Type

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

from openagent.dto.mutation import Transfer
from openagent.experts import (
    chain_name_to_id,
    get_token_data_by_key,
    select_best_token,
)


class ParamSchema(BaseModel):
    to_address: str = Field(
        description = """从查询中提取提及的地址，
例如："0x1234567890abcdef1234567890abcdef12345678", "vitalik.eth" 等。
如果地址既不以 '0x' 开头，也不以 '.eth' 结尾，则应在其后添加 ".eth"。
"""
    )

    token: str = Field(
        description = """从查询中提取提及的加密货币，
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


class TransferExpert(BaseTool):
    name = "转账助手"
    description = """使用此工具进行加密货币转账。例如：\
"转账 1 ETH 到 0x1234567890abcdef1234567890abcdef12345678", \
"转账 1 BTC 到 vitalik.eth" 等。\
"""
    args_schema: Type[ParamSchema] = ParamSchema
    return_direct = False
    last_task_id: Optional[str] = None

    def _run(
        self,
        to_address: str,
        token: str,
        chain_name: str,
        amount: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        raise NotImplementedError

    async def _arun(
        self,
        to_address: str,
        token: str,
        chain_name: str = "ethereum",
        amount: str = "1",
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ):
        return await fetch_transfer(to_address, token, chain_name, amount)


async def fetch_transfer(to_address: str, token: str, chain_name: str, amount: str):
    if not to_address.startswith("0x") and not to_address.endswith(".eth"):
        to_address += ".eth"
    chain_id = chain_name_to_id(chain_name)
    res = {
        "to_address": to_address,
        "token": token,
        "amount": amount,
    }
    token_info = await select_best_token(token, chain_id)

    transfer = Transfer(
        to_address=res.get("to_address", "1"),
        token=get_token_data_by_key(token_info, "symbol"),
        token_address=get_token_data_by_key(token_info, "address"),
        chain_id=chain_id,
        amount=res.get("amount", "1"),
        logoURI=get_token_data_by_key(token_info, "logoURI"),
        decimals=get_token_data_by_key(token_info, "decimals"),
    )

    return transfer.model_dump_json()
