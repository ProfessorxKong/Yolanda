import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchHeader from '@/components/Search/SearchHeader'
import SearchContainer from '@/components/Search/SearchContainer'
import SearchFooter from '@/components/Search/SearchFooter'
import styles from './index.module.scss'

const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const isDisabled = useMemo(() => query.trim().length === 0, [query])

  const handleSearch = () => {
    if (isDisabled) return
    // TODO: integrate actual search
    // eslint-disable-next-line no-console
    console.log('Search:', query)
  }
  return (
    <div className={styles['search-page']}>
      <SearchHeader />
      <div className={styles['content']}>
        <div className={styles['search-row']}>
          <SearchContainer
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder={t('search.placeholder')}
          />
        </div>
      </div>
      <SearchFooter />
    </div>
  )
}

export default SearchPage
