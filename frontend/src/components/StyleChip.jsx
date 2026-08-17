export default function StyleChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-3.5 py-2 font-body text-[13px] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-6px_rgba(36,26,61,0.3)] ${
        active
          ? "border-teal bg-teal/10 text-teal"
          : "border-[rgba(36,26,61,0.15)] bg-white text-ink"
      }`}
    >
      {children}
    </button>
  );
}
