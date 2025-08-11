import React from 'react'
import MainLayout from '@/layout/MainLayout'
import HomePage from '@/pages/home'
import styles from './App.module.scss'

const App: React.FC = () => {
  return (
    <div className={styles['App']}>
      <MainLayout>
        <HomePage />
      </MainLayout>
    </div>
  )
}
export default App
