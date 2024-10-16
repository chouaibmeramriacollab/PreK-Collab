import { NotificationCenter } from '@affine/component';
import { PeekViewManagerModal } from '@affine/core/modules/peek-view';
import { useService, WorkspaceService } from '@toeverything/infra';

import { MobileSettingModal } from '../views';
import { MobileSignInModal } from '../views/sign-in/modal';

export function MobileCurrentWorkspaceModals() {
  const currentWorkspace = useService(WorkspaceService).workspace;

  return (
    <>
      {currentWorkspace ? <MobileSettingModal /> : null}
      <PeekViewManagerModal />
    </>
  );
}

// I don't like the name, but let's keep it for now
export const AllWorkspaceModals = () => {
  return (
    <>
      <NotificationCenter />
      <MobileSignInModal />
    </>
  );
};
