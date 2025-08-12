import React from 'react'

export interface SseData {
  id: string
  choices: Array<{
    index: number
    delta: {
      content: string
      function_call: null
      tool_calls: null
      role: string
      refusal: null
    }
    finish_reason: null
    logprobs: null
  }>
  created: number
  model: string
  service_tier: null
  system_fingerprint: null
  object: string
  usage: null
}

export interface parsedContent {
  event: string
  data: {
    content: string
    action: string
    name: string
  }
}

export interface SseOptions {
  headers?: Record<string, string>
  method?: string
  body?: Record<string, string | boolean>
}

// 状态管理接口类型定义
export interface StateUpdateHandlers {
  // eslint-disable-next-line no-unused-vars
  setData: (data: string) => void
  setThinkMsg: React.Dispatch<React.SetStateAction<string>>
  dispatch: React.Dispatch<any> // Redux dispatch
  chatDispatch: React.Dispatch<any> // Chat action dispatch
  updateFrameRef: React.MutableRefObject<number | null>
}

export interface SessionContext {
  pageType: string
  pdfSessionId?: string
  searchSessionId?: string
  chatSessionId?: string
}
