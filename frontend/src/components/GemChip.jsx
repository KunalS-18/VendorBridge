import { FAIRNESS_META, GEM_CLIP } from "../data/fairness";

export default function GemChip({ fairness, size = "sm", withLabel = false, note }) {
  const meta = FAIRNESS_META[fairness];
  const px = size === "lg" ? 56 : 32;

  return (
    <div className="flex-shrink-0 text-right">
      <div
        title={note}
        className="box-border inline-block p-[3px] transition-transform duration-200 ease-out hover:scale-110"
        style={{
          width: px,
          height: px,
          clipPath: GEM_CLIP,
          background: "linear-gradient(135deg,#f0c565,#D99A2B)",
          boxShadow: `0 4px 14px -3px ${meta.text}77`,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ clipPath: GEM_CLIP, background: `linear-gradient(135deg,${meta.from},${meta.to})` }}
        >
          <div
            className="animate-gem-shimmer absolute top-[-50%] left-[-50%] h-[200%] w-[200%]"
            style={{
              background:
                "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.65) 50%, transparent 60%)",
            }}
          />
        </div>
      </div>
      {withLabel && (
        <div className="mt-1 text-[11px] font-semibold" style={{ color: meta.text }}>
          {meta.label}
        </div>
      )}
    </div>
  );
}
