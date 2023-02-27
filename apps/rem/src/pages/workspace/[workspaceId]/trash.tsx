import { useTranslation } from '@affine/i18n';
import { DeleteTemporarilyIcon } from '@blocksuite/icons';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet-async';

import { WorkspaceTitle } from '../../../components/pure/workspace-title';
import { useCurrentWorkspace } from '../../../hooks/current/use-current-workspace';
import { useLoadWorkspace } from '../../../hooks/use-load-workspace';
import { useSyncRouterWithCurrentWorkspace } from '../../../hooks/use-sync-router-with-current-workspace';
import { WorkspaceLayout } from '../../../layouts';
import { NextPageWithLayout } from '../../../shared';

const TrashPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [currentWorkspace] = useCurrentWorkspace();
  const { t } = useTranslation();
  useLoadWorkspace(currentWorkspace);
  useSyncRouterWithCurrentWorkspace(router);
  return (
    <>
      <Helmet>
        <title>{t('Trash')} - AFFiNE</title>
      </Helmet>
      <WorkspaceTitle icon={<DeleteTemporarilyIcon />}>
        {t('Trash')}
      </WorkspaceTitle>
      Trash Page
    </>
  );
};

export default TrashPage;

TrashPage.getLayout = page => {
  return <WorkspaceLayout>{page}</WorkspaceLayout>;
};
