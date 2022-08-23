import {
  Autocomplete as MuiAutocomplete,
  styled,
  TextField
} from '@mui/material'
import React, { FC, memo, useEffect, useState } from 'react'

import { useGetAirports, useToast } from '@/hooks'
import { IAirport } from '@/types'

export interface IAutoCompleteProps {
  /**
   * AutoComplete Component ID
   */
  id: string
  /**
   * Autocomplete Label
   */
  label: string
  /**
   * Function Fired when the FROM AutoComplete changed
   */
  handleAutoCompleteChanged: (autoCompleteNameairport: IAirport) => void
}

const CustomAutoComplete = styled(MuiAutocomplete<IAirport>)(() => ({
  '& .MuiChip-root': {
    borderRadius: '4px',
    background: 'transparent'
  }
}))

export const AutoComplete: FC<IAutoCompleteProps> = memo(
  ({ label = '', handleAutoCompleteChanged, ...props }: IAutoCompleteProps) => {
    const {
      term,
      airports,
      singleAirport,
      handleInputChange,
      handleAutomCompleteChange
    } = useGetAirports()
    const [availableAirports, setAvailableAirports] = useState<IAirport[]>([])
    const { showToast } = useToast()

    useEffect(() => {
      if (term.length > 2) {
        airports.forEach(function (airport) {
          airport.label = airport.name + ', ' + airport.iata
        })

        const newAirports = airports.filter(
          airport =>
            airport.name.toLowerCase().includes(term.toLowerCase()) ||
            airport.iata.toLowerCase().includes(term.toLowerCase())
        )
        if (!newAirports.length)
          showToast({
            message: 'No results found for search term.'
          })
        setAvailableAirports(newAirports)
      } else {
        setAvailableAirports([])
      }
    }, [airports])

    useEffect(() => {
      handleAutoCompleteChanged(singleAirport)
    }, [singleAirport])

    return (
      <CustomAutoComplete
        loading={term.length > 2}
        {...props}
        disablePortal
        options={availableAirports}
        sx={{ width: 300 }}
        onChange={handleAutomCompleteChange}
        renderInput={params => (
          <TextField {...params} onChange={handleInputChange} label={label} />
        )}
      />
    )
  }
)

AutoComplete.displayName = 'AutoComplete'

export default AutoComplete
