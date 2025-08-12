import { useTyperLogic } from '@/components/Chat/hooks/useTyperLogic'
import { useAppSelector } from '@/store/hooks'
import { chatNewSelectors } from '@/store/selectors'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'
import { PauseOutlined, UpOutlined } from '@ant-design/icons'
// import { preventZeroWidthCharacters } from '@/utils'
import ChatMain from '@/components/Chat/ChatMain'
import ChatStep from '@/components/Chat/ChatStep'
import classNames from 'classnames'
import SearchIcon from '@/assets/svg/search-icon.svg?react'
import { AppRoute } from '@/router'
import { useLocation } from 'react-router-dom'
const Search = (): React.JSX.Element | null => {
  const { t } = useTranslation()
  const location = useLocation()
  const { pathname } = location
  const {
    inputValue,
    setInputValue,
    setIsButtonDisabled,
    inputAreaRef,
    handleButtonClick,
    handleComposition,
    handleKeyDown,
    skipEnter,
  } = useTyperLogic()

  const isTaskStart = useAppSelector(chatNewSelectors.getTaskStart)
  const round = useAppSelector(chatNewSelectors.getCurrentRound)

  // 如果页面类型不是 search，说明正在切换页面，直接返回 null 避免显示空状态
  if (pathname !== AppRoute.Search) {
    return null
  }

  // if (!round) {
  //   return (
  //     <div className={classNames(styles['chat-container'], styles['chat-container-empty'])}>
  //       <div className={styles['empty-chat-message']}>
  //         <SearchIcon />
  //         <span>{t('chat.enterTopics')}</span>
  //       </div>
  //       <div className={styles['input-container-centered']}>
  //         <div className={styles['input-wrapper']}>
  //           <Input.TextArea
  //             className={styles['input']}
  //             value={inputValue}
  //             onChange={(e) => {
  //               setInputValue(e.target.value)
  //               setIsButtonDisabled(!e.target.value.trim())
  //             }}
  //             placeholder={t('chat.typeMessage')}
  //             autoSize={{ minRows: 2, maxRows: 6 }}
  //             variant="borderless"
  //             onCompositionStart={handleComposition}
  //             onCompositionEnd={handleComposition}
  //             onCompositionUpdate={handleComposition}
  //             onPressEnter={async (e) => {
  //               if (skipEnter.current || isTaskStart) {
  //                 return
  //               }
  //               await handleKeyDown(e)
  //             }}
  //             // onBeforeInput={preventZeroWidthCharacters}
  //           />
  //         </div>
  //         <div className={classNames(styles['operation-container'])}>
  //           <Button
  //             type="primary"
  //             onClick={handleButtonClick}
  //             icon={isTaskStart ? <PauseOutlined /> : <UpOutlined />}
  //             className={classNames(styles['chat-send'], {
  //               [styles['stop-send-stop']]: isTaskStart,
  //             })}
  //             disabled={isTaskStart || !inputValue.trim()}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className={`${styles['chat-container']}`} ref={inputAreaRef}>
      <div className={styles['chat-wrapper']}>
        <div className={styles['input-container']}>
          <div className={styles['input-wrapper']}>
            <Input.TextArea
              className={styles['input']}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setIsButtonDisabled(!e.target.value.trim())
              }}
              placeholder={t('chat.typeMessage')}
              autoSize={{ minRows: 1, maxRows: 4 }}
              variant="borderless"
              onCompositionStart={handleComposition}
              onCompositionEnd={handleComposition}
              onCompositionUpdate={handleComposition}
              onPressEnter={async (e) => {
                if (skipEnter.current || isTaskStart) {
                  return
                }
                await handleKeyDown(e)
              }}
              // onBeforeInput={preventZeroWidthCharacters}
            />
            <Button
              type="primary"
              onClick={handleButtonClick}
              icon={isTaskStart ? <PauseOutlined /> : <UpOutlined />}
              className={classNames(styles['chat-send'], {
                [styles['stop-send-stop']]: isTaskStart,
              })}
              disabled={isTaskStart || !inputValue.trim()}
            />
          </div>
        </div>
        <ChatMain type={AppRoute.Search} className={classNames(styles['chat-main'])} />
      </div>
      <div className={styles['chat-step-wrapper']}>
        <ChatStep />
      </div>
    </div>
  )
}
export default Search
