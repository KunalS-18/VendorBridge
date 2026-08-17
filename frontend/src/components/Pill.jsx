export default function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-[18px] py-[10px] font-body text-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-6px_rgba(36,26,61,0.3)] ${
        active
          ? "border-magenta bg-gradient-to-br from-magenta to-magenta-dark text-ivory"
          : "border-[rgba(36,26,61,0.15)] bg-white text-ink"
      }`}
    >
      {children}
    </button>
  );
}
