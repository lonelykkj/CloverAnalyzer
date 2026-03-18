import { useMemo, useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'

interface TreeData {
  name: string
  value?: number
  category: string
  children?: TreeData[]
}

const mockData: TreeData = {
  name: 'root',
  category: 'root',
  children: [
    { name: 'Vídeos', value: 124, category: 'video' },
    { name: 'Documentos', value: 42, category: 'docs' },
    { name: 'Imagens', value: 38, category: 'images' },
    { name: 'Áudio', value: 12, category: 'audio' },
    { name: 'Outros', value: 125, category: 'other' },
  ]
}

export function TreeMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      }
    })
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  const leaves = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return []

    const root = d3.hierarchy(mockData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    d3.treemap<TreeData>()
      .size([dimensions.width, dimensions.height])
      .paddingInner(3)
      .round(true)(root)

    return root.leaves()
  }, [dimensions])

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden">
      <AnimatePresence>
        {leaves.map((leaf, i) => (
          <motion.div
            key={leaf.data.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="absolute flex flex-col items-start justify-start p-2.5 rounded-lg border border-black/10 overflow-hidden cursor-default transition-opacity hover:opacity-85"
            style={{
              left: leaf.x0,
              top: leaf.y0,
              width: leaf.x1 - leaf.x0,
              height: leaf.y1 - leaf.y0,
              backgroundColor: `var(--cat-${leaf.data.category})`,
            }}
          >
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider leading-tight">
              {leaf.data.name}
            </span>
            <div className="mt-1 flex flex-col font-mono text-[10px] text-white/55">
              <span>{leaf.data.value} GB</span>
              <span>{Math.round((leaf.value! / mockData.children!.reduce((s, c) => s + c.value!, 0)) * 100)}%</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
