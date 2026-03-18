export function Titlebar() {
  return (
    <header className="flex h-10 w-full select-none items-center justify-between border-b border-clover-border-main bg-clover-bg-titlebar px-4 drag">
      <div className="flex gap-2 no-drag">
      </div>

      <div className="flex items-center gap-2 pr-2">
        <span className="font-syne text-[11px] font-medium tracking-widest text-clover-text-subtle uppercase">
          Clover Analyzer
        </span>
        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-clover-green-bright/10 text-clover-green-bright">
          🍀
        </div>
      </div>

      {/* Spacer to keep title centered if needed, or just alignment */}
      <div className="w-[52px]" />
    </header>
  )
}
