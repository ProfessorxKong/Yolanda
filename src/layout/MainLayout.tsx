import React from 'react'
import { Outlet } from 'react-router-dom'
import TabBar from '@/components/TabBar'
import LanguageFab from '@/components/LanguageFab'
import styles from './MainLayout.module.scss'

const MainLayout: React.FC = () => {
  return (
    <div className={styles.mainLayout}>
      <header>
        <TabBar />
      </header>
      <main>
        <Outlet />
      </main>
      <LanguageFab />
    </div>
  )
}

export default MainLayout
