import { InformationIcon, LogOutIcon } from '@blocksuite/icons';
import { styled } from '@/styles';
import { Divider } from '@/ui/divider';
import { useAppState } from '@/providers/app-state-provider/context';
import { SelectorPopperContainer } from './styles';
import {
  PrivateWorkspaceItem,
  WorkspaceItem,
  CreateWorkspaceItem,
  ListItem,
  LoginItem,
} from './WorkspaceItem';
import { WorkspaceSetting } from '@/components/workspace-setting';
import { useCallback, useEffect, useState } from 'react';
import {
  downloadWorkspace,
  getWorkspaceDetail,
  WorkspaceType,
} from '@pathfinder/data-services';
import { Workspace } from '@blocksuite/store';

export type WorkspaceDetails = Record<
  string,
  { memberCount: number; owner: { id: string; name: string } }
>;

type SelectorPopperContentProps = {
  isShow: boolean;
};

export const SelectorPopperContent = ({
  isShow,
}: SelectorPopperContentProps) => {
  const { user, workspacesMeta } = useAppState();
  const [settingWorkspaceId, setSettingWorkspaceId] = useState<string | null>(
    null
  );
  const [workSpaceDetails, setWorkSpaceDetails] = useState<WorkspaceDetails>(
    {}
  );
  const [workspaces, setWorkspaces] = useState<
    Record<string, Workspace | null>
  >({});
  const handleClickSettingWorkspace = (workspaceId: string) => {
    setSettingWorkspaceId(workspaceId);
  };
  const handleCloseWorkSpace = () => {
    setSettingWorkspaceId(null);
  };
  const settingWorkspace = settingWorkspaceId
    ? workspacesMeta.find(workspace => workspace.id === settingWorkspaceId)
    : undefined;

  const refreshDetails = useCallback(async () => {
    const workspaceDetailList = await Promise.all(
      workspacesMeta?.map(async ({ id, type }) => {
        if (user) {
          if (type === WorkspaceType.Private) {
            return { id, member_count: 1, owner: user };
          } else {
            const data = await getWorkspaceDetail({ id });
            return { id, ...data } || { id, member_count: 0, owner: user };
          }
        }
      })
    );
    const workSpaceDetails: WorkspaceDetails = {};
    workspaceDetailList.forEach(details => {
      if (details) {
        const { id, member_count, owner } = details;
        if (!owner) return;
        workSpaceDetails[id] = {
          memberCount: member_count || 1,
          owner: {
            id: owner.id,
            name: owner.name,
          },
        };
      }
    });
    setWorkSpaceDetails(workSpaceDetails);
  }, [user, workspacesMeta]);

  // TODO: add to context
  const refreshWorkspaces = useCallback(async () => {
    const workspacesList = await Promise.all(
      workspacesMeta.map(async ({ id }) => {
        const workspace = new Workspace({
          room: id,
          providers: [],
        });
        const updates = await downloadWorkspace({ workspaceId: id });
        updates &&
          Workspace.Y.applyUpdate(workspace.doc, new Uint8Array(updates));
        // if after update, the space:meta is empty, then we need to get map with doc
        workspace.doc.getMap('space:meta');
        return { id, workspace };
      })
    );
    const workspaces: Record<string, Workspace | null> = {};

    workspacesList.forEach(({ id, workspace }) => {
      workspaces[id] = workspace;
    });

    setWorkspaces(workspaces);
  }, [workspacesMeta]);

  useEffect(() => {
    if (isShow) {
      setSettingWorkspaceId(null);
      refreshDetails();
      refreshWorkspaces();
    }
  }, [isShow, refreshDetails]);

  return !user ? (
    <SelectorPopperContainer placement="bottom-start">
      <LoginItem />
      <StyledDivider />
      <ListItem
        icon={<InformationIcon />}
        name="About AFFiNE"
        onClick={() => console.log('About AFFiNE')}
      />
    </SelectorPopperContainer>
  ) : (
    <SelectorPopperContainer placement="bottom-start">
      <PrivateWorkspaceItem />
      <StyledDivider />
      <WorkspaceGroupTitle>Workspace</WorkspaceGroupTitle>
      <WorkspaceWrapper>
        {workspacesMeta.map(workspace => {
          return (
            <WorkspaceItem
              type={workspace.type}
              key={workspace.id}
              id={workspace.id}
              icon={workspaces[workspace.id]?.meta.avatar || ''}
              onClick={handleClickSettingWorkspace}
              name={
                workspaces[workspace.id]?.meta.name ||
                (workspace.type === WorkspaceType.Private
                  ? user.name
                  : `workspace-${workspace.id}`)
              }
              memberCount={workSpaceDetails[workspace.id]?.memberCount || 1}
            />
          );
        })}
      </WorkspaceWrapper>
      <CreateWorkspaceItem />
      {settingWorkspace ? (
        <WorkspaceSetting
          isShow={Boolean(settingWorkspaceId)}
          onClose={handleCloseWorkSpace}
          workspace={settingWorkspace}
          owner={
            (settingWorkspaceId &&
              workSpaceDetails[settingWorkspaceId]?.owner) || {
              id: user.id,
              name: user.name,
            }
          }
          workspaces={workspaces}
        />
      ) : null}
      <StyledDivider />
      <ListItem
        icon={<InformationIcon />}
        name="About AFFiNE"
        onClick={() => console.log('About AFFiNE')}
      />
      <ListItem
        icon={<LogOutIcon />}
        name="Sign out"
        onClick={() => {
          console.log('Sign out');
          // FIXME: remove token from local storage and reload the page
          localStorage.removeItem('affine_token');
          window.location.reload();
        }}
      />
    </SelectorPopperContainer>
  );
};

const StyledDivider = styled(Divider)({
  margin: '8px 12px',
  width: 'calc(100% - 24px)',
});

const WorkspaceGroupTitle = styled('div')(({ theme }) => {
  return {
    color: theme.colors.iconColor,
    fontSize: theme.font.sm,
    lineHeight: '30px',
    height: '30px',
    padding: '0 12px',
  };
});

const WorkspaceWrapper = styled('div')(({ theme }) => {
  return {
    maxHeight: '200px',
    overflow: 'auto',
  };
});
