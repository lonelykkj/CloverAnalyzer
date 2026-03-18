import { ChevronDown } from 'lucide-react'

export function Toolbar() {
  return (
    <div className="flex items-center justify-between border-b border-clover-bg-hover px-6 py-4">
      <div className="flex items-center gap-1 font-mono text-[12px] text-clover-text-subtle">
        <span>Macintosh HD</span>
        <span>/</span>
        <span>Users</span>
        <span>/</span>
        <span className="text-clover-green-bright">clover</span>
      </div>

      <button className="flex items-center gap-2 rounded-md border border-clover-border-card bg-clover-bg-card px-3 py-1.5 font-syne text-[12px] text-clover-text-muted transition-colors hover:text-clover-green-bright">
        <span>Maior primeiro</span>
        <ChevronDown size={14} />
      </button>
    </div>
  )
}
