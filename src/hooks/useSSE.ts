/* eslint-disable no-console */
// DocType logic removed
// import { info } from '@tauri-apps/plugin-log'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/store'
import { chatNewActions } from '@/store/slices/chatNew'
import { getSessionId } from '@/store/selectors/chat'
import { useSearchParams } from 'react-router-dom'
// import { AppRoute } from '@/router'

import { httpClient } from '@/api'
import { SseOptions } from '@/types/sse'

export const useSse = (
  baseUrl: string,
  options: SseOptions & { onStreamEnd?: () => void } = {},
): {
  error: Error | null
  isLoading: boolean
  // eslint-disable-next-line no-unused-vars
  sendRequest: (message: string, path?: string) => Promise<void>
  cancelRequest: () => void
  flowInfoBuffer: string
} => {
  const [searchParams] = useSearchParams()
  const [flowInfoBuffer] = useState<string>('')
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  // const location = useLocation()
  // const { pathname } = location

  const dispatchRTK = useDispatch()
  // const team = useSelector((state: RootState) => state.team)
  // const knowledge = useSelector((state: RootState) => (state as any).knowledge)

  const sessionId = useSelector(getSessionId)

  const pdfDocId = searchParams.get('docId')

  // 处理消息
  const handleMessage = useCallback(
    (message: string) => {
      dispatchRTK(chatNewActions.addMessage({ data: message }))
    },
    [dispatchRTK],
  )

  useEffect(() => {
    console.log('knowledge.currentDocId', pdfDocId)
  }, [pdfDocId])

  // 发送请求
  const sendRequest = useCallback(
    async (message: string, path: string = baseUrl) => {
      if (!message.trim()) {
        return
      }

      // if (!team.currentTeamId) {
      //   return
      // }

      setIsLoading(true)
      setError(null)

      const requestData: Record<string, unknown> = {
        // team_id: team.currentTeamId,
        message,
        stream: true,
        session_id: sessionId?.toString(),
        // ...(pdfDocId && pathname === '/pdf' ? { doc_ids: [`${pdfDocId}`] } : {}),
        // ...(knowledge.baseIds.length > 0 && pathname == '/pdf'
        //   ? { knowledge_ids: [pdfDocId] }
        //   : {}),
      }

      httpClient.sse(path, requestData, {
        onMessage: handleMessage,
        onError: (err) => {
          console.error('SSE error:', err)
          setError(err instanceof Error ? err : new Error('SSE connection error'))
        },
        onEnd: () => {
          // info('SSE request completed')
          setIsLoading(false)
          if (typeof options.onStreamEnd === 'function') {
            options.onStreamEnd()
          }
        },
      })
    },
    [baseUrl, sessionId, options, handleMessage],
  )

  // 取消请求
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }, [])

  return {
    error,
    isLoading,
    sendRequest,
    cancelRequest,
    flowInfoBuffer,
  }
}
