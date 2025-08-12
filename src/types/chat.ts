import { Pagination } from '@/types/pagination'
import type { MatchInfo, CardDetails, VerificationInfo } from '@/types/messageProcessor'

interface SessionList {
  // API 实际上不管 category 是什么，都返回在 chat_session_list 字段中
  chat_session_list?: {
    id: string
    team_id: string
    title: string
    metadata: object
    is_active: boolean
    created_by_user_id: string
    created_at: string
    updated_at: string
  }[]
  pagination: Pagination
}

interface ChatHistory {
  messages: {
    id: string
    parent_id: string
    root_id: string
    is_answer: boolean
    role_name: string
    sender_type: string
    action: string
    content: string
    status: string
    error_message: string
    metadata: {
      data: any
      instant: number
      stream: boolean
    }
    created_at: string
    updated_at: string
  }[]
  pagination: Pagination
}

interface PlannerAgent {
  thought: string
  tasks: {
    id: number
    task: string
    dep: number[]
    function: string
    function_paras: {
      core_words: string[] | null
      query: string | null
      rewrite_zh: string[] | null
      rewrite_en: string[] | null
      chunk_offset: number | null
      chunk_num: number | null
      llm_query: string | null
    }
  }[]
}

interface SearchAgent {
  search_kb: []
  search_web: {
    description: string
    extracted_content: string
    id: number
    query: string
    title: string
    url: string
  }[]
}

interface LLMHistory {
  items: {
    id: string
    message_id: string
    model_name: string
    model_parameters: {
      agent_name: string
      frequency_penalty: number
      max_tokens: number
      n: number
      temperature: number
    }
    prompt_messages: {
      role: string
      content: string
    }[]
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
    duration_ms: number
    raw_response: string
    status: string
    error_message: string
    created_at: string
    updated_at: string
  }[]
  pagination: Pagination
}

export interface Message {
  id: string
  content: string | null
  sender: 'user' | 'bot'
  isTyping?: boolean
  thinkMsg?: string
  collapseMsg?: {
    planner?: string
    extractor?: string
  }
  // 新增结构化数据字段
  matchInfo?: MatchInfo
  cardDetails?: CardDetails
  hasMatchSuccess?: boolean
  verificationInfo?: VerificationInfo
}

export interface CreateChatResponse {
  id: string
  team_id: string
  title: string
  metadata: object
  is_active: boolean
  created_by_user_id: string
  created_at: string
  updated_at: string
}

export type ChatAction =
  | { type: 'SET_CHAT_SESSION_ID'; payload: string }
  | { type: 'SET_SEARCH_SESSION_ID'; payload: string }
  | { type: 'SET_RUN_ID'; payload: string }
  | { type: 'CLEAR_CHAT_SESSION_ID' }
  | { type: 'CLEAR_SEARCH_SESSION_ID' }
  | { type: 'CLEAR_RUN_ID' }

export type { SessionList, ChatHistory, PlannerAgent, SearchAgent, LLMHistory }
