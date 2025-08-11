import React from 'react'
import styles from './index.module.scss'

const DiscoverPage: React.FC = () => {
  return (
    <div className={styles.discoverPage}>
      <div className={styles.header}>
        <h1>Discover</h1>
        <p>Explore trending research and academic insights</p>
      </div>
      <div className={styles.content}>
        <div className={styles.categories}>
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>🔬</div>
            <h3>Science & Technology</h3>
            <p>Latest breakthroughs in STEM fields</p>
            <span className={styles.paperCount}>2,341 papers</span>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>💼</div>
            <h3>Business & Economics</h3>
            <p>Market trends and economic analysis</p>
            <span className={styles.paperCount}>1,892 papers</span>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>🧠</div>
            <h3>Psychology & Social Science</h3>
            <p>Human behavior and social studies</p>
            <span className={styles.paperCount}>1,567 papers</span>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>⚕️</div>
            <h3>Medicine & Health</h3>
            <p>Medical research and healthcare</p>
            <span className={styles.paperCount}>3,456 papers</span>
          </div>
        </div>

        <div className={styles.trending}>
          <h2>Trending Research</h2>
          <div className={styles.trendingList}>
            <div className={styles.trendingItem}>
              <div className={styles.trendingBadge}>🔥 Hot</div>
              <h4>AI in Healthcare: Recent Advances</h4>
              <p>
                Comprehensive review of artificial intelligence applications in medical diagnosis
                and treatment
              </p>
              <div className={styles.trendingMeta}>
                <span>123 citations</span>
                <span>•</span>
                <span>Published 2 days ago</span>
              </div>
            </div>
            <div className={styles.trendingItem}>
              <div className={styles.trendingBadge}>📈 Rising</div>
              <h4>Quantum Computing Breakthroughs</h4>
              <p>
                Latest developments in quantum computing algorithms and hardware implementations
              </p>
              <div className={styles.trendingMeta}>
                <span>89 citations</span>
                <span>•</span>
                <span>Published 1 week ago</span>
              </div>
            </div>
            <div className={styles.trendingItem}>
              <div className={styles.trendingBadge}>⭐ Featured</div>
              <h4>Climate Change Mitigation Strategies</h4>
              <p>Novel approaches to carbon reduction and sustainable development practices</p>
              <div className={styles.trendingMeta}>
                <span>256 citations</span>
                <span>•</span>
                <span>Published 3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoverPage
