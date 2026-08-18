from chromadb import PersistentClient
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

from app.core.config import settings

COLLECTION_NAME = "price_benchmarks"

# +/- this fraction of the comparable average still counts as "fair"
FAIRNESS_BAND = 0.15

# Synthetic comparable market-price entries for the (category, city) pairs
# covered by our sample vendors. In production these would come from real
# market data / vendor submissions rather than being hardcoded here.
SEED_COMPARABLES = [
    {"category": "photography", "city": "Mumbai", "price": 70000},
    {"category": "photography", "city": "Mumbai", "price": 90000},
    {"category": "photography", "city": "Mumbai", "price": 110000},
    {"category": "photography", "city": "Mumbai", "price": 130000},
    {"category": "catering", "city": "Delhi", "price": 350000},
    {"category": "catering", "city": "Delhi", "price": 400000},
    {"category": "catering", "city": "Delhi", "price": 450000},
    {"category": "catering", "city": "Delhi", "price": 500000},
    {"category": "decor", "city": "Bangalore", "price": 280000},
    {"category": "decor", "city": "Bangalore", "price": 300000},
    {"category": "decor", "city": "Bangalore", "price": 320000},
    {"category": "decor", "city": "Bangalore", "price": 350000},
    {"category": "entertainment", "city": "Mumbai", "price": 60000},
    {"category": "entertainment", "city": "Mumbai", "price": 75000},
    {"category": "entertainment", "city": "Mumbai", "price": 85000},
    {"category": "entertainment", "city": "Mumbai", "price": 100000},
    {"category": "venue", "city": "Jaipur", "price": 1400000},
    {"category": "venue", "city": "Jaipur", "price": 1500000},
    {"category": "venue", "city": "Jaipur", "price": 1600000},
    {"category": "venue", "city": "Jaipur", "price": 1700000},
]

_client = PersistentClient(path=settings.chroma_persist_dir)
# ONNX-runtime build of all-MiniLM-L6-v2 bundled with chromadb itself — same
# local/free/no-API-key embedding model, without pulling in full PyTorch
# (which OOMs on Render's 512MB free-tier instance).
_embedding_fn = DefaultEmbeddingFunction()


def get_collection():
    return _client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=_embedding_fn,
    )


def seed_if_empty() -> None:
    collection = get_collection()
    if collection.count() > 0:
        return

    collection.add(
        ids=[f"{c['category']}-{c['city']}-{i}" for i, c in enumerate(SEED_COMPARABLES)],
        documents=[
            f"Wedding {c['category']} vendor in {c['city']}, market price around Rs {c['price']}"
            for c in SEED_COMPARABLES
        ],
        metadatas=[
            {"category": c["category"], "city": c["city"], "price": c["price"]}
            for c in SEED_COMPARABLES
        ],
    )


def price_fairness(category: str, city: str, price_min: float, price_max: float) -> str:
    """Compare a vendor's price against comparable entries retrieved from ChromaDB."""
    collection = get_collection()
    vendor_price = (float(price_min) + float(price_max)) / 2

    results = collection.query(
        query_texts=[f"Wedding {category} vendor in {city}"],
        n_results=5,
        where={"$and": [{"category": category}, {"city": city}]},
    )

    metadatas = results.get("metadatas", [[]])[0]
    if not metadatas:
        return "fair"  # no comparables for this category/city yet, default to fair

    avg_price = sum(m["price"] for m in metadatas) / len(metadatas)

    if vendor_price < avg_price * (1 - FAIRNESS_BAND):
        return "underpriced"
    if vendor_price > avg_price * (1 + FAIRNESS_BAND):
        return "above_market"
    return "fair"
