'use server'

/**
 * Server-side actions for managing weather observations.
 *
 * This module provides CRUD operations using Prisma ORM
 * and ensures UI revalidation after mutations.
 */

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

/**
 * Fetch the latest 50 weather observations ordered by most recent.
 *
 * @returns {Promise<{ success: true, data: Observation[] } | { success: false, error: string }>}
 */
export async function getObservations() {
  try {
    const observations = await prisma.weatherObservation.findMany({
      orderBy: { observation_time: 'desc' },
      take: 50,
    })

    return { success: true as const, data: observations }
  } catch (error) {
    console.error('Failed to fetch observations:', error)
    return { success: false as const, error: 'Failed to fetch observations' }
  }
}

/**
 * Create a new weather observation from form data.
 *
 * Extracts and parses form values, ensuring numeric fields are properly handled.
 * Empty or invalid numeric values are stored as null.
 *
 * @param {FormData} formData - Form input containing observation fields
 * @returns {Promise<{ success: true } | { success: false, error: string }>}
 */
export async function createObservation(formData: FormData) {
  try {
    // Parse required fields
    const observationTime = new Date(formData.get('observation_time') as string)
    const messageType = formData.get('message_type') as string

    // Optional raw METAR/SYNOP message
    const rawMessage = (formData.get('raw_message') as string) || null

    /**
     * Helper function to safely parse numeric inputs.
     * Returns null for empty or invalid values.
     */
    const parseNumber = (val: FormDataEntryValue | null) => {
      if (!val || val === '') return null
      const parsed = Number(val)
      return isNaN(parsed) ? null : parsed
    }

    // Parse meteorological parameters
    const airTemp = parseNumber(formData.get('air_temperature'))
    const dewpoint = parseNumber(formData.get('dewpoint'))
    const windDir = parseNumber(formData.get('wind_direction'))
    const windSpeed = parseNumber(formData.get('wind_speed'))
    const qfe = parseNumber(formData.get('qfe'))
    const qnh = parseNumber(formData.get('qnh'))

    // Insert into database
    await prisma.weatherObservation.create({
      data: {
        observation_time: observationTime,
        message_type: messageType,
        raw_message: rawMessage,
        air_temperature: airTemp,
        dewpoint: dewpoint,
        wind_direction: windDir !== null ? Math.round(windDir) : null,
        wind_speed: windSpeed !== null ? Math.round(windSpeed) : null,
        qfe: qfe,
        qnh: qnh,
      },
    })

    // Revalidate pages to reflect new data
    revalidatePath('/')
    revalidatePath('/manage')

    return { success: true as const }
  } catch (error) {
    console.error('Failed to create observation:', error)
    return { success: false as const, error: 'Failed to save observation' }
  }
}

/**
 * Update an existing weather observation.
 *
 * Uses the same parsing logic as creation, ensuring consistency.
 *
 * @param {string} id - Unique identifier of the observation
 * @param {FormData} formData - Updated form data
 * @returns {Promise<{ success: true } | { success: false, error: string }>}
 */
export async function updateObservation(id: string, formData: FormData) {
  try {
    const observationTime = new Date(formData.get('observation_time') as string)
    const messageType = formData.get('message_type') as string
    const rawMessage = (formData.get('raw_message') as string) || null

    const parseNumber = (val: FormDataEntryValue | null) => {
      if (!val || val === '') return null
      const parsed = Number(val)
      return isNaN(parsed) ? null : parsed
    }

    const airTemp = parseNumber(formData.get('air_temperature'))
    const dewpoint = parseNumber(formData.get('dewpoint'))
    const windDir = parseNumber(formData.get('wind_direction'))
    const windSpeed = parseNumber(formData.get('wind_speed'))
    const qfe = parseNumber(formData.get('qfe'))
    const qnh = parseNumber(formData.get('qnh'))

    // Update database record
    await prisma.weatherObservation.update({
      where: { id },
      data: {
        observation_time: observationTime,
        message_type: messageType,
        raw_message: rawMessage,
        air_temperature: airTemp,
        dewpoint: dewpoint,
        wind_direction: windDir !== null ? Math.round(windDir) : null,
        wind_speed: windSpeed !== null ? Math.round(windSpeed) : null,
        qfe: qfe,
        qnh: qnh,
      },
    })

    // Revalidate affected pages
    revalidatePath('/')
    revalidatePath('/manage')

    return { success: true as const }
  } catch (error) {
    console.error('Failed to update observation:', error)
    return { success: false as const, error: 'Failed to update observation' }
  }
}

/**
 * Delete a weather observation by ID.
 *
 * @param {string} id - Unique identifier of the observation
 * @returns {Promise<{ success: true } | { success: false, error: string }>}
 */
export async function deleteObservation(id: string) {
  try {
    await prisma.weatherObservation.delete({
      where: { id },
    })

    // Revalidate pages after deletion
    revalidatePath('/')
    revalidatePath('/manage')

    return { success: true as const }
  } catch (error) {
    console.error('Failed to delete observation:', error)
    return { success: false as const, error: 'Failed to delete observation' }
  }
}