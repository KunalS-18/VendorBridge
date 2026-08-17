import SectionLabel from "../components/SectionLabel";
import RailButton from "../components/RailButton";
import GemChip from "../components/GemChip";
import { FAIRNESS_META, fairnessNote } from "../data/fairness";
import { formatINR, titleCase } from "../utils/format";

const RAIL_PITCH = 42;

function FairnessKeyRow({ fairness, label }) {
  const meta = FAIRNESS_META[fairness];
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-3 w-3 rounded-[3px]"
        style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}
      />
      {label}
    </div>
  );
}

function RailHighlight({ activeIdx }) {
  return (
    <div
      className="absolute left-0 right-0 h-9 rounded-lg bg-[rgba(198,49,110,0.12)] transition-[top] duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]"
      style={{ top: activeIdx * RAIL_PITCH, opacity: activeIdx >= 0 ? 1 : 0 }}
    />
  );
}

function VendorCard({ vendor, index, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`animate-fade-slide-in relative mb-4 cursor-pointer rounded-[14px] bg-white p-5 transition-all duration-200 ease-out hover:-translate-y-[3px] hover:border-[rgba(198,49,110,0.35)] hover:shadow-[0_16px_32px_-12px_rgba(36,26,61,0.28)] ${
        index === 0 ? "border-2 border-[#D99A2B]" : "border border-[rgba(36,26,61,0.08)]"
      }`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {index === 0 && (
        <div className="animate-badge-pulse absolute -top-[11px] left-5 rounded-full bg-[#D99A2B] px-2.5 py-[3px] text-[11px] font-semibold text-white">
          Best Match
        </div>
      )}
      <div className="grid grid-cols-[140px_1fr] gap-5">
        <div className="flex h-[110px] items-center justify-center rounded-[10px] bg-[repeating-linear-gradient(45deg,rgba(36,26,61,0.05),rgba(36,26,61,0.05)_8px,rgba(36,26,61,0.09)_8px,rgba(36,26,61,0.09)_16px)] p-1 text-center font-mono text-[10px] text-[#8a8098]">
          vendor photo
        </div>
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-display mb-0.5 text-xl">{vendor.name}</div>
              <div className="whitespace-nowrap text-[13px] text-muted">
                {vendor.city} · {titleCase(vendor.category)} · ★ {vendor.rating ?? "—"} ·{" "}
                {Math.round(vendor.score * 100)}% match
              </div>
            </div>
            <GemChip fairness={vendor.price_fairness} size="sm" withLabel note={fairnessNote(vendor)} />
          </div>
          <div className="my-2.5 flex flex-wrap gap-1.5">
            {vendor.style_tags.map((tag) => (
              <div
                key={tag}
                className="rounded-full bg-[rgba(36,26,61,0.06)] px-2.5 py-1 text-xs text-ink"
              >
                {titleCase(tag)}
              </div>
            ))}
          </div>
          <div className="text-base font-semibold">
            {formatINR(vendor.price_min)} – {formatINR(vendor.price_max)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsScreen({
  category,
  city,
  categories,
  cities,
  results,
  loading,
  error,
  onToggleCategory,
  onToggleCity,
  onEditSearch,
  onSelectVendor,
}) {
  const categoryActiveIdx = categories.indexOf(category);
  const cityActiveIdx = cities.indexOf(city);

  return (
    <div className="animate-fade-slide-in mx-auto grid max-w-[1200px] grid-cols-[260px_1fr] gap-8 px-6 pt-8 pb-20">
      <div className="border-r border-[rgba(36,26,61,0.1)] pr-6">
        <SectionLabel>Category</SectionLabel>
        <div className="relative mb-6 flex flex-col gap-1.5">
          <RailHighlight activeIdx={categoryActiveIdx} />
          {categories.map((cat) => (
            <RailButton key={cat} active={category === cat} onClick={() => onToggleCategory(cat)}>
              {titleCase(cat)}
            </RailButton>
          ))}
        </div>

        <SectionLabel>City</SectionLabel>
        <div className="relative mb-6 flex flex-col gap-1.5">
          <RailHighlight activeIdx={cityActiveIdx} />
          {cities.map((c) => (
            <RailButton key={c} active={city === c} onClick={() => onToggleCity(c)}>
              {c}
            </RailButton>
          ))}
        </div>

        <div className="mb-1.5 text-[13px] text-muted">Price-fairness key</div>
        <div className="flex flex-col gap-2 text-[13px]">
          <FairnessKeyRow fairness="underpriced" label="Great deal" />
          <FairnessKeyRow fairness="fair" label="Fair price" />
          <FairnessKeyRow fairness="above_market" label="Above market" />
        </div>
      </div>

      <div>
        <div className="mb-5 flex items-baseline justify-between">
          <div className="font-display text-[26px]">
            {loading ? "Searching…" : `${results.length} vendors matched`}
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onEditSearch();
            }}
            className="text-sm"
          >
            Edit search
          </a>
        </div>

        {error && (
          <div className="rounded-[10px] bg-[rgba(178,58,72,0.08)] px-4 py-3 text-sm text-[#B23A48]">
            Couldn't load vendors — is the backend running on port 8000? ({error})
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="text-sm text-muted">No vendors matched your filters. Try widening them.</div>
        )}

        {results.map((v, i) => (
          <VendorCard key={v.id} vendor={v} index={i} onClick={() => onSelectVendor(v)} />
        ))}
      </div>
    </div>
  );
}
