export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const API_ENDPOINTS = {
  PING: '/ping',
} as const

export const SEARCH_EXAMPLE_KEYS = [
  'search.examples.qloraPapers',
  'search.examples.grpoAfter2024',
  'search.examples.acl2025BestPaper',
] as const
