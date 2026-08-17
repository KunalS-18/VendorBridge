export default function BudgetSlider({ label, value, onChange, min = 0, max = 25, step = 0.5 }) {
  const pct = (value - min) / (max - min);

  return (
    <div className="mb-6">
      <div className="mb-2 text-xs text-muted">{label}</div>
      <div className="relative pt-7">
        <div
          className="absolute top-0 -translate-x-1/2 rounded-md bg-ink px-2.5 py-1 text-xs font-semibold text-ivory transition-[left] duration-100 ease-linear"
          style={{ left: `${pct * 100}%` }}
        >
          ₹{value}L
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
