from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models
from app.db.session import get_db
from app.schemas.vendor import Vendor

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("/", response_model=list[Vendor])
def list_vendors(db: Session = Depends(get_db)):
    # TODO: hard filter -> weighted scoring -> GPT-4o-mini re-rank -> RAG price benchmarking
    return db.query(models.Vendor).all()
