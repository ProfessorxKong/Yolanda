import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/router/AppRoutes'
import styles from './App.module.scss'

const App: React.FC = () => {
  return (
    <div className={styles['App']}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
}
export default App
