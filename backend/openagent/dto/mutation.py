from pydantic import BaseModel


class Swap(BaseModel):
    from_token: str
    from_token_address: str
    to_token: str
    to_token_address: str
    chain_id: str
    amount: str
    type: str = "swap"


class Transfer(BaseModel):
    # task_id: str
    to_address: str
    token: str
    token_address: str
    chain_id: str
    amount: str
    logoURI: str  # noqa
    decimals: int
