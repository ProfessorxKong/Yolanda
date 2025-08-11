import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/services/api/client'

export const fetchPing = createAsyncThunk('app/fetchPing', async () => {
  const res = await apiClient('/ping')
  return res.text()
})

