import { httpClient } from '../client'
import { SearchResult, SearchRequest } from '../models/search'

export const searchService = {
  search: (query: string, docId?: string): Promise<SearchResult[]> =>
    httpClient.post<SearchResult[]>('/search', { query, docId }),

  semanticSearch: (query: string, docId?: string): Promise<SearchResult[]> =>
    httpClient.post<SearchResult[]>('/search/semantic', { query, docId }),

  advancedSearch: (searchRequest: SearchRequest): Promise<SearchResult[]> =>
    httpClient.post<SearchResult[]>(
      '/search/advanced',
      searchRequest as unknown as Record<string, unknown>,
    ),
}
