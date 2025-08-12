import React from 'react';
import { CheckCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './MarkdownRenderer.module.scss';

interface QuestionSectionProps {
  before?: string;
  marker: string;
  after: string;
  processText: (text: string) => React.ReactNode;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({
  before,
  marker,
  after,
  processText,
}) => {
  const { t } = useTranslation();
  const isQuestionIcon = marker === t('workflow.extractRelevantInfo');
  const Icon = isQuestionIcon ? QuestionCircleFilled : CheckCircleFilled;
  const iconClassName = isQuestionIcon ? styles.questionIcon : styles.checkIcon;

  return (
    <div className={styles.questionItem}>
      {before && <div>{processText(before)}</div>}
      <div className={styles.questionHeader}>
        <Icon className={iconClassName} />
        <strong className={styles.questionLabel}>{marker}：</strong>
      </div>
      <div className={styles.questionContent}>{processText(after)}</div>
    </div>
  );
};
