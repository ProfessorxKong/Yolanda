import { useAppSelector } from '@/store/hooks'
import styles from './index.module.scss'
import { chatNewSelectors } from '@/store/selectors'
import {
  getSearchAgentOriginalMessage,
  getAllVerifierContents,
  getVerifierInfo,
  sortVerifierContents,
  hasErrorOrVerifierAgentEnd,
  hasErrorVerifierAgent,
} from '@/components/Chat/utils/search'
import { isHumanRound, isStreamRound } from '@/components/Chat/utils'
// import { openUrl } from '@tauri-apps/plugin-opener';
import { Skeleton } from 'antd'
import { useNavigate } from 'react-router-dom'
import { JSX } from 'react'
import MatchIcon from '@/assets/svg/match.svg?react'
import PartialIcon from '@/assets/svg/partial.svg?react'
import WarningIcon from '@/assets/svg/warning.svg?react'
import { useTranslation } from 'react-i18next'
import { isTaskEnd } from '@/components/Chat/utils/chat'

const Verifier = (): JSX.Element => {
  const { t } = useTranslation()
  const rounds = useAppSelector(chatNewSelectors.getSearchVerificationRounds())
  const currentRound = useAppSelector(chatNewSelectors.getCurrentRound)
  const navigate = useNavigate()

  const isTaskStart = useAppSelector(chatNewSelectors.getTaskStart)

  const handleTitleClick = (node: {
    reason?: string
    match?: string
    data?: any
    nodeId?: string | undefined
    end?: any
  }) => {
    const metadata = node?.data?.metadata
    if (metadata?.url) {
      // openUrl(metadata.url)
    } else if (metadata?.source_path) {
      navigate(
        `/pdf?sourcePath=${encodeURIComponent(metadata.source_path)}&docId=${metadata?.document_id}`,
      )
    }
  }

  return (
    <>
      {rounds.map((item, index) => {
        if (isHumanRound(item)) {
          return (
            <>
              <div className={styles['human-container']}>
                <div className={styles['human']}>{`${item.humanMessage} `}</div>
              </div>
            </>
          )
        }
        return hasErrorOrVerifierAgentEnd(item)
          ? (() => {
              const verifierContents = getAllVerifierContents(item)
              // 应用双因素排序
              const sortedVerifierContents = sortVerifierContents(verifierContents)

              const originalMessage = getSearchAgentOriginalMessage(item)
              return (
                <>
                  {!isStreamRound(item) && (
                    <>
                      <div className={styles['human-container']}>
                        <div className={styles['human']}>{originalMessage}</div>
                      </div>
                    </>
                  )}
                  {sortedVerifierContents.map((ct, verifierIndex) => {
                    const vInfo = getVerifierInfo(ct)
                    return (
                      <div
                        key={`${item.id || index}-${verifierIndex}`}
                        className={styles['verifier-item']}
                      >
                        <div className={styles['verifier-title']}>
                          <div onClick={() => handleTitleClick(ct)}>{ct.data?.action}</div>
                          <div
                            className={[
                              styles['verifier-status'], // 第一个固定类名
                              ct?.matches === 'yes'
                                ? styles['verifier-status-match']
                                : styles['verifier-status-partial'], // 第二个条件类名
                            ].join(' ')}
                          >
                            {ct?.matches == 'yes' ? <MatchIcon /> : <PartialIcon />}
                            <span>{ct?.matches}</span>
                          </div>
                        </div>
                        <div className={styles['verifier-info']}>
                          <span>{vInfo}</span>
                          {/* {ct.timestamp && (
                            <span className={styles['verifier-timestamp']}>
                              {formatTimestamp(ct.timestamp)}
                            </span>
                          )} */}
                        </div>
                        <div className={styles['verifier-content']}>
                          <div className={styles['verifier-reason']}>{ct?.reasoning}</div>
                        </div>
                      </div>
                    )
                  })}
                  {hasErrorVerifierAgent(item) && isTaskEnd(item) && (
                    <div className={styles['verifier-error']}>
                      <WarningIcon />
                      <div>{t('chat.processWasForced')}</div>
                    </div>
                  )}
                  {isTaskStart &&
                    !isTaskEnd(item) &&
                    currentRound?.rootNode.runId === item.rootNode.runId && (
                      <Skeleton active paragraph={{ rows: 3 }} />
                    )}
                </>
              )
            })()
          : (() => {
              if (
                isTaskStart &&
                !isTaskEnd(item) &&
                currentRound?.rootNode.runId === item.rootNode.runId
              ) {
                return <Skeleton active paragraph={{ rows: 3 }} />
              }

              if (isTaskEnd(item)) {
                const originalMessage = getSearchAgentOriginalMessage(item)
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

              return null
            })()
      })}
    </>
  )
}

export default Verifier
