import { DialogTrigger } from '@radix-ui/react-dialog';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';

import type { ButtonProps } from '../button';
import { Button } from '../button';
import Input, { type InputProps } from '../input';
import type { ModalProps } from './modal';
import { Modal } from './modal';
import * as styles from './styles.css';

export interface PromptModalProps extends ModalProps {
  confirmButtonOptions?: Omit<ButtonProps, 'children'>;
  onConfirm?: ((text: string) => void) | ((text: string) => Promise<void>);
  onCancel?: () => void;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;

  label?: React.ReactNode;
  defaultValue?: string;
  required?: boolean;
  cancelButtonOptions?: Omit<ButtonProps, 'children'>;

  inputOptions?: Omit<InputProps, 'value' | 'onChange'>;
  reverseFooter?: boolean;
  /**
   * Auto focus on confirm button when modal opened
   * @default true
   */
  autoFocusConfirm?: boolean;
}

export const PromptModal = ({
  children,
  confirmButtonOptions,
  // FIXME: we need i18n
  confirmText,
  cancelText = 'Cancel',
  cancelButtonOptions,
  reverseFooter,
  onConfirm,
  onCancel,
  label,
  required = true,
  inputOptions,
  defaultValue,
  width = 480,
  autoFocusConfirm = true,
  ...props
}: PromptModalProps) => {
  const [value, setValue] = useState(defaultValue ?? '');
  const onConfirmClick = useCallback(() => {
    Promise.resolve(onConfirm?.(value)).catch(err => {
      console.error(err);
    });
  }, [onConfirm, value]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        if (value) {
          e.preventDefault();
          return;
        } else {
          e.currentTarget.blur();
        }
      }
    },
    [value]
  );

  return (
    <Modal
      contentOptions={{
        className: styles.confirmModalContainer,
        onPointerDownOutside: e => {
          e.stopPropagation();
          onCancel?.();
        },
      }}
      width={width}
      closeButtonOptions={{
        onClick: onCancel,
      }}
      {...props}
    >
      <div className={styles.label}>{label}</div>
      <Input
        value={value}
        onChange={setValue}
        autoFocus
        onKeyDown={onKeyDown}
        {...inputOptions}
      />
      {children ? (
        <div className={styles.confirmModalContent}>{children}</div>
      ) : null}
      <div
        className={clsx(styles.modalFooter, {
          modalFooterWithChildren: !!children,
          reverse: reverseFooter,
        })}
      >
        <DialogTrigger asChild>
          <Button
            onClick={onCancel}
            data-testid="confirm-modal-cancel"
            {...cancelButtonOptions}
          >
            {cancelText}
          </Button>
        </DialogTrigger>
        <Button
          onClick={onConfirmClick}
          disabled={required && !value}
          data-testid="confirm-modal-confirm"
          autoFocus={autoFocusConfirm}
          {...confirmButtonOptions}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

interface OpenPromptModalOptions {
  autoClose?: boolean;
  onSuccess?: () => void;
}
interface PromptModalContextProps {
  modalProps: PromptModalProps;
  openPromptModal: (
    props?: PromptModalProps,
    options?: OpenPromptModalOptions
  ) => void;
  closePromptModal: () => void;
}
const PromptModalContext = createContext<PromptModalContextProps>({
  modalProps: { open: false },
  openPromptModal: () => {},
  closePromptModal: () => {},
});
export const PromptModalProvider = ({ children }: PropsWithChildren) => {
  const [modalProps, setModalProps] = useState<PromptModalProps>({
    open: false,
  });

  const setLoading = useCallback((value: boolean) => {
    setModalProps(prev => ({
      ...prev,
      confirmButtonOptions: {
        ...prev.confirmButtonOptions,
        loading: value,
      },
    }));
  }, []);

  const closePromptModal = useCallback(() => {
    setModalProps({ open: false });
  }, []);

  const openPromptModal = useCallback(
    (props?: PromptModalProps, options?: OpenPromptModalOptions) => {
      const { autoClose = true, onSuccess } = options ?? {};
      if (!props) {
        setModalProps({ open: true });
        return;
      }

      const { onConfirm: _onConfirm, ...otherProps } = props;

      const onConfirm = (text: string) => {
        setLoading(true);
        return Promise.resolve(_onConfirm?.(text))
          .then(() => onSuccess?.())
          .catch(console.error)
          .finally(() => setLoading(false))
          .finally(() => autoClose && closePromptModal());
      };
      setModalProps({ ...otherProps, onConfirm, open: true });
    },
    [closePromptModal, setLoading]
  );

  const onOpenChange = useCallback(
    (open: boolean) => {
      modalProps.onOpenChange?.(open);
      setModalProps(props => ({ ...props, open }));
    },
    [modalProps]
  );

  return (
    <PromptModalContext.Provider
      value={{
        openPromptModal: openPromptModal,
        closePromptModal: closePromptModal,
        modalProps,
      }}
    >
      {children}
      {/* TODO(@catsjuice): multi-instance support(unnecessary for now) */}
      <PromptModal {...modalProps} onOpenChange={onOpenChange} />
    </PromptModalContext.Provider>
  );
};

export const usePromptModal = () => {
  const context = useContext(PromptModalContext);
  if (!context) {
    throw new Error(
      'useConfirmModal must be used within a ConfirmModalProvider'
    );
  }
  return {
    openPromptModal: context.openPromptModal,
    closePromptModal: context.closePromptModal,
  };
};
