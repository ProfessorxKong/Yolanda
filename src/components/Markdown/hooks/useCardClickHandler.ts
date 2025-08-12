import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import type { CardMetadata } from '../types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCardClickHandler = () => {
  const navigate = useNavigate();
  const { ensureSession } = useSession();

  const handleCardTitleClick = useCallback(
    async (metadata: CardMetadata) => {
      try {
        if (metadata.source_path && (metadata.id || metadata.document_id)) {
          const docId = metadata.id || metadata.document_id;

          // Use useDocSession to get PDF sessionId
          if (docId) {
            await ensureSession(docId);
          }

          // 直接导航，不提前设置 pageType
          // pageType 会在 PDF 页面加载时由路由系统自动设置
          navigate(`/pdf?sourcePath=${encodeURIComponent(metadata.source_path)}&docId=${docId}`);
        }
      } catch (error) {
        console.error('Route navigation failed:', error);
      }
    },
    [navigate, ensureSession]
  );

  const handleCardTitleClickEvent = useCallback(
    async (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.getAttribute('data-action') === 'cardTitleClick') {
        event.preventDefault();
        event.stopPropagation();

        const metadataStr = target.getAttribute('data-metadata');

        if (metadataStr) {
          try {
            const metadata: CardMetadata = JSON.parse(metadataStr);
            await handleCardTitleClick(metadata);
          } catch (error) {
            console.error('Failed to parse metadata:', error);
          }
        }
      }
    },
    [handleCardTitleClick]
  );

  useEffect(() => {
    // Use capture phase for better event handling
    document.addEventListener('click', handleCardTitleClickEvent, true);

    return () => {
      document.removeEventListener('click', handleCardTitleClickEvent, true);
    };
  }, [handleCardTitleClickEvent]);

  return {
    handleCardTitleClick,
  };
};
