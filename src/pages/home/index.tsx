import React from 'react'
import styles from './index.module.scss'
import Background from '@/assets/svg/background.svg?react'

const HomePage = (): React.ReactElement => {
  return (
    <div className={styles['home-page']}>
      <Background className={styles['background']} />
    </div>
  )
}

export default HomePage
