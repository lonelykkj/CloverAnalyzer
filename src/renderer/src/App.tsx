import { AppShell } from './components/Layout/AppShell'
import { Toolbar } from './components/FileList/Toolbar'
import { Badge } from './components/ui/badge'
import { ScrollArea } from './components/ui/scroll-area'
import { MoreVertical, Trash2, ArrowRight } from 'lucide-react'

function App() {
  return (
    <AppShell 
      rightPanel={
        <div className="flex flex-col gap-6 p-5">
          <section>
            <h3 className="mb-4 text-[10px] font-semibold tracking-widest text-clover-text-subtle uppercase">
              Mapa de disco
            </h3>
            {/* Placeholder para o Treemap D3 */}
            <div className="aspect-square w-full rounded-xl bg-clover-bg-card border border-clover-border-card flex items-center justify-center p-4">
              <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
                <div className="rounded-lg bg-clover-cat-video/20 border border-clover-cat-video/30 flex flex-col p-2">
                  <span className="text-[10px] font-bold text-clover-cat-video uppercase">Vídeos</span>
                  <span className="text-[10px] font-mono opacity-60">124 GB</span>
                </div>
                <div className="rounded-lg bg-clover-cat-docs/20 border border-clover-cat-docs/30 flex flex-col p-2">
                  <span className="text-[10px] font-bold text-clover-cat-docs uppercase">Docs</span>
                  <span className="text-[10px] font-mono opacity-60">42 GB</span>
                </div>
                <div className="col-span-2 rounded-lg bg-clover-green-bright/10 border border-clover-green-bright/20 flex flex-col p-2">
                  <span className="text-[10px] font-bold text-clover-green-bright uppercase">Sistema</span>
                  <span className="text-[10px] font-mono opacity-60">175 GB</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Pode limpar" value="143 GB" color="text-clover-cat-video" />
              <StatCard label="Total usado" value="341 GB" color="text-clover-green-bright" />
              <StatCard label="Arquivos" value="48.2k" color="text-clover-text-muted" />
              <StatCard label="Pastas" value="3.1k" color="text-clover-text-muted" />
            </div>
          </section>
        </div>
      }
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <Toolbar />
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            <FileItem name="Movies" path="/Users/clover/Movies" size="124.5 GB" category="video" percentage={65} />
            <FileItem name="node_modules" path="/Users/clover/Projects/clover-analyzer" size="4.2 GB" category="other" percentage={15} isWarning />
            <FileItem name="Downloads" path="/Users/clover/Downloads" size="32.1 GB" category="docs" percentage={45} />
            <FileItem name="Pictures" path="/Users/clover/Pictures" size="18.7 GB" category="images" percentage={30} />
            <FileItem name="Music" path="/Users/clover/Music" size="12.4 GB" category="audio" percentage={20} />
            <FileItem name="Applications" path="/Applications" size="45.2 GB" category="other" percentage={40} />
            {/* Repetindo para popular o scroll */}
            <FileItem name="Desktop" path="/Users/clover/Desktop" size="2.1 GB" category="other" percentage={10} />
            <FileItem name="Documents" path="/Users/clover/Documents" size="8.5 GB" category="docs" percentage={15} />
          </div>
        </ScrollArea>
      </div>
    </AppShell>
  )
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="rounded-lg border border-clover-border-card bg-clover-bg-card p-3">
      <p className="mb-1 text-[10px] text-clover-text-subtle uppercase">{label}</p>
      <p className={`font-mono text-[16px] font-bold ${color}`}>{value}</p>
    </div>
  )
}

function FileItem({ name, path, size, category, percentage, isWarning = false }: any) {
  const catColor = `var(--cat-${category === 'other' ? 'other' : category})`
  
  return (
    <div className="group flex items-center justify-between border-b border-[#141a14] px-6 py-3 transition-colors hover:bg-clover-bg-hover">
      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-clover-bg-card text-xl">
          {category === 'video' ? '🎬' : category === 'images' ? '🖼️' : category === 'audio' ? '🎵' : '📁'}
        </div>
        
        <div className="flex flex-col overflow-hidden">
          <span className="font-syne text-[13px] font-medium text-[#c8e6c9] truncate">{name}</span>
          <span className="font-mono text-[11px] text-clover-text-subtle truncate">{path}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex w-[120px] flex-col gap-1.5">
          <div className="h-[3px] w-full rounded-full bg-clover-border-card overflow-hidden">
            <div className="h-full" style={{ width: `${percentage}%`, backgroundColor: catColor }} />
          </div>
          {isWarning ? (
            <Badge variant="outline" className="h-4 border-[#3a3010] bg-[#2a2010] px-1.5 text-[9px] font-bold text-[#c8942a] uppercase">
              Pode ser limpo
            </Badge>
          ) : (
            <Badge variant="outline" className="h-4 border-[#1a3a1a] bg-[#102010] px-1.5 text-[9px] font-bold text-clover-green-mid uppercase">
              OK
            </Badge>
          )}
        </div>

        <div className="w-[80px] text-right">
          <span className="font-mono text-[12px] font-medium" style={{ color: catColor }}>{size}</span>
        </div>

        <div className="flex w-[32px] justify-end">
          <button className="flex h-8 w-8 items-center justify-center rounded-md text-clover-text-subtle opacity-0 transition-all hover:bg-clover-bg-card hover:text-clover-green-bright group-hover:opacity-100">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
