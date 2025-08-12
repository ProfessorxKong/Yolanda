import { ConversationRound, TreeNode } from '@/store/slices/chatNew'
import { extractJsonFromMarkdown } from './json'
import { getPrimaryDomain } from '@/utils/domain'
import { truncateText } from '@/utils/helpers'

export const hasVerifierAgentEnd = (round: ConversationRound): boolean => {
  const checkNode = (node: TreeNode): boolean => {
    if (node.end) {
      const data = node.end.data.content
      const json = extractJsonFromMarkdown(data)
      if (node.end.name === 'verification' && json && json.matches.toLowerCase() !== 'no') {
        return true
      }
    }

    if (node.children && node.children.length > 0) {
      return node.children.some((child: TreeNode) => checkNode(child))
    }

    return false
  }
  return checkNode(round.rootNode)
}

export const hasErrorOrVerifierAgentEnd = (round: ConversationRound): boolean => {
  const checkNode = (node: TreeNode): boolean => {
    if (node.error) {
      return true
    }
    if (node.end) {
      const data = node.end.data.content
      const json = extractJsonFromMarkdown(data)
      if (node.end.name === 'verification' && json && json.matches.toLowerCase() !== 'no') {
        return true
      }
    }

    if (node.children && node.children.length > 0) {
      return node.children.some((child: TreeNode) => checkNode(child))
    }

    return false
  }
  return checkNode(round.rootNode)
}

export const hasErrorVerifierAgent = (round: ConversationRound): boolean => {
  const checkNode = (node: TreeNode): boolean => {
    if (node.error) {
      return true
    }

    if (node.children && node.children.length > 0) {
      return node.children.some((child: TreeNode) => checkNode(child))
    }
    return false
  }
  return checkNode(round.rootNode)
}

export const getVerifierContent = (
  round: ConversationRound,
): { reasoning: string; matches: string; data: any } | null => {
  const results = getAllVerifierContents(round)
  return results.length > 0 ? results[0] : null // 保持向后兼容
}

export const getAllVerifierContents = (
  round: ConversationRound,
): Array<{
  reasoning: string
  matches: string
  data: any
  nodeId?: string
  timestamp?: number
}> => {
  const results: Array<{
    reasoning: string
    matches: string
    data: any
    nodeId?: string
    timestamp?: number
  }> = []

  const findAllVerifierContents = (node: TreeNode): void => {
    if (node.end) {
      const content = node.end.data.content
      const json = extractJsonFromMarkdown(content)
      if (node.end.name === 'verification' && json && json.matches?.toLowerCase() !== 'no') {
        results.push({
          ...json,
          data: { ...node.end.data },
          nodeId: node.runId,
          timestamp: node.end.created_at || Date.now(), // 添加时间戳
        })
      }
    }

    // 递归检查所有子节点
    for (const child of node.children) {
      findAllVerifierContents(child)
    }
  }

  findAllVerifierContents(round.rootNode)
  return results
}

/**
 * 双因素排序函数：优先按match状态排序，其次按时间戳排序
 * @param verifierContents 验证器内容数组
 * @returns 排序后的验证器内容数组
 */
export const sortVerifierContents = (
  verifierContents: Array<{
    reasoning: string
    matches: string
    data: any
    nodeId?: string
    timestamp?: number
  }>,
) => {
  return [...verifierContents].sort((a, b) => {
    // 第一优先级：match状态排序
    const getMatchPriority = (match: string | undefined) => {
      if (match === 'match') return 1
      if (match === 'partial' || !match) return 3
      return 2 // 其他状态
    }

    const priorityA = getMatchPriority(a.matches)
    const priorityB = getMatchPriority(b.matches)

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    // 第二优先级：时间戳升序排序（时间戳越小越靠前）
    const timestampA = a.timestamp || 0
    const timestampB = b.timestamp || 0
    return timestampA - timestampB
  })
}

/**
 * 格式化时间戳为可读时间
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化的时间字符串
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffMins < 1) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else {
    // 显示具体时间
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

export const getVerifierReason = (round: ConversationRound): string => {
  const ct = getVerifierContent(round)
  return ct?.reasoning || ''
}

/**
 * 获取验证器信息，格式为：作者 - 年份 - 主域名
 * @param ct 验证器内容对象
 * @returns 格式化的验证器信息字符串
 */
export const getVerifierInfo = (ct: {
  reasoning: string
  matches: string
  data: any
  nodeId?: string
}): string => {
  if (!ct?.data?.metadata) {
    return ''
  }

  const { metadata } = ct.data
  // console.log('[verify data] metadata', ct);

  const author = metadata.authors || ''
  // console.log('[verify data] author', author);

  const year = metadata.year || ''
  const realYear = year === '0' ? '' : year // 如果年份为0，则显示为...
  const mainUrl = getPrimaryDomain(metadata.url) || ''
  let vInfo = ''
  vInfo += truncateText(author, 20) ? `${author} - ` : ''
  vInfo += realYear ? `${realYear} - ` : ''
  vInfo += mainUrl ? `${mainUrl}` : ''
  return vInfo
}

export const getSearchAgentOriginalMessage = (round: ConversationRound): string => {
  const findSearchAgentOriginalMessage = (node: TreeNode): string => {
    if (node.start && ['search_planner_agent', 'search_verify_agent'].includes(node.start.name)) {
      return node.start.metadata?.original_message || ''
    }

    for (const child of node.children) {
      const result = findSearchAgentOriginalMessage(child)
      if (result) {
        return result
      }
    }

    return ''
  }

  return findSearchAgentOriginalMessage(round.rootNode)
}
