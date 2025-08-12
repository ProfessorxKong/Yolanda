import { createSlice } from '@reduxjs/toolkit'
import { Location } from 'react-router-dom'

export const routeSlices = createSlice({
  name: 'route',
  initialState: {
    location: {} as Location,
  },
  reducers: {
    setLocation: (state, action) => {
      const location = action.payload
      state.location = location
    },
    clearLocation: (state) => {
      state.location = {} as Location
    },
  },
})

export const { actions: routeActions } = routeSlices
export default routeSlices.reducer
