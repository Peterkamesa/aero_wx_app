'use client'

/**
 * DeleteButton Component
 *
 * A reusable client-side button component for deleting a weather observation.
 * It handles user confirmation, loading state, and UI refresh after deletion.
 *
 * Props:
 * @param {string} id - Unique identifier of the observation to be deleted
 *
 * Features:
 * - Displays a confirmation dialog before deletion
 * - Shows a loading spinner while the delete operation is in progress
 * - Calls a server action to delete the observation
 * - Refreshes the page data after successful deletion
 * - Accessible with aria-label and title attributes
 */

import { useState } from 'react'
import { deleteObservation } from '../actions/weather'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id }: { id: string }) {
  // Tracks loading state during deletion
  const [loading, setLoading] = useState(false)

  // Next.js router for refreshing data after deletion
  const router = useRouter()

  /**
   * Handles the delete action:
   * - Prompts user for confirmation
   * - Calls delete API
   * - Refreshes the page on success
   */
  const handleDelete = async () => {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this observation?')) return

    setLoading(true)
    try {
      // Call server action to delete observation
      await deleteObservation(id)

      // Refresh UI to reflect changes
      router.refresh()
    } catch (error) {
      console.error('Failed to delete', error)
    } finally {
      // Reset loading state
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="btn-icon btn-icon--danger"
      disabled={loading}
      title="Delete observation"
      aria-label="Delete observation"
    >
      {loading ? (
        /**
         * Loading spinner icon (animated)
         */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 108 8"
          />
        </svg>
      ) : (
        /**
         * Trash icon (default state)
         */
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </button>
  )
}