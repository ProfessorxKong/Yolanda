import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 定义消息内容的接口
export interface MessageContent {
  event: string // 如: onAgentStart, onAgentEnd, onToolStart, onToolEnd 等
  data: {
    action: string
    content: any
    metadata: any
    error: any
  }
  name: string // 如: mx_agent, verifier_agent, Search 等
  session_id: string
  run_id: string
  task_id?: number // 任务ID, 用于标识具体的任务
  parent_id: string
  is_answer: boolean
  created_at: number
  metadata: Record<string, any>
}

// 定义单个数据项结构 - 支持字符串和对象两种格式
interface ChatDataItem {
  data: string | MessageContent
}

// 定义树节点结构
export interface TreeNode {
  runId: string
  start?: MessageContent
  end?: MessageContent
  stream?: MessageContent
  error?: MessageContent
  parentId?: string
  depth: number
  children: TreeNode[]
  siblings: string[]
}

// 定义一轮会话的结构
export interface ConversationRound {
  id: string // 轮次唯一标识
  rootNode: TreeNode // 该轮次的根节点
  createdAt: string // 创建时间
  isActive: boolean // 是否为当前活跃轮次
  humanMessage?: string // 用户消息
  metadata?: Record<string, any> // 会话轮次元数据
}

// 定义会话数据结构
export interface SessionData {
  sessionId: string
  rounds: ConversationRound[] // 多轮对话数组
  currentRoundId?: string // 当前活跃轮次ID
}

export interface ChatNewState {
  chatSessions: {
    [sessionId: string]: SessionData
  }
}

// 定义历史消息的接口
export interface HistoryMessage {
  id: number
  parent_id: number | string
  root_id: number | string
  is_answer: boolean
  role_name: string
  sender_type: string
  action: string
  content: string | any
  status: string
  error_message: string
  metadata: {
    created_at: number
    data: {
      action: string
      content: any
      error: any
      metadata: any
    }
    event: string
    is_answer: boolean
    metadata: Record<string, any>
    name: string
    parent_id: string
    run_id: string
    session_id: number | string
  }
  created_at: string
  updated_at: string
}

