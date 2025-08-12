import { useState } from 'react'
import type { CreateChatResponse } from '@/types/chat'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { createChat } from '@/store/thunks'

interface UseCreateOptions {
  category: string // AppRoute.Chat | AppRoute.Search
}

interface UseCreateReturn {
  create: () => Promise<CreateChatResponse | undefined>
  loading: boolean
  error: Error | null
}

export const useCreateChat = (props: UseCreateOptions): UseCreateReturn => {
  const { category } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const dispatchRTK = useDispatch<AppDispatch>()

  const create = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await dispatchRTK(
        createChat({
          category: category.replace('/', ''),
        }),
      )
      if (createChat.fulfilled.match(result)) {
        const data = result.payload
        // 不再在这里直接设置选中，而是返回创建的会话数据
        // 让调用方决定如何处理选中逻辑
        return data
      }
    } catch (err) {
      console.error(`[useCreate] Error creating ${category}:`, err)
      setError(err instanceof Error ? err : new Error('未知错误'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    create,
    loading,
    error,
  }
}
