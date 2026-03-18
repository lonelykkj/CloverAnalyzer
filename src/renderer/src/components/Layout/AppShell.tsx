import { ReactNode, useState, useEffect, useCallback } from 'react'
import { Titlebar } from '../Titlebar/Titlebar'
import { Sidebar } from '../Sidebar/Sidebar'

interface AppShellProps {
  children: ReactNode
  rightPanel?: ReactNode
  showSidebar?: boolean
}

export function AppShell({ children, rightPanel, showSidebar = true }: AppShellProps) {
  const [sidebarWidth, setSidebarWidth] = useState(220)
  const [rightPanelWidth, setRightPanelWidth] = useState(280)
  const [isResizingSidebar, setIsResizingSidebar] = useState(false)
  const [isResizingRightPanel, setIsResizingRightPanel] = useState(false)

  const startResizingSidebar = useCallback(() => setIsResizingSidebar(true), [])
  const startResizingRightPanel = useCallback(() => setIsResizingRightPanel(true), [])
  const stopResizing = useCallback(() => {
    setIsResizingSidebar(false)
    setIsResizingRightPanel(false)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizingSidebar) {
        const newWidth = e.clientX
        if (newWidth > 150 && newWidth < 400) {
          setSidebarWidth(newWidth)
        }
      }
      if (isResizingRightPanel) {
        const newWidth = window.innerWidth - e.clientX
        if (newWidth > 200 && newWidth < 500) {
          setRightPanelWidth(newWidth)
        }
      }
    },
    [isResizingSidebar, isResizingRightPanel]
  )

  useEffect(() => {
    if (isResizingSidebar || isResizingRightPanel) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    } else {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizingSidebar, isResizingRightPanel, resize, stopResizing])

  return (
    <div 
      className={`flex h-screen w-full flex-col bg-clover-bg-root text-clover-text-primary overflow-hidden ${
        (isResizingSidebar || isResizingRightPanel) ? 'cursor-col-resize select-none' : ''
      }`}
    >
      <Titlebar />
      
      <div className="flex flex-1 overflow-hidden relative">
        {showSidebar && (
          <>
            <div style={{ width: sidebarWidth }}>
              <Sidebar />
            </div>
            {/* Sidebar Resize Handle */}
            <div 
              onMouseDown={startResizingSidebar}
              className={`absolute top-0 bottom-0 z-50 w-1 cursor-col-resize transition-colors hover:bg-clover-green-bright/30 ${
                isResizingSidebar ? 'bg-clover-green-bright/50' : ''
              }`}
              style={{ left: sidebarWidth - 2 }}
            />
          </>
        )}
        
        <main className="flex flex-1 flex-col overflow-hidden bg-clover-bg-root">
          {children}
        </main>

        {rightPanel && (
          <>
            {/* Right Panel Resize Handle */}
            <div 
              onMouseDown={startResizingRightPanel}
              className={`absolute top-0 bottom-0 z-50 w-1 cursor-col-resize transition-colors hover:bg-clover-green-bright/30 ${
                isResizingRightPanel ? 'bg-clover-green-bright/50' : ''
              }`}
              style={{ right: rightPanelWidth - 2 }}
            />
            <aside 
              style={{ width: rightPanelWidth }}
              className="border-l border-clover-border-main bg-clover-bg-root overflow-y-auto"
            >
              {rightPanel}
            </aside>
          </>
        )}
      </div>
    </div>
  )
}
