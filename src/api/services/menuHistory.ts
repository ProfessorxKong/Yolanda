import { httpClient } from '../client'

export interface CreateChatRequest {
  title?: string
  team_id?: string
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

export interface UpdateChatRequest {
  id: string
  title?: string
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

export interface ChatListRequest {
  page?: number
  page_size?: number
  team_id?: string
  [key: string]: unknown
}

export interface MenuHistoryChatSession {
  id: string
  team_id: string
  title: string
  metadata: Record<string, unknown>
  is_active: boolean
  created_by_user_id: string
  created_at: string
  updated_at: string
}

export interface ChatListResponse {
  chat_session_list: MenuHistoryChatSession[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

export const menuHistoryService = {
  // 创建聊天
  createChat: (data: CreateChatRequest): Promise<MenuHistoryChatSession> =>
    httpClient.post<MenuHistoryChatSession>('chat/sessions/new', data),

  // 更新聊天
  updateChat: (data: UpdateChatRequest): Promise<MenuHistoryChatSession> =>
    httpClient.post<MenuHistoryChatSession>('chat/sessions/update', data),

  // 获取聊天列表
  fetchMenuHistory: (data: ChatListRequest): Promise<ChatListResponse> =>
    httpClient.post<ChatListResponse>('chat/sessions/list', data),
}
