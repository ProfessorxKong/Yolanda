import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Background from '@/assets/svg/background.svg?react'
import SearchHeader from '@/components/Search/SearchHeader'
import SearchContainer from '@/components/Search/SearchContainer'
import SearchFooter from '@/components/Search/SearchFooter'
import styles from './index.module.scss'

const HomePage = (): React.ReactElement => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const isDisabled = useMemo(() => query.trim().length === 0, [query])

  const handleSearch = (): void => {
    if (isDisabled) return
    // eslint-disable-next-line no-console
    console.log('Search:', query)
  }

  return (
    <div className={styles['home-page']}>
      <Background className={styles['background']} />
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
    </div>
  )
}

export default HomePage
