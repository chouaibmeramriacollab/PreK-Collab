import {
  ConfirmModal,
  IconButton,
  Menu,
  MenuIcon,
  MenuItem,
  toast,
  Tooltip,
} from '@affine/component';
import { useAppSettingHelper } from '@affine/core/hooks/affine/use-app-setting-helper';
import { useBlockSuiteMetaHelper } from '@affine/core/hooks/affine/use-block-suite-meta-helper';
import { useTrashModalHelper } from '@affine/core/hooks/affine/use-trash-modal-helper';
import { Workbench } from '@affine/core/modules/workbench';
import { FavoriteItemsAdapter } from '@affine/core/modules/workspace';
import type { Collection, DeleteCollectionInfo } from '@affine/env/filter';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import {
  DeleteIcon,
  DeletePermanentlyIcon,
  DuplicateIcon,
  EditIcon,
  FavoritedIcon,
  FavoriteIcon,
  FilterIcon,
  FilterMinusIcon,
  MoreVerticalIcon,
  OpenInNewIcon,
  ResetIcon,
  SplitViewIcon,
} from '@blocksuite/icons';
import type { DocMeta } from '@blocksuite/store';
import { useLiveData, useService, Workspace } from '@toeverything/infra';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import type { CollectionService } from '../../modules/collection';
import { FavoriteTag } from './components/favorite-tag';
import * as styles from './list.css';
import { DisablePublicSharing, MoveToTrash } from './operation-menu-items';
import { CreateOrEditTag } from './tags/create-tag';
import type { TagMeta } from './types';
import { ColWrapper, stopPropagationWithoutPrevent } from './utils';
import type { AllPageListConfig } from './view';
import { useEditCollection, useEditCollectionName } from './view';

export interface PageOperationCellProps {
  page: DocMeta;
  isInAllowList?: boolean;
  onRemoveFromAllowList?: () => void;
}

