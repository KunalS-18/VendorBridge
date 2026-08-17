// In dev, VITE_API_URL is unset so requests stay relative and go through
// Vite's dev proxy (vite.config.js: '/api' -> localhost:8000). In production
// (no dev proxy exists) VITE_API_URL must be set at build time to the
// deployed backend's URL, e.g. https://vendorbridge-api.onrender.com
const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function searchVendors({ city, category, budgetMin, budgetMax, styleTags } = {}) {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (category) params.set("category", category);
  if (budgetMin != null) params.set("budget_min", String(budgetMin));
  if (budgetMax != null) params.set("budget_max", String(budgetMax));
  if (styleTags && styleTags.length > 0) params.set("style_tags", styleTags.join(","));

  const qs = params.toString();
  const res = await fetch(`${API_BASE}/api/search${qs ? `?${qs}` : ""}`);
  if (!res.ok) {
    throw new Error(`Search request failed (${res.status})`);
  }
  return res.json();
}
