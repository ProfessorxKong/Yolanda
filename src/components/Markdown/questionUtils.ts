import i18n from 'i18next';

export const processQuestionText = (text: string) => {
  // 获取当前语言的翻译
  const understandProblem = i18n.t('workflow.understandProblem');
  const decomposeProblem = i18n.t('workflow.decomposeProblem');
  const extractRelevantInfo = i18n.t('workflow.extractRelevantInfo');
  const validateAcademicSearchResults = i18n.t('workflow.validateAcademicSearchResults');
  const validateWebSearchResults = i18n.t('workflow.validateWebSearchResults');
  const validateKnowledgeSearchResults = i18n.t('workflow.validateKnowledgeSearchResults');

  const match = text.match(
    new RegExp(
      `^(.*?)(${understandProblem}|${decomposeProblem}|${extractRelevantInfo}|${validateAcademicSearchResults}|${validateWebSearchResults}|${validateKnowledgeSearchResults})(.*)$`,
      's'
    )
  );
  if (!match) return null;

  const [, before, marker, after] = match;
  return {
    before,
    marker,
    after,
  };
};
