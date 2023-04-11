import { MenuItem, MuiClickAwayListener, PureMenu } from '@affine/component';
import { useTranslation } from '@affine/i18n';
import {
  MoreVerticalIcon,
  MoveToIcon,
  PenIcon,
  PlusIcon,
} from '@blocksuite/icons';
import type { PageMeta } from '@blocksuite/store';
import { useTheme } from '@mui/material';
import { useMemo, useState } from 'react';

import { useAffineHelper } from '../../../../hooks/affine/use-affine-helper';
import type { BlockSuiteWorkspace } from '../../../../shared';
import { toast } from '../../../../utils';
import { CopyLink, MoveToTrash } from '../../operation-menu-items';
import { PinboardMenu } from '../pinboard-menu/';
import { StyledOperationButton } from '../styles';

export type OperationButtonProps = {
  isRoot: boolean;
  onAdd: () => void;
  onDelete: () => void;
  metas: PageMeta[];
  currentMeta: PageMeta;
  blockSuiteWorkspace: BlockSuiteWorkspace;
  isHover: boolean;
  onRename?: () => void;
  onMenuClose?: () => void;
};
export const OperationButton = ({
  isRoot,
  onAdd,
  onDelete,
  metas,
  currentMeta,
  blockSuiteWorkspace,
  isHover,
  onMenuClose,
  onRename,
}: OperationButtonProps) => {
  const {
    zIndex: { modal: modalIndex },
  } = useTheme();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [operationMenuOpen, setOperationMenuOpen] = useState(false);
  const [pinboardMenuOpen, setPinboardMenuOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const menuIndex = useMemo(() => modalIndex + 1, [modalIndex]);
  const { removeToTrash } = useAffineHelper(blockSuiteWorkspace);

  return (
    <MuiClickAwayListener
      onClickAway={() => {
        setOperationMenuOpen(false);
        setPinboardMenuOpen(false);
      }}
    >
      <div
        onClick={e => {
          e.stopPropagation();
        }}
        onMouseLeave={() => {
          setOperationMenuOpen(false);
          setPinboardMenuOpen(false);
        }}
      >
        <StyledOperationButton
          data-testid="pinboard-operation-button"
          ref={ref => setAnchorEl(ref)}
          size="small"
          onClick={() => {
            setOperationMenuOpen(!operationMenuOpen);
          }}
          visible={isHover}
        >
          <MoreVerticalIcon />
        </StyledOperationButton>

        <PureMenu
          data-testid="pinboard-operation-menu"
          width={256}
          anchorEl={anchorEl}
          open={operationMenuOpen}
          placement="bottom-start"
          zIndex={menuIndex}
        >
          <MenuItem
            data-testid="pinboard-operation-add"
            onClick={() => {
              onAdd();
              setOperationMenuOpen(false);
              onMenuClose?.();
            }}
            icon={<PlusIcon />}
          >
            {t('Add a subpage inside')}
          </MenuItem>
          {!isRoot && (
            <MenuItem
              data-testid="pinboard-operation-move-to"
              onClick={() => {
                setOperationMenuOpen(false);
                setPinboardMenuOpen(true);
              }}
              icon={<MoveToIcon />}
            >
              {t('Move to')}
            </MenuItem>
          )}
          {!isRoot && (
            <MenuItem
              data-testid="pinboard-operation-rename"
              onClick={() => {
                onRename?.();
                setOperationMenuOpen(false);
                onMenuClose?.();
              }}
              icon={<PenIcon />}
            >
              {t('Rename')}
            </MenuItem>
          )}
          {!isRoot && (
            <MoveToTrash
              testId="pinboard-operation-move-to-trash"
              onItemClick={() => {
                setOperationMenuOpen(false);
                setConfirmModalOpen(true);
                onMenuClose?.();
              }}
            />
          )}
          <CopyLink />
        </PureMenu>

        <PinboardMenu
          anchorEl={anchorEl}
          open={pinboardMenuOpen}
          placement="bottom-start"
          zIndex={menuIndex}
          metas={metas}
          currentMeta={currentMeta}
          blockSuiteWorkspace={blockSuiteWorkspace}
          showRemovePinboard={true}
        />
        <MoveToTrash.ConfirmModal
          open={confirmModalOpen}
          meta={currentMeta}
          onConfirm={() => {
            toast(t('Moved to Trash'));
            removeToTrash(currentMeta.id);
            onDelete();
          }}
          onCancel={() => {
            setConfirmModalOpen(false);
          }}
          confirmButtonTestId="move-to-trash-confirm"
          cancelButtonTestId="move-to-trash-cancel"
        />
      </div>
    </MuiClickAwayListener>
  );
};
