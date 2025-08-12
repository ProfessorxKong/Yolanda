import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'

const SearchHeader: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className={styles.header}>
      <div className={styles['header-title']}>
        <p>{t('search.title')}</p>
      </div>
      <div className={styles['header-subtitle']}>
        <p>{t('search.subtitle')}</p>
      </div>
    </div>
  )
}

export default SearchHeader
