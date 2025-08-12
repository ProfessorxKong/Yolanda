import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/api'
import { ChatMessage } from '@/api/models/chat'
import { ChatHistory } from '@/types/chat'

export const fetchChatHistory = createAsyncThunk<
  ChatHistory,
  { session_id: string },
  { rejectValue: string }
>('chat/fetchHistory', async (data, { rejectWithValue }) => {
  try {
    return await api.chat.getChatHistory(data)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '获取聊天历史失败')
  }
})

export const sendChatMessage = createAsyncThunk<
  ChatMessage,
  { docId: string; message: string },
  { rejectValue: string }
>('chat/sendMessage', async ({ docId, message }, { rejectWithValue }) => {
  try {
    return await api.chat.sendMessage(docId, message)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '发送消息失败')
  }
})

export const createChatSession = createAsyncThunk<
  { sessionId: string },
  string,
  { rejectValue: string }
>('chat/createSession', async (docId, { rejectWithValue }) => {
  try {
    return await api.chat.createChatSession(docId)
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : '创建聊天会话失败')
  }
})

export const deleteChatSession = createAsyncThunk<void, string, { rejectValue: string }>(
  'chat/deleteSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      return await api.chat.deleteChatSession(sessionId)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '删除聊天会话失败')
    }
  },
)
