import { Box, styled, Typography } from '@mui/material'
import { useLoadScript } from '@react-google-maps/api'
import React, { useState } from 'react'

import { AutoComplete, Map } from '@/components'
import { REACT_APP_GOOGLE_MAP_API_KEY } from '@/configs/env'

import { IAirport, IMarker } from './types'

const AppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  zIndex: 1,

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}))

const SearchContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  position: 'absolute',
  top: theme.spacing(4),
  right: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(2),
  zIndex: 99,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),

  [theme.breakpoints.down('sm')]: {
    backgroundColor: theme.palette.grey[200],
    position: 'inherit',
    padding: theme.spacing(2, 0),
    width: '100%',
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAP_API_KEY as string
  })

  const [fromMarker, setFromMarker] = useState<IMarker>()
  const [toMarker, setToMarker] = useState<IMarker>()

  const onFromAutoCompleteChanged = (airport: IAirport) => {
    const newMarker: IMarker = {
      id: 1,
      name: airport?.name,
      position: {
        lat: parseFloat(airport?.latitude),
        lng: parseFloat(airport?.longitude)
      }
    }
    setFromMarker(newMarker)
  }

  const onToAutoCompleteChanged = (airport: IAirport) => {
    const newMarker = {
      id: 2,
      name: airport?.name,
      position: {
        lat: parseFloat(airport?.latitude) || 0,
        lng: parseFloat(airport?.longitude) || 0
      }
    }
    setToMarker(newMarker)
  }

  return (
    <AppContainer>
      <SearchContainer>
        <Typography sx={{ fontSize: 14, marginBottom: '4px' }}>
          Search Airports with Name or IATA Code
        </Typography>
        <AutoComplete
          id='From_AutoComplete'
          label='From'
          handleAutoCompleteChanged={onFromAutoCompleteChanged}
        />
        <AutoComplete
          id='To_AutoComplete'
          label='To'
          handleAutoCompleteChanged={onToAutoCompleteChanged}
        />
      </SearchContainer>
      {isLoaded ? (
        <Map fromLocation={fromMarker} toLocation={toMarker} />
      ) : null}
    </AppContainer>
  )
}

export default App
