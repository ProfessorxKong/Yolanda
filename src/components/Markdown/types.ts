export interface MarkdownRendererProps {
  content: string | any;
  className?: string;
  id?: string;
}

export interface ReferenceAnnotation {
  id: number;
  chunk_id?: string | number;
  url?: string;
  source_path?: string;
  doc_id?: string | number;
}

export interface CardMetadata {
  source_path?: string;
  id?: string;
  document_id?: string;
}

export interface QuestionData {
  before: string;
  marker: string;
  after: string;
}

export interface ChunkInfo {
  id: string;
  // 添加其他 chunk 相关字段根据实际数据结构
  [key: string]: any;
}

export interface ReferenceIconClickEvent {
  referenceId: number;
  annotation: ReferenceAnnotation;
}

export interface CardTitleClickEvent {
  metadata: CardMetadata;
}