export const PageOperationCell = ({
  isInAllowList,
  page,
  onRemoveFromAllowList,
}: PageOperationCellProps) => {
  const t = useAFFiNEI18N();
  const currentWorkspace = useService(Workspace);
  const { appSettings } = useAppSettingHelper();
  const { setTrashModal } = useTrashModalHelper(currentWorkspace.docCollection);
  const [openDisableShared, setOpenDisableShared] = useState(false);
  const favAdapter = useService(FavoriteItemsAdapter);
  const favourite = useLiveData(
    useMemo(() => favAdapter.isFavorite$(page.id, 'doc'), [favAdapter, page.id])
  );
  const workbench = useService(Workbench);
  const { duplicate } = useBlockSuiteMetaHelper(currentWorkspace.docCollection);

  const onDisablePublicSharing = useCallback(() => {
    toast('Successfully disabled', {
      portal: document.body,
    });
  }, []);

  const onRemoveToTrash = useCallback(() => {
    setTrashModal({
      open: true,
      pageIds: [page.id],
      pageTitles: [page.title],
    });
  }, [page.id, page.title, setTrashModal]);

  const onOpenInSplitView = useCallback(() => {
    workbench.openPage(page.id, { at: 'tail' });
  }, [page.id, workbench]);

  const onToggleFavoritePage = useCallback(() => {
    const status = favAdapter.isFavorite(page.id, 'doc');
    favAdapter.toggle(page.id, 'doc');
    toast(
      status
        ? t['com.affine.toastMessage.removedFavorites']()
        : t['com.affine.toastMessage.addedFavorites']()
    );
  }, [page.id, favAdapter, t]);

  const onDuplicate = useCallback(() => {
    duplicate(page.id, false);
  }, [duplicate, page.id]);

  const OperationMenu = (
    <>
      {page.isPublic && (
        <DisablePublicSharing
          data-testid="disable-public-sharing"
          onSelect={() => {
            setOpenDisableShared(true);
          }}
        />
      )}
      {isInAllowList && (
        <MenuItem
          onClick={onRemoveFromAllowList}
          preFix={
            <MenuIcon>
              <FilterMinusIcon />
            </MenuIcon>
          }
        >
          {t['Remove special filter']()}
        </MenuItem>
      )}
      <MenuItem
        onClick={onToggleFavoritePage}
        preFix={
          <MenuIcon>
            {favourite ? (
              <FavoritedIcon style={{ color: 'var(--affine-primary-color)' }} />
            ) : (
              <FavoriteIcon />
            )}
          </MenuIcon>
        }
      >
        {favourite
          ? t['com.affine.favoritePageOperation.remove']()
          : t['com.affine.favoritePageOperation.add']()}
      </MenuItem>

      {environment.isDesktop && appSettings.enableMultiView ? (
        <MenuItem
          onClick={onOpenInSplitView}
          preFix={
            <MenuIcon>
              <SplitViewIcon />
            </MenuIcon>
          }
        >
          {t['com.affine.workbench.split-view.page-menu-open']()}
        </MenuItem>
      ) : null}

      {!environment.isDesktop && (
        <Link
          className={styles.clearLinkStyle}
          onClick={stopPropagationWithoutPrevent}
          to={`/workspace/${currentWorkspace.id}/${page.id}`}
          target={'_blank'}
          rel="noopener noreferrer"
        >
          <MenuItem
            style={{ marginBottom: 4 }}
            preFix={
              <MenuIcon>
                <OpenInNewIcon />
              </MenuIcon>
            }
          >
            {t['com.affine.openPageOperation.newTab']()}
          </MenuItem>
        </Link>
      )}

      <MenuItem
        preFix={
          <MenuIcon>
            <DuplicateIcon />
          </MenuIcon>
        }
        onSelect={onDuplicate}
      >
        {t['com.affine.header.option.duplicate']()}
      </MenuItem>

      <MoveToTrash data-testid="move-to-trash" onSelect={onRemoveToTrash} />
    </>
  );
  return (
    <>
      <ColWrapper
        hideInSmallContainer
        data-testid="page-list-item-favorite"
        data-favorite={favourite ? true : undefined}
        className={styles.favoriteCell}
      >
        <FavoriteTag onClick={onToggleFavoritePage} active={favourite} />
      </ColWrapper>
      <ColWrapper alignment="start">
        <Menu
          items={OperationMenu}
          contentOptions={{
            align: 'end',
          }}
        >
          <IconButton type="plain" data-testid="page-list-operation-button">
            <MoreVerticalIcon />
          </IconButton>
        </Menu>
      </ColWrapper>
      <DisablePublicSharing.DisablePublicSharingModal
        onConfirm={onDisablePublicSharing}
        open={openDisableShared}
        onOpenChange={setOpenDisableShared}
      />
    </>
  );
};

export interface TrashOperationCellProps {
  onPermanentlyDeletePage: () => void;
  onRestorePage: () => void;
}

export const TrashOperationCell = ({
  onPermanentlyDeletePage,
  onRestorePage,
}: TrashOperationCellProps) => {
  const t = useAFFiNEI18N();
  const [open, setOpen] = useState(false);
  return (
    <ColWrapper flex={1}>
      <Tooltip content={t['com.affine.trashOperation.restoreIt']()} side="top">
        <IconButton
          data-testid="restore-page-button"
          style={{ marginRight: '12px' }}
          onClick={() => {
            onRestorePage();
          }}
        >
          <ResetIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        content={t['com.affine.trashOperation.deletePermanently']()}
        side="top"
        align="end"
      >
        <IconButton
          data-testid="delete-page-button"
          onClick={() => {
            setOpen(true);
          }}
        >
          <DeletePermanentlyIcon />
        </IconButton>
      </Tooltip>
      <ConfirmModal
        title={`${t['com.affine.trashOperation.deletePermanently']()}?`}
        description={t['com.affine.trashOperation.deleteDescription']()}
        cancelText={t['com.affine.confirmModal.button.cancel']()}
        confirmButtonOptions={{
          type: 'error',
          children: t['com.affine.trashOperation.delete'](),
        }}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          onPermanentlyDeletePage();
          setOpen(false);
        }}
      />
    </ColWrapper>
  );
};

