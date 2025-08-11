import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'

interface LanguageOption {
  code: string
  label: string
  flag: string
}

const LanguageFab: React.FC = () => {
  const { i18n, t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const fabRef = useRef<HTMLDivElement>(null)

  const languages: LanguageOption[] = [
    { code: 'en', label: t('language.english'), flag: '🇺🇸' },
    { code: 'zh', label: t('language.chinese'), flag: '🇨🇳' },
  ]

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // 点击外部区域关闭悬浮球
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  return (
    <div ref={fabRef} className={styles['language-fab']}>
      {/* 展开的语言选项 */}
      <div className={`${styles['language-options']} ${isExpanded ? styles['expanded'] : ''}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`${styles['language-option']} ${lang.code === i18n.language ? styles['active'] : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className={styles['flag']}>{lang.flag}</span>
            <span className={styles['label']}>{lang.label}</span>
          </button>
        ))}
      </div>

      {/* 主悬浮按钮 */}
      <button
        className={`${styles['fab-button']} ${isExpanded ? styles['expanded'] : ''}`}
        onClick={toggleExpanded}
        aria-label={t('language.switchLanguage')}
      >
        <span className={styles['current-flag']}>{currentLanguage.flag}</span>
        <span className={styles['expand-icon']}>{isExpanded ? '×' : '+'}</span>
      </button>
    </div>
  )
}

export default LanguageFab
