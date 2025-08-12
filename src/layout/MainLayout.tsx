import React from 'react'
import { Outlet } from 'react-router-dom'
import TabBar from '@/components/TabBar'
import styles from './MainLayout.module.scss'
import LanguageFab from '@/components/LanguageFab'

interface MainLayoutProps {
  backgroundColor?: string
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <div className={styles['main-layout']}>
      <div className={styles['main-layout-content']}>
        <TabBar />
        <Outlet />
      </div>
      <LanguageFab />
    </div>
  )
}
