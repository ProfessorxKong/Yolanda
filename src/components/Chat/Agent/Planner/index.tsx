import React from 'react';
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer';
import { MessageContent } from '@/store/slices/chatNew';

interface PlannerProps {
  end?: MessageContent;
}

const Planner: React.FC<PlannerProps> = ({ end }) => {
  const content = end?.data?.content;

  try {
    const parsedContent = typeof content == 'string' ? JSON.parse(content || '{}') : content;
    const thought = parsedContent?.thought;

    return <MarkdownRenderer content={thought} />;
  } catch (error) {
    // 如果解析失败，使用原始内容
    return <MarkdownRenderer content={content} />;
  }
};

export default Planner;
