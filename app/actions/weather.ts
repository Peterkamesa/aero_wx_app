'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

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

export async function createObservation(formData: FormData) {
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

    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true as const }
  } catch (error) {
    console.error('Failed to create observation:', error)
    return { success: false as const, error: 'Failed to save observation' }
  }
}

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

    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true as const }
  } catch (error) {
    console.error('Failed to update observation:', error)
    return { success: false as const, error: 'Failed to update observation' }
  }
}

export async function deleteObservation(id: string) {
  try {
    await prisma.weatherObservation.delete({
      where: { id },
    })
    revalidatePath('/')
    revalidatePath('/manage')
    return { success: true as const }
  } catch (error) {
    console.error('Failed to delete observation:', error)
    return { success: false as const, error: 'Failed to delete observation' }
  }
}
