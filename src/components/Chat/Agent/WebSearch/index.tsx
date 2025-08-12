import React from 'react'
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer'
import { useCollapse } from '../../CollapseContent'
import { extractJsonFromMarkdown } from '@/utils/json'
import { useI18n } from '@/hooks/useI18n'
import { htmlParser } from '@/utils/html'
// import UpIcon from '@/assets/svg/up.svg?react';
// import DownIcon from '@/assets/svg/down.svg?react';
import styles from './index.module.scss'

interface WebSearchProps {
  end?: {
    name?: string
    data?: {
      content?: string
    }
  }
}

const WebSearch: React.FC<WebSearchProps> = ({ end }) => {
  const { t } = useI18n()

  const content = end?.data?.content
  let titles: string[] = []
  let hasValidContent = false
  let isJsonMarkdown = false

  if (!content) {
    // 内容为空的情况，但仍需调用 hook
  } else if (typeof content === 'string' && content.startsWith('```json')) {
    isJsonMarkdown = true
  } else {
    // 否则解析JSON并映射title
    try {
      const parsedContent = typeof content == 'string' ? JSON.parse(content) : content
      const results = parsedContent?.map((item: any) =>
        item.title !== '' ? item.title : htmlParser(item.text)?.replace(/^\n+/, ''),
      )

      if (results && Array.isArray(results)) {
        titles = results
        hasValidContent = true
      }
    } catch (error) {
      // 解析失败，将使用原始内容
    }
  }

  // Hook 必须在组件顶层调用
  const {
    isEmpty,
    displayTitles,
    shouldShowCollapseButton,
    isExpanded,
    toggleExpanded,
    // remainingCount,
  } = useCollapse(titles)

  // 处理各种情况的渲染
  if (!content) {
    return null
  }

  if (isJsonMarkdown) {
    return <div className={styles['json-content']}>{extractJsonFromMarkdown(content)}</div>
  }

  // 如果没有有效内容，使用原始内容渲染
  if (!hasValidContent) {
    console.log('###############content', content)
    return <MarkdownRenderer content={content} />
  }

  // 如果titles为空
  if (isEmpty) {
    return <MarkdownRenderer content={titles} />
  }

  // 渲染折叠内容
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {displayTitles.map((title, index) => (
          <div key={index} className={styles.titleItem}>
            {title}
          </div>
        ))}
      </div>
      {shouldShowCollapseButton && (
        <div className={styles.toggleButton} onClick={toggleExpanded}>
          {isExpanded ? (
            <>
              {t('common.collapse')}
              {/* <UpIcon /> */}
            </>
          ) : (
            <>
              {t('common.expand')}
              {/* <DownIcon /> */}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default WebSearch
