import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { AppDispatch, RootState } from '@/store'
// import { getKnowledgeDocumentSession } from '@/store/thunks'

interface UseDocSessionReturn {
  ensureSession: (docId: string) => void
}

interface SessionIdentifiers {
  chatSessionId: string | null
  pathname: string
}

export const useSession = (): UseDocSessionReturn => {
  const dispatchRTK = useDispatch<AppDispatch>()
  const location = useLocation()

  const sessionIdentifiers = useSelector(
    (state: RootState): SessionIdentifiers => ({
      chatSessionId: state.chat.chat_session_id,
      pathname: location.pathname,
    }),
    (left, right) => left.chatSessionId === right.chatSessionId && left.pathname === right.pathname,
  )

  const ensureSession = useCallback(
    async (docId: string) => {
      if (!docId?.trim()) {
        console.warn('Document ID is required')
      }

      // Removed pdfActions related logic

      try {
        // const result = await dispatchRTK(
        //   getKnowledgeDocumentSession({
        //     doc_id: docId,
        //     team_id: teamId,
        //   }),
        // )
        // if (getKnowledgeDocumentSession.fulfilled.match(result)) {
        //   const sessionData = result.payload
        //   // Removed pdfActions related logic
        // } else {
        //   const errorMessage = result.payload || 'Failed to create document session'
        //   console.error('Failed to get document session:', errorMessage)
        //   // Removed pdfActions related logic
        // }
      } catch (error) {
        // const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        // console.error('Failed to get document session ID:', errorMessage)
        // // Removed pdfActions related logic
      }
    },
    [sessionIdentifiers, dispatchRTK],
  )

  return {
    ensureSession,
  }
}
