import { DebugLogger } from '@affine/debug';
import { rootCurrentPageIdAtom } from '@affine/workspace/atom';
import { useAtom, useAtomValue } from 'jotai';
import type { NextRouter } from 'next/router';
import { useRef } from 'react';

import { rootCurrentWorkspaceAtom } from '../atoms/root';
export const HALT_PROBLEM_TIMEOUT = 1000;

const logger = new DebugLogger('useRouterWithWorkspaceIdDefense');

export function useRouterAndWorkspaceWithPageIdDefense(router: NextRouter) {
  const currentWorkspace = useAtomValue(rootCurrentWorkspaceAtom);
  const [currentPageId, setCurrentPageId] = useAtom(rootCurrentPageIdAtom);
  const timeoutRef = useRef<unknown | null>(null);
  if (!router.isReady) {
    return;
  }
  if (!timeoutRef.current) {
    timeoutRef.current = setTimeout(() => {
      if (currentPageId) {
        const page =
          currentWorkspace.blockSuiteWorkspace.getPage(currentPageId);
        if (!page) {
          const firstOne =
            currentWorkspace.blockSuiteWorkspace.meta.pageMetas.at(0);
          if (firstOne) {
            logger.warn(
              'cannot find page',
              currentPageId,
              'so redirect to',
              firstOne.id
            );
            setCurrentPageId(firstOne.id);
            void router.push({
              pathname: '/workspace/[workspaceId]/[pageId]',
              query: {
                ...router.query,
                workspaceId: currentWorkspace.id,
                pageId: firstOne.id,
              },
            });
          }
        }
      }
    }, HALT_PROBLEM_TIMEOUT);
  }
  const { workspaceId, pageId } = router.query;
  if (typeof pageId !== 'string') {
    console.warn('pageId is not a string', pageId);
    return;
  }
  if (typeof workspaceId !== 'string') {
    console.warn('workspaceId is not a string', workspaceId);
    return;
  }
  if (currentWorkspace?.id !== workspaceId) {
    console.warn('workspaceId is not currentWorkspace', workspaceId);
    return;
  }
  if (currentPageId !== pageId) {
    console.log('set current page id', pageId);
    setCurrentPageId(pageId);
    if (
      !(
        router.pathname === '/workspace/[workspaceId]/[pageId]' &&
        router.query.workspaceId === workspaceId &&
        router.query.pageId === pageId
      )
    ) {
      void router.push({
        pathname: '/workspace/[workspaceId]/[pageId]',
        query: {
          ...router.query,
          workspaceId,
          pageId,
        },
      });
    }
  }
}
