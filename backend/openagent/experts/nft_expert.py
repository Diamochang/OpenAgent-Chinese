import json
from typing import Optional, Type

import requests
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

from openagent.conf.env import settings


class ARGS(BaseModel):
    action: str = Field(
        description = "指定要执行的操作：'search' 表示 NFT "
        "收藏品搜索，'rank' 表示收藏品排名"
    )
    keyword: Optional[str] = Field(
        default = None,
        description = "NFT 符号或收藏品名称，仅在 'action=search' 时必需",
    )
    sort_field: Optional[str] = Field(
        default = "market_cap",
        description = """
默认为 market_cap。选项包括：volume_1d, volume_7d, volume_30d,
volume_total, volume_change_1d,
volume_change_7d, volume_change_30d, sales_1d, sales_7d, sales_30d,
sales_total, sales_change_1d,
sales_change_7d, sales_change_30d,
floor_price, market_cap。仅在 'action=rank' 时必需
    """,
    )


class NFTExpert(BaseTool):
    name = "NFT 助手"
    description = "一个用于搜索 NFT 收藏品或获取收藏品排名的工具。"
    args_schema: Type[ARGS] = ARGS
    def _run(
        self,
        action: str,
        keyword: Optional[str] = None,
        sort_field: Optional[str] = "market_cap",
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        if action == "search":
            if keyword is None:
                return "错误：搜索操作需要关键词。"
            return self.search_nft_collections(keyword)
        elif action == "rank":
            return self.collection_ranking(sort_field)
        else:
            return (
                "错误：未知的操作类型。 "
                "请将 'action' 指定为 'search' 或 'rank'。"
            )

    async def _arun(
        self,
        action: str,
        keyword: Optional[str] = None,
        sort_field: Optional[str] = "market_cap",
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        return self._run(action, keyword, sort_field, run_manager)

    @staticmethod
    def search_nft_collections(keyword: str) -> str:
        """Search for NFT collections."""
        url = "https://restapi.nftscan.com/api/v2/collections/filters"
        payload = json.dumps(
            {
                "contract_address_list": [],
                "name_fuzzy_search": "false",
                "show_collection": "false",
                "sort_direction": "desc",
                "sort_field": "floor_price",
                "name": "",
                "symbol": keyword,
            }
        )
        headers = {
            "Content-Type": "application/json",
            "X-API-KEY": f"{settings.NFTSCAN_API_KEY}",
        }

        response = requests.post(url, headers=headers, data=payload)
        return response.text

    @staticmethod
    def collection_ranking(sort_field: str) -> str:
        """Search for NFT collections ranking."""
        url = f"https://restapi.nftscan.com/api/v2/statistics/ranking/collection?sort_field={sort_field}&sort_direction=desc&limit=20"

        headers = {"X-API-KEY": f"{settings.NFTSCAN_API_KEY}"}
        response = requests.get(url, headers=headers)
        return response.text
