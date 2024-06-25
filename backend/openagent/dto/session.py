from datetime import datetime
from enum import Enum
from typing import ClassVar

from pydantic import BaseModel, Field

from openagent.db.models import ChatSession


class SessionTreeNodeDTOType(str, Enum):
    folder = "folder"
    session = "session"


class SessionTreeNodeDTO(BaseModel):
    session_id: str = Field(description="会话 ID")
    parent_id: str | None = Field(
        example=None, default=None, description="父 ID，如为空，则为根文件夹"
    )
    title: str | None = Field(default=None, description="会话标题")
    order: int = Field(
        description="在父文件夹中的顺序，会话将按顺序降序排序"
    )
    created_at: datetime = Field(description="创建时间")
    children: list | None = []
    type: SessionTreeNodeDTOType = SessionTreeNodeDTOType.folder
    def __hash__(self):
        return hash(self.session_id) ^ hash(self.type)

    def __lt__(self, other):
        # sort by type , folder first, order asc, created_at desc
        if self.type != other.type:
            return self.type == SessionTreeNodeDTOType.folder
        if self.order != other.order:
            return self.order > other.order
        return self.created_at < other.created_at


def build_session_tree_node(node: ChatSession) -> SessionTreeNodeDTO:
    return SessionTreeNodeDTO(
        session_id=node.session_id,
        title=node.title,
        order=node.order,
        parent_id=node.parent_id,
        created_at=node.created_at,
        type=node.type,
    )


class NewSessionFolderDTO(BaseModel):
    user_id: str = Field(example="jackma")  
    title: str = Field(example="folder1")   
    order: int = Field(
        example=1, 
        description="在父文件夹中的排序位置，会话将按此顺序降序排列"
    )
    parent_id: str | None = Field(
        example=None,
        default=None,
        description="父 ID，如为空，则创建根文件夹"
    )

    class Config:
        json_schema_extra: ClassVar = {
            "example": {"user_id": "jackma", "title": "folder1", "order": 0}
        }


class SessionTab(str, Enum):
    favorite = "favorite"
    recent = "recent"


class UpdateSessionDTO(BaseModel):
    user_id: str = Field(example="jackma")  
    session_id: str = Field(example="1234567890") 
    title: str | None = Field(
        example=None,
        default=None,
        description="会话标题，如为空则不进行更新",
    )
    order: int | None = Field(
        example=None,
        default=None,
        description="会话排序序号，如为空则不进行更新",
    )
    tab: SessionTab | None = Field(
        example=None,
        default=None,
        description="会话标签页，如为空则不进行更新",
    )
    parent_id: str | None = Field(
        example=None,
        default=None,
        description="父 ID，如为空则不进行更新",
    )


class MoveSessionDTO(BaseModel):
    user_id: str = Field(description="用户 ID", example="jackma")
    from_session_id: str = Field(description="源会话 ID", example="1234567890")
    to_session_tab: SessionTab = Field(
        description="目标标签页，收藏夹或最近。如果是最近，则忽略 to_session_id",
        example="收藏夹",
    )
    to_session_id: str | None = Field(
        description="目标父会话 ID，仅当目标标签页为收藏夹时有效。如为空，则移动到根文件夹",
        example="0987654321",
        default=None,
    )
