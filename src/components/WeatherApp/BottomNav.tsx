import './BottomNav.css'

const navItems = [
  { label: 'Home', icon: '🏠', active: true },
  { label: 'Locations', icon: '✈️', active: false },
  { label: 'Forecast', icon: '📅', active: false },
  { label: 'Settings', icon: '⚙️', active: false },
]

export default function BottomNav() {
  return (
    <>
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.label}
          className={`nav-item ${item.active ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    {/* <p>© 2026 Jeanchrisostome. All rights reserved.</p> */}
    </nav>
    
    </>
  )
}
