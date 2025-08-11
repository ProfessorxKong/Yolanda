import React from 'react'
import styles from './index.module.scss'

const UserPage: React.FC = () => {
  return (
    <div className={styles.userPage}>
      <div className={styles.header}>
        <h1>User Profile</h1>
        <p>Manage your account and preferences</p>
      </div>
      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            <div className={styles.avatarPlaceholder}>👤</div>
          </div>
          <div className={styles.userInfo}>
            <h2>John Doe</h2>
            <p>john.doe@example.com</p>
            <span className={styles.userType}>Pro Member</span>
          </div>
        </div>

        <div className={styles.settingsGrid}>
          <div className={styles.settingCard}>
            <h3>Account Settings</h3>
            <ul>
              <li>Personal Information</li>
              <li>Password & Security</li>
              <li>Email Preferences</li>
            </ul>
          </div>

          <div className={styles.settingCard}>
            <h3>Research Preferences</h3>
            <ul>
              <li>Default Search Filters</li>
              <li>Favorite Journals</li>
              <li>Research Areas</li>
            </ul>
          </div>

          <div className={styles.settingCard}>
            <h3>Subscription</h3>
            <ul>
              <li>Current Plan: Pro</li>
              <li>Billing Information</li>
              <li>Usage Statistics</li>
            </ul>
          </div>

          <div className={styles.settingCard}>
            <h3>Privacy & Data</h3>
            <ul>
              <li>Data Export</li>
              <li>Privacy Settings</li>
              <li>Delete Account</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage
