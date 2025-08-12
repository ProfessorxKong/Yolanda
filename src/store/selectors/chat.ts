import { AppRoute } from '@/router'
import { RootState } from '@/store'

export const getSessionId = (state: RootState): string | null => {
  //   const { route, pdf, chat } = state;
  const { route, chat } = state
  const { location } = route
  switch (location.pathname) {
    // case AppRoute.Pdf:
    //   return pdf.sessionId || null
    case AppRoute.Search:
      return chat.search_session_id || null
    // case AppRoute.Chat:
    //   return chat.chat_session_id || null
    default:
      return null
  }
}
