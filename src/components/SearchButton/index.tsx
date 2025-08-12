import React from 'react'
import SendIcon from '@/assets/svg/send.svg?react'
import NoSendIcon from '@/assets/svg/nosend.svg?react'
import styles from './index.module.scss'

export type SearchButtonProps = {
  disabled?: boolean
  onClick?: () => void
  className?: string
}

const SearchButton: React.FC<SearchButtonProps> = ({ disabled = false, onClick, className }) => {
  const handleClick = () => {
    if (disabled) return
    onClick?.()
  }

  return (
    <div
      className={`${styles.button} ${disabled ? styles.nosend : styles.send} ${className ?? ''}`}
      onClick={handleClick}
      role="button"
      aria-disabled={disabled}
    >
      {disabled ? <NoSendIcon /> : <SendIcon />}
    </div>
  )
}

export default SearchButton
