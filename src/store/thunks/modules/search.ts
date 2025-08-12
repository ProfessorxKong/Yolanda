import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/api'
import { SearchResult, SearchRequest } from '@/api/models/search'

// Search-related thunks
export const performSearch = createAsyncThunk<
  SearchResult[],
  { query: string; docId?: string },
  { rejectValue: string }
>('search/perform', async ({ query, docId }, { rejectWithValue }) => {
  try {
    return await api.search.search(query, docId)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '搜索失败')
  }
})

export const performSemanticSearch = createAsyncThunk<
  SearchResult[],
  { query: string; docId?: string },
  { rejectValue: string }
>('search/semantic', async ({ query, docId }, { rejectWithValue }) => {
  try {
    return await api.search.semanticSearch(query, docId)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '语义搜索失败')
  }
})

export const performAdvancedSearch = createAsyncThunk<
  SearchResult[],
  SearchRequest,
  { rejectValue: string }
>('search/advanced', async (searchRequest, { rejectWithValue }) => {
  try {
    return await api.search.advancedSearch(searchRequest)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '高级搜索失败')
  }
})
