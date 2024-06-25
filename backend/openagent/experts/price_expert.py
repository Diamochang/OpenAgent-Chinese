from typing import Optional, Type

import ccxt
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
from loguru import logger
from pydantic import BaseModel, Field


class ARGS(BaseModel):
    token: str = Field(description="代币标识")


class PriceExpert(BaseTool):
    name = "价格助手"
    description = "使用此工具获取代币的价格。"
    args_schema: Type[ARGS] = ARGS

    def _run(
        self,
        token: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        raise NotImplementedError

    async def _arun(
        self,
        token: str,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        return f"{token}的价格是：{fetch_price(token)}"


_exchanges = [ccxt.binance(), ccxt.okx(), ccxt.gateio(), ccxt.mexc()]


def fetch_price(base: str, quote: str = "USDT") -> float:
    for exchange in _exchanges:
        try:
            trades = exchange.fetch_trades(f"{base.upper()}/{quote}", limit=1)
            last = trades[0]["price"]
            return last
        except Exception as e:  # noqa
            logger.warning(f"从{exchange.id}获取价格时发生错误：{e}")
    raise Exception(f"未找到{base}的市场")
