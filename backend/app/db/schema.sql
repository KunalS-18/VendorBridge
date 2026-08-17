CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    price_min NUMERIC NOT NULL,
    price_max NUMERIC NOT NULL,
    style_tags TEXT[] DEFAULT '{}',
    rating NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
