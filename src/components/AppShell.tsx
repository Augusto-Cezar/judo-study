import { Outlet } from 'react-router-dom'
import NavRail from './NavRail'

export default function AppShell() {
  return (
    <div className="app-shell">
      <NavRail />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
