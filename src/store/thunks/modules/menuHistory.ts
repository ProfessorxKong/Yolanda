import { createAsyncThunk } from '@reduxjs/toolkit'
import { menuHistoryService } from '@/api/services/menuHistory'
import type {
  CreateChatRequest,
  UpdateChatRequest,
  ChatListRequest,
  MenuHistoryChatSession,
  ChatListResponse,
} from '@/api/services/menuHistory'

export const createChat = createAsyncThunk<
  MenuHistoryChatSession,
  CreateChatRequest,
  { rejectValue: string }
>('menuHistory/createChat', async (data, { rejectWithValue }) => {
  try {
    return await menuHistoryService.createChat(data)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '创建聊天失败')
  }
})

export const updateMenuHistoryChat = createAsyncThunk<
  MenuHistoryChatSession,
  UpdateChatRequest,
  { rejectValue: string }
>('menuHistory/updateChat', async (data, { rejectWithValue }) => {
  try {
    return await menuHistoryService.updateChat(data)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '更新聊天失败')
  }
})

export const fetchMenuHistory = createAsyncThunk<
  ChatListResponse,
  ChatListRequest,
  { rejectValue: string }
>('menuHistory/fetchMenuHistory', async (data, { rejectWithValue }) => {
  try {
    return await menuHistoryService.fetchMenuHistory(data)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '获取聊天列表失败')
  }
})
