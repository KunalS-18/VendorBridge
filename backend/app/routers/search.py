from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import models
from app.db.session import get_db
from app.schemas.vendor import Vendor, VendorWithScore
from app.services import price_benchmark

router = APIRouter(prefix="/api", tags=["search"])

# Fixed defaults for now; a gradient-descent tuning step will refine these
# once we have real preference data to train on.
WEIGHTS = {
    "budget_fit": 0.5,
    "rating": 0.3,
    "style_match": 0.2,
}


def _budget_fit(vendor: models.Vendor, budget_min: float | None, budget_max: float | None) -> float:
    if budget_min is None and budget_max is None:
        return 1.0  # no budget stated, so no penalty

    if budget_min is not None and budget_max is not None:
        couple_target = (budget_min + budget_max) / 2
    else:
        couple_target = budget_min if budget_min is not None else budget_max

    if couple_target == 0:
        return 1.0

    vendor_mid = (float(vendor.price_min) + float(vendor.price_max)) / 2
    distance = abs(vendor_mid - couple_target)
    return max(0.0, 1 - distance / couple_target)


def _rating_score(vendor: models.Vendor) -> float:
    if vendor.rating is None:
        return 0.0
    return max(0.0, min(1.0, float(vendor.rating) / 5))


def _style_match(vendor: models.Vendor, query_tags: list[str]) -> float:
    vendor_tags = {t.lower() for t in (vendor.style_tags or [])}
    overlap = len(vendor_tags & set(query_tags))
    return overlap / len(query_tags)


@router.get("/search", response_model=list[VendorWithScore])
def search_vendors(
    city: str | None = Query(None),
    category: str | None = Query(None),
    budget_min: float | None = Query(None),
    budget_max: float | None = Query(None),
    style_tags: str | None = Query(None, description="Comma-separated list of style tags"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Vendor)

    if city is not None:
        query = query.filter(models.Vendor.city.ilike(city))
    if category is not None:
        query = query.filter(models.Vendor.category.ilike(category))
    if budget_min is not None:
        query = query.filter(models.Vendor.price_max >= budget_min)
    if budget_max is not None:
        query = query.filter(models.Vendor.price_min <= budget_max)

    vendors = query.all()

    query_tags = (
        [t.strip().lower() for t in style_tags.split(",") if t.strip()]
        if style_tags
        else []
    )

    scored = []
    for vendor in vendors:
        score = (
            WEIGHTS["budget_fit"] * _budget_fit(vendor, budget_min, budget_max)
            + WEIGHTS["rating"] * _rating_score(vendor)
        )
        if query_tags:
            score += WEIGHTS["style_match"] * _style_match(vendor, query_tags)
        scored.append((vendor, score))

    scored.sort(key=lambda pair: pair[1], reverse=True)

    # TODO (Stage 3): GPT-4o-mini re-ranking of `scored` goes here once we have
    # an OPENAI_API_KEY. Skipped for now — the order below is purely the
    # weighted score from Stage 2, untouched by any LLM step.

    return [
        VendorWithScore(
            **Vendor.model_validate(vendor).model_dump(),
            score=round(score, 4),
            price_fairness=price_benchmark.price_fairness(
                vendor.category, vendor.city, vendor.price_min, vendor.price_max
            ),
        )
        for vendor, score in scored
    ]
