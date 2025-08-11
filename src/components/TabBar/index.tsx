import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import WislandLogo from '@/assets/svg/wisland.svg?react'
import UserIcon from '@/assets/svg/user.svg?react'
import styles from './index.module.scss'

const TabBar: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const tabItems = [
    { key: 'search', path: '/search', label: t('tabBar.scholarSearch') },
    { key: 'write', path: '/write', label: t('tabBar.writing') },
    { key: 'tool', path: '/tool', label: t('tabBar.tools') },
    { key: 'price', path: '/price', label: t('tabBar.pricing') },
    { key: 'discover', path: '/discover', label: t('tabBar.discover') },
  ]

  return (
    <div className={styles['tab-bar-container']}>
      <div className={styles['tab-bar']}>
        {/* 左侧 Logo */}
        <Link to="/home" className={styles['logo']}>
          <WislandLogo />
        </Link>

        {/* 中间 Tab 导航 */}
        <nav className={styles['navigation']}>
          {tabItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`${styles['tab-item']} ${location.pathname === item.path ? styles['active'] : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右侧用户图标 */}
        <Link to="/user" className={styles['user-icon']}>
          <UserIcon />
        </Link>
      </div>
    </div>
  )
}

export default TabBar
