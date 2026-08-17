export default function RailButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 cursor-pointer rounded-lg border-none bg-transparent px-2.5 py-2 text-left font-body text-sm transition-all duration-150 ${
        active ? "font-semibold text-magenta" : "font-normal text-ink"
      }`}
    >
      {children}
    </button>
  );
}
