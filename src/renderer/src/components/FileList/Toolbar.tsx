import { ChevronDown, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function Toolbar() {
  const path = ['Macintosh HD', 'Users', 'clover']

  return (
    <div className="flex items-center justify-between border-b border-clover-bg-hover px-6 py-4">
      <div className="flex items-center gap-1 font-mono text-[12px] text-clover-text-subtle">
        {path.map((item, index) => (
          <div key={item} className="flex items-center gap-1">
            <motion.button 
              whileHover={{ color: 'var(--green-bright)' }}
              className={`transition-colors ${index === path.length - 1 ? 'text-clover-green-bright font-medium' : ''}`}
            >
              {item}
            </motion.button>
            {index < path.length - 1 && (
              <ChevronRight size={12} className="opacity-40" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-md border border-clover-border-card bg-clover-bg-card px-3 py-1.5 font-syne text-[12px] text-clover-text-muted transition-colors hover:text-clover-green-bright"
        >
          <span>Maior primeiro</span>
          <ChevronDown size={14} />
        </motion.button>
      </div>
    </div>
  )
}
