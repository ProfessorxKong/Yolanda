import { useState, useEffect, useRef } from 'react'
import { message as antdMessage } from 'antd'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useAppDispatch } from '@/store/hooks'

import type { Message } from '@/types/chat'
import { getSessionId } from '@/store/selectors/chat'
import { useAppSelector } from '@/store/hooks'
import { chatNewActions } from '@/store/slices/chatNew'
import { chatNewSelectors } from '@/store/selectors/chatNew'

import { chatActions } from '@/store/slices/chat'
import { AppRoute } from '@/router'

// import { useChatBreak } from '@/hooks/useChatBreak'
// import { info } from '@tauri-apps/plugin-log'
import { useCreateChat } from '@/hooks/useCreateChat'
import { useSse } from '@/hooks/useSSE'
import { CHAT_FLOW_MODEL } from '@/constants/apis'

// 滚动到聊天区域底部的工具函数
const scrollChatToBottom = (delay = 100) => {
  setTimeout(() => {
    const chatMainElement = document.getElementById('chat-main')
    if (chatMainElement) {
      chatMainElement.scrollTo({
        top: chatMainElement.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, delay)
}

export const useTyperLogic = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isUserScrolled, setIsUserScrolled] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)

  const dispatchRTK = useAppDispatch()
  const chat = useSelector((state: RootState) => state.chat)

  const location = useLocation()
  const inputText = useSelector((state: RootState) => state.global.inputText)

  const skipEnter = useRef(false)
  const typingIntervalRef = useRef<null>(null)
  const inputAreaRef = useRef<HTMLDivElement>(null)
  const sessionId = useAppSelector(getSessionId)

  const { pathname } = location

  // 添加创建会话的 hooks
  const { create: createChatSession } = useCreateChat({
    category: 'chat',
  })
  const { create: createSearchSession } = useCreateChat({
    category: 'search',
  })

  const { sendRequest } = useSse(CHAT_FLOW_MODEL.path, {
    onStreamEnd: () => {
      // 使用setTimeout避免可能的循环引用问题
      setTimeout(() => {
        // 发送自定义事件来触发菜单刷新
        const event = new CustomEvent('refreshMenuHistory', {
          detail: { category: pathname },
        })
        window.dispatchEvent(event)
      }, 200) // 增加延迟以确保DOM更新完成
    },
  })

  // 使用基于sessionId的loading状态
  const isLoading = useSelector(chatNewSelectors.getTaskStart)

  // listen to the change of session_id, clear the message
  useEffect(() => {
    if (pathname !== '/pdf') {
      setMessages([])
      setIsUserScrolled(false)
    }
  }, [chat.chat_session_id, chat.search_session_id, pathname])

  // listen to the change of page type, handle the case when switching to the PDF page
  useEffect(() => {
    if (pathname !== '/pdf') {
      setMessages([])
      setIsUserScrolled(false)
    }
  }, [pathname])

  // 当切换到搜索页面时，清空消息列表
  useEffect(() => {
    if (pathname === '/search') {
      setMessages([])
    }
  }, [pathname])

  // listen to the change of input text
  useEffect(() => {
    if (inputText) {
      setIsButtonDisabled(false)
      setInputValue(inputText.trim())
      dispatchRTK(setInputText(null))
    }
  }, [inputText, dispatchRTK])

  useEffect(() => {
    if (isLoading) {
      setIsButtonDisabled(false)
    }
  }, [isLoading])

  // listen to the change of sseUserMsg and add it to messages

  // 当sessionId变化时，检查是否有待发送的消息
  useEffect(() => {
    if (sessionId && pendingMessage) {
      info(`[useTyperLogic] SessionId updated, sending pending message: ${pendingMessage}`)
      sendRequest(pendingMessage)
      setPendingMessage(null)

      // 发送待处理消息后延迟滚动，确保骨架屏渲染完成
      setTimeout(() => {
        scrollChatToBottom(50)
      }, 300)
    }
  }, [sessionId, pendingMessage, sendRequest])

  // when the component is unmounted, clear the timer
  useEffect(() => {
    const interval = typingIntervalRef.current
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // 检查当前页面类型并自动创建会话（如果不存在）
    let currentSessionId = sessionId

    if (pathname === AppRoute.Chat && !currentSessionId) {
      try {
        info('[useTyperLogic] Auto-creating chat session before sending message')
        const result = await createChatSession()
        if (result) {
          currentSessionId = result.id
          dispatchRTK(chatActions.setChatSessionId(result.id))
          // 等待状态更新完成
          await new Promise((resolve) => setTimeout(resolve, 200))
          // 发送自定义事件来触发菜单刷新
          const event = new CustomEvent('refreshMenuHistory', {
            detail: { category: 'chat' },
          })
          window.dispatchEvent(event)
        } else {
          antdMessage.error('创建聊天会话失败')
          return
        }
      } catch (error) {
        console.error('[useTyperLogic] Error auto-creating chat session:', error)
        antdMessage.error('创建聊天会话失败')
        return
      }
    } else if (pathname === AppRoute.Search && !currentSessionId) {
      try {
        info('[useTyperLogic] Auto-creating search session before sending message')
        const result = await createSearchSession()
        if (result) {
          currentSessionId = result.id
          dispatchRTK(chatActions.setSearchSessionId(result.id))

          // 等待状态更新完成
          await new Promise((resolve) => setTimeout(resolve, 200))
          // 发送自定义事件来触发菜单刷新
          const event = new CustomEvent('refreshMenuHistory', {
            detail: { category: 'search' },
          })
          window.dispatchEvent(event)
        } else {
          antdMessage.error('创建搜索会话失败')
          return
        }
      } catch (error) {
        console.error('[useTyperLogic] Error auto-creating search session:', error)
        antdMessage.error('创建搜索会话失败')
        return
      }
    }

    setIsUserScrolled(false)

    const messageToSend = inputValue
    setInputValue('')

    // 确保使用正确的sessionId发送请求
    if (currentSessionId) {
      info(`[useTyperLogic] Sending message with sessionId: ${currentSessionId}`)

      // 先更新Redux状态中的消息
      dispatchRTK(
        chatNewActions.sendMessage({
          sessionId: currentSessionId,
          message: messageToSend,
        }),
      )

      // 延迟滚动到底部，确保骨架屏渲染完成后再滚动
      // 使用更长的延迟确保骨架屏已经渲染到DOM中
      setTimeout(() => {
        scrollChatToBottom(50)
      }, 300)

      // 如果sessionId刚刚创建，设置为待发送消息，等待sessionId更新后再发送
      if (sessionId !== currentSessionId) {
        info('[useTyperLogic] SessionId just created, setting pending message')
        setPendingMessage(messageToSend)
      } else {
        // 如果sessionId已经存在，直接发送
        sendRequest(messageToSend)
      }
    } else {
      console.error('[useTyperLogic] No sessionId available for sending message')
      antdMessage.error('会话状态异常，请刷新页面重试')
    }
  }

  const handleButtonClick = async () => {
    if (isLoading) {
      try {
        await breakChat()
      } catch (error) {
        console.error('[Typer] 中断聊天失败:', error)
        antdMessage.error('中断聊天失败')
      }
      return
    }
    await handleSendMessage()
  }

  const handleComposition = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    e.stopPropagation()
    if (e.type === 'compositionstart') {
      setIsComposing(true)
    }

    if (e.type === 'compositionend') {
      skipEnter.current = true
      setTimeout(() => {
        skipEnter.current = false
      }, 10)
      setIsComposing(false)
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      if (e.shiftKey) {
        return
      } else {
        e.preventDefault()
        await handleSendMessage()
      }
    }
  }

  return {
    // State
    messages,
    inputValue,
    setInputValue,
    isButtonDisabled,
    setIsButtonDisabled,
    isUserScrolled,
    setIsUserScrolled,

    // Refs
    inputAreaRef,

    // Handlers
    handleSendMessage,
    handleButtonClick,
    handleComposition,
    handleKeyDown,

    // Other
    skipEnter,
  }
}
