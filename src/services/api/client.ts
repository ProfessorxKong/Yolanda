import { API_BASE_URL } from '@/constants'

export async function apiClient(path: string, init?: RequestInit) {
  const url = `${API_BASE_URL}${path}`
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response
}
