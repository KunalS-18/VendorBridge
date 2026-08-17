export default function Header({ onLogoClick }) {
  return (
    <>
      <div className="flex items-center justify-between bg-ivory px-10 py-5">
        <div className="flex cursor-pointer items-center gap-2.5" onClick={onLogoClick}>
          <div className="h-2.5 w-2.5 rounded-full bg-magenta" />
          <div className="font-display text-2xl tracking-wide">VendorBridge</div>
        </div>
        <div className="text-sm text-muted">Planning a wedding in India</div>
      </div>
      <div className="animate-kinari-pan h-1 w-full bg-[length:200%_100%] bg-[linear-gradient(90deg,#C6316E,#D99A2B,#0E7A5F,#C6316E,#D99A2B)]" />
    </>
  );
}
