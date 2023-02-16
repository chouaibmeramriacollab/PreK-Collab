import {
  GlobalActionsCreator,
  useGlobalState,
  useGlobalStateApi,
} from '@/store/app';
import type { DataCenter } from '@affine/datacenter';
import { PageMeta } from '@/providers/app-state-provider';
import { getDataCenter, WorkspaceUnit } from '@affine/datacenter';
import { createDefaultWorkspace } from '@/providers/app-state-provider/utils';
import { useCallback, useEffect } from 'react';
import { DisposableGroup } from '@blocksuite/global/utils';

export type DataCenterState = {
  readonly dataCenter: DataCenter;
  readonly dataCenterPromise: Promise<DataCenter>;

  dataCenterWorkspaceList: WorkspaceUnit[];
  currentDataCenterWorkspace: WorkspaceUnit | null;
  dataCenterPageList: PageMeta[];
};

export type DataCenterActions = {
  loadWorkspace: (
    workspaceId: string,
    signal?: AbortSignal
  ) => Promise<WorkspaceUnit | null>;
};

export const createDataCenterState = (): DataCenterState => ({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  dataCenter: null!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  dataCenterPromise: null!,
  dataCenterWorkspaceList: [],
  currentDataCenterWorkspace: null,
  dataCenterPageList: [],
});
export const createDataCenterActions: GlobalActionsCreator<
  DataCenterActions
> = (set, get) => ({
  loadWorkspace: async (workspaceId, signal) => {
    const { dataCenter, dataCenterWorkspaceList, currentDataCenterWorkspace } =
      get();
    if (!dataCenterWorkspaceList.find(v => v.id.toString() === workspaceId)) {
      return null;
    }
    if (workspaceId === currentDataCenterWorkspace?.id) {
      return currentDataCenterWorkspace;
    }
    const workspace = (await dataCenter.loadWorkspace(workspaceId)) ?? null;

    if (signal?.aborted) {
      // do not update state if aborted
      return null;
    }

    let isOwner;
    if (workspace?.provider === 'local') {
      // isOwner is useful only in the cloud
      isOwner = true;
    } else {
      const userInfo = get().user;
      // We must ensure workspace.owner exists, then ensure id same.
      isOwner = workspace?.owner && userInfo?.id === workspace.owner.id;
    }

    const pageList =
      (workspace?.blocksuiteWorkspace?.meta.pageMetas as PageMeta[]) ?? [];
    if (workspace?.blocksuiteWorkspace) {
      set({
        currentWorkspace: workspace.blocksuiteWorkspace,
      });
    }
    set({
      isOwner,
    });

    set({
      currentDataCenterWorkspace: workspace,
      dataCenterPageList: pageList,
    });

    return workspace;
  },
});

export function DataCenterLoader() {
  const dataCenter = useGlobalState(useCallback(store => store.dataCenter, []));
  const dataCenterPromise = useGlobalState(
    useCallback(store => store.dataCenterPromise, [])
  );
  const api = useGlobalStateApi();
  //# region effect for listening workspace list change
  useEffect(() => {
    return api.subscribe(
      store => store.dataCenter,
      dataCenter => {
        const disposableGroup = new DisposableGroup();
        //# region init dataCenter
        disposableGroup.add(
          dataCenter.onWorkspacesChange(
            () => {
              api.setState({
                dataCenterWorkspaceList: dataCenter.workspaces,
              });
            },
            { immediate: false }
          )
        );
        //# endregion
        return () => {
          disposableGroup.dispose();
        };
      }
    );
  }, [api]);
  //# endregion
  //# region effect for updating workspace page list
  useEffect(() => {
    return api.subscribe(
      store => store.currentDataCenterWorkspace,
      currentWorkspace => {
        const disposableGroup = new DisposableGroup();
        disposableGroup.add(
          currentWorkspace?.blocksuiteWorkspace?.meta.pagesUpdated.on(() => {
            if (
              Array.isArray(
                currentWorkspace.blocksuiteWorkspace?.meta.pageMetas
              )
            ) {
              api.setState({
                dataCenterPageList: currentWorkspace.blocksuiteWorkspace?.meta
                  .pageMetas as PageMeta[],
              });
            }
          })
        );
        return () => {
          disposableGroup.dispose();
        };
      }
    );
  }, [api]);
  //# endregion

  if (!dataCenter && !dataCenterPromise) {
    const promise = getDataCenter();
    api.setState({ dataCenterPromise: promise });
    promise.then(async dataCenter => {
      // Ensure datacenter has at least one workspace
      if (dataCenter.workspaces.length === 0) {
        await createDefaultWorkspace(dataCenter);
      }
      // set initial state
      api.setState({
        dataCenter,
        dataCenterWorkspaceList: dataCenter.workspaces,
        currentWorkspace: null,
        currentDataCenterWorkspace: null,
        dataCenterPageList: [],
      });
    });
    throw promise;
  }
  if (!dataCenter) {
    throw dataCenterPromise;
  }
  return null;
}