// 定义历史数据的接口
export interface HistoryData {
  messages: HistoryMessage[][]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

const initialState: ChatNewState = {
  chatSessions: {},
}

const chatNewSlice = createSlice({
  name: 'chatNew',
  initialState,
  reducers: {
    // 添加非流式消息
    addMessage: (state, action: PayloadAction<ChatDataItem>) => {
      const data = action.payload

      let messageContent: MessageContent

      if (typeof data.data === 'string') {
        try {
          messageContent = JSON.parse(data.data)
        } catch (error) {
          console.error('Failed to parse data string:', error)
          return
        }
      } else {
        messageContent = data.data
      }

      const sessionId = messageContent.session_id

      // 确保会话存在
      if (!state.chatSessions[sessionId]) {
        state.chatSessions[sessionId] = {
          sessionId,
          rounds: [],
        }
      }

      const session = state.chatSessions[sessionId]

      // 检查是否需要创建新会话轮次
      const isStartEvent = messageContent.event.toLowerCase().includes('start')
      const isEndEvent = messageContent.event.toLowerCase().includes('end')
      const isStreamEvent = messageContent.event.toLowerCase().includes('stream')
      const isErrorEvent = messageContent.event.toLowerCase().includes('error')
      const parentId = messageContent.parent_id

      // 如果是根节点且是开始事件，创建新会话轮次
      if (!parentId && isStartEvent) {
        // 将当前会话轮次设为非活跃（如果存在）
        if (session.currentRoundId) {
          const currentRound = session.rounds.find((r) => r.id === session.currentRoundId)
          if (currentRound) {
            currentRound.isActive = false
          }
        }

        const newRound: ConversationRound = {
          id: generateRoundId('stream'),
          rootNode: {
            runId: messageContent.run_id,
            depth: 0,
            children: [],
            siblings: [],
          },
          createdAt: new Date().toISOString(),
          isActive: true,
        }
        session.rounds.push(newRound)
        session.currentRoundId = newRound.id
      }

      // 更新树形结构
      updateTreeNodes(
        session,
        messageContent,
        parentId,
        isStartEvent,
        isEndEvent,
        isStreamEvent,
        isErrorEvent,
      )
    },
    addStreamMessage: (_state, action: PayloadAction<ChatDataItem>) => {
      const data = action.payload

      let messageContent: MessageContent
      if (typeof data.data === 'string') {
        try {
          messageContent = JSON.parse(data.data)
        } catch (error) {
          console.error('Failed to parse data string:', error)
          return
        }
      } else {
        messageContent = data.data
      }
      console.log('Received stream message:', messageContent)
    },
    // 添加历史消息
    addHistoryMessages: (state, action: PayloadAction<HistoryData>) => {
      const { messages } = action.payload

      try {
        messages.forEach((roundMessages) => {
          if (roundMessages.length === 0) return
          const firstMessage = roundMessages[0]
          const sessionId = firstMessage.metadata.session_id.toString()
          if (!state.chatSessions[sessionId]) {
            state.chatSessions[sessionId] = {
              sessionId,
              rounds: [],
            }
          }
          const session = state.chatSessions[sessionId]
          // 处理这一轮的所有消息
          roundMessages.forEach((historyMessage) => {
            // 检查是否已经存在相同的消息（通过 run_id 和 event 来判断）
            const isStartEvent = historyMessage.metadata.event.toLowerCase().includes('start')
            const isEndEvent = historyMessage.metadata.event.toLowerCase().includes('end')
            const isStreamEvent = historyMessage.metadata.event.toLowerCase().includes('stream')
            const isErrorEvent = historyMessage.metadata.event.toLowerCase().includes('error')

            // 检查是否已经处理过这个特定的事件
            const existingMessage = session.rounds.some((round) => {
              const node = findNodeInTree([round.rootNode], historyMessage.metadata.run_id)
              if (!node) return false
              if (isStartEvent && node.start) return true
              if (isEndEvent && node.end) return true
              if (isErrorEvent && node.error) return true
              if (isStreamEvent && node.stream) return true
              return false
            })

            if (existingMessage) {
              // 如果消息已存在，跳过处理
              return
            }

            // 将历史消息转换为 MessageContent 格式
            const messageContent: MessageContent = {
              event: historyMessage.metadata.event,
              data: {
                action: historyMessage.metadata.data.action,
                content: historyMessage.metadata.data.content,
                metadata: historyMessage.metadata.data.metadata,
                error: historyMessage.metadata.data.error,
              },
              name: historyMessage.metadata.name,
              session_id: historyMessage.metadata.session_id.toString(),
              run_id: historyMessage.metadata.run_id,
              parent_id: historyMessage.metadata.parent_id,
              is_answer: historyMessage.metadata.is_answer,
              created_at: historyMessage.metadata.created_at,
              metadata: historyMessage.metadata.metadata,
            }

            const parentId = messageContent.parent_id

            if (!parentId && isStartEvent) {
              if (session.currentRoundId) {
                const currentRound = session.rounds.find((r) => r.id === session.currentRoundId)
                if (currentRound) {
                  currentRound.isActive = false
                }
              }

              const newRound: ConversationRound = {
                id: generateRoundId('history'),
                rootNode: {
                  runId: messageContent.run_id,
                  depth: 0,
                  children: [],
                  siblings: [],
                },
                createdAt: new Date().toISOString(),
                isActive: true,
              }
              session.rounds.push(newRound)
              session.currentRoundId = newRound.id
            }

            updateTreeNodes(
              session,
              messageContent,
              parentId,
              isStartEvent,
              isEndEvent,
              isStreamEvent,
              isErrorEvent,
            )
          })
        })
      } catch (error) {
        console.log('========xxx====222===', error)
      }
    },

    // 发送消息,此刻是流式发送,单独展示human 消息, 不展示llm 消息
    sendMessage: (state, action: PayloadAction<{ sessionId: string; message: string }>) => {
      const { sessionId, message } = action.payload
      let session = state.chatSessions[sessionId]
      if (!session) {
        // 如果会话不存在,创建会话
        state.chatSessions[sessionId] = {
          sessionId,
          rounds: [],
        }
        session = state.chatSessions[sessionId]
      }

      const newRound: ConversationRound = {
        id: generateRoundId('human'),
        rootNode: {
          runId: '',
          depth: 0,
          children: [],
          siblings: [],
        },
        humanMessage: message,
        createdAt: new Date().toISOString(),
        isActive: true,
      }
      session.rounds.push(newRound)
      session.currentRoundId = newRound.id
    },

    // 开始新会话轮次
    startNewRound: (state, action: PayloadAction<{ sessionId: string; roundId?: string }>) => {
      const { sessionId, roundId } = action.payload
      const session = state.chatSessions[sessionId]

      if (!session) return

      // 将当前会话轮次设为非活跃
      if (session.currentRoundId) {
        const currentRound = session.rounds.find((r) => r.id === session.currentRoundId)
        if (currentRound) {
          currentRound.isActive = false
        }
      }

      // 创建新会话轮次
      const newRound: ConversationRound = {
        id: roundId || generateRoundId('history'),
        rootNode: {
          runId: '', // 将在添加消息时设置
          depth: 0,
          children: [],
          siblings: [],
        },
        createdAt: new Date().toISOString(),
        isActive: true,
      }

      session.rounds.push(newRound)
      session.currentRoundId = newRound.id
    },

    // 切换到指定会话轮次
    switchToRound: (state, action: PayloadAction<{ sessionId: string; roundId: string }>) => {
      const { sessionId, roundId } = action.payload
      const session = state.chatSessions[sessionId]

      if (!session) return

      // 将所有会话轮次设为非活跃
      session.rounds.forEach((round) => {
        round.isActive = false
      })

      // 激活指定会话轮次
      const targetRound = session.rounds.find((r) => r.id === roundId)
      if (targetRound) {
        targetRound.isActive = true
        session.currentRoundId = roundId
      }
    },

    break: (state, action: PayloadAction<{ sessionId: string }>) => {
      const { sessionId } = action.payload
      const session = state.chatSessions[sessionId]
      if (!session) return
      const roundsWithoutEnd = session.rounds.filter((r) => !r.rootNode.end)
      if (roundsWithoutEnd.length > 0) {
        roundsWithoutEnd.forEach((r) => {
          r.rootNode.end = {
            data: {
              action: '',
              content: '',
              metadata: {},
              error: null,
              ...r.rootNode.start?.data,
            },
            session_id: sessionId,
            run_id: r.rootNode.runId,
            parent_id: r.rootNode.runId,
            is_answer: true,
            created_at: Date.now(),
            metadata: {},
            ...r.rootNode.start,
            name: 'mx_agent',
            event: 'onAgentEnd',
          }
        })
      }
    },
  },
})

// 生成会话轮次ID
function generateRoundId(suffix: string): string {
  return `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${suffix}`
}

// 在树中查找节点
function findNodeInTree(treeNodes: TreeNode[], runId: string): TreeNode | null {
  for (const node of treeNodes) {
    if (node.runId === runId) {
      return node
    }
    const found = findNodeInTree(node.children, runId)
    if (found) return found
  }
  return null
}

// 更新树形结构
function updateTreeNodes(
  session: SessionData,
  messageContent: MessageContent,
  parentId: string,
  isStartEvent: boolean,
  isEndEvent: boolean,
  isStreamEvent: boolean,
  isErrorEvent: boolean,
): void {
  const runId = messageContent.run_id

  // 使用当前活跃会话轮次
  const targetRound = session.rounds.find((r) => r.id === session.currentRoundId)

  if (!targetRound) return

  // 查找现有节点
  let existingNode = findNodeInTree([targetRound.rootNode], runId)

  if (!existingNode) {
    // 创建新节点
    const newNode: TreeNode = {
      runId,
      parentId: parentId || undefined,
      depth: 0,
      children: [],
      siblings: [],
    }

    if (parentId && parentId !== '') {
      // 有父节点，添加到父节点的children中
      const parentNode = findNodeInTree([targetRound.rootNode], parentId)
      if (parentNode) {
        newNode.depth = parentNode.depth + 1
        parentNode.children.push(newNode)
        // 更新兄弟关系
        newNode.siblings = parentNode.children
          .filter((child) => child.runId !== runId)
          .map((child) => child.runId)
        parentNode.children.forEach((child) => {
          if (child.runId !== runId) {
            child.siblings = parentNode.children
              .filter((c) => c.runId !== child.runId)
              .map((c) => c.runId)
          }
        })
      } else {
        // 父节点不存在，创建占位符
        const parentPlaceholder: TreeNode = {
          runId: parentId,
          depth: 0,
          children: [newNode],
          siblings: [],
        }
        targetRound.rootNode.children.push(parentPlaceholder)
        newNode.depth = 1
        newNode.siblings = []
      }
    } else {
      // 没有父节点，是根节点
      if (!targetRound.rootNode.runId) {
        targetRound.rootNode.runId = runId
      } else {
        targetRound.rootNode.children.push(newNode)
      }
    }

    existingNode = newNode
  }

  // 更新事件消息
  if (isStartEvent) {
    if (existingNode.start) {
      if (typeof messageContent.data.content === 'string') {
        existingNode.start.data.content += messageContent.data.content
      } else {
        existingNode.start.data.content = messageContent.data.content
      }
      existingNode.start.data.action = messageContent.data.action
      existingNode.start.data.metadata = messageContent.data.metadata
      existingNode.start.data.error = messageContent.data.error
      existingNode.start.is_answer = messageContent.is_answer
      existingNode.start.created_at = messageContent.created_at
      existingNode.start.metadata = messageContent.metadata
    } else {
      existingNode.start = messageContent
    }
  } else if (isEndEvent) {
    if (existingNode.end) {
      if (typeof messageContent.data.content === 'string') {
        existingNode.end.data.content += messageContent.data.content
      } else {
        existingNode.end.data.content = messageContent.data.content
      }
      existingNode.end.data.action = messageContent.data.action
      existingNode.end.data.metadata = messageContent.data.metadata
      existingNode.end.data.error = messageContent.data.error
      existingNode.end.is_answer = messageContent.is_answer
      existingNode.end.created_at = messageContent.created_at
      existingNode.end.metadata = messageContent.metadata
    } else {
      existingNode.end = messageContent
    }
  } else if (isStreamEvent) {
    if (existingNode.stream) {
      if (typeof messageContent.data.content === 'string') {
        existingNode.stream.data.content += messageContent.data.content
      } else {
        existingNode.stream.data.content = messageContent.data.content
      }
      existingNode.stream.data.action = messageContent.data.action
      existingNode.stream.data.metadata = messageContent.data.metadata
      existingNode.stream.data.error = messageContent.data.error
      existingNode.stream.is_answer = messageContent.is_answer
      existingNode.stream.created_at = messageContent.created_at
      existingNode.stream.metadata = messageContent.metadata
    } else {
      existingNode.stream = messageContent
    }
  } else if (isErrorEvent) {
    if (existingNode.error) {
      if (typeof messageContent.data.content === 'string') {
        existingNode.error.data.content += messageContent.data.content
      } else {
        existingNode.error.data.content = messageContent.data.content
      }
      existingNode.error.data.action = messageContent.data.action
      existingNode.error.data.metadata = messageContent.data.metadata
      existingNode.error.data.error = messageContent.data.error
      existingNode.error.is_answer = messageContent.is_answer
      existingNode.error.created_at = messageContent.created_at
      existingNode.error.metadata = messageContent.metadata
    } else {
      existingNode.error = messageContent
    }
  }
}

export const { actions: chatNewActions } = chatNewSlice
export default chatNewSlice.reducer
