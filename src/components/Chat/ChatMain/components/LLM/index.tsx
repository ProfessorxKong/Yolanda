import { useAppSelector } from '@/store/hooks'
import { chatNewSelectors } from '@/store/selectors'
import styles from './index.module.scss'
import {
  getLLMContent,
  getAgentOriginalMessage,
  hasErrorLLMAgent,
  isTaskEnd,
  getStreamContent,
  hasErrorAgentEnd,
} from '@/components/Chat/utils/chat'
import { isHumanRound, isStreamRound } from '@/components/Chat/utils'
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer'
import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import WarningIcon from '@/assets/svg/warning.svg?react'
import { JSX } from 'react'
interface LLMProps {
  type: string | '/search' | '/chat' | '/pdf'
}

const LLM = (props: LLMProps): JSX.Element => {
  const rounds = useAppSelector(chatNewSelectors.getAllRounds(props.type))
  const currentRound = useAppSelector(chatNewSelectors.getCurrentRound)
  const { t } = useTranslation()

  return (
    <>
      {rounds.map((item) => {
        if (isHumanRound(item)) {
          return (
            <div id={`${item.id}`} key={`${item.id}`} className={styles['human-container']}>
              <div className={styles['human']}>{item.humanMessage}</div>
            </div>
          )
        }
        return hasErrorAgentEnd(item)
          ? (() => {
              return (
                <div id={`${item.id}`} key={`${item.id}`} className={styles['llm-item']}>
                  {!isStreamRound(item) && (
                    <div className={styles['human-container']}>
                      <div className={styles['human']}>{getAgentOriginalMessage(item)}</div>
                    </div>
                  )}
                  <MarkdownRenderer content={getLLMContent(item)}></MarkdownRenderer>
                  {hasErrorLLMAgent(item) && (
                    <div className={styles['llm-error']}>
                      <WarningIcon />
                      <div>{t('chat.processWasForced')}</div>
                    </div>
                  )}
                </div>
              )
            })()
          : (() => {
              if (currentRound?.rootNode.runId === item.rootNode.runId && getStreamContent(item)) {
                return <MarkdownRenderer content={getStreamContent(item)}></MarkdownRenderer>
              }

              if (isTaskEnd(item)) {
                const originalMessage = getAgentOriginalMessage(item)
                return (
                  <div>
                    {!isStreamRound(item) && (
                      <>
                        <div className={styles['human-container']}>
                          <div className={styles['human']}>{originalMessage}</div>
                        </div>
                      </>
                    )}
                    <div className={styles['no-result']}>
                      <WarningIcon />
                      <div>{t('chat.taskNotResult')}</div>
                    </div>
                  </div>
                )
              }
              return <Skeleton active paragraph={{ rows: 2 }} />
            })()
      })}
    </>
  )
}

export default LLM
