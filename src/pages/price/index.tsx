import React from 'react'
import styles from './index.module.scss'

const PricePage: React.FC = () => {
  return (
    <div className={styles.pricePage}>
      <div className={styles.header}>
        <h1>Pricing</h1>
        <p>Choose the perfect plan for your academic research needs</p>
      </div>
      <div className={styles.content}>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <div className={styles.planName}>Free</div>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>0</span>
              <span className={styles.period}>/month</span>
            </div>
            <ul className={styles.features}>
              <li>✓ 10 searches per month</li>
              <li>✓ Basic writing assistance</li>
              <li>✓ 2 AI tools access</li>
              <li>✓ Community support</li>
            </ul>
            <button className={styles.planButton}>Get Started</button>
          </div>

          <div className={`${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.badge}>Most Popular</div>
            <div className={styles.planName}>Pro</div>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>19</span>
              <span className={styles.period}>/month</span>
            </div>
            <ul className={styles.features}>
              <li>✓ Unlimited searches</li>
              <li>✓ Advanced AI writing</li>
              <li>✓ All tools access</li>
              <li>✓ Priority support</li>
              <li>✓ Export capabilities</li>
            </ul>
            <button className={styles.planButton}>Choose Pro</button>
          </div>

          <div className={styles.pricingCard}>
            <div className={styles.planName}>Enterprise</div>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>99</span>
              <span className={styles.period}>/month</span>
            </div>
            <ul className={styles.features}>
              <li>✓ Everything in Pro</li>
              <li>✓ Team collaboration</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support</li>
              <li>✓ Advanced analytics</li>
            </ul>
            <button className={styles.planButton}>Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricePage
