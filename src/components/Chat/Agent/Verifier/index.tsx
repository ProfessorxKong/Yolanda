import React from 'react'
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer'
import styles from './index.module.scss'
import { truncateText } from '@/utils/helpers'
import MatchIcon from '@/assets/svg/match.svg?react'
import PartialIcon from '@/assets/svg/partial.svg?react'
import FailIcon from '@/assets/svg/mismatch.svg?react'
import TruncateText from '@/components/TruncateText'
import { MessageContent } from '@/store/slices/chatNew'
interface VerifierProps {
  end?: MessageContent
}

const Verifier: React.FC<VerifierProps> = ({ end }) => {
  const content = end?.data?.content

  // 根据match值渲染相应的图标
  const renderMatchIcon = (match: string) => {
    switch (match?.toLowerCase()) {
      case 'yes':
        return <MatchIcon />
      case 'partial':
        return <PartialIcon />
      case 'no':
        return <FailIcon />
      default:
        return null
    }
  }

  try {
    const parsedContent = typeof content === 'string' ? JSON.parse(content || '{}') : content
    const match = parsedContent?.matches
    const reason = parsedContent?.reasoning

    return (
      <div>
        <div className={styles['action-title-area']}>
          <div className={styles['action-label']}>
            <TruncateText title={end?.data?.action || ''}>{end?.data?.action || ''}</TruncateText>
          </div>
          <div className={styles['action-match']}>{renderMatchIcon(match)}</div>
        </div>

        <div className={styles['action-reason']}>{truncateText(reason, 64)}</div>
      </div>
    )
  } catch (error) {
    // 解析失败，将使用原始内容
    return <MarkdownRenderer content={content || ''} />
  }
}

export default Verifier
