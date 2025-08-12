/**
 * HTML 解析相关工具函数
 */

import { truncateText } from './helpers'

/**
 * 解析 HTML 文本，移除脚本和元标签，返回纯文本内容
 * @param text - 要解析的 HTML 字符串
 * @returns 解析后的纯文本内容
 */
export const htmlParser = (text?: string): string | undefined => {
  const parser = new DOMParser()
  try {
    if (typeof text === 'string') {
      const doc = parser.parseFromString(text, 'text/html')
      const scripts = doc.querySelectorAll('script')
      scripts.forEach((script) => script.remove())

      const titles = doc.querySelectorAll('title')
      titles.forEach((title) => title.remove())

      const metas = doc.querySelectorAll('meta')
      metas.forEach((meta) => meta.remove())

      const styles = doc.querySelectorAll('style')
      styles.forEach((style) => style.remove())

      const body = doc.querySelector('body')
      if (body) {
        const textContent = body.textContent || body.innerText || ''

        return truncateText(
          textContent
            .replace(/\s+/g, ' ') // 将多个空白字符替换为单个空格
            .trim(),
          50,
        )
      }
    }
  } catch (error) {
    console.error('Error parsing HTML:', error)
  }
  return text
}
