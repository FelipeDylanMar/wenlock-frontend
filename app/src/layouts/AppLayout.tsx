import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ProfileDropdown } from './ProfileDropdown'

const HOVER_CLOSE_DELAY_MS = 150

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const hoverCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sidebarWidth = collapsed ? 116 : 336

  const clearHoverCloseTimeout = () => {
    if (hoverCloseTimeoutRef.current) {
      clearTimeout(hoverCloseTimeoutRef.current)
      hoverCloseTimeoutRef.current = null
    }
  }

  const scheduleHoverClose = () => {
    clearHoverCloseTimeout()
    hoverCloseTimeoutRef.current = setTimeout(() => {
      setProfileMenuOpen(false)
      hoverCloseTimeoutRef.current = null
    }, HOVER_CLOSE_DELAY_MS)
  }

  const handleProfileMouseEnter = () => {
    clearHoverCloseTimeout()
    setProfileMenuOpen(true)
  }

  const handleProfileMouseLeave = () => {
    scheduleHoverClose()
  }

  return (
    <div className="relative h-screen overflow-hidden bg-page-bg">
      <div
        className="absolute top-0 left-0 h-full bg-page-bg transition-[width] duration-300 ease-out"
        style={{ width: `${sidebarWidth}px` }}
      >
        <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />
      </div>

      <div
        className="absolute top-0 right-0 transition-all duration-300 ease-out"
        style={{ left: `${sidebarWidth}px` }}
      >
        <Topbar
          isProfileMenuOpen={profileMenuOpen}
          onProfileClick={() => setProfileMenuOpen((v) => !v)}
          onProfileMouseEnter={handleProfileMouseEnter}
          onProfileMouseLeave={handleProfileMouseLeave}
        />
      </div>

      <ProfileDropdown
        open={profileMenuOpen}
        onClose={() => setProfileMenuOpen(false)}
        onMouseEnter={handleProfileMouseEnter}
        onMouseLeave={handleProfileMouseLeave}
      />

      <main
        className="absolute top-[84px] right-0 bottom-0 overflow-hidden p-0 bg-page-bg transition-[left] duration-300 ease-out"
        style={{ left: `${sidebarWidth}px` }}
      >
        <Outlet />
      </main>
    </div>
  )
}
