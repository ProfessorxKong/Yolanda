import { getFlatErrorAndVerification } from '@/utils/chat'
import { RootState } from '../index'
import { SessionData, TreeNode, ConversationRound } from '../slices/chatNew'
import { getSessionId } from './chat'

export const chatNewSelectors = {
  // 基础会话选择器
  getCurrentSession: (state: RootState): SessionData | null => {
    const sessionId = getSessionId(state)
    if (!sessionId) return null
    return state.chatNew.chatSessions[sessionId] || null
  },

  // 当前活跃会话轮次
  getCurrentRound: (state: RootState): ConversationRound | null => {
    const session = chatNewSelectors.getCurrentSession(state)
    if (!session?.currentRoundId) return null
    return session.rounds.find((r) => r.id === session.currentRoundId) || null
  },

  // 当前会话轮次的子节点（用于ChatStep）
  getCurrentRoundChildren: (state: RootState): TreeNode[] => {
    const currentRound = chatNewSelectors.getCurrentRound(state)
    return currentRound?.rootNode.children || []
  },

  // 所有会话轮次列表 type:'/search' | '/chat' | '/pdf'
  getAllRounds:
    (type: string) =>
    (state: RootState): ConversationRound[] => {
      const { location } = state.route
      if (location.pathname !== type) return []
      const session = chatNewSelectors.getCurrentSession(state)
      return session?.rounds || []
    },

  //TODO:检查代码
  getSearchVerificationRounds:
    () =>
    (state: RootState): ConversationRound[] => {
      const { pathname } = state.route.location
      if (pathname !== '/search') return []
      const session = chatNewSelectors.getCurrentSession(state)
      const rounds = session?.rounds || []

      return rounds.map((round) => {
        const updatedChildren = round.rootNode.children.map((item) => {
          if (item.end?.name === 'executor_agent') {
            const flatChildren = getFlatErrorAndVerification(item)
            return {
              ...item,
              children: flatChildren,
            }
          }
          return { ...item }
        })

        return {
          ...round,
          rootNode: {
            ...round.rootNode,
            children: updatedChildren,
          },
        }
      })
    },

  getJobCounts: (state: RootState): { total: number; current: number } => {
    const currentRound = chatNewSelectors.getCurrentRound(state)
    if (!currentRound) return { total: 0, current: 0 }

    const countEvents = (nodes: TreeNode[]): { total: number; current: number } =>
      nodes.reduce(
        (acc, node) => {
          const childCounts = node.children.length
            ? countEvents(node.children)
            : { total: 0, current: 0 }
          return {
            total: acc.total + (node.start ? 1 : 0) + childCounts.total,
            current: acc.current + (node.end || node.error ? 1 : 0) + childCounts.current,
          }
        },
        { total: 0, current: 0 },
      )

    const result = countEvents([currentRound.rootNode])
    return result
  },

  // true 表示任务开始，false 表示任务结束
  getTaskStart: (state: RootState): boolean => {
    const currentRound = chatNewSelectors.getCurrentRound(state)
    if (!currentRound) return false
    const rootNode = currentRound.rootNode
    if (rootNode.start && rootNode.end) {
      return false
    } else if (rootNode.start && !rootNode.end) {
      return true
    } else {
      return false
    }
  },

  getRootNode: (state: RootState): TreeNode | null => {
    const currentRound = chatNewSelectors.getCurrentRound(state)
    return currentRound?.rootNode || null
  },

  findNodeHasEndByRunId: (state: RootState, runId: string): TreeNode | null => {
    const currentRound = chatNewSelectors.getCurrentRound(state)
    if (!currentRound) return null
    const stack: TreeNode[] = [currentRound.rootNode]
    while (stack.length > 0) {
      const node = stack.pop()!
      if (node.start?.run_id === runId && node.end) return node
      if (node.children && node.children.length > 0) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i])
        }
      }
    }
    return null
  },
}
