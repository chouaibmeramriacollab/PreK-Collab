import { useAFFiNEI18N } from '@affine/i18n/hooks';
import { SettingsIcon } from '@blocksuite/icons';
import {
  PreconditionStrategy,
  registerAffineCommand,
} from '@toeverything/infra/command';
import { type createStore, useAtomValue } from 'jotai';
import type { useTheme } from 'next-themes';

import { openQuickSearchModalAtom } from '../atoms';
import { appSettingAtom } from '../atoms/settings';
import type { useLanguageHelper } from '../hooks/affine/use-language-helper';
import { transLabelContainer } from './index.css';

// todo - find a better way to abstract the following translations components
const ClientBorderStyleLabel = () => {
  const { clientBorder } = useAtomValue(appSettingAtom);
  const t = useAFFiNEI18N();
  return (
    <div
      key={'affine:change-client-border-style'}
      className={transLabelContainer}
    >
      {t['com.affine.cmdk.affine.client-border-style.to']()}
      <strong>
        {clientBorder
          ? t['com.affine.cmdk.affine.switch-state.off']()
          : t['com.affine.cmdk.affine.switch-state.on']()}
      </strong>
    </div>
  );
};

const FullWidthLayoutLabel = () => {
  const { fullWidthLayout } = useAtomValue(appSettingAtom);
  const t = useAFFiNEI18N();
  return (
    <div
      key={'affine:change-full-width-layout'}
      className={transLabelContainer}
    >
      {t['com.affine.cmdk.affine.full-width-layout.to']()}
      <strong>
        {fullWidthLayout
          ? t['com.affine.cmdk.affine.switch-state.off']()
          : t['com.affine.cmdk.affine.switch-state.on']()}
      </strong>
    </div>
  );
};

const NoisyBackgroundLabel = () => {
  const { enableNoisyBackground } = useAtomValue(appSettingAtom);
  const t = useAFFiNEI18N();
  return (
    <div
      key={'affine:noise-background-on-the-sidebar'}
      className={transLabelContainer}
    >
      {t['com.affine.cmdk.affine.noise-background-on-the-sidebar.to']()}
      <strong>
        {enableNoisyBackground
          ? t['com.affine.cmdk.affine.switch-state.off']()
          : t['com.affine.cmdk.affine.switch-state.on']()}
      </strong>
    </div>
  );
};

const BlurBackgroundLabel = () => {
  const { enableBlurBackground } = useAtomValue(appSettingAtom);
  const t = useAFFiNEI18N();
  return (
    <div
      key={'affine:translucent-ui-on-the-sidebar'}
      className={transLabelContainer}
    >
      {t['com.affine.cmdk.affine.translucent-ui-on-the-sidebar.to']()}
      <strong>
        {enableBlurBackground
          ? t['com.affine.cmdk.affine.switch-state.off']()
          : t['com.affine.cmdk.affine.switch-state.on']()}
      </strong>
    </div>
  );
};

