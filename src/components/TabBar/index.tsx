import React from 'react'
import { useTranslation } from 'react-i18next'
import WislandLogo from '@/assets/svg/wisland.svg?react'
import UserIcon from '@/assets/svg/user.svg?react'
import styles from './index.module.scss'

const TabBar: React.FC = () => {
  const { t } = useTranslation()

  const tabItems = [
    { key: 'scholarSearch', label: t('tabBar.scholarSearch') },
    { key: 'writing', label: t('tabBar.writing') },
    { key: 'tools', label: t('tabBar.tools') },
    { key: 'pricing', label: t('tabBar.pricing') },
    { key: 'discover', label: t('tabBar.discover') },
  ]

  return (
    <div className={styles['tab-bar-container']}>
      <div className={styles['tab-bar']}>
        {/* 左侧 Logo */}
        <div className={styles['logo']}>
          <WislandLogo />
        </div>

        {/* 中间 Tab 导航 */}
        <nav className={styles['navigation']}>
          {tabItems.map((item) => (
            <button key={item.key} className={styles['tab-item']}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* 右侧用户图标 */}
        <div className={styles['user-icon']}>
          <UserIcon />
        </div>
      </div>
    </div>
  )
}

export default TabBar
