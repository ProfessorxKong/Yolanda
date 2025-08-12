export interface MatchInfo {
  status: 'yes' | 'partial' | 'no';
  reason: string;
}

export interface CardDetails {
  title: string;
  url?: string;
  sourcePath?: string;
  authors?: string;
  abstract?: string;
  metadata?: any;
  actionType?: 'cardTitleClick' | 'externalLink';
}

export interface VerificationInfo {
  type: 'web' | 'academic' | 'knowledgeBase';
}

export interface ProcessedMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
  collapseMsg?: {
    planner?: string;
    extractor?: string;
  };
  // 新增结构化数据字段
  matchInfo?: MatchInfo;
  cardDetails?: CardDetails;
  hasMatchSuccess?: boolean; // 用于标识是否有匹配成功标记
  verificationInfo?: VerificationInfo;
}

export interface HandlerResult {
  shouldAddMessage: boolean;
  plannerContent?: string;
  extractorContent?: string;
  verificationInfo?: VerificationInfo;
}

export type ExtractorData = {
  metadata: any;
  action: string;
  content: string;
};