export function registerAffineSettingsCommands({
  t,
  store,
  theme,
  languageHelper,
}: {
  t: ReturnType<typeof useAFFiNEI18N>;
  store: ReturnType<typeof createStore>;
  theme: ReturnType<typeof useTheme>;
  languageHelper: ReturnType<typeof useLanguageHelper>;
}) {
  const unsubs: Array<() => void> = [];
  const { onSelect, languagesList, currentLanguage } = languageHelper;
  unsubs.push(
    registerAffineCommand({
      id: 'affine:show-quick-search',
      preconditionStrategy: PreconditionStrategy.Never,
      category: 'affine:general',
      keyBinding: {
        binding: '$mod+K',
      },
      icon: <SettingsIcon />,
      run() {
        const quickSearchModalState = store.get(openQuickSearchModalAtom);
        store.set(openQuickSearchModalAtom, !quickSearchModalState);
      },
    })
  );

  // color schemes
  unsubs.push(
    registerAffineCommand({
      id: 'affine:change-color-scheme-to-auto',
      label: (
        <div className={transLabelContainer}>
          {t['com.affine.cmdk.affine.color-scheme.to']()}
          <strong>{t['com.affine.themeSettings.system']()}</strong>
        </div>
      ),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () => theme.theme !== 'system',
      run() {
        theme.setTheme('system');
      },
    })
  );
  unsubs.push(
    registerAffineCommand({
      id: 'affine:change-color-scheme-to-dark',
      label: (
        <div className={transLabelContainer}>
          {t['com.affine.cmdk.affine.color-scheme.to']()}
          <strong>{t['com.affine.themeSettings.dark']()}</strong>
        </div>
      ),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () => theme.theme !== 'dark',
      run() {
        theme.setTheme('dark');
      },
    })
  );

  unsubs.push(
    registerAffineCommand({
      id: 'affine:change-color-scheme-to-light',
      label: (
        <div className={transLabelContainer}>
          {t['com.affine.cmdk.affine.color-scheme.to']()}
          <strong>{t['com.affine.themeSettings.light']()}</strong>
        </div>
      ),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () => theme.theme !== 'light',
      run() {
        theme.setTheme('light');
      },
    })
  );

  //Font styles
  unsubs.push(
    registerAffineCommand({
      id: 'affine:change-font-style-to-sans',
      label: (
        <div className={transLabelContainer}>
          {t['com.affine.cmdk.affine.font-style.to']()}
          <strong>{t['com.affine.appearanceSettings.fontStyle.sans']()}</strong>
        </div>
      ),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () =>
        store.get(appSettingAtom).fontStyle !== 'Sans',
      run() {
        store.set(appSettingAtom, prev => ({
          ...prev,
          fontStyle: 'Sans',
        }));
      },
    })
  );

  unsubs.push(
    registerAffineCommand({
      id: 'affine:change-font-style-to-serif',
      label: (
        <div className={transLabelContainer}>
          {t['com.affine.cmdk.affine.font-style.to']()}
          <strong>
            {t['com.affine.appearanceSettings.fontStyle.serif']()}
          </strong>
        </div>
      ),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () =>
        store.get(appSettingAtom).fontStyle !== 'Serif',
      run() {
        store.set(appSettingAtom, prev => ({
          ...prev,
          fontStyle: 'Serif',
        }));
      },
    })
  );

  unsubs.push(
    registerAffineCommand({
      id: 'affine:change-font-style-to-mono',
      label: (
        <div className={transLabelContainer}>
          {t['com.affine.cmdk.affine.font-style.to']()}
          <strong>{t['com.affine.appearanceSettings.fontStyle.mono']()}</strong>
        </div>
      ),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () =>
        store.get(appSettingAtom).fontStyle !== 'Mono',
      run() {
        store.set(appSettingAtom, prev => ({
          ...prev,
          fontStyle: 'Mono',
        }));
      },
    })
  );

  //Display Language
  languagesList.forEach(language => {
    unsubs.push(
      registerAffineCommand({
        id: `affine:change-display-language-to-${language.name}`,
        label: (
          <div className={transLabelContainer}>
            {t['com.affine.cmdk.affine.display-language.to']()}
            <strong>{language.originalName}</strong>
          </div>
        ),
        category: 'affine:settings',
        icon: <SettingsIcon />,
        preconditionStrategy: () => currentLanguage?.tag !== language.tag,
        run() {
          onSelect(language.tag);
        },
      })
    );
  });

  //Layout Style
  unsubs.push(
    registerAffineCommand({
      id: `affine:change-client-border-style`,
      label: () => ClientBorderStyleLabel(),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () => environment.isDesktop,
      run() {
        store.set(appSettingAtom, prev => ({
          ...prev,
          clientBorder: !prev.clientBorder,
        }));
      },
    })
  );

  unsubs.push(
    registerAffineCommand({
      id: `affine:change-full-width-layout`,
      label: () => <FullWidthLayoutLabel />,
      category: 'affine:settings',
      icon: <SettingsIcon />,
      run() {
        store.set(appSettingAtom, prev => ({
          ...prev,
          fullWidthLayout: !prev.fullWidthLayout,
        }));
      },
    })
  );

  unsubs.push(
    registerAffineCommand({
      id: `affine:change-noise-background-on-the-sidebar`,
      label: () => NoisyBackgroundLabel(),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () => environment.isDesktop,
      run() {
        store.set(appSettingAtom, prev => ({
          ...prev,
          enableNoisyBackground: !prev.enableNoisyBackground,
        }));
      },
    })
  );

  unsubs.push(
    registerAffineCommand({
      id: `affine:change-translucent-ui-on-the-sidebar`,
      label: () => BlurBackgroundLabel(),
      category: 'affine:settings',
      icon: <SettingsIcon />,
      preconditionStrategy: () => environment.isDesktop,
      run() {
        store.set(appSettingAtom, prev => ({
          ...prev,
          enableBlurBackground: !prev.enableBlurBackground,
        }));
      },
    })
  );

  return () => {
    unsubs.forEach(unsub => unsub());
  };
}
