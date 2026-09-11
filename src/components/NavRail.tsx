import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import logoImg from '../imports/image.png'

const navItems = [
  { number: '01', label: 'Início', to: '/' },
  { number: '02', label: 'Técnicas', to: '/tecnicas' },
  { number: '03', label: 'Estudar', to: '/estudar' },
]

const fontSizes = [
  { size: 'sm' as const, label: 'A−', ariaLabel: 'Texto menor' },
  { size: 'md' as const, label: 'A', ariaLabel: 'Texto padrão' },
  { size: 'lg' as const, label: 'A+', ariaLabel: 'Texto maior' },
]

export default function NavRail() {
  const { theme, setTheme, fontSize, setFontSize } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isLight = theme === 'light'

  return (
    <>
      {/* Mobile top bar */}
      <header className="mobile-header" role="banner">
        <div className="mobile-logo">
          <img src={logoImg} alt="Judo Study" className="mobile-logo-img" />
          <span className="mobile-brand">JUDO STUDY</span>
        </div>
        <button
          className="hamburger-btn"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
          aria-controls="nav-rail"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? '✕' : '≡'}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Nav rail */}
      <nav
        id="nav-rail"
        className={`nav-rail${mobileOpen ? ' nav-rail--open' : ''}`}
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <div className="nav-logo">
          <img src={logoImg} alt="JD" className="nav-logo-img" aria-hidden="true" />
          <div className="nav-brand" aria-label="Judo Study">
            <span>JUDO</span>
            <span>STUDY</span>
          </div>
        </div>

        {/* Navigation items */}
        <ul className="nav-items" role="list">
          {navItems.map(({ number, label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-item${isActive ? ' nav-item--active' : ''}`
                }
                aria-current={undefined}
                onClick={() => setMobileOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <span className="nav-number" aria-hidden="true">
                      {number}
                    </span>
                    <span className="nav-label">
                      {label}
                      {isActive && <span className="sr-only"> (página atual)</span>}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Accessibility controls */}
        <div className="nav-accessibility">
          <span className="nav-a11y-label" aria-hidden="true">
            Acessibilidade
          </span>
          <div className="nav-font-controls" role="group" aria-label="Tamanho do texto">
            {fontSizes.map(({ size, label, ariaLabel }) => (
              <button
                key={size}
                className={`font-btn${fontSize === size ? ' font-btn--active' : ''}`}
                onClick={() => setFontSize(size)}
                aria-pressed={fontSize === size}
                aria-label={ariaLabel}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className="theme-btn"
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            aria-label={isLight ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {isLight ? 'Modo escuro' : 'Modo claro'}
          </button>
        </div>

        {/* Version */}
        <div className="nav-version">JDS / 01.01</div>
      </nav>
    </>
  )
}
