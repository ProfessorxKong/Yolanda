import React from 'react'
import { useTranslation } from 'react-i18next'
import { SEARCH_EXAMPLE_KEYS } from '@/constants'
import styles from './index.module.scss'

const SearchFooter: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className={styles.footer}>
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
  )
}

export default SearchFooter
