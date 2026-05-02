import { getObservations } from '../actions/weather'
import ObservationForm from '../components/ObservationForm'
import DeleteButton from '../components/DeleteButton'

/**
 * Utility function to format a Date object into a readable string.
 *
 * Format:
 * - Day (2 digits)
 * - Month (short name)
 * - Hour & Minute (24-hour format)
 *
 * Example: "02 May, 14:30"
 *
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatTime(date: Date) {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Returns the appropriate CSS class for a message type badge.
 *
 * @param {string} type - Observation message type (e.g., METAR, SPECI, MANUAL)
 * @returns {string} CSS class for styling the badge
 */
function getBadgeClass(type: string) {
  switch (type) {
    case 'METAR': return 'badge badge--metar'
    case 'SPECI': return 'badge badge--speci'
    default: return 'badge badge--manual'
  }
}

/**
 * ManagePage Component (Server Component)
 *
 * This page provides an interface for:
 * - Adding new weather observations
 * - Viewing and managing existing observations
 *
 * Features:
 * - Fetches observation data from the database using a server action
 * - Displays a form for creating new observations
 * - Shows a table of recent observations
 * - Handles empty state when no data is available
 * - Allows deletion of observations via DeleteButton component
 *
 * Data Flow:
 * - Calls `getObservations()` on the server
 * - Safely extracts observation data if the request is successful
 *
 * @returns {JSX.Element} The Manage Data page UI
 */
export default async function ManagePage() {
  // Fetch observations from server
  const result = await getObservations()

  // Extract data safely
  const observations = result.success ? (result.data || []) : []

  return (
    <main>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-header__title">Manage Data</h1>
        <p className="page-header__subtitle">
          Add new observations or manage existing database entries
        </p>
      </div>

      {/* Observation form */}
      <ObservationForm />

      {/* Observation history section */}
      <div className="section-panel glass-panel">
        <div className="section-panel__header">
          <h3 className="section-panel__title">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Observation History
          </h3>

          {/* Record count */}
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {observations.length} records
          </span>
        </div>

        {/* Empty state */}
        {observations.length === 0 ? (
          <div className="empty-state">
            <svg
              className="empty-state__icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="empty-state__text">No observations in database</p>
            <p className="empty-state__sub">Use the form above to add your first entry</p>
          </div>
        ) : (
          /**
           * Data table displaying observation records
           */
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Temp</th>
                  <th>Dew</th>
                  <th>Wind</th>
                  <th>QNH</th>
                  <th>QFE</th>
                  <th>Raw Message</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {observations.map((obs) => (
                  <tr key={obs.id}>
                    {/* Observation time */}
                    <td>{formatTime(new Date(obs.observation_time))}</td>

                    {/* Message type badge */}
                    <td>
                      <span className={getBadgeClass(obs.message_type)}>
                        {obs.message_type}
                      </span>
                    </td>

                    {/* Air temperature */}
                    <td>
                      {obs.air_temperature !== null
                        ? `${obs.air_temperature}°`
                        : '—'}
                    </td>

                    {/* Dewpoint */}
                    <td>
                      {obs.dewpoint !== null
                        ? `${obs.dewpoint}°`
                        : '—'}
                    </td>

                    {/* Wind information */}
                    <td>
                      {obs.wind_direction !== null && obs.wind_speed !== null
                        ? `${String(obs.wind_direction).padStart(3, '0')}/${obs.wind_speed}kt`
                        : '—'}
                    </td>

                    {/* QNH pressure */}
                    <td>{obs.qnh !== null ? obs.qnh : '—'}</td>

                    {/* QFE pressure */}
                    <td>{obs.qfe !== null ? obs.qfe : '—'}</td>

                    {/* Raw METAR/SPECI message */}
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {obs.raw_message ? (
                        <span
                          className="mono"
                          style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}
                        >
                          {obs.raw_message}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Delete action */}
                    <td style={{ textAlign: 'right' }}>
                      <DeleteButton id={obs.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}