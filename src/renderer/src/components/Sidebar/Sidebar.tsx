import { Monitor, Smartphone, Video, FileText, Image, Music, Layers } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="flex h-full w-[220px] flex-col border-r border-clover-border-main bg-clover-bg-titlebar">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Section: Dispositivos */}
        <section className="mb-8">
          <h2 className="mb-3 text-[10px] font-semibold tracking-[0.12em] text-clover-text-subtle uppercase">
            Dispositivos
          </h2>
          <nav className="space-y-1">
            <SidebarItem icon={<Monitor size={14} />} label="Macintosh HD" active />
            <SidebarItem icon={<Smartphone size={14} />} label="iCloud Drive" />
          </nav>
        </section>

        {/* Section: Categorias */}
        <section>
          <h2 className="mb-3 text-[10px] font-semibold tracking-[0.12em] text-clover-text-subtle uppercase">
            Categorias
          </h2>
          <nav className="space-y-1">
            <CategoryItem color="var(--cat-video)" label="Vídeos" />
            <CategoryItem color="var(--cat-docs)" label="Documentos" />
            <CategoryItem color="var(--cat-images)" label="Imagens" />
            <CategoryItem color="var(--cat-audio)" label="Áudio" />
            <CategoryItem color="var(--cat-other)" label="Outros" />
          </nav>
        </section>
      </div>

      {/* Disk Info Card */}
      <div className="p-4">
        <div className="rounded-xl border border-clover-border-card bg-clover-bg-card p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-syne text-[13px] font-semibold text-[#c8e6c9]">Macintosh HD</span>
            <span className="text-[10px] text-[#5a7a5c]">SSD · APFS</span>
          </div>
          <div className="mb-2 h-[5px] w-full rounded-full bg-clover-border-card overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-clover-green-mid to-clover-green-bright" 
              style={{ width: '65%' }} 
            />
          </div>
          <div className="flex justify-between font-mono text-[11px]">
            <span className="text-clover-green-bright">341 GB</span>
            <span className="text-[#5a7a5c]">158 GB livres</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-syne transition-colors ${
      active 
        ? 'bg-[#1e2b1f] text-clover-green-bright' 
        : 'text-clover-text-muted hover:bg-clover-bg-hover hover:text-[#c8e6c9]'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  )
}

function CategoryItem({ color, label }: { color: string, label: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-syne text-clover-text-muted transition-colors hover:bg-clover-bg-hover hover:text-[#c8e6c9]">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </button>
  )
}
