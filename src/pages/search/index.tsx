import React from 'react'
import styles from './index.module.scss'

const SearchPage: React.FC = () => {
  return (
    <div className={styles.searchPage}>
      <div className={styles.header}>
        <h1>Scholar Search</h1>
        <p>Search academic papers and scholarly content</p>
      </div>
      <div className={styles.content}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Enter your search query..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>Search</button>
        </div>
        {/* <div className={styles.results}> */}
        {/* Search results will be displayed here */}
      </div>
      {/* </div> */}
    </div>
  )
}

export default SearchPage
