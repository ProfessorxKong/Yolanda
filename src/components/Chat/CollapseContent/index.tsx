import { useState } from 'react';

interface UseCollapseOptions {
  maxVisibleLines?: number;
}

export const useCollapse = (titles: string[], options: UseCollapseOptions = {}) => {
  const { maxVisibleLines = 3 } = options;
  const [isExpanded, setIsExpanded] = useState(false);

  if (!titles || titles.length === 0) {
    return {
      isEmpty: true,
      displayTitles: [],
      shouldShowCollapseButton: false,
      isExpanded: false,
      toggleExpanded: () => {},
      remainingCount: 0,
    };
  }

  const shouldShowCollapseButton = titles.length > maxVisibleLines;
  const displayTitles = isExpanded ? titles : titles.slice(0, maxVisibleLines);
  const remainingCount = titles.length - maxVisibleLines;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return {
    isEmpty: false,
    displayTitles,
    shouldShowCollapseButton,
    isExpanded,
    toggleExpanded,
    remainingCount,
  };
};
