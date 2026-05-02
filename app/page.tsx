import { getObservations } from './actions/weather'

/**
 * Utility function to format a Date object into a detailed readable string.
 *
 * Format:
 * - Day (2 digits)
 * - Month (short name)
 * - Year (numeric)
 * - Time (HH:mm, 24-hour format)
 *
 * Example: "02 May 2026, 14:30"
 *
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatTime(date: Date) {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Returns the CSS class for styling observation type badges.
 *
 * @param {string} type - Observation type (METAR, SPECI, MANUAL)
 * @returns {string} Corresponding CSS class
 */
function getBadgeClass(type: string) {
  switch (type) {
    case 'METAR': return 'badge badge--metar'
    case 'SPECI': return 'badge badge--speci'
    default: return 'badge badge--manual'
  }
}

/**
 * Returns the CSS class for the feed indicator dot based on observation type.
 *
 * @param {string} type - Observation type
 * @returns {string} CSS class for feed dot styling
 */
function getDotClass(type: string) {
  switch (type) {
    case 'METAR': return 'feed-item__dot feed-item__dot--metar'
    case 'SPECI': return 'feed-item__dot feed-item__dot--speci'
    default: return 'feed-item__dot feed-item__dot--manual'
  }
}

/**
 * Dashboard Component (Server Component)
 *
 * This is the main dashboard view for displaying aviation weather data.
 * It provides a real-time overview of the latest meteorological conditions
 * and a feed of recent observations.
 *
 * Features:
 * - Fetches observation data from the backend using a server action
 * - Displays key meteorological metrics (Temperature, Dewpoint, Wind, QNH, QFE)
 * - Shows recent observations in a feed layout
 * - Includes a wind compass visualization
 * - Handles empty states when no data is available
 *
 * Data Handling:
 * - Prioritizes the latest METAR observation for metrics display
 * - Falls back to the most recent observation if no METAR is available
 *
 * @returns {JSX.Element} Dashboard UI
 */
export default async function Dashboard() {
  // Fetch observation data
  const result = await getObservations()
  const observations = result.success ? (result.data || []) : []

  // Get latest observation and latest METAR
  const latest = observations[0] ?? null
  const latestMetar = observations.find((o) => o.message_type === 'METAR')

  // Choose data source (prefer METAR)
  const src = latestMetar ?? latest

  // Extract meteorological values
  const temp = src?.air_temperature
  const dew = src?.dewpoint
  const windDir = src?.wind_direction
  const windSpd = src?.wind_speed
  const qnh = src?.qnh
  const qfe = src?.qfe

  /**
   * Formats numeric values for display.
   * Returns '--' if value is null or undefined.
   */
  const fmt = (v: number | null | undefined) =>
    v !== null && v !== undefined ? String(v) : '--'

  /**
   * Formats wind direction with leading zeros (e.g., 030).
   */
  const fmtDir = (v: number | null | undefined) =>
    v !== null && v !== undefined ? String(v).padStart(3, '0') : '--'

  return (
    <main>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-header__title">Aviation Weather Dashboard</h1>
        <p className="page-header__subtitle">
          Real-time overview of current meteorological conditions
          {src && (
            <> — Last update: {formatTime(new Date(src.observation_time))}</>
          )}
        </p>
      </div>

      {/* Metric Cards Section */}
      <div className="metrics-grid">
        {/* Temperature Card */}
        <div className="metric-card glass-panel metric-card--temp">
          <div className="metric-card__icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V3m0 0L9.5 5.5M12 3l2.5 2.5M12 9a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
            </svg>
          </div>
          <span className="metric-label">Temperature</span>
          <div className="metric-value">
            {fmt(temp)} <span className="metric-unit">°C</span>
          </div>
        </div>

        {/* Dewpoint Card */}
        <div className="metric-card glass-panel metric-card--dew">
          <div className="metric-card__icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8 8 0 004-14.9V3a1 1 0 00-2 0v.28a8 8 0 00-6 7.72 8 8 0 004 7z" />
            </svg>
          </div>
          <span className="metric-label">Dewpoint</span>
          <div className="metric-value">
            {fmt(dew)} <span className="metric-unit">°C</span>
          </div>
        </div>

        {/* Wind Card */}
        <div className="metric-card glass-panel metric-card--wind">
          <div className="metric-card__icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
            </svg>
          </div>
          <span className="metric-label">Wind</span>
          <div className="metric-value">
            {fmtDir(windDir)}° / {fmt(windSpd)} <span className="metric-unit">KT</span>
          </div>
        </div>

        {/* QNH Card */}
        <div className="metric-card glass-panel metric-card--qnh">
          <div className="metric-card__icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="metric-label">QNH</span>
          <div className="metric-value">
            {fmt(qnh)} <span className="metric-unit">hPa</span>
          </div>
        </div>

        {/* QFE Card */}
        <div className="metric-card glass-panel metric-card--qfe">
          <div className="metric-card__icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <span className="metric-label">QFE</span>
          <div className="metric-value">
            {fmt(qfe)} <span className="metric-unit">hPa</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid: Feed + Wind Compass */}
      <div className="dashboard-grid">
        {/* Recent Observations Feed */}
        <div className="section-panel glass-panel">
          <div className="section-panel__header">
            <h3 className="section-panel__title">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Recent Observations
            </h3>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              {observations.length} total
            </span>
          </div>

          {/* Empty state */}
          {observations.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <p className="empty-state__text">No observations recorded yet</p>
              <p className="empty-state__sub">Go to Manage Data to add your first observation</p>
            </div>
          ) : (
            /**
             * Observation feed (latest 8 entries)
             */
            <div>
              {observations.slice(0, 8).map((obs) => (
                <div key={obs.id} className="feed-item">
                  <div className={getDotClass(obs.message_type)} />

                  <div className="feed-item__content">
                    <div className="feed-item__meta">
                      <span className={getBadgeClass(obs.message_type)}>
                        {obs.message_type}
                      </span>
                      <span className="feed-item__time">
                        {formatTime(new Date(obs.observation_time))}
                      </span>
                    </div>

                    {/* Raw message or fallback */}
                    {obs.raw_message ? (
                      <div className="feed-item__message">{obs.raw_message}</div>
                    ) : (
                      <span className="feed-item__no-message">
                        Manual entry — T:{fmt(obs.air_temperature)} D:{fmt(obs.dewpoint)} W:{fmtDir(obs.wind_direction)}/{fmt(obs.wind_speed)}kt
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wind Compass Visualization */}
        <div className="section-panel glass-panel">
          <div className="section-panel__header">
            <h3 className="section-panel__title">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Wind Direction
            </h3>
          </div>

          <div className="wind-compass">
            {/* Cardinal directions */}
            <span className="wind-compass__label wind-compass__label--n">N</span>
            <span className="wind-compass__label wind-compass__label--s">S</span>
            <span className="wind-compass__label wind-compass__label--e">E</span>
            <span className="wind-compass__label wind-compass__label--w">W</span>

            {/* Wind arrow */}
            {windDir !== null && windDir !== undefined ? (
              <div
                className="wind-compass__arrow"
                style={{ transform: `rotate(${windDir}deg)` }}
              />
            ) : null}

            {/* Center marker */}
            <div className="wind-compass__center" />

            {/* Wind speed + direction display */}
            <div className="wind-compass__speed">
              {windDir !== null && windDir !== undefined
                ? `${fmtDir(windDir)}° / ${fmt(windSpd)} kt`
                : 'No data'}
            </div>
          </div>

          {/* Source info */}
          {src && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                Source: {src.message_type} at {formatTime(new Date(src.observation_time))}
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}