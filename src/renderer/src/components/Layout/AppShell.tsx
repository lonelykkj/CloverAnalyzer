import { ReactNode } from 'react'
import { Titlebar } from '../Titlebar/Titlebar'
import { Sidebar } from '../Sidebar/Sidebar'

interface AppShellProps {
  children: ReactNode
  rightPanel?: ReactNode
}

export function AppShell({ children, rightPanel }: AppShellProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-clover-bg-root text-clover-text-primary overflow-hidden">
      <Titlebar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex flex-1 flex-col overflow-hidden bg-clover-bg-root">
          {children}
        </main>

        {rightPanel && (
          <aside className="w-[280px] border-l border-clover-border-main bg-clover-bg-root overflow-y-auto">
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  )
}
