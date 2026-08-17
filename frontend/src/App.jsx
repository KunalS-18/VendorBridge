import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import SearchScreen from "./screens/SearchScreen";
import ResultsScreen from "./screens/ResultsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { searchVendors } from "./api/client";

const BUDGET_MIN_L = 0;
const BUDGET_MAX_L = 25;

function App() {
  const [screen, setScreen] = useState("search");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All");
  const [styleTags, setStyleTags] = useState([]);
  const [budgetMinL, setBudgetMinL] = useState(BUDGET_MIN_L);
  const [budgetMaxL, setBudgetMaxL] = useState(BUDGET_MAX_L);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Filter facets (categories/cities/style tags) derived from the live catalog,
  // not hardcoded — so the Search screen always reflects what's actually in the DB.
  const [catalog, setCatalog] = useState({ categories: [], cities: [], styleTagOptions: [] });
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    searchVendors()
      .then((vendors) => {
        if (cancelled) return;
        setCatalog({
          categories: [...new Set(vendors.map((v) => v.category))].sort(),
          cities: [...new Set(vendors.map((v) => v.city))].sort(),
          styleTagOptions: [...new Set(vendors.flatMap((v) => v.style_tags))].sort(),
        });
      })
      .catch((err) => !cancelled && setCatalogError(err.message))
      .finally(() => !cancelled && setCatalogLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = useCallback(() => {
    setResultsLoading(true);
    setResultsError(null);
    searchVendors({
      city: city === "All" ? undefined : city,
      category: category === "All" ? undefined : category,
      budgetMin: budgetMinL > BUDGET_MIN_L ? budgetMinL * 100000 : undefined,
      budgetMax: budgetMaxL < BUDGET_MAX_L ? budgetMaxL * 100000 : undefined,
      styleTags,
    })
      .then(setResults)
      .catch((err) => setResultsError(err.message))
      .finally(() => setResultsLoading(false));
  }, [city, category, budgetMinL, budgetMaxL, styleTags]);

  // Fires on entering the results screen, and again whenever filters change
  // while already there — keeps "live filtering" backed by real API calls.
  useEffect(() => {
    if (screen === "results") runSearch();
  }, [screen, runSearch]);

  const toggleCategory = (cat) => setCategory((c) => (c === cat ? "All" : cat));
  const toggleCity = (c) => setCity((cur) => (cur === c ? "All" : c));
  const toggleStyle = (s) =>
    setStyleTags((tags) => (tags.includes(s) ? tags.filter((t) => t !== s) : [...tags, s]));
  const selectVendor = (vendor) => {
    setSelectedVendor(vendor);
    setScreen("profile");
  };

  return (
    <div className="font-body min-h-screen w-full bg-ivory text-ink">
      <Header onLogoClick={() => setScreen("search")} />

      {screen === "search" && (
        <SearchScreen
          category={category}
          city={city}
          styleTags={styleTags}
          budgetMinL={budgetMinL}
          budgetMaxL={budgetMaxL}
          categories={catalog.categories}
          cities={catalog.cities}
          styleTagOptions={catalog.styleTagOptions}
          catalogLoading={catalogLoading}
          catalogError={catalogError}
          onToggleCategory={toggleCategory}
          onToggleCity={toggleCity}
          onToggleStyle={toggleStyle}
          onBudgetMinChange={(v) => setBudgetMinL(Math.min(v, budgetMaxL))}
          onBudgetMaxChange={(v) => setBudgetMaxL(Math.max(v, budgetMinL))}
          onSubmit={() => setScreen("results")}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          category={category}
          city={city}
          categories={catalog.categories}
          cities={catalog.cities}
          results={results}
          loading={resultsLoading}
          error={resultsError}
          onToggleCategory={toggleCategory}
          onToggleCity={toggleCity}
          onEditSearch={() => setScreen("search")}
          onSelectVendor={selectVendor}
        />
      )}
      {screen === "profile" && selectedVendor && (
        <ProfileScreen vendor={selectedVendor} onBack={() => setScreen("results")} />
      )}
    </div>
  );
}

export default App;
