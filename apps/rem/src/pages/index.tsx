import { Button } from '@affine/component';
import { useAtom } from 'jotai/index';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { openWorkspacesModalAtom } from '../atoms';
import { useCurrentPage } from '../hooks/current/use-current-page';
import { useCurrentUser } from '../hooks/current/use-current-user';
import { useCurrentWorkspace } from '../hooks/current/use-current-workspace';
import { usePageMeta } from '../hooks/use-page-meta';
import { prefetchNecessaryData } from '../hooks/use-workspaces';
import { RemWorkspace } from '../shared';
import { apis } from '../shared/apis';

const Editor = dynamic(
  async () => (await import('../components/BlockSuiteEditor')).Editor,
  {
    ssr: false,
  }
);

function WorkspacePagePreview({ workspace }: { workspace: RemWorkspace }) {
  if (workspace.flavour === 'affine' && !workspace.firstBinarySynced) {
    return <div>loading...</div>;
  }
  const [, setId] = useCurrentPage();
  const blockSuiteWorkspace = workspace.blockSuiteWorkspace;
  const pageMetas = usePageMeta(blockSuiteWorkspace);
  return (
    <div>
      <div>page list</div>
      <div
        style={{
          border: '1px solid black',
        }}
      >
        {pageMetas.map(pageMeta => {
          return (
            <div
              onClick={() => {
                setId(pageMeta.id);
              }}
              key={pageMeta.id}
            >
              {pageMeta.title || 'Untitled'}
            </div>
          );
        })}
      </div>
    </div>
  );
}

prefetchNecessaryData();

const IndexPage: NextPage = () => {
  const user = useCurrentUser();
  const [currentWorkspace] = useCurrentWorkspace();
  const [currentPage] = useCurrentPage();
  const [, setOpenWorkspacesModal] = useAtom(openWorkspacesModalAtom);
  useEffect(() => {
    prefetchNecessaryData();
  }, []);
  useEffect(() => {
    if (currentWorkspace?.flavour === 'affine') {
      if (currentWorkspace.firstBinarySynced) {
        currentWorkspace.providers.forEach(provider => {
          provider.connect();
        });
        return () => {
          currentWorkspace.providers.forEach(provider => {
            provider.disconnect();
          });
        };
      }
    }
  }, [currentWorkspace]);
  const router = useRouter();
  return (
    <div>
      <Button
        onClick={() => {
          setOpenWorkspacesModal(true);
        }}
      >
        show all
      </Button>
      {user ? (
        <Button
          onClick={async () => {
            apis.auth.clear();
            await apis.signOutFirebase();
            router.reload();
          }}
        >
          sign out
        </Button>
      ) : (
        <Button
          onClick={async () => {
            await apis.signInWithGoogle();
            router.reload();
          }}
        >
          {' '}
          sign in with google
        </Button>
      )}
      {currentWorkspace ? (
        <WorkspacePagePreview workspace={currentWorkspace} />
      ) : (
        <div>no current workspace</div>
      )}
      {currentPage ? (
        <Editor page={currentPage} key={currentPage.id} />
      ) : (
        <div>no current page</div>
      )}
    </div>
  );
};

export default IndexPage;
