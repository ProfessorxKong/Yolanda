import React from 'react'
import styles from './index.module.scss'

const ToolPage: React.FC = () => {
  return (
    <div className={styles.toolPage}>
      <div className={styles.header}>
        <h1>Tools</h1>
        <p>Academic research and productivity tools</p>
      </div>
      <div className={styles.content}>
        <div className={styles.toolGrid}>
          <div className={styles.toolCard}>
            <div className={styles.toolIcon}>📊</div>
            <h3>Data Analysis</h3>
            <p>Analyze research data with AI assistance</p>
            <button className={styles.toolButton}>Open Tool</button>
          </div>
          <div className={styles.toolCard}>
            <div className={styles.toolIcon}>📚</div>
            <h3>Reference Manager</h3>
            <p>Organize and format citations</p>
            <button className={styles.toolButton}>Open Tool</button>
          </div>
          <div className={styles.toolCard}>
            <div className={styles.toolIcon}>🔍</div>
            <h3>Literature Review</h3>
            <p>AI-powered literature analysis</p>
            <button className={styles.toolButton}>Open Tool</button>
          </div>
          <div className={styles.toolCard}>
            <div className={styles.toolIcon}>✍️</div>
            <h3>Grammar Checker</h3>
            <p>Academic writing enhancement</p>
            <button className={styles.toolButton}>Open Tool</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolPage
