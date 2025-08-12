import { API_BASE_URL, HTTP_PREFIX, SSE_PREFIX } from './config'

// Utility function to normalize URL paths by removing duplicate slashes
const normalizePath = (path: string): string => {
  // First, temporarily replace protocol slashes to preserve them
  return path.replace(/([^:]\/)\/+/g, '$1')
}

interface HttpRequestOptions {
  path: string
  method: string
  data?: Record<string, unknown> | FormData
  headers?: Record<string, string>
  responseType?: 'json' | 'blob' | 'stream'
}

interface SseRequestOptions extends Omit<HttpRequestOptions, 'responseType'> {
  // eslint-disable-next-line no-unused-vars
  onMessage?: (_message: string) => void
  // eslint-disable-next-line no-unused-vars
  onError?: (_error: Error) => void
  onEnd?: () => void
}

interface HttpResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Removed auth path checks; callers should handle auth/headers explicitly.

// Removed store-related logic. Authorization must be provided via headers by the caller when needed.

export class HttpClient {
  private static instance: HttpClient

  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient()
    }
    return HttpClient.instance
  }

  /**
   * Generic request method - using browser fetch
   */
  public async request<T>({
    path,
    method,
    data,
    headers: customHeaders = {},
  }: Omit<HttpRequestOptions, 'responseType'>): Promise<T> {
    const fullPath = normalizePath(`${HTTP_PREFIX}/${path}`)
    const headers: Record<string, string> = { ...customHeaders }

    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(normalizePath(`${API_BASE_URL}/${fullPath}`), {
      method,
      headers,
      ...(data && { body: data instanceof FormData ? data : JSON.stringify(data) }),
    })

    if (!response.ok) {
      throw new Error('请求失败')
    }

    const result: HttpResponse<T> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Request failed')
    }

    return result.data
  }

  /**
   * Local request method - using native fetch
   */
  public async requestLocal<T>({
    path,
    method,
    data,
    headers: customHeaders = {},
    responseType = 'json',
  }: HttpRequestOptions): Promise<T> {
    const fullPath = normalizePath(`${HTTP_PREFIX}/${path}`)
    const headers: Record<string, string> = { ...customHeaders }

    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(normalizePath(`${API_BASE_URL}/${fullPath}`), {
      method,
      headers,
      ...(data && {
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    })

    if (!response.ok) {
      throw new Error('请求失败')
    }

    if (responseType === 'blob') {
      return response.blob() as Promise<T>
    }

    const result: HttpResponse<T> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Request failed')
    }

    return result.data
  }

  /**
   * Server-Sent Events (SSE) streaming using fetch ReadableStream
   */
  public async requestSSE({
    path,
    method = 'POST',
    data,
    headers: customHeaders = {},
    onMessage,
    onError,
    onEnd,
  }: SseRequestOptions): Promise<void> {
    const fullPath = normalizePath(`${SSE_PREFIX}/${path}`)
    const headers: Record<string, string> = { ...customHeaders, Accept: 'text/event-stream' }

    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    try {
      const response = await fetch(normalizePath(`${API_BASE_URL}/${fullPath}`), {
        method,
        headers,
        ...(data && { body: data instanceof FormData ? data : JSON.stringify(data) }),
      })

      if (!response.ok || !response.body) {
        throw new Error('SSE 连接失败')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let partial = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        partial += chunk

        const lines = partial.split('\n')
        partial = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const message = line.slice(6)
            const trimmed = message.trim()
            if (!trimmed) continue
            if (trimmed === '[DONE]') {
              onEnd?.()
              return
            }
            onMessage?.(message)
          }
        }
      }

      // Flush remaining partial line if any (without [DONE])
      if (partial.startsWith('data: ')) {
        const message = partial.slice(6)
        const trimmed = message.trim()
        if (trimmed && trimmed !== '[DONE]') {
          onMessage?.(message)
        }
      }
    } catch (err) {
      console.error('SSE request error:', err)
      onError?.(err instanceof Error ? err : new Error('SSE connection error'))
    } finally {
      onEnd?.()
    }
  }

  // Convenience methods
  public get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ path, method: 'GET', headers })
  }

  public post<T>(
    path: string,
    data?: Record<string, unknown> | FormData,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>({ path, method: 'POST', data, headers })
  }

  public put<T>(
    path: string,
    data?: Record<string, unknown> | FormData,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>({ path, method: 'PUT', data, headers })
  }

  public delete<T>(
    path: string,
    data?: Record<string, unknown> | FormData,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>({ path, method: 'DELETE', data, headers })
  }

  public getLocal<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.requestLocal<T>({ path, method: 'GET', headers })
  }

  public postLocal<T>(
    path: string,
    data?: Record<string, unknown> | FormData,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.requestLocal<T>({ path, method: 'POST', data, headers })
  }

  /**
   * Convenient SSE method for streaming requests
   */
  public sse(
    path: string,
    data?: Record<string, unknown> | FormData,
    options?: {
      // eslint-disable-next-line no-unused-vars
      onMessage?: (_message: string) => void
      // eslint-disable-next-line no-unused-vars
      onError?: (_error: Error) => void
      onEnd?: () => void
      headers?: Record<string, string>
    },
  ): Promise<void> {
    return this.requestSSE({
      path,
      method: 'POST',
      data,
      headers: options?.headers,
      onMessage: options?.onMessage,
      onError: options?.onError,
      onEnd: options?.onEnd,
    })
  }
}

// Export singleton instance
export const httpClient = HttpClient.getInstance()
