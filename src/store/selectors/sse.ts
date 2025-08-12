import { AppRoute } from '@/router'

// 获取当前会话ID的选择器
export const getCurrentSessionId = (
  pageType: string,
  searchSessionId?: string,
  chatSessionId?: string,
): string | undefined => {
  return pageType === AppRoute.Search ? searchSessionId : chatSessionId
}

//TODO: 根据页面类型选择聊天历史
export const getChatHistoryByPageType = (
  pathname: string,
  pdfChatHistory: unknown,
  normalChatHistory: unknown,
): unknown => {
  return pathname === '/pdf' ? pdfChatHistory : normalChatHistory
}

// 根据当前URL获取PDF标签页标题
export const getCurrentPdfTabTitle = (
  pageType: string,
  pathname: string,
  search: string,
  pdfTabs: { tabs: Array<{ path: string; title: string }> },
): string | null => {
  if (pageType === 'pdf') {
    const currentUrl = pathname + search
    const currentTab = pdfTabs.tabs.find((tab) => {
      const tabUrl = `/pdf?sourcePath=${encodeURIComponent(tab.path)}`
      return tabUrl === currentUrl
    })
    return currentTab?.title || null
  }
  return null
}

// 根据标题获取对应的sessionId
export const getMatchedSessionId = (
  currentPdfTabTitle: string | null,
  docIds: Array<{ title: string; sessionId?: string }>,
): string | null => {
  if (currentPdfTabTitle && docIds.length > 0) {
    const matchedDoc = docIds.find((doc) => doc.title === currentPdfTabTitle)
    return matchedDoc?.sessionId || null
  }
  return null
}
