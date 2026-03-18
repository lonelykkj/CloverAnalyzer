import { useState } from 'react'
import { AppShell } from './components/Layout/AppShell'
import { Toolbar } from './components/FileList/Toolbar'
import { TreeMap } from './components/TreeMap/TreeMap'
import { Badge } from './components/ui/badge'
import { ScrollArea } from './components/ui/scroll-area'
import { ArrowRight, Trash2, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StartScreen } from './components/Layout/StartScreen'
import { DeleteDialog } from './components/FileList/DeleteDialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip"

type AppStatus = 'idle' | 'scanning' | 'complete'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
}

function App() {
  const [status, setStatus] = useState<AppStatus>('idle')
  const [scannedFiles, setScannedFiles] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState({ name: '', size: '' })

  const startScan = () => {
    setStatus('scanning')
    let count = 0
    const interval = setInterval(() => {
      count += 150
      setScannedFiles(count)
      if (count > 4500) {
        clearInterval(interval)
        setStatus('complete')
      }
    }, 50)
  }

  const handleDeleteClick = (name: string, size: string) => {
    setSelectedFile({ name, size })
    setDeleteDialogOpen(true)
  }

  return (
    <TooltipProvider>
      <AppShell 
        showSidebar={status === 'complete'}
        rightPanel={status === 'complete' ? (
          <div className="flex flex-col gap-6 p-5">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-semibold tracking-widest text-clover-text-subtle uppercase">
                  Mapa de disco
                </h3>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={12} className="text-clover-text-subtle" />
                  </TooltipTrigger>
                  <TooltipContent>Visualização proporcional do disco</TooltipContent>
                </Tooltip>
              </div>
              <div className="relative aspect-square w-full">
                <TreeMap />
              </div>
            </section>

            <section>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Pode limpar" value="143 GB" color="text-clover-cat-video" delay={0.1} />
                <StatCard label="Total usado" value="341 GB" color="text-clover-green-bright" delay={0.2} />
                <StatCard label="Arquivos" value="48.2k" color="text-clover-text-muted" delay={0.3} />
                <StatCard label="Pastas" value="3.1k" color="text-clover-text-muted" delay={0.4} />
              </div>
            </section>
          </div>
        ) : null}
      >
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full"
            >
              <StartScreen onStart={startScan} />
            </motion.div>
          )}

          {status === 'scanning' && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center p-10"
            >
              <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-clover-green-bright/10 border-t-clover-green-bright"
                />
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl">🍀</span>
                  <span className="mt-2 font-mono text-2xl font-bold text-clover-green-bright">{scannedFiles}</span>
                </div>
              </div>
              <h2 className="font-syne text-xl font-medium text-clover-text-primary">Analisando arquivos...</h2>
              <p className="mt-2 font-mono text-sm text-clover-text-subtle truncate max-w-md text-center">
                /Users/clover/Library/Caches/com.apple.CloudDocs
              </p>
            </motion.div>
          )}

          {status === 'complete' && (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <Toolbar />
              <ScrollArea className="flex-1">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col"
                >
                  <FileItem name="Movies" path="/Users/clover/Movies" size="124.5 GB" category="video" percentage={65} onDelete={() => handleDeleteClick('Movies', '124.5 GB')} />
                  <FileItem name="node_modules" path="/Users/clover/Projects/clover-analyzer" size="4.2 GB" category="other" percentage={15} isWarning onDelete={() => handleDeleteClick('node_modules', '4.2 GB')} />
                  <FileItem name="Downloads" path="/Users/clover/Downloads" size="32.1 GB" category="docs" percentage={45} onDelete={() => handleDeleteClick('Downloads', '32.1 GB')} />
                  <FileItem name="Pictures" path="/Users/clover/Pictures" size="18.7 GB" category="images" percentage={30} onDelete={() => handleDeleteClick('Pictures', '18.7 GB')} />
                  <FileItem name="Music" path="/Users/clover/Music" size="12.4 GB" category="audio" percentage={20} onDelete={() => handleDeleteClick('Music', '12.4 GB')} />
                  <FileItem name="Applications" path="/Applications" size="45.2 GB" category="other" percentage={40} onDelete={() => handleDeleteClick('Applications', '45.2 GB')} />
                </motion.div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        <DeleteDialog 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => console.log('Apagar:', selectedFile.name)}
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
        />
      </AppShell>
    </TooltipProvider>
  )
}

function StatCard({ label, value, color, delay }: { label: string, value: string, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-hover)' }}
      className="rounded-lg border border-clover-border-card bg-clover-bg-card p-3 transition-colors"
    >
      <p className="mb-1 text-[10px] text-clover-text-subtle uppercase">{label}</p>
      <p className={`font-mono text-[16px] font-bold ${color}`}>{value}</p>
    </motion.div>
  )
}

function FileItem({ name, path, size, category, percentage, isWarning = false, onDelete }: any) {
  const catColor = `var(--cat-${category === 'other' ? 'other' : category})`
  return (
    <motion.div 
      variants={itemVariants}
      className="group flex items-center justify-between border-b border-[#141a14] px-6 py-3 transition-colors hover:bg-clover-bg-hover"
    >
      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        <Tooltip>
          <TooltipTrigger>
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-clover-bg-card text-xl"
            >
              {category === 'video' ? '🎬' : category === 'images' ? '🖼️' : category === 'audio' ? '🎵' : '📁'}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="capitalize">{category}</TooltipContent>
        </Tooltip>
        
        <div className="flex flex-col overflow-hidden">
          <span className="font-syne text-[13px] font-medium text-[#c8e6c9] truncate">{name}</span>
          <span className="font-mono text-[11px] text-clover-text-subtle truncate">{path}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex w-[120px] flex-col gap-1.5">
          <div className="h-[3px] w-full rounded-full bg-clover-border-card overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full" 
              style={{ backgroundColor: catColor }} 
            />
          </div>
          {isWarning ? (
            <Badge variant="outline" className="h-4 border-[#3a3010] bg-[#2a2010] px-1.5 text-[9px] font-bold text-[#c8942a] uppercase">Pode ser limpo</Badge>
          ) : (
            <Badge variant="outline" className="h-4 border-[#1a3a1a] bg-[#102010] px-1.5 text-[9px] font-bold text-clover-green-mid uppercase">OK</Badge>
          )}
        </div>
        <div className="w-[80px] text-right">
          <span className="font-mono text-[12px] font-medium" style={{ color: catColor }}>{size}</span>
        </div>
        <div className="flex w-[64px] items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button 
                onClick={onDelete}
                whileHover={{ scale: 1.1, color: '#ef4444' }}
                className="flex h-8 w-8 items-center justify-center rounded-md text-clover-text-subtle opacity-0 transition-all hover:bg-clover-bg-card group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>Apagar arquivo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button 
                whileHover={{ x: 4 }}
                className="flex h-8 w-8 items-center justify-center rounded-md text-clover-text-subtle opacity-0 transition-all hover:bg-clover-bg-card hover:text-clover-green-bright group-hover:opacity-100"
              >
                <ArrowRight size={16} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>Abrir pasta</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  )
}

export default App
