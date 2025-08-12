export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random()
    .toString(36)
    .substr(2, 9)}`
}

/**
 * Truncate text to specified length, add ellipsis if exceeds the limit
 * @param text Text to truncate
 * @param maxLength Maximum length, defaults to 100
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

/**
 * 根据验证类型生成验证标题
 * @param type 验证类型
 * @returns 验证标题字符串
 */
export const getVerificationTitle = (type: string): string => {
  switch (type) {
    case 'web':
      return '验证网络搜索结果'
    case 'academic':
      return '验证学术搜索结果'
    case 'knowledgeBase':
      return '验证知识库搜索结果'
    default:
      return '验证搜索结果'
  }
}

/**
 * 防抖函数 - 性能优化工具
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数 - 性能优化工具
 * @param fn 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

/**
 * 深度克隆对象 - 避免引用问题
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  return obj
}

/**
 * 批量处理数组 - 避免大量数据一次性处理导致的性能问题
 * @param array 要处理的数组
 * @param batchSize 批处理大小
 * @param processor 处理函数
 * @returns Promise
 */
export const batchProcess = async <T, R>(
  array: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>,
): Promise<R[]> => {
  const results: R[] = []

  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize)
    const batchResults = await processor(batch)
    results.push(...batchResults)

    // 让出主线程，避免阻塞 UI
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return results
}

/**
 * 内存优化的字符串处理 - 避免创建大量临时字符串
 * @param text 原始文本
 * @param maxSize 最大内存使用量（字符数）
 * @returns 处理后的文本
 */
export const memoryOptimizedStringProcess = (text: string, maxSize: number = 50000): string => {
  if (text.length <= maxSize) return text

  // 对于超大字符串，进行分块处理
  const chunks = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + maxSize, text.length)
    chunks.push(text.slice(start, end))
    start = end
  }

  // 返回截断的内容加上统计信息
  return chunks[0] + (chunks.length > 1 ? `...[还有 ${chunks.length - 1} 个片段]` : '')
}

/**
 * 清理对象中的空值和大对象 - 减少内存占用
 * @param obj 要清理的对象
 * @param maxStringLength 最大字符串长度
 * @returns 清理后的对象
 */
export const cleanObject = (obj: any, maxStringLength: number = 1000): any => {
  if (obj === null || obj === undefined) return obj

  if (typeof obj === 'string') {
    return obj.length > maxStringLength ? obj.slice(0, maxStringLength) + '...' : obj
  }

  if (Array.isArray(obj)) {
    return obj.length > 100
      ? `[Array: ${obj.length} items]`
      : obj.map((item) => cleanObject(item, maxStringLength))
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    if (keys.length > 50) {
      return `[Object: ${keys.length} properties]`
    }

    const cleaned: any = {}
    for (const key of keys) {
      const value = obj[key]
      if (value !== null && value !== undefined) {
        cleaned[key] = cleanObject(value, maxStringLength)
      }
    }
    return cleaned
  }

  return obj
}

/**
 * 创建一个简单的 LRU 缓存 - 避免内存泄漏
 */
export class LRUCache<K, V> {
  private capacity: number
  private cache: Map<K, V>

  constructor(capacity: number = 100) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!
      // 重新插入以更新访问顺序
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return undefined
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 删除最旧的项
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}
