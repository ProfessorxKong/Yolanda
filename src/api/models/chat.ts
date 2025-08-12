export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: string
}

export interface ChatSession {
  sessionId: string
}
