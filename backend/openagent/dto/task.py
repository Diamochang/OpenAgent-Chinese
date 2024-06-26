from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class TransferDTO(BaseModel):
    user_id: str = Field(description="用户 ID", example="clnx2bsgi000008l68gxi8q72")
    task_id: str = Field(description="任务 ID", example="1")
    executor_id: int = Field(description="执行者 ID", example=1)
    to_address: str = Field(
        description="转账至的地址",
        example="0xFcf62726dbf3a9C2765f138111AA04Bf50bD67D6",
    )
    amount: str = Field(description="转账金额", example="0.001")
    token_address: str = Field(
        description="代币合约地址",
        example="0x4d2bf3A34a2311dB4b3D20D4719209EDaDBf69b6",
    )
    token: str = Field(description="代币类型", example="ETH")
    logoURI: str
    decimals: int


class ConfirmTransferDTO(BaseModel):
    user_id: str = Field(description="用户 ID", example="clnx2bsgi000008l68gxi8q72")
    task_id: str = Field(description="任务 ID", example="1")
    executor_id: int = Field(description="执行者 ID", example=1)
    to_address: str = Field(
        description="转账至的地址",
        example="0xFcf62726dbf3a9C2765f138111AA04Bf50bD67D6",
    )
    amount: str = Field(description="转账金额", example="0.001")
    token_address: str = Field(
        description="代币合约地址",
        example="0x4d2bf3A34a2311dB4b3D20D4719209EDaDBf69b6",
    )


class CancelTransferDTO(BaseModel):
    user_id: str = Field(description="用户 ID", example="clnx2bsgi000008l68gxi8q72")
    task_id: str = Field(description="任务 ID", example="1")


class TransferQueryDTO(BaseModel):
    executor_id: int = Field(description="执行者 ID", example=1)
    to_address: str = Field(
        description="转账至的地址",
        example="0xFcf62726dbf3a9C2765f138111AA04Bf50bD67D6",
    )
    amount: str = Field(description="转账金额", example="0.001")
    token_address: str = Field(
        description="代币合约地址",
        example="0x4d2bf3A34a2311dB4b3D20D4719209EDaDBf69b6",
    )
    token: str = Field(description="代币类型", example="ETH")
    logoURI: str | None = Field(description="Logo 的 URI", example="https://li.quest/logo.png")
    decimals: int | None = Field(description="小数位数", example=18)

class TaskStatus(str, Enum):
    idle = "idle"
    pending = "pending"
    running = "running"
    done = "done"
    canceled = "canceled"
    failed = "failed"


class TaskType(str, Enum):
    transfer = "transfer"
    # swap = "swap"


class TaskDTO(BaseModel):
    task_id: str
    user_id: str
    session_id: str
    type: TaskType
    body: TransferQueryDTO | object = None
    status: TaskStatus
    created_at: datetime
    hash: str | None = None
    run_at: datetime | None = None
    done_at: datetime | None = None
