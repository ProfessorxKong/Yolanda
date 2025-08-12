import React from 'react'
import ReactMarkdown from 'react-markdown'
import type { Pluggable } from 'unified'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeReferenceIcons } from './plugins/rehypeReferenceIcons'
// import { createMarkdownComponents } from './config/markdownComponents'
import { useCardClickHandler } from './hooks/useCardClickHandler'
// import { parseTagsToText } from '@/constants/MessageTags';
import type { MarkdownRendererProps } from './types'
import styles from './MarkdownRenderer.module.scss'
import rehypeRaw from 'rehype-raw'

// Import required styles
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'
import { useTranslation } from 'react-i18next'
// import { useLocation } from 'react-router-dom'
// import { AppRoute } from '@/router'

const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ content, id }) => {
  const { t } = useTranslation()
  // const location = useLocation()

  // Determine if we're in chat page for conditional logic
  // const isChatPage = location.pathname === AppRoute.Chat;

  // Use extracted event handlers (reference click handler is now in GlobalEventHandler)
  useCardClickHandler()

  // Parse tags to text before rendering
  const parsedContent = React.useMemo(() => {
    // console.log('=======++++===== content:', content);

    // console.log('=====++++===== content:', typeof content);

    return typeof content === 'object' ? JSON.stringify(content) : content
  }, [content])

  // Create markdown components configuration
  // const components = React.useMemo(() => createMarkdownComponents({ isChatPage }), [isChatPage])

  // Plugin configurations
  const remarkPlugins: Pluggable[] = React.useMemo(
    () => [
      [
        remarkMath,
        {
          singleDollar: true,
          doubleDollar: true,
        },
      ],
      remarkGfm,
    ],
    [],
  )

  const rehypePlugins: any[] = React.useMemo(
    () => [
      rehypeRaw,
      rehypeReferenceIcons,
      [
        rehypeKatex,
        {
          strict: false,
          throwOnError: false,
          displayMode: false,
          output: 'html',
        },
      ],
      rehypeHighlight,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
    [],
  )

  return (
    <div className={styles['markdown-container']} id={`${id}`}>
      {parsedContent === '[]' && <div>{t('common.noData')}</div>}
      {parsedContent !== '[]' && (
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          // components={components}
        >
          {parsedContent}
        </ReactMarkdown>
      )}
    </div>
  )
})

export default MarkdownRenderer
