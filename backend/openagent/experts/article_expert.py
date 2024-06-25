import json
from typing import Optional, Type

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

from openagent.index.pgvector_store import store


class ARGS(BaseModel):
    keyword: str = Field(
        description = "要搜索的关键词",
    )


class ArticleExpert(BaseTool):
    name = "文章助手"
    description = (
        "一个用于搜索与 Web3 相关文章的工具。如果你对 Web3 缺乏了解，"
        "可以使用此工具查找有助于回答你问题的相关文章。提供与你想要搜索的主题相关的关键词或短语，"
        "该工具将返回一系列相关文章的摘录。"
        "文章来源于 IQWiki 和 Mirror。"
    )
    args_schema: Type[ARGS] = ARGS

    def _run(
        self,
        keyword: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        return self.search_articles(keyword)

    async def _arun(
        self,
        keyword: str,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        return self.search_articles(keyword)

    @staticmethod
    def search_articles(keyword: str) -> str:
        retriever = store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"score_threshold": 0.8, "k": 3},
        )
        res = retriever.get_relevant_documents(keyword)
        docs = list(map(lambda x: x.page_content, res))
        return json.dumps(docs)
