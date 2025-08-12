export interface MarkdownRendererProps {
  content: string | any
  className?: string
  id?: string
}

export interface ReferenceAnnotation {
  id: number
  chunk_id?: string | number
  url?: string
  source_path?: string
  doc_id?: string | number
}

export interface CardMetadata {
  source_path?: string
  id?: string
  document_id?: string
}

export interface QuestionData {
  before: string
  marker: string
  after: string
}

export interface ChunkInfo {
  id: string
  // 添加其他 chunk 相关字段根据实际数据结构
  [key: string]: any
}

export interface ReferenceIconClickEvent {
  referenceId: number
  annotation: ReferenceAnnotation
}

export interface CardTitleClickEvent {
  metadata: CardMetadata
}

// Added local copies for reference-related types used by GlobalEventHandler
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
