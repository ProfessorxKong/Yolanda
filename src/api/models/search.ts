export interface SearchResult {
  id: string
  title: string
  snippet: string
  score: number
}

export interface SearchRequest {
  query: string
  docId?: string
}
