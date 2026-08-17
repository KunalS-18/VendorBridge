from typing import Literal

from pydantic import BaseModel


class VendorBase(BaseModel):
    name: str
    category: str
    city: str
    price_min: float
    price_max: float
    style_tags: list[str] = []
    rating: float | None = None


class Vendor(VendorBase):
    id: int

    class Config:
        from_attributes = True


class VendorWithScore(Vendor):
    score: float
    price_fairness: Literal["underpriced", "fair", "above_market"]
