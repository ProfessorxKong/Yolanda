import { ConversationRound, TreeNode } from '@/store/slices/chatNew';

// 检查是否包含 llm_agent 的 end 数据
export const hasLLMAgentEnd = (round: ConversationRound): boolean => {
  const checkNode = (node: TreeNode): boolean => {
    if (
      node.end &&
      (node.end.name === 'llm_agent' ||
        node.end.name === 'general_qa_agent' ||
        node.end.name === 'summary_planner')
    ) {
      return true;
    }

    if (node.children && node.children.length > 0) {
      return node.children.some((child: TreeNode) => checkNode(child));
    }

    return false;
  };

  return checkNode(round.rootNode);
};

export const hasErrorAgentEnd = (round: ConversationRound): boolean => {
  const checkNode = (node: TreeNode): boolean => {
    if (node.error) {
      return true;
    }

    if (
      (node.end &&
        (node.end.name === 'llm_agent' ||
          node.end.name === 'general_qa_agent' ||
          node.end.name === 'summary_agent')) ||
      node.error
    ) {
      return true;
    }

    if (node.children && node.children.length > 0) {
      return node.children.some((child: TreeNode) => checkNode(child));
    }

    return false;
  };

  return checkNode(round.rootNode);
};

export const hasErrorLLMAgent = (round?: ConversationRound | null): boolean => {
  if (!round) return false;
  const checkNode = (node: TreeNode): boolean => {
    if (node.error) {
      return true;
    }

    if (node.children && node.children.length > 0) {
      return node.children.some((child: TreeNode) => checkNode(child));
    }

    return false;
  };

  return checkNode(round.rootNode);
};

// 如果有，获取llm 的content 值
export const getLLMContent = (round: ConversationRound): string => {
  const findLLMContent = (node: TreeNode): string => {
    if (
      (node.end &&
        (node.end.name === 'llm_agent' ||
          node.end.name === 'general_qa_agent' ||
          node.end.name === 'summary_agent')) ||
      node.error
    ) {
      return node.end?.data?.content || '';
    }
    for (const child of node.children) {
      const result = findLLMContent(child);
      if (result) return result;
    }
    return '';
  };
  return findLLMContent(round.rootNode);
};

export const getStreamContent = (round: ConversationRound): string | undefined => {
  const getStreamContent = (node: TreeNode): string | undefined => {
    if (
      node.stream &&
      (node.stream.name === 'llm_agent' || node.stream.name === 'summary_agent') &&
      node.stream.event === 'onAgentStream'
    ) {
      return node.stream?.data?.content;
    }
    for (const child of node.children) {
      const result = getStreamContent(child);
      if (result) return result;
    }
    return undefined;
  };
  return getStreamContent(round.rootNode);
};

export const getAnnotationMap = (contentsMap: any[]) => {
  const annotationMap = [
    ...(contentsMap.filter(item => item?.id || item?.chunk_id || item?.document_detail?.id) || []),
  ].map(item => ({
    id: item?.id + 1,
    chunk_id: item?.chunk_id,
    doc_id: item?.document_detail?.id,
    ...(item?.url ? { url: item.url } : {}),
    ...(item?.document_detail?.source_path
      ? { source_path: item?.document_detail.source_path }
      : {}),
  }));
  return annotationMap;
};

// 递归获取 agent 的start.metadata.original_message
export const getAgentOriginalMessage = (round: ConversationRound): string => {
  const findAgentOriginalMessage = (node: TreeNode): string => {
    if (
      node.start &&
      (node.start.name === 'planner_agent' ||
        node.start?.name === 'general_qa_agent' ||
        node.start?.name === 'summary_planner')
    ) {
      return node.start.metadata?.original_message || '';
    }

    for (const child of node.children) {
      const result = findAgentOriginalMessage(child);
      if (result) return result;
    }

    return '';
  };

  return findAgentOriginalMessage(round.rootNode);
};

export const findRoundHasEndByRunId = (
  round: ConversationRound | null,
  runId?: string | null
): TreeNode | null => {
  if (!round || !runId) return null;
  const stack: TreeNode[] = [round.rootNode];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.start?.run_id === runId && node.end) return node;
    if (node.children && node.children.length > 0) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }
  return null;
};

export const findRoundHasErrorAndEndByRunId = (
  round: ConversationRound | null,
  runId?: string | null
): TreeNode | null => {
  if (!round || !runId) return null;
  const stack: TreeNode[] = [round.rootNode];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.start?.run_id === runId && (node.end || node.error)) return node;
    if (node.children && node.children.length > 0) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }
  return null;
};

export const isTaskEnd = (round: ConversationRound | null): boolean => {
  if (!round) return false;

  if (round.rootNode.start) {
    return Boolean(round.rootNode.end);
  }
  return false;
};
