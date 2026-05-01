'use client'

import { useState } from 'react'
import { createObservation } from '../actions/weather'
import { useRouter } from 'next/navigation'

export default function ObservationForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await createObservation(formData)
      if (result.success) {
        e.currentTarget.reset()
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        router.refresh()
      } else {
        setError(result.error || 'Failed to save observation')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="section-panel glass-panel">
      <div className="section-panel__header">
        <h3 className="section-panel__title">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Observation
        </h3>
      </div>

      {error && (
        <div className="alert alert--error">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert--success">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Observation saved successfully
        </div>
      )}

      <div className="form-grid" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="observation_time">Observation Time</label>
          <input
            type="datetime-local"
            id="observation_time"
            name="observation_time"
            className="form-control"
            required
            defaultValue={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="message_type">Message Type</label>
          <select id="message_type" name="message_type" className="form-control" required>
            <option value="METAR">METAR</option>
            <option value="SPECI">SPECI</option>
            <option value="MANUAL">MANUAL</option>
          </select>
        </div>
      </div>

      <div className="form-grid form-grid--full" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="raw_message">Raw Message (Optional)</label>
          <textarea
            id="raw_message"
            name="raw_message"
            className="form-control"
            rows={2}
            placeholder="METAR EGLL 011220Z AUTO 26010KT 9999 FEW040 15/09 Q1013="
          />
        </div>
      </div>

      <div className="form-grid form-grid--3col" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="air_temperature">Air Temp (°C)</label>
          <input type="number" step="0.1" id="air_temperature" name="air_temperature" className="form-control" placeholder="15.0" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="dewpoint">Dewpoint (°C)</label>
          <input type="number" step="0.1" id="dewpoint" name="dewpoint" className="form-control" placeholder="9.0" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="wind_direction">Wind Dir (°)</label>
          <input type="number" min="0" max="360" id="wind_direction" name="wind_direction" className="form-control" placeholder="260" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="wind_speed">Wind Speed (KT)</label>
          <input type="number" min="0" id="wind_speed" name="wind_speed" className="form-control" placeholder="10" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="qfe">QFE (hPa)</label>
          <input type="number" step="0.1" id="qfe" name="qfe" className="form-control" placeholder="1011.0" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="qnh">QNH (hPa)</label>
          <input type="number" step="0.1" id="qnh" name="qnh" className="form-control" placeholder="1013.0" />
        </div>
      </div>

      <div className="form-actions">
        <button type="reset" className="btn btn-secondary">Clear</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 108 8" />
              </svg>
              Saving...
            </>
          ) : (
            'Save Observation'
          )}
        </button>
      </div>
    </form>
  )
}
