import { getObservations } from '../actions/weather'
import ObservationForm from '../components/ObservationForm'
import DeleteButton from '../components/DeleteButton'

function formatTime(date: Date) {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function getBadgeClass(type: string) {
  switch (type) {
    case 'METAR': return 'badge badge--metar'
    case 'SPECI': return 'badge badge--speci'
    default: return 'badge badge--manual'
  }
}

export default async function ManagePage() {
  const result = await getObservations()
  const observations = result.success ? (result.data || []) : []

  return (
    <main>
      <div className="page-header">
        <h1 className="page-header__title">Manage Data</h1>
        <p className="page-header__subtitle">
          Add new observations or manage existing database entries
        </p>
      </div>

      <ObservationForm />

      <div className="section-panel glass-panel">
        <div className="section-panel__header">
          <h3 className="section-panel__title">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Observation History
          </h3>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {observations.length} records
          </span>
        </div>

        {observations.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="empty-state__text">No observations in database</p>
            <p className="empty-state__sub">Use the form above to add your first entry</p>
          </div>
        ) : (
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
                    <td>{formatTime(new Date(obs.observation_time))}</td>
                    <td>
                      <span className={getBadgeClass(obs.message_type)}>
                        {obs.message_type}
                      </span>
                    </td>
                    <td>{obs.air_temperature !== null ? `${obs.air_temperature}°` : '—'}</td>
                    <td>{obs.dewpoint !== null ? `${obs.dewpoint}°` : '—'}</td>
                    <td>
                      {obs.wind_direction !== null && obs.wind_speed !== null
                        ? `${String(obs.wind_direction).padStart(3, '0')}/${obs.wind_speed}kt`
                        : '—'}
                    </td>
                    <td>{obs.qnh !== null ? obs.qnh : '—'}</td>
                    <td>{obs.qfe !== null ? obs.qfe : '—'}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {obs.raw_message ? (
                        <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                          {obs.raw_message}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
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
