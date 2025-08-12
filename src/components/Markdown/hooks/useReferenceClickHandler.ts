import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { openUrl } from '@tauri-apps/plugin-opener';
import type { RootState } from '@/store';
import { pdfActions } from '@/store/slices/pdf';
import { setChunkLoading, selectAnnotationMapBySession } from '@/store/slices/annotation';
import { useSession } from '@/hooks/useSession';
import { useAppSelector } from '@/store/hooks';
import { getCurrentSessionId } from '@/store/selectors/sse';
import type { ReferenceAnnotation } from '../types';
import { fetchChunkInfo } from '@/utils/chunkUtils';
import styles from '../MarkdownRenderer.module.scss';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReferenceClickHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const dispatchRTK = useDispatch();
  const { ensureSession } = useSession();

  // Get session IDs for current session detection
  const pdfSessionId = useSelector((state: RootState) => state.pdf.sessionId);
  const searchSessionId = useSelector((state: RootState) => state.chat.search_session_id);
  const chatSessionId = useSelector((state: RootState) => state.chat.chat_session_id);

  // Get current session ID based on page type
  const currentSessionId = getCurrentSessionId(
    pathname,
    pdfSessionId || undefined,
    searchSessionId || undefined,
    chatSessionId || undefined
  );

  // Get annotation map for current session
  const annotationMap = useAppSelector(selectAnnotationMapBySession(currentSessionId || ''));

  const handleReferenceClick = useCallback(
    async (_referenceId: number, annotation: ReferenceAnnotation) => {
      try {
        // Handle source path navigation
        if (annotation.source_path) {
          if (annotation.doc_id) {
            await ensureSession(annotation.doc_id as string);
          }

          navigate(
            `/pdf?sourcePath=${encodeURIComponent(annotation.source_path)}&docId=${
              annotation.doc_id
            }`
          );
        }

        // Handle URL opening
        if (annotation.url) {
          await openUrl(annotation.url);
        }

        // Handle chunk information - fetch on demand
        if (annotation.chunk_id && currentSessionId) {
          const chunkId = annotation.chunk_id.toString();
          try {
            // Set loading state
            dispatchRTK(setChunkLoading({ sessionId: currentSessionId, chunkId, loading: true }));

            const chunk = await fetchChunkInfo(chunkId);
            if (chunk) {
              dispatchRTK(pdfActions.setChunkInfo(chunk));
            }
          } catch (error) {
            console.error('Failed to fetch chunk info:', error);
          } finally {
            // Clear loading state
            dispatchRTK(setChunkLoading({ sessionId: currentSessionId, chunkId, loading: false }));
          }
        }
      } catch (error) {
        console.error('Failed to handle reference click:', error);
      }
    },
    [dispatchRTK, ensureSession, navigate, currentSessionId]
  );

  const handleReferenceClickEvent = useCallback(
    async (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains(styles.referenceIcon)) {
        const referenceIdStr = target.getAttribute('data-reference-id');
        if (referenceIdStr) {
          const referenceId = parseInt(referenceIdStr, 10);
          // 使用数组索引而不是item.id来匹配reference
          const annotation = annotationMap[referenceId];

          if (annotation) {
            const validAnnotation: ReferenceAnnotation = {
              id: annotation.id || 0, // 提供默认值
              chunk_id: annotation.chunk_id,
              url: annotation.url,
              source_path: annotation.source_path,
              doc_id: annotation.doc_id,
            };
            await handleReferenceClick(referenceId, validAnnotation);
          }
        }
      }
    },
    [annotationMap, handleReferenceClick]
  );

  useEffect(() => {
    document.addEventListener('click', handleReferenceClickEvent);
    return () => {
      document.removeEventListener('click', handleReferenceClickEvent);
    };
  }, [handleReferenceClickEvent]);

  return {
    handleReferenceClick,
  };
};
