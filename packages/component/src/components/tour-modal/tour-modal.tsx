import { useAFFiNEI18N } from '@affine/i18n/hooks';
import { ArrowLeftSmallIcon, ArrowRightSmallIcon } from '@blocksuite/icons';
import { Modal, type ModalProps } from '@toeverything/components/modal';
import clsx from 'clsx';
import { useState } from 'react';

import {
  arrowStyle,
  buttonDisableStyle,
  containerStyle,
  descriptionContainerStyle,
  descriptionStyle,
  formSlideToLeftStyle,
  formSlideToRightStyle,
  modalStyle,
  slideToLeftStyle,
  slideToRightStyle,
  tabActiveStyle,
  tabContainerStyle,
  tabStyle,
  titleContainerStyle,
  titleStyle,
  videoContainerStyle,
  videoSlideStyle,
  videoStyle,
} from './index.css';

export const TourModal = (props: ModalProps) => {
  const t = useAFFiNEI18N();
  const [step, setStep] = useState(-1);
  return (
    <Modal
      width={545}
      contentOptions={{
        ['data-testid' as string]: 'onboarding-modal',
        style: {
          minHeight: '480px',
          padding: 0,
        },
      }}
      overlayOptions={{
        style: {
          background: 'transparent',
        },
      }}
      {...props}
    >
      <div className={modalStyle}>
        <div className={titleContainerStyle}>
          {step !== -1 && (
            <div
              className={clsx(titleStyle, {
                [slideToRightStyle]: step === 0,
                [formSlideToLeftStyle]: step === 1,
              })}
            >
              {t['com.affine.onboarding.title2']()}
            </div>
          )}
          <div
            className={clsx(titleStyle, {
              [slideToLeftStyle]: step === 1,
              [formSlideToRightStyle]: step === 0,
            })}
          >
            {t['com.affine.onboarding.title1']()}
          </div>
        </div>

        <div className={containerStyle}>
          <div
            className={clsx(arrowStyle, { [buttonDisableStyle]: step !== 1 })}
            onClick={() => step === 1 && setStep(0)}
            data-testid="onboarding-modal-pre-button"
          >
            <ArrowLeftSmallIcon />
          </div>
          <div className={videoContainerStyle}>
            <div className={videoSlideStyle}>
              {step !== -1 && (
                <video
                  autoPlay
                  muted
                  loop
                  className={clsx(videoStyle, {
                    [slideToRightStyle]: step === 0,
                    [formSlideToLeftStyle]: step === 1,
                  })}
                  data-testid="onboarding-modal-editing-video"
                >
                  <source src="/editingVideo.mp4" type="video/mp4" />
                  <source src="/editingVideo.webm" type="video/webm" />
                </video>
              )}
              <video
                autoPlay
                muted
                loop
                className={clsx(videoStyle, {
                  [slideToLeftStyle]: step === 1,
                  [formSlideToRightStyle]: step === 0,
                })}
                data-testid="onboarding-modal-switch-video"
              >
                <source src="/switchVideo.mp4" type="video/mp4" />
                <source src="/switchVideo.webm" type="video/webm" />
              </video>
            </div>
          </div>
          <div
            className={clsx(arrowStyle, { [buttonDisableStyle]: step === 1 })}
            onClick={() => setStep(1)}
            data-testid="onboarding-modal-next-button"
          >
            <ArrowRightSmallIcon />
          </div>
        </div>
        <ul className={tabContainerStyle}>
          <li
            className={clsx(tabStyle, {
              [tabActiveStyle]: step !== 1,
            })}
            onClick={() => setStep(0)}
          ></li>
          <li
            className={clsx(tabStyle, { [tabActiveStyle]: step === 1 })}
            onClick={() => setStep(1)}
          ></li>
        </ul>
        <div className={descriptionContainerStyle}>
          {step !== -1 && (
            <div
              className={clsx(descriptionStyle, {
                [slideToRightStyle]: step === 0,
                [formSlideToLeftStyle]: step === 1,
              })}
            >
              {t['com.affine.onboarding.videoDescription2']()}
            </div>
          )}
          <div
            className={clsx(descriptionStyle, {
              [slideToLeftStyle]: step === 1,
              [formSlideToRightStyle]: step === 0,
            })}
          >
            {t['com.affine.onboarding.videoDescription1']()}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TourModal;
