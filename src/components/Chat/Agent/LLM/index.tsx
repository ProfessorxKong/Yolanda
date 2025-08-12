import React from 'react';
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer';
import { MessageContent } from '@/store/slices/chatNew';
import { useAppSelector } from '@/store/hooks';
import { chatNewSelectors } from '@/store/selectors';

interface LLMAgentProps {
  end?: MessageContent;
}

const LLMAgent: React.FC<LLMAgentProps> = ({ end }) => {
  const session = useAppSelector(chatNewSelectors.getCurrentSession);
  const content = end?.data?.content;
  return <MarkdownRenderer id={session?.currentRoundId} content={content || ''} />;
};

export default LLMAgent;
