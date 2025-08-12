import { ConversationRound, TreeNode } from '@/store/slices/chatNew';

const findCitationNodeById = (
  rounds: ConversationRound[],
  id: string | null
): { contents: any[]; metadata: any } => {
  if (!id) return { contents: [], metadata: {} };

  const round = rounds.find(r => r.id === id);
  if (!round || !round.rootNode || !round.rootNode.start) return { contents: [], metadata: {} };

  const start = round.rootNode.start;

  if (start?.event !== 'onAgentStart' || start?.name !== 'mx_agent') {
    // return [];
    return {
      contents: [],
      metadata: start?.metadata || {},
    };
  }
  // search_kb
  // search_scholar
  // search_web
  if (start?.metadata?.search_kb) {
    return {
      contents: traverseEndNode(round),
      metadata: start?.metadata || {},
    };
  }
  if (start?.metadata?.search_scholar) {
    return {
      contents: [],
      metadata: start?.metadata || {},
    };
  }
  if (start?.metadata?.search_web) {
    return {
      contents: traverseRankToolEndNode(round),
      metadata: start?.metadata || {},
    };
  }
  return {
    contents: [],
    metadata: {},
  };
};

// Find all onToolEnd nodes by ID and return their data/content arrays
const traverseEndNode = (round: ConversationRound): any[] => {
  const toolEndContents: any[] = [];
  // Recursive function to traverse the tree and find onToolEnd nodes
  const traverseNode = (node: TreeNode) => {
    // Check if current node has onToolEnd event
    if (node.end?.event === 'onToolEnd' && node.end?.data?.content) {
      toolEndContents.push(node.end.data.content);
    }

    // Recursively traverse children
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => traverseNode(child));
    }
  };

  // Start traversal from root node
  if (round.rootNode) {
    traverseNode(round.rootNode);
  }
  return toolEndContents;
};

export const traverseRankToolEndNode = (round: ConversationRound): any[] => {
  const toolEndContents: any[] = [];

  // Recursive function to traverse the tree and find onToolEnd nodes
  const traverseNode = (node: TreeNode) => {
    // Check if current node has onToolEnd event
    if (
      node.end?.event === 'onToolEnd' &&
      node.end?.name === 'reranker' &&
      node.end?.data?.content
    ) {
      toolEndContents.push(node.end.data.content);
    }

    // Recursively traverse children
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => traverseNode(child));
    }
  };

  // Start traversal from root node
  if (round.rootNode) {
    traverseNode(round.rootNode);
  }

  return toolEndContents;
};

export const getAllCitationNodeById = (
  rounds: ConversationRound[],
  id: string | null
): { contents: any[]; metadata: any } => {
  return findCitationNodeById(rounds, id);
};

// Find the node ID of a specific node
export const findNodeId = (node: HTMLElement): string | null => {
  let currentNode = node;
  while (node) {
    if (
      currentNode?.getAttribute('id')?.endsWith('_human') ||
      currentNode?.getAttribute('id')?.endsWith('_stream') ||
      currentNode?.getAttribute('id')?.endsWith('_history')
    ) {
      return currentNode.getAttribute('id');
    }
    if (currentNode) {
      currentNode = currentNode?.parentElement as HTMLElement;
    } else {
      break;
    }
  }
  return null;
};
