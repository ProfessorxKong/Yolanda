import React from 'react'
import { useTranslation } from 'react-i18next'
import { SEARCH_EXAMPLE_KEYS } from '@/constants'
import styles from './index.module.scss'

const SearchPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className={styles['search-page']}>
      <div className={styles['header']}>
        <h1>{t('search.title')}</h1>
        <p>{t('search.subtitle')}</p>
      </div>
      <div className={styles['content']}>
        <div className={styles['search-container']}>
          <input
            type="text"
            placeholder="Enter your search query..."
            className={styles['search-input']}
          />
          <button className={styles['search-button']}>Search</button>
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
