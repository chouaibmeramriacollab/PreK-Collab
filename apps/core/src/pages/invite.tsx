import { Button } from '@affine/component';
import {
  acceptInviteByInviteIdMutation,
  acceptInviteByWorkspaceIdMutation,
} from '@affine/graphql';
import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useMutation } from '../shared/gql';

// valid URL: /invite?wsId=xxx&inviteId=xxx
// valid URL: /invite?wsId=xxx
export const Component = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('id');
  const inviteId = searchParams.get('invite');
  const { trigger: triggerByWorkspaceId } = useMutation({
    mutation: acceptInviteByWorkspaceIdMutation,
  });
  const { trigger: triggerByInviteId } = useMutation({
    mutation: acceptInviteByInviteIdMutation,
  });
  const onClickAccept = useCallback(async () => {
    if (inviteId && workspaceId) {
      await triggerByInviteId({
        workspaceId,
        inviteId,
      });
    } else if (workspaceId) {
      await triggerByWorkspaceId({
        workspaceId,
      });
    }
  }, [inviteId, triggerByWorkspaceId, triggerByInviteId, workspaceId]);
  return (
    <div>
      <Button onClick={onClickAccept}>Accept Invitation</Button>
    </div>
  );
};
