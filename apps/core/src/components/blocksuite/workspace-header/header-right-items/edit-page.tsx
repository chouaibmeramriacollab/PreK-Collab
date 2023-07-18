import { displayFlex, styled, TextButton } from '@affine/component';
import { useCallback } from 'react';

export const EditPage = () => {
  const router = useRouter();
  const pageId = router.query.pageId as string;
  const workspaceId = router.query.workspaceId as string;
  const { jumpToPage } = useRouterHelper(router);
  const onClickPage = useCallback(() => {
    if (workspaceId && pageId) {
      jumpToPage(workspaceId, pageId).catch(error => {
        console.error(error);
      });
    }
  }, [jumpToPage, pageId, workspaceId]);
  return (
    <div>
      <StyledEditPageButton onClick={() => onClickPage()}>
        Edit Page
      </StyledEditPageButton>
    </div>
  );
};
export default EditPage;

const StyledEditPageButton = styled(
  TextButton,
  {}
)(() => {
  return {
    border: '1px solid var(--affine-primary-color)',
    color: 'var(--affine-primary-color)',
    width: '100%',
    borderRadius: '8px',
    whiteSpace: 'nowrap',
    padding: '0 16px',
    ...displayFlex('center', 'center'),
  };
});
