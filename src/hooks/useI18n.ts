import { useTranslation } from 'react-i18next'

export const useI18n = () => {
  const { t, i18n } = useTranslation()

  const changeLanguage = (language: 'zh' | 'en') => {
    i18n.changeLanguage(language)
  }

  const getCurrentLanguage = () => {
    return i18n.language
  }

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
  }
}