export interface CollectionOperationCellProps {
  collection: Collection;
  info: DeleteCollectionInfo;
  config: AllPageListConfig;
  service: CollectionService;
}

export const CollectionOperationCell = ({
  collection,
  config,
  service,
  info,
}: CollectionOperationCellProps) => {
  const t = useAFFiNEI18N();

  const { open: openEditCollectionModal, node: editModal } =
    useEditCollection(config);

  const { open: openEditCollectionNameModal, node: editNameModal } =
    useEditCollectionName({
      title: t['com.affine.editCollection.renameCollection'](),
    });

  const handleEditName = useCallback(() => {
    // use openRenameModal if it is in the sidebar collection list
    openEditCollectionNameModal(collection.name)
      .then(name => {
        return service.updateCollection(collection.id, collection => ({
          ...collection,
          name,
        }));
      })
      .catch(err => {
        console.error(err);
      });
  }, [collection.id, collection.name, openEditCollectionNameModal, service]);

  const handleEdit = useCallback(() => {
    openEditCollectionModal(collection)
      .then(collection => {
        return service.updateCollection(collection.id, () => collection);
      })
      .catch(err => {
        console.error(err);
      });
  }, [openEditCollectionModal, collection, service]);

  const handleDelete = useCallback(() => {
    return service.deleteCollection(info, collection.id);
  }, [service, info, collection]);

  return (
    <>
      {editModal}
      {editNameModal}
      <Tooltip content={t['com.affine.collection.menu.rename']()} side="top">
        <IconButton onClick={handleEditName}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content={t['com.affine.collection.menu.edit']()} side="top">
        <IconButton onClick={handleEdit}>
          <FilterIcon />
        </IconButton>
      </Tooltip>

      <ColWrapper alignment="start">
        <Menu
          items={
            <MenuItem
              onClick={handleDelete}
              preFix={
                <MenuIcon>
                  <DeleteIcon />
                </MenuIcon>
              }
              type="danger"
            >
              {t['Delete']()}
            </MenuItem>
          }
          contentOptions={{
            align: 'end',
          }}
        >
          <IconButton type="plain">
            <MoreVerticalIcon />
          </IconButton>
        </Menu>
      </ColWrapper>
    </>
  );
};

interface TagOperationCellProps {
  tag: TagMeta;
  onTagDelete: (tagId: string[]) => void;
}

export const TagOperationCell = ({
  tag,
  onTagDelete,
}: TagOperationCellProps) => {
  const t = useAFFiNEI18N();
  const [open, setOpen] = useState(false);

  const handleDelete = useCallback(() => {
    onTagDelete([tag.id]);
  }, [onTagDelete, tag.id]);
  return (
    <>
      <div className={styles.editTagWrapper} data-show={open}>
        <div style={{ width: '100%' }}>
          <CreateOrEditTag open={open} onOpenChange={setOpen} tagMeta={tag} />
        </div>
      </div>

      <Tooltip content={t['Rename']()} side="top">
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
      </Tooltip>

      <ColWrapper alignment="start">
        <Menu
          items={
            <MenuItem
              preFix={
                <MenuIcon>
                  <DeleteIcon />
                </MenuIcon>
              }
              type="danger"
              onSelect={handleDelete}
            >
              {t['Delete']()}
            </MenuItem>
          }
          contentOptions={{
            align: 'end',
          }}
        >
          <IconButton type="plain">
            <MoreVerticalIcon />
          </IconButton>
        </Menu>
      </ColWrapper>
    </>
  );
};
