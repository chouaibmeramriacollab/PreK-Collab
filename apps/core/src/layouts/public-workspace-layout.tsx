import { MainContainer } from '@affine/component/workspace';
import type { AffinePublicWorkspace } from '@affine/env/workspace';
import { useAtom } from 'jotai';
import type React from 'react';
import { lazy, Suspense } from 'react';

import { openQuickSearchModalAtom } from '../atoms';
import { AppContainer } from '../components/affine/app-container';
import { useLocationTitle } from '../hooks/use-location-title';

const QuickSearchModal = lazy(() =>
  import('../components/pure/quick-search-modal').then(module => ({
    default: module.QuickSearchModal,
  }))
);

type PublicQuickSearchProps = {
  workspace: AffinePublicWorkspace;
};

export const PublicQuickSearch: React.FC<PublicQuickSearchProps> = ({
  workspace,
}) => {
  const router = useRouter();
  const [openQuickSearchModal, setOpenQuickSearchModalAtom] = useAtom(
    openQuickSearchModalAtom
  );
  return (
    <Suspense>
      <QuickSearchModal
        workspace={workspace}
        open={openQuickSearchModal}
        setOpen={setOpenQuickSearchModalAtom}
        router={router}
      />
    </Suspense>
  );
};

const PublicWorkspaceLayoutInner: React.FC<React.PropsWithChildren> = props => {
  const router = useRouter();
  const title = useLocationTitle(router);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <AppContainer>
        <MainContainer>{props.children}</MainContainer>
      </AppContainer>
    </>
  );
};

export const PublicWorkspaceLayout: React.FC<
  React.PropsWithChildren
> = props => {
  return (
    <PublicWorkspaceLayoutInner>{props.children}</PublicWorkspaceLayoutInner>
  );
};
