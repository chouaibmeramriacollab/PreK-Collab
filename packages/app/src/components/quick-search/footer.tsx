import React from 'react';
import { AddIcon } from '@blocksuite/icons';
import { StyledModalFooterContent } from './style';
import { useEditor } from '@/providers/editor-provider';
import { useModal } from '@/providers/global-modal-provider';
import { IconButton } from '@/ui/button';

const QuickSearchFooter = () => {
  const { createPage, getPageMeta, openPage } = useEditor();
  const { triggerQuickSearchModal } = useModal();
  return (
    <StyledModalFooterContent>
      <IconButton
        onClick={async () => {
          const page = createPage();
          const pageMeta = getPageMeta((await page).id);
          pageMeta && openPage(pageMeta.id);
          triggerQuickSearchModal();
        }}
      >
        <AddIcon />
      </IconButton>
      <span>New page</span>
    </StyledModalFooterContent>
  );
};

export default QuickSearchFooter;
