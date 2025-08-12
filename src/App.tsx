import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { routes, AppRoutes } from '@/router'
import styles from './App.module.scss'

const App: React.FC = () => {
  return (
    <div className={styles['App']}>
      <BrowserRouter>
        <AppRoutes routes={routes} />
      </BrowserRouter>
    </div>
  )
}
export default App
