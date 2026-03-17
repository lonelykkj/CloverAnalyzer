import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-clover-bg-root font-syne text-clover-text-primary">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-clover-green-bright">
          🍀 Clover Analyzer
        </h1>
        <p className="font-mono text-clover-text-subtle">
          Seu disco nunca esteve tão limpo.
        </p>
        <Button variant="outline" className="mt-4 border-clover-border-main bg-clover-bg-card hover:bg-clover-bg-hover hover:text-clover-green-bright">
          Começar Scan
        </Button>
      </div>
    </div>
  )
}

export default App