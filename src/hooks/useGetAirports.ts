/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AutocompleteValue } from '@mui/material'
import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'

import { IAirport } from '@/types'
import { getAirports, getSingleAirPort } from '@/utils/airport'

import { useToast } from './useToast'

const InitialAirPortValue = {
  label: '',
  name: '',
  city: '',
  iata: '',
  country: {
    name: '',
    iso: ''
  },
  state: {
    name: '',
    abbr: ''
  },
  latitude: '',
  longitude: ''
}

export const useGetAirports = () => {
  const [term, setTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [airports, setAirports] = useState<IAirport[]>([])
  const [singleAirport, setSingleAirport] =
    useState<IAirport>(InitialAirPortValue)
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  const { showToast } = useToast()

  const fetchAirports = useCallback(
    async (keyword: string) => {
      try {
        setIsLoading(true)
        const response = await getAirports(keyword)
        setIsLoading(false)
        if (response.data.status) {
          setAirports((response.data?.airports as IAirport[]) ?? [])
        } else {
          showToast({
            type: 'warning',
            message: response.data.message
          })
          setAirports([])
        }
      } catch (e) {
        const error = e as AxiosError
        showToast({
          type: 'error',
          message: error?.message
        })
      }
    },
    [getAirports]
  )

  const fetchSingleAirport = useCallback(
    async (iata: string) => {
      try {
        const response = await getSingleAirPort(iata)
        setSingleAirport(
          response.status
            ? (response.data?.airport as IAirport) ?? InitialAirPortValue
            : InitialAirPortValue
        )
      } catch (e) {
        const error = e as AxiosError
        showToast({
          type: 'error',
          message: error.message
        })
      }
    },
    [getSingleAirPort]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const keyword = e.target.value
    setTerm(keyword)
    if (keyword?.length > 2) {
      clearTimeout(timer)
      const newTimer = setTimeout(() => {
        fetchAirports(keyword)
      }, 500)
      setTimer(newTimer)
    } else {
      setAirports([])
    }
  }

  const handleAutomCompleteChange = (
    e: React.SyntheticEvent,
    value: AutocompleteValue<IAirport, false, false, false>
  ) => {
    e.preventDefault()
    if (!value) {
      setTerm('')
      setAirports([])
    }
    const iata = value?.iata as string
    fetchSingleAirport(iata)
  }

  return {
    term,
    isLoading,
    singleAirport,
    airports,
    handleInputChange,
    handleAutomCompleteChange
  }
}
