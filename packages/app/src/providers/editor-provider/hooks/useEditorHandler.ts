import { QueryContent } from '@blocksuite/store/dist/workspace/search';
import { createPage, initialPage, generateDefaultPageId } from '../utils';
import { Workspace } from '@blocksuite/store';
import { useRouter } from 'next/router';
import { EditorHandlers, PageMeta } from '../interface';
import { EditorContainer } from '@blocksuite/editor';

export const useEditorHandler = ({
  editor,
  workspace,
}: {
  workspace?: Workspace;
  editor?: EditorContainer;
}): EditorHandlers => {
  const router = useRouter();

  return {
    createPage: async ({ pageId = generateDefaultPageId(), title } = {}) => {
      const page = await createPage(workspace!, pageId);
      initialPage(page, title);
      return page;
    },
    getPageMeta(pageId: string) {
      pageId = pageId.replace('space:', '');
      return workspace!.meta.pageMetas.find(
        page => page.id === pageId
      ) as PageMeta;
    },
    openPage: (pageId, query = {}) => {
      return router.push({
        pathname: '/',
        query: {
          pageId,
          ...query,
        },
      });
    },
    toggleDeletePage: pageId => {
      const pageMeta = workspace!.meta.pageMetas.find(p => p.id === pageId);
      if (pageMeta) {
        workspace!.setPageMeta(pageId, {
          trash: !pageMeta.trash,
          trashDate: +new Date(),
        });
      }
    },
    favoritePage: pageId => {
      workspace!.setPageMeta(pageId, { favorite: true });
    },
    permanentlyDeletePage: pageId => {
      // TODO:  workspace.meta.removePage or workspace.removePage?
      workspace!.meta.removePage(pageId);
    },
    unFavoritePage: pageId => {
      workspace!.setPageMeta(pageId, { favorite: true });
    },
    toggleFavoritePage: pageId => {
      const pageMeta = workspace?.meta.pageMetas.find(p => p.id === pageId);
      if (pageMeta) {
        workspace!.setPageMeta(pageId, { favorite: !pageMeta.favorite });
      }
    },
    search: (query: QueryContent) => {
      return workspace!.search(query);
    },
    changeEditorMode: (pageId: string) => {
      editor!.mode = editor!.mode === 'page' ? 'edgeless' : 'page';
      workspace?.setPageMeta(pageId, { mode: editor!.mode });
    },
  };
};

export default useEditorHandler;
