from sqlalchemy import ARRAY, Column, DateTime, Integer, Numeric, Text, func

from app.db.session import Base


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True)
    name = Column(Text, nullable=False)
    category = Column(Text, nullable=False)
    city = Column(Text, nullable=False)
    price_min = Column(Numeric, nullable=False)
    price_max = Column(Numeric, nullable=False)
    style_tags = Column(ARRAY(Text), default=list)
    rating = Column(Numeric)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
