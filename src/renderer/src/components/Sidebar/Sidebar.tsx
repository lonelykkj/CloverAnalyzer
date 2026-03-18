import { Monitor, ChevronRight, HardDrive } from 'lucide-react'
import { motion } from 'framer-motion'

export function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col border-r border-clover-border-main bg-clover-bg-titlebar">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Section: Dispositivos */}
        <section className="mb-8">
          <h2 className="mb-3 text-[10px] font-semibold tracking-[0.12em] text-clover-text-subtle uppercase">
            Dispositivos
          </h2>
          <nav className="space-y-1">
            <SidebarItem icon={<Monitor size={14} />} label="Macintosh HD" active />
            <SidebarItem icon={<HardDrive size={14} />} label="Volumes Externos" />
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
        <motion.div 
          whileHover={{ borderColor: 'var(--green-bright)', backgroundColor: '#1e2b1f' }}
          className="cursor-default rounded-xl border border-clover-border-card bg-clover-bg-card p-3 transition-colors"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="font-syne text-[13px] font-semibold text-[#c8e6c9]">Macintosh HD</span>
            <span className="text-[10px] text-[#5a7a5c]">SSD · APFS</span>
          </div>
          <div className="mb-2 h-[5px] w-full rounded-full bg-clover-border-card overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-clover-green-mid to-clover-green-bright" 
            />
          </div>
          <div className="flex justify-between font-mono text-[11px]">
            <span className="text-clover-green-bright font-bold">341 GB</span>
            <span className="text-[#5a7a5c]">158 GB livres</span>
          </div>
        </motion.div>
      </div>
    </aside>
  )
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <motion.button 
      whileHover={{ x: 4 }}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-syne transition-all ${
        active 
          ? 'bg-[#1e2b1f] text-clover-green-bright shadow-[0_0_15px_rgba(125,201,127,0.05)]' 
          : 'text-clover-text-muted hover:bg-clover-bg-hover hover:text-[#c8e6c9]'
      }`}
    >
      <div className={active ? 'text-clover-green-bright' : 'text-clover-text-subtle'}>
        {icon}
      </div>
      <span className="flex-1 text-left">{label}</span>
      {active && <ChevronRight size={12} className="opacity-40" />}
    </motion.button>
  )
}

function CategoryItem({ color, label }: { color: string, label: string }) {
  return (
    <motion.button 
      whileHover={{ x: 4, backgroundColor: 'var(--bg-hover)' }}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-syne text-clover-text-muted transition-all hover:text-[#c8e6c9]"
    >
      <div className="h-2 w-2 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: color }} />
      <span className="flex-1 text-left">{label}</span>
    </motion.button>
  )
}
