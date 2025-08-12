import { TreeNode } from '@/store/slices/chatNew';

export const getFlatChildren = (node: TreeNode): TreeNode[] => {
  const result: TreeNode[] = [];
  const queue: TreeNode[] = [...(node.children || [])];
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    if (current.start?.name !== 'executor_agent') {
      result.push(current);
    }
    if (current.children && current.children.length > 0) {
      queue.push(...current.children);
    }
  }

  return result;
};

export const getFlatOnlyVerification = (node: TreeNode): TreeNode[] => {
  const result: TreeNode[] = [];
  const queue: TreeNode[] = [...(node.children || [])];
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    if (current.start?.name === 'verification') {
      result.push(current);
    }
    if (current.children && current.children.length > 0) {
      queue.push(...current.children);
    }
  }

  return result;
};

export const getFlatErrorAndVerification = (node: TreeNode): TreeNode[] => {
  const result: TreeNode[] = [];
  const queue: TreeNode[] = [...(node.children || [])];
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i];
    if (current.start?.name === 'verification' || current.error) {
      result.push(current);
    }
    if (current.children && current.children.length > 0) {
      queue.push(...current.children);
    }
  }

  return result;
};
