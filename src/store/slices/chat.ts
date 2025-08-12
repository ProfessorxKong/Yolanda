import { AppRoute } from '@/router'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChatSession {
  id: string
  team_id: string
  title: string
  metadata: object
  is_active: boolean
  created_by_user_id: string
  created_at: string
  updated_at: string
}

interface ChatState {
  chat_session_id: string | null
  search_session_id: string | null
}

const initialState: ChatState = {
  chat_session_id: null,
  search_session_id: null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatSessionId: (state, action: PayloadAction<string>) => {
      state.chat_session_id = action.payload
    },
    setSearchSessionId: (state, action: PayloadAction<string>) => {
      state.search_session_id = action.payload
    },
    clearChatSessionId: (state) => {
      state.chat_session_id = null
    },
    clearSearchSessionId: (state) => {
      state.search_session_id = null
    },
    // 新增：自动选中逻辑，根据会话列表自动选择合适的会话
    autoSelectSession: (
      state,
      action: PayloadAction<{
        category: string //  AppRoute.Chat | AppRoute.Search ('/chat' | '/search');
        sessionList: ChatSession[]
        newSessionId?: string
      }>,
    ) => {
      const { category, sessionList, newSessionId } = action.payload

      if (category === AppRoute.Write) {
        // 如果有新创建的会话ID，优先选中新创建的
        if (newSessionId) {
          state.chat_session_id = newSessionId
        }
        // 如果当前没有选中的会话，且有可用的会话列表，选中第一个
        else if (!state.chat_session_id && sessionList.length > 0) {
          state.chat_session_id = sessionList[0].id
        }
        // 如果当前选中的会话不在列表中，选中第一个（如果有的话）
        else if (state.chat_session_id && sessionList.length > 0) {
          const currentSessionExists = sessionList.some(
            (session) => session.id === state.chat_session_id,
          )
          if (!currentSessionExists) {
            state.chat_session_id = sessionList[0].id
          }
        }
      } else if (category === AppRoute.Search) {
        // 搜索会话的类似逻辑
        if (newSessionId) {
          state.search_session_id = newSessionId
        } else if (!state.search_session_id && sessionList.length > 0) {
          state.search_session_id = sessionList[0].id
        } else if (state.search_session_id && sessionList.length > 0) {
          const currentSessionExists = sessionList.some(
            (session) => session.id === state.search_session_id,
          )
          if (!currentSessionExists) {
            state.search_session_id = sessionList[0].id
          }
        }
      }
    },
  },
})

export const { actions: chatActions } = chatSlice
export default chatSlice.reducer
