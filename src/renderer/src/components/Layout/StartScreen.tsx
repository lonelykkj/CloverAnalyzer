import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { HardDrive, ShieldCheck, Zap } from 'lucide-react'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-clover-bg-root px-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center"
      >
        {/* Logo/Icon Area */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0, -5, 0] 
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-clover-green-bright/10 text-6xl shadow-[0_0_40px_rgba(125,201,127,0.15)]"
        >
          🍀
        </motion.div>

        <h1 className="font-syne text-4xl font-bold tracking-tight text-clover-text-primary">
          Clover <span className="text-clover-green-bright">Analyzer</span>
        </h1>
        
        <p className="mt-4 max-w-md font-syne text-lg text-clover-text-muted">
          Seu disco nunca esteve tão limpo. Escaneie agora e descubra como liberar espaço com inteligência.
        </p>

        <motion.div 
          className="mt-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onStart}
            className="h-14 rounded-2xl bg-clover-green-bright px-10 font-syne text-lg font-bold text-clover-bg-root hover:bg-clover-green-mid"
          >
            Escanear Macintosh HD
          </Button>
        </motion.div>

        {/* Features / Badges */}
        <div className="mt-16 grid grid-cols-3 gap-8">
          <Feature icon={<Zap size={18} />} label="Ultra Rápido" />
          <Feature icon={<ShieldCheck size={18} />} label="100% Seguro" />
          <Feature icon={<HardDrive size={18} />} label="Deep Scan" />
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 flex flex-col items-center gap-1 font-mono text-[10px] text-clover-text-subtle uppercase tracking-widest"
      >
        <span>Apple Silicon Optimized</span>
        <span className="opacity-50">v1.0.0</span>
      </motion.div>
    </div>
  )
}

function Feature({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 text-clover-text-subtle">
      <div className="text-clover-green-bright/60">{icon}</div>
      <span className="font-syne text-[11px] font-semibold uppercase tracking-wider">{label}</span>
    </div>
  )
}
