import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { openUrl } from '@tauri-apps/plugin-opener';
import { debounce } from 'lodash';
import type { RootState } from '@/store';
import { pdfActions } from '@/store/slices/pdf';
import { setChunkLoading } from '@/store/slices/annotation';
import { useSession } from '@/hooks/useSession';
import { useAppSelector } from '@/store/hooks';
import { getCurrentSessionId } from '@/store/selectors/sse';
import type { ReferenceAnnotation } from './types';
import type {
  CitationContent,
  SearchItem,
  ProcessedAnnotation,
  ReferenceType,
} from '@/types/reference';
import { fetchChunkInfo } from '@/utils/chunkUtils';
import styles from './MarkdownRenderer.module.scss';
import { chatNewSelectors } from '@/store/selectors';
import { findNodeId, getAllCitationNodeById } from './utils';
import { getAnnotationMap } from '../Chat/utils/chat';

const GlobalEventHandler: React.FC = () => {
  const navigate = useNavigate();
  const dispatchRTK = useDispatch();
  const { ensureSession } = useSession();
  const location = useLocation();
  const { pathname } = location;

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
  // Use pageType to determine which rounds to get
  const allRounds = useAppSelector(chatNewSelectors.getAllRounds(pathname));

  const getReferenceId = useCallback(async (target: HTMLElement): Promise<number | -1> => {
    if (target.classList.contains(styles.referenceIcon)) {
      const referenceIdStr = target.getAttribute('data-reference-id');

      if (referenceIdStr) {
        const referenceId = parseInt(referenceIdStr, 10);
        return referenceId;
      }
      return -1; // Return -1 if no reference ID found
    }
    return -1;
  }, []);

  const handleReferenceClick = useCallback(
    async (_referenceId: number, annotation: ReferenceAnnotation) => {
      try {
        const pathname = location.pathname;
        const search = location.search;
        const originalUrl = `${pathname}${search}`;
        const url = `/pdf?sourcePath=${encodeURIComponent(annotation.source_path || '')}&docId=${
          annotation.doc_id
        }`;

        // Handle source path navigation
        if (annotation.source_path && originalUrl !== url) {
          if (annotation.doc_id) {
            await ensureSession(annotation.doc_id as string);
          }
          navigate(url);
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
              setTimeout(() => {
                dispatchRTK(pdfActions.setChunkInfo(chunk));
              }, 100);
            }
          } catch (error) {
            console.error('Failed to fetch chunk info:', error);
            // 确保在错误情况下也要清除loading状态
            dispatchRTK(setChunkLoading({ sessionId: currentSessionId, chunkId, loading: false }));
          } finally {
            // Clear loading state
            dispatchRTK(setChunkLoading({ sessionId: currentSessionId, chunkId, loading: false }));
          }
        }
      } catch (error) {
        console.error('Failed to handle reference click:', error);
      }
    },
    [dispatchRTK, ensureSession, navigate, currentSessionId, location]
  );

  // 创建防抖版本的handleReferenceClick
  const debouncedHandleReferenceClick = useMemo(
    () => debounce(handleReferenceClick, 300),
    [handleReferenceClick]
  );
  const clickReference = useCallback(
    async (referenceId: number, annotationMap: ProcessedAnnotation[]) => {
      const annotation = annotationMap.find(item => item.id === referenceId);

      if (annotation) {
        const validAnnotation: ReferenceAnnotation = {
          id: annotation.id || 0, // 提供默认
          chunk_id: annotation.chunk_id,
          url: annotation.url,
          source_path: annotation.source_path,
          doc_id: annotation.doc_id,
        };
        await debouncedHandleReferenceClick(referenceId, validAnnotation);
      }
    },
    [debouncedHandleReferenceClick]
  );

  const handleReferences = useCallback(
    async (contents: SearchItem[], target: HTMLElement, referenceType: ReferenceType) => {
      try {
        let annotations: ProcessedAnnotation[];

        if (referenceType === 'kb') {
          const flattenedContents = contents.flatMap(item => item.search_kb || []);
          annotations = getAnnotationMap(flattenedContents);
        } else {
          // For web and scholar references
          const flattenedContents = contents.flatMap(item => item || []);
          annotations = flattenedContents.map(item => ({
            ...item,
            id: Number(item.id) + 1,
          })) as ProcessedAnnotation[];
        }

        const referenceId = await getReferenceId(target);
        typeof referenceId === 'number' && referenceId !== -1
          ? await clickReference(referenceId, annotations)
          : console.warn('No reference ID found');
      } catch (error) {
        console.error('Handle references error:', error);
      }
    },
    [getReferenceId, clickReference]
  );

  const handleReferenceClickEvent = useCallback(
    async (event: Event) => {
      try {
        const target = event.target as HTMLElement;
        const nodeId = findNodeId(target);
        const contents: CitationContent = getAllCitationNodeById(allRounds, nodeId);

        const metadata = contents.metadata;

        let qaSource: ReferenceType | 'unknown' = 'unknown'; // Default value
        switch (true) {
          case metadata.search_kb:
            qaSource = 'kb';
            break;

          case metadata.search_scholar:
            qaSource = 'scholar';
            break;

          case metadata.search_web:
            qaSource = 'web';
            break;

          default:
            break;
        }
        if (qaSource !== 'unknown') {
          await handleReferences(contents.contents || [], target, qaSource);
        }
      } catch (error) {
        console.error('Reference click event error:', error);
      }
    },
    [allRounds, handleReferences]
  );

  useEffect(() => {
    document.addEventListener('click', handleReferenceClickEvent);

    return () => {
      document.removeEventListener('click', handleReferenceClickEvent);
    };
  }, [handleReferenceClickEvent]);

  return null; // 这个组件不渲染任何内容
};

export default GlobalEventHandler;
