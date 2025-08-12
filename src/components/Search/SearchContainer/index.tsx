import React, { useMemo } from 'react'
import SearchButton from '@/components/Search/SearchButton'
import styles from './index.module.scss'

export type SearchContainerProps = {
  value: string
  onChange: (newValue: string) => void
  onSearch?: () => void
  placeholder?: string
  className?: string
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  value,
  onChange,
  onSearch,
  placeholder,
  className,
}) => {
  const isDisabled = useMemo(() => value.trim().length === 0, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isDisabled) {
      onSearch?.()
    }
  }

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <SearchButton disabled={isDisabled} onClick={onSearch} />
    </div>
  )
}

export default SearchContainer
