import SectionLabel from "../components/SectionLabel";
import Pill from "../components/Pill";
import StyleChip from "../components/StyleChip";
import BudgetSlider from "../components/BudgetSlider";
import { titleCase } from "../utils/format";

export default function SearchScreen({
  category,
  city,
  styleTags,
  budgetMinL,
  budgetMaxL,
  categories,
  cities,
  styleTagOptions,
  catalogLoading,
  catalogError,
  onToggleCategory,
  onToggleCity,
  onToggleStyle,
  onBudgetMinChange,
  onBudgetMaxChange,
  onSubmit,
}) {
  return (
    <div className="bandhani-bg animate-fade-slide-in mx-auto max-w-[760px] px-6 pt-[72px] pb-[100px]">
      <h1 className="font-display mb-3 text-center text-[44px] leading-[1.15]">
        Find the vendors who'll actually deliver.
      </h1>
      <p className="mb-12 text-center text-base text-muted">
        Ranked by real prices, real ratings, and whether you're being overcharged.
      </p>

      {catalogError && (
        <div className="mb-8 rounded-[10px] bg-[rgba(178,58,72,0.08)] px-4 py-3 text-sm text-[#B23A48]">
          Couldn't reach the VendorBridge API — is the backend running on port 8000? ({catalogError})
        </div>
      )}

      <SectionLabel>What are you looking for?</SectionLabel>
      <div className="mb-9 flex flex-wrap gap-2.5">
        {categories.map((cat) => (
          <Pill key={cat} active={category === cat} onClick={() => onToggleCategory(cat)}>
            {titleCase(cat)}
          </Pill>
        ))}
        {!catalogLoading && categories.length === 0 && (
          <span className="text-sm text-muted">No categories available yet.</span>
        )}
      </div>

      <SectionLabel>City</SectionLabel>
      <div className="mb-9 flex flex-wrap gap-2.5">
        {cities.map((c) => (
          <Pill key={c} active={city === c} onClick={() => onToggleCity(c)}>
            {c}
          </Pill>
        ))}
      </div>

      <SectionLabel>Style</SectionLabel>
      <div className="mb-9 flex flex-wrap gap-2">
        {styleTagOptions.map((s) => (
          <StyleChip key={s} active={styleTags.includes(s)} onClick={() => onToggleStyle(s)}>
            {titleCase(s)}
          </StyleChip>
        ))}
      </div>

      <SectionLabel>Budget</SectionLabel>
      <BudgetSlider label="Minimum" value={budgetMinL} onChange={onBudgetMinChange} />
      <BudgetSlider label="Maximum" value={budgetMaxL} onChange={onBudgetMaxChange} />

      <button
        type="button"
        onClick={onSubmit}
        className="font-body mt-5 w-full cursor-pointer rounded-[10px] border-none bg-gradient-to-br from-magenta to-magenta-dark py-[18px] text-[17px] font-semibold text-ivory shadow-[0_10px_24px_-8px_rgba(198,49,110,0.55)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(198,49,110,0.65)] active:translate-y-0 active:shadow-[0_6px_16px_-6px_rgba(198,49,110,0.5)]"
      >
        See matching vendors
      </button>
    </div>
  );
}
