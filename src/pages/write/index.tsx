import React from 'react'
import styles from './index.module.scss'

const WritePage: React.FC = () => {
  return (
    <div className={styles.writePage}>
      <div className={styles.header}>
        <h1>Writing</h1>
        <p>AI-powered writing assistance for academic content</p>
      </div>
      <div className={styles.content}>
        <div className={styles.editorContainer}>
          <div className={styles.toolbar}>
            <button className={styles.toolButton}>Bold</button>
            <button className={styles.toolButton}>Italic</button>
            <button className={styles.toolButton}>Underline</button>
            <button className={styles.toolButton}>Citation</button>
          </div>
          <textarea
            className={styles.editor}
            placeholder="Start writing your academic content here..."
            rows={15}
          />
        </div>
        {/* <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3>AI Assistant</h3>
            <p>Get writing suggestions and improvements</p>
            <button className={styles.aiButton}>Get AI Help</button>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default WritePage
