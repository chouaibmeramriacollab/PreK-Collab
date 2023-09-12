import { Modal } from '@toeverything/components/modal';
import type { FC, PropsWithChildren } from 'react';

export type AuthModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const AuthModal: FC<PropsWithChildren<AuthModalProps>> = ({
  children,
  open,
  setOpen,
}) => {
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      data-testid="auth-modal"
      width={400}
      height={468}
      contentOptions={{
        style: { padding: '44px 40px 0' },
      }}
    >
      {children}
    </Modal>
  );
};
