import React, { useEffect, useState } from 'react';
import {
  StyledSearchArrowWrapper,
  StyledSwitchWrapper,
  StyledTitle,
  StyledTitleWrapper,
} from './styles';
import { IconButton } from '@/ui/button';
import { Content } from '@/ui/layout';
import { useEditor } from '@/providers/editor-provider';
import EditorModeSwitch from '@/components/editor-mode-switch';
import { ArrowDownIcon } from '@blocksuite/icons';
import { useModal } from '@/providers/global-modal-provider';

import Header from './header';

export const PageHeader = () => {
  const [title, setTitle] = useState('');
  const [isHover, setIsHover] = useState(false);

  const { editor } = useEditor();
  const { triggerQuickSearchModal } = useModal();
  useEffect(() => {
    if (editor?.model) {
      setTitle(editor.model.title || 'Untitled');
      editor.model.propsUpdated.on(() => {
        setTitle(editor.model.title);
      });
    }
    return () => {
      editor?.model?.propsUpdated.dispose();
    };
  }, [editor]);

  return (
    <Header>
      {title && (
        <StyledTitle
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
        >
          <StyledTitleWrapper>
            <StyledSwitchWrapper>
              <EditorModeSwitch
                isHover={isHover}
                style={{
                  marginRight: '12px',
                }}
              />
            </StyledSwitchWrapper>
            <Content ellipsis={true}>{title}</Content>
            <StyledSearchArrowWrapper>
              <IconButton
                onClick={() => {
                  triggerQuickSearchModal();
                }}
              >
                <ArrowDownIcon />
              </IconButton>
            </StyledSearchArrowWrapper>
          </StyledTitleWrapper>
        </StyledTitle>
      )}
    </Header>
  );
};

export default PageHeader;
