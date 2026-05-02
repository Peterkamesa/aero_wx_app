'use client'

/**
 * Navigation Component
 *
 * A client-side top navigation bar for the application.
 * It provides branding and navigation links, with active
 * link highlighting based on the current route.
 *
 * Features:
 * - Displays application logo and title ("AeroWx")
 * - Provides navigation links to key pages (Dashboard, Manage Data)
 * - Highlights the currently active route
 * - Uses Next.js client-side routing for fast navigation
 *
 * Hooks:
 * @hook usePathname - Retrieves the current URL path to determine active link
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  // Get the current route pathname
  const pathname = usePathname()

  return (
    <nav className="top-nav">
      {/* Application branding section */}
      <div className="top-nav__brand">
        <div className="top-nav__logo">
          {/* Cloud/weather icon */}
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
        </div>

        {/* Application name */}
        <span className="top-nav__title">AeroWx</span>
      </div>

      {/* Navigation links */}
      <div className="top-nav__links">
        {/* Dashboard link */}
        <Link
          href="/"
          className={`top-nav__link ${
            pathname === '/' ? 'top-nav__link--active' : ''
          }`}
        >
          Dashboard
        </Link>

        {/* Manage Data link */}
        <Link
          href="/manage"
          className={`top-nav__link ${
            pathname === '/manage' ? 'top-nav__link--active' : ''
          }`}
        >
          Manage Data
        </Link>
      </div>
    </nav>
  )
}