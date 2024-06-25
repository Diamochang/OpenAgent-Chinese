from typing import Optional, Type

import requests
from langchain import SerpAPIWrapper
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

from openagent.conf.env import settings


class SearchSchema(BaseModel):
    query: str = Field(description="搜索查询的关键词。")
    search_type: str = Field(
        description="""执行的搜索类型。选项包括：
        - "google"：针对当前事件和实时信息的谷歌搜索
        - "dune"：搜索 Dune 数据看板"""
    )
    gl: Optional[str] = Field(
        default="sg",
        description="谷歌搜索的国家代码，例如 'us', 'cn', 'jp'。为适应中文大语言模型，本分支默认为 'sg'。",
    )
    hl: Optional[str] = Field(
        default="zh-cn",
        description="谷歌搜索的语言代码，例如 'en', 'zh-cn', 'ja'。为适应中文大语言模型，本分支默认为 'zh-cn'。",
    )


async def dune_search(query: str) -> str:
    url = f"{settings.RSS3_SEARCH_API}/dune/search?keyword={query}"
    headers = {"Accept": "*/*", "Content-Type": "application/x-www-form-urlencoded"}
    response = requests.request("GET", url, headers=headers)
    return response.text


async def google_search(query: str, gl: str, hl: str) -> str:
    search_wrapper = SerpAPIWrapper(
        search_engine="google",
        params={"engine": "google", "gl": gl, "hl": hl},
    )
    return search_wrapper.run(query)


class SearchExpert(BaseTool):
    name = "搜索助手"
    description = """
    一个多功能的搜索工具，能够根据查询类型执行多种类型的搜索：
    - 对于与图表、数据可视化或仪表板相关的查询，请使用 Dune 搜索。
    - 对于涉及项目介绍、当前事件或实时信息的查询，请使用谷歌搜索。"""  # noqa: E501
    args_schema: Type[SearchSchema] = SearchSchema

    def _run(
        self,
        query: str,
        search_type: str,
        gl: Optional[str] = "us",
        hl: Optional[str] = "en",
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        raise NotImplementedError

    async def _arun(
        self,
        query: str,
        search_type: str,
        gl: Optional[str] = "us",
        hl: Optional[str] = "en",
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        if search_type == "google":
            return await google_search(query, gl, hl)
        elif search_type == "dune":
            return await dune_search(query)
        else:
            raise ValueError(f"未定义的搜索类型：{search_type}")
