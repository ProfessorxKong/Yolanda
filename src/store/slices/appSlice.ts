import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  counter: number
  loading: boolean
}

const initialState: AppState = {
  counter: 0,
  loading: false,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    increment(state) {
      state.counter += 1
    },
  },
})

export const { increment } = appSlice.actions
export default appSlice.reducer

