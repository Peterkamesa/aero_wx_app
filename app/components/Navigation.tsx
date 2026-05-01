'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="top-nav">
      <div className="top-nav__brand">
        <div className="top-nav__logo">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <span className="top-nav__title">AeroWx</span>
      </div>
      <div className="top-nav__links">
        <Link
          href="/"
          className={`top-nav__link ${pathname === '/' ? 'top-nav__link--active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          href="/manage"
          className={`top-nav__link ${pathname === '/manage' ? 'top-nav__link--active' : ''}`}
        >
          Manage Data
        </Link>
      </div>
    </nav>
  )
}
