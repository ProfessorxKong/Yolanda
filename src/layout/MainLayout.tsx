import React from 'react'
import TabBar from '@/components/TabBar'
import LanguageFab from '@/components/LanguageFab'
import styles from './MainLayout.module.scss'

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.mainLayout}>
      <header>
        <TabBar />
      </header>
      <main>{children}</main>
      <LanguageFab />
    </div>
  )
}

export default MainLayout
