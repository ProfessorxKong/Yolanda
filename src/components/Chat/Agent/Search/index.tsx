import React from 'react'
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer'
import { useCollapse } from '../../CollapseContent'
import { useI18n } from '@/hooks/useI18n'
import styles from './index.module.scss'
import PDFIcon from '@/assets/svg/pdf.svg?react'
import { MessageContent } from '@/store/slices/chatNew'

interface SearchAgentProps {
  end?: MessageContent
}

const SearchAgent: React.FC<SearchAgentProps> = ({ end }) => {
  const { t } = useI18n()
  const content = end?.data?.content
  let searchResults: string[] = []
  let hasValidContent = false

  try {
    const parsedContent = typeof content == 'string' ? JSON.parse(content || '{}') : content
    const results = parsedContent?.search_kb?.map((item: any) => item.document_detail?.title)

    if (results && Array.isArray(results)) {
      searchResults = results
      hasValidContent = true
    }
  } catch (error) {
    // 解析失败，将使用原始内容
  }

  // Hook 必须在组件顶层调用
  const {
    isEmpty,
    displayTitles,
    shouldShowCollapseButton,
    isExpanded,
    toggleExpanded,
    // remainingCount,
  } = useCollapse(searchResults)

  // 如果没有有效内容，使用原始内容渲染
  if (!hasValidContent) {
    return <MarkdownRenderer content={content} />
  }

  // 如果搜索结果为空
  if (isEmpty) {
    return <MarkdownRenderer content={searchResults} />
  }

  // 渲染折叠内容
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {displayTitles.map((title, index) => (
          <div key={index} className={styles.titleItem}>
            <PDFIcon className={styles.pdfIcon} />
            {title}
          </div>
        ))}
      </div>

      {shouldShowCollapseButton && (
        <div className={styles.toggleButton} onClick={toggleExpanded}>
          {isExpanded ? t('common.collapse') : t('common.expand')}
        </div>
      )}
    </div>
  )
}

export default SearchAgent
