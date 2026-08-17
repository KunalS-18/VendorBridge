import GemChip from "../components/GemChip";
import { FAIRNESS_META, fairnessNote } from "../data/fairness";
import { formatINR, titleCase } from "../utils/format";

export default function ProfileScreen({ vendor, onBack }) {
  const meta = FAIRNESS_META[vendor.price_fairness];

  return (
    <>
      <div className="animate-fade-slide-in mx-auto max-w-[900px] px-6 pt-8 pb-[140px]">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="mb-5 inline-block text-sm"
        >
          ← Back to results
        </a>

        <div className="mb-7 flex h-[280px] items-center justify-center rounded-2xl bg-[repeating-linear-gradient(45deg,rgba(36,26,61,0.05),rgba(36,26,61,0.05)_10px,rgba(36,26,61,0.09)_10px,rgba(36,26,61,0.09)_20px)] font-mono text-[13px] text-[#8a8098]">
          cover photo — {vendor.name}
        </div>

        <div className="mb-2 flex items-start justify-between gap-5">
          <div>
            <div className="font-display text-[34px]">{vendor.name}</div>
            <div className="mt-1 text-[15px] text-muted">
              {vendor.city} · {titleCase(vendor.category)} · ★ {vendor.rating ?? "—"} ·{" "}
              {Math.round(vendor.score * 100)}% match
            </div>
          </div>
          <GemChip fairness={vendor.price_fairness} size="lg" />
        </div>

        <div className="my-5 mb-8 flex items-center gap-2.5 rounded-[10px] bg-[rgba(36,26,61,0.04)] px-[18px] py-3.5">
          <div className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ background: meta.text }} />
          <div className="text-sm">
            <b style={{ color: meta.text }}>{meta.label}.</b> {fairnessNote(vendor)}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {vendor.style_tags.map((tag) => (
            <div key={tag} className="rounded-full bg-[rgba(36,26,61,0.06)] px-3 py-[5px] text-[13px]">
              {titleCase(tag)}
            </div>
          ))}
        </div>

        <div className="font-display mb-3.5 text-[22px]">Price range</div>
        <div className="mb-9 rounded-xl border border-[rgba(36,26,61,0.12)] p-[18px]">
          <div className="text-xl font-bold">
            {formatINR(vendor.price_min)} – {formatINR(vendor.price_max)}
          </div>
          <div className="mt-1 text-[13px] text-muted">Full range for this vendor's services.</div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex max-w-[900px] items-center justify-between border-t border-[rgba(36,26,61,0.1)] bg-ivory px-6 py-4">
        <div>
          <div className="text-[13px] text-muted">Starting from</div>
          <div className="text-[19px] font-bold">{formatINR(vendor.price_min)}</div>
        </div>
        <button
          type="button"
          className="font-body cursor-pointer rounded-[10px] border-none bg-gradient-to-br from-magenta to-magenta-dark px-8 py-3.5 text-base font-semibold text-ivory shadow-[0_10px_24px_-8px_rgba(198,49,110,0.5)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(198,49,110,0.6)] active:translate-y-0 active:shadow-[0_6px_16px_-6px_rgba(198,49,110,0.45)]"
        >
          Enquire Now
        </button>
      </div>
    </>
  );
}
