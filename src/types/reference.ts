// Reference and citation related types for GlobalEventHandler

export interface CitationContent {
  contents: SearchItem[]
  metadata: {
    search_kb?: boolean
    search_web?: boolean
    search_scholar?: boolean
  }
}

export interface SearchItem {
  id?: number
  chunk_id?: string | number
  url?: string
  document_detail?: {
    id?: string | number
    source_path?: string
  }
  search_kb?: SearchItem[]
}

export interface ProcessedAnnotation {
  id: number
  chunk_id?: string | number
  url?: string
  source_path?: string
  doc_id?: string | number
}

export type ReferenceType = 'kb' | 'web' | 'scholar'
