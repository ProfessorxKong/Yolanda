import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SEARCH_EXAMPLE_KEYS } from '@/constants'
import SearchContainer from '@/components/SearchContainer'
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
      <div className={styles['header']}>
        <h1>{t('search.title')}</h1>
        <p>{t('search.subtitle')}</p>
      </div>
      <div className={styles['content']}>
        <div className={styles['search-row']}>
          <SearchContainer
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder={t('search.placeholder')}
          />
        </div>
        {/* <div className={styles.results}> */}
        {/* Search results will be displayed here */}
      </div>
      {/* </div> */}
      <div className={styles['footer']}>
        {/* <p>© 2025 Scholar Search. All rights reserved.</p> */}
        <div className={styles['footer-header']}>
          <p>{t('search.tryExamples')}</p>
        </div>
        <div className={styles['footer-content']}>
          <div className={styles['footer-content-items']}>
            {SEARCH_EXAMPLE_KEYS.map((key) => (
              <div key={key} className={styles['footer-content-item']}>
                <p>{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
