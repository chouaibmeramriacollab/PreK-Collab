import type { NextPage } from 'next';
import { styled } from '@/styles';
import { PageHeader } from '@/components/header';
import { FAQ } from '@/components/faq';
import EdgelessToolbar from '@/components/edgeless-toolbar';
import MobileModal from '@/components/mobile-modal';
import Editor from '@/components/editor';

const StyledEditorContainer = styled('div')(({ theme }) => {
  return {
    height: 'calc(100vh - 60px)',
  };
});

const Home: NextPage = () => {
  return (
    <>
      <PageHeader />
      <MobileModal />
      <StyledEditorContainer>
        <Editor />
      </StyledEditorContainer>
      <FAQ />
      <EdgelessToolbar />
    </>
  );
};

export default Home;
