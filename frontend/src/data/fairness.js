import { titleCase } from "../utils/format";

// Faceted hexagon/diamond used by the Kundan price-fairness gem.
export const GEM_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

// Keys match the `price_fairness` values returned by GET /api/search.
export const FAIRNESS_META = {
  underpriced: { label: "Great Deal", from: "#22b88f", to: "#0E7A5F", text: "#0E7A5F" },
  fair: { label: "Fair Price", from: "#ecb954", to: "#D99A2B", text: "#946417" },
  above_market: { label: "Above Market", from: "#d1596a", to: "#B23A48", text: "#B23A48" },
};

// The API returns a fairness category, not an explanatory sentence, so we
// compose a plain-language note client-side from the fields it does return.
export function fairnessNote(vendor) {
  const meta = FAIRNESS_META[vendor.price_fairness];
  return `${meta.label} versus comparable ${titleCase(vendor.category)} vendors in ${vendor.city}.`;
}
